import { NextRequest, NextResponse } from 'next/server'
import { getResend, FROM_EMAIL, LEAD_NOTIFY_EMAIL, SITE_URL } from '@/lib/resend'
import { newsletterWelcomeEmail, buildLabWaitlistEmail, subscriberNotifyEmail } from '@/lib/emails'
import { getSupabase, hasSupabase } from '@/lib/supabase'

// Where the subscribe form can be embedded. Falls back to 'newsletter' so a
// bad/spoofed value can't pollute the column.
//
// 'build-lab' is posted server-to-server by runyouraiboard.com when someone
// joins the Build Lab waitlist. 'education' is for the /education surface.
// Both were previously blocked on an unverified worry that
// bda_subscribers.source carried a CHECK constraint rejecting new values —
// checked 2026-07-17: it does not. The column has only UNIQUE(email) and the
// PK, and defaults to 'newsletter'. Adding a source is safe.
const ALLOWED_SOURCES = new Set(['newsletter', 'footer', 'blog', 'education', 'build-lab'])

export async function POST(req: NextRequest) {
  try {
    const { email, name, source } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const cleanEmail = email.trim().toLowerCase()
    const cleanName = typeof name === 'string' && name.trim() ? name.trim() : null
    const subSource =
      typeof source === 'string' && ALLOWED_SOURCES.has(source) ? source : 'newsletter'

    if (!hasSupabase()) {
      return NextResponse.json({ error: 'Subscriptions not configured' }, { status: 503 })
    }

    // Upsert the subscriber. Re-subscribing flips status back to active.
    let unsubscribeToken: string | null = null
    try {
      const { data, error } = await getSupabase()
        .from('bda_subscribers')
        .upsert(
          {
            email: cleanEmail,
            name: cleanName,
            source: subSource,
            status: 'active',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'email', ignoreDuplicates: false }
        )
        .select('unsubscribe_token')
        .single()
      if (error) throw error
      unsubscribeToken = (data?.unsubscribe_token as string) ?? null
    } catch (dbErr) {
      console.error('Subscriber upsert failed:', dbErr)
      return NextResponse.json({ error: 'Could not subscribe. Please try again.' }, { status: 500 })
    }

    // Best-effort welcome + owner notification. Never fail the subscribe on email.
    if (process.env.RESEND_API_KEY) {
      const resend = getResend()
      const unsubscribeUrl = `${SITE_URL}/api/unsubscribe?list=subscribers&token=${unsubscribeToken}`
      try {
        // Confirm what they actually asked for. Someone joining the Build Lab
        // waitlist gets the Lab confirmation, not "thanks for subscribing" —
        // they are subscribed, but leading with that would read as a
        // bait-and-switch on the thing they clicked.
        const welcome =
          subSource === 'build-lab'
            ? buildLabWaitlistEmail(cleanName ?? undefined, unsubscribeUrl)
            : newsletterWelcomeEmail(cleanName ?? undefined, unsubscribeUrl)
        await resend.emails.send({
          from: FROM_EMAIL,
          to: cleanEmail,
          subject: welcome.subject,
          html: welcome.html,
          text: welcome.text,
          headers: { 'List-Unsubscribe': `<${unsubscribeUrl}>` },
        })
      } catch (mailErr) {
        console.error('Newsletter welcome email failed (non-fatal):', mailErr)
      }
      try {
        const notify = subscriberNotifyEmail(cleanEmail, subSource)
        await resend.emails.send({
          from: FROM_EMAIL,
          to: LEAD_NOTIFY_EMAIL,
          replyTo: cleanEmail,
          subject: notify.subject,
          html: notify.html,
          text: notify.text,
        })
      } catch (notifyErr) {
        console.error('Subscriber notification failed (non-fatal):', notifyErr)
      }
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
