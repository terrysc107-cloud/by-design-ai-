import { NextRequest, NextResponse } from 'next/server'
import { hasSupabase } from '@/lib/supabase'
import { hasOpenAI } from '@/lib/openai'
import { generatePosts } from '@/lib/content-engine'
import { countByStatus, insertDrafts } from '@/lib/content-queue'
import { getResend, FROM_EMAIL, LEAD_NOTIFY_EMAIL } from '@/lib/resend'
import { contentDraftsReadyEmail } from '@/lib/emails'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Weekly cron: keep the draft queue topped up so there's always content to
// approve. Generates only enough to reach DRAFT_TARGET, then emails the owner.
// Nothing here publishes — approval (content-review) + content-publish do that.
const LANE = 'medical'
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

  try {
    const current = await countByStatus('draft', LANE)
    const need = DRAFT_TARGET - current
    if (need <= 0) {
      return NextResponse.json({ ok: true, generated: 0, drafts: current, note: 'queue already full' })
    }

    const posts = await generatePosts({ lane: LANE, count: need })
    const rows = await insertDrafts(posts, LANE)

    // Best-effort owner notification — never fail the cron on email issues.
    if (process.env.RESEND_API_KEY && rows.length) {
      try {
        const mail = contentDraftsReadyEmail(rows.length, LANE)
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

    return NextResponse.json({ ok: true, generated: rows.length, drafts: current + rows.length })
  } catch (err) {
    console.error('content-generate cron failed:', err)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
