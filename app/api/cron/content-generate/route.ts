import { NextRequest, NextResponse } from 'next/server'
import { hasSupabase } from '@/lib/supabase'
import { hasOpenAI } from '@/lib/openai'
import { generatePosts } from '@/lib/content-engine'
import { filterPosts } from '@/lib/content-guardrail'
import { countByStatus, insertDrafts } from '@/lib/content-queue'
import { getResend, FROM_EMAIL, LEAD_NOTIFY_EMAIL } from '@/lib/resend'
import { contentDraftsReadyEmail } from '@/lib/emails'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Weekly cron: keep the draft queue topped up so there's always content to
// approve. Generates only enough to reach DRAFT_TARGET per lane, then emails
// the owner. Nothing here publishes; approval (content-review) and
// content-publish do that.
//
// MULTI-LANE since 2026-09-03. This was `const LANE = 'medical'` back when the
// site sold one thing. The site now runs co-equal paths, so each path needs its
// own queue: 'medical' asks for a discovery call, 'board' sells the course, and
// a post that mixes the two asks a reader to do something they did not come to
// do. Each lane is topped up independently and a failure in one does not stop
// the other.
const LANES = ['medical', 'board'] as const
const DRAFT_TARGET = 6

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  const auth = req.headers.get('authorization')
  const qs = req.nextUrl.searchParams.get('secret')
  if (secret && auth !== `Bearer ${secret}` && qs !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!hasSupabase() || !hasOpenAI()) {
    return NextResponse.json({ error: 'Content engine not configured' }, { status: 503 })
  }

  const results: Record<string, unknown> = {}
  let generatedTotal = 0
  let blockedTotal = 0

  for (const lane of LANES) {
    try {
      const current = await countByStatus('draft', lane)
      const need = DRAFT_TARGET - current
      if (need <= 0) {
        results[lane] = { generated: 0, drafts: current, note: 'queue already full' }
        continue
      }

      const posts = await generatePosts({ lane, count: need })

      // THE CLAIM GATE. A blocked post is dropped, not queued and not retried:
      // it reached a human's approval screen only after passing here, and the
      // next weekly run simply generates a replacement. Logging the violation
      // is what makes a bad prompt visible; silently requeuing it would not.
      const { passed, blocked } = filterPosts(posts)
      for (const b of blocked) {
        console.warn(
          `[content-guardrail] blocked a ${lane} post:`,
          b.violations.map(v => `"${v.match}" ${v.why}`).join(' | ')
        )
      }
      blockedTotal += blocked.length

      const rows = passed.length ? await insertDrafts(passed, lane) : []
      generatedTotal += rows.length
      results[lane] = {
        generated: rows.length,
        blocked: blocked.length,
        drafts: current + rows.length,
      }

      // Best-effort owner notification. Never fail the cron on email issues.
      if (process.env.RESEND_API_KEY && rows.length) {
        try {
          const mail = contentDraftsReadyEmail(rows.length, lane)
          await getResend().emails.send({
            from: FROM_EMAIL,
            to: LEAD_NOTIFY_EMAIL,
            subject: mail.subject,
            html: mail.html,
            text: mail.text,
          })
        } catch (mailErr) {
          console.error('Drafts-ready email failed (non-fatal):', mailErr)
        }
      }
    } catch (err) {
      // One lane failing must not cost the other its weekly top-up.
      console.error(`content-generate failed for lane "${lane}":`, err)
      results[lane] = { error: 'Generation failed' }
    }
  }

  return NextResponse.json({ ok: true, generated: generatedTotal, blocked: blockedTotal, lanes: results })
}
