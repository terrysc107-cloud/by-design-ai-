import { NextRequest, NextResponse } from 'next/server'
import { hasSupabase } from '@/lib/supabase'
import { hasOpenAI } from '@/lib/openai'
import { generateIssue, pickIssueImages, insertIssue, setIssueStatus } from '@/lib/newsletter'
import { generateNewsletterPromo } from '@/lib/content-engine'
import { insertDraft } from '@/lib/content-queue'
import { getResend, FROM_EMAIL, LEAD_NOTIFY_EMAIL } from '@/lib/resend'
import { newsletterApprovalEmail } from '@/lib/emails'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Weekly cron: draft this week's newsletter issue. With NEWSLETTER_AUTONOMOUS
// unset/false (default), the issue stays 'draft' and the owner gets a one-click
// "Approve & Send" email — nothing reaches subscribers until approved. With
// NEWSLETTER_AUTONOMOUS=true, the issue is approved immediately and the send
// cron picks it up. Also drafts social posts that promote the issue.
const LANE = 'general'
// Square brand asset for the Instagram promo (IG requires media). Repo-relative.
const IG_PROMO_ASSET = 'public/brand/bda-share-square-1200x1200.png'

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  const auth = req.headers.get('authorization')
  const qs = req.nextUrl.searchParams.get('secret')
  if (secret && auth !== `Bearer ${secret}` && qs !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!hasSupabase() || !hasOpenAI()) {
    return NextResponse.json({ error: 'Newsletter engine not configured' }, { status: 503 })
  }

  try {
    const gen = await generateIssue({ lane: LANE, featureLatestPost: true })
    const images = pickIssueImages(LANE)
    const featured = gen.cta_url.includes('/blog/')
      ? {
          slug: gen.cta_url.split('/blog/')[1] ?? '',
          title: gen.cta_label,
          url: gen.cta_url,
        }
      : null
    const issue = await insertIssue(gen, { lane: LANE, featured, images })

    const autonomous = process.env.NEWSLETTER_AUTONOMOUS === 'true'
    if (autonomous) {
      await setIssueStatus(issue.id, 'approved')
    } else if (process.env.RESEND_API_KEY) {
      // Best-effort owner approval email — never fail the cron on email.
      try {
        const mail = newsletterApprovalEmail({
          id: issue.id,
          subject: issue.subject,
          approval_token: issue.approval_token,
        })
        await getResend().emails.send({
          from: FROM_EMAIL,
          to: LEAD_NOTIFY_EMAIL,
          subject: mail.subject,
          html: mail.html,
          text: mail.text,
        })
      } catch (mailErr) {
        console.error('Newsletter approval email failed (non-fatal):', mailErr)
      }
    }

    // Best-effort: draft promo posts into the content queue. A failure here must
    // not fail issue generation.
    const topic = issue.body.map(s => s.heading).join('; ') || issue.subject
    const promos: Record<string, boolean> = {}
    try {
      const li = await generateNewsletterPromo({ subject: issue.subject, topic }, 'linkedin')
      await insertDraft({ lane: 'medical', pillar: 'promo', platform: 'linkedin', content: li })
      promos.linkedin = true
    } catch (e) {
      console.error('LinkedIn promo draft failed (non-fatal):', e)
    }
    try {
      const ig = await generateNewsletterPromo({ subject: issue.subject, topic }, 'instagram')
      await insertDraft({ lane: 'medical', pillar: 'promo', platform: 'instagram', content: ig, asset: IG_PROMO_ASSET })
      promos.instagram = true
    } catch (e) {
      console.error('Instagram promo draft failed (non-fatal):', e)
    }

    return NextResponse.json({
      ok: true,
      issueId: issue.id,
      subject: issue.subject,
      autonomous,
      status: autonomous ? 'approved' : 'draft',
      promos,
    })
  } catch (err) {
    console.error('newsletter-generate cron failed:', err)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
