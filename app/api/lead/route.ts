import { NextRequest, NextResponse } from 'next/server'
import { getResend, FROM_EMAIL, LEAD_NOTIFY_EMAIL } from '@/lib/resend'
import { guideEmail, leadNotifyEmail } from '@/lib/emails'
import { getSupabase, hasSupabase } from '@/lib/supabase'
import { nextDripDate } from '@/lib/drip'

// Known lead sources (lane front doors). Anything else falls back to the
// default so a bad/spoofed value can't pollute the column.
const ALLOWED_SOURCES = new Set(['lead_magnet', 'medical'])

export async function POST(req: NextRequest) {
  try {
    const { name, email, source } = await req.json()

    if (!name || !email || typeof name !== 'string' || typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const leadSource =
      typeof source === 'string' && ALLOWED_SOURCES.has(source) ? source : 'lead_magnet'

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not set — lead captured but no email sent:', `${name} <${email}>`)
      return NextResponse.json({ error: 'Email service not configured' }, { status: 503 })
    }

    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()

    // Store the lead and enroll them in the drip sequence. Best-effort: a storage
    // failure should never stop us from delivering the guide they asked for.
    if (hasSupabase()) {
      try {
        const now = new Date()
        const dripNext = nextDripDate(now, 0) // first drip after signup
        await getSupabase()
          .from('bda_leads')
          .upsert(
            {
              name: cleanName,
              email: cleanEmail,
              source: leadSource,
              drip_stage: 0,
              drip_next_at: dripNext?.toISOString() ?? null,
              unsubscribed: false,
              updated_at: now.toISOString(),
            },
            { onConflict: 'email', ignoreDuplicates: false }
          )
      } catch (dbErr) {
        console.error('Supabase lead upsert failed (non-fatal):', dbErr)
      }

      // Also add them to the weekly newsletter list. ignoreDuplicates so we
      // never resurrect someone who previously unsubscribed, and never flip an
      // existing subscriber's row. Best-effort.
      try {
        await getSupabase()
          .from('bda_subscribers')
          .upsert(
            {
              email: cleanEmail,
              name: cleanName,
              source: leadSource,
              status: 'active',
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'email', ignoreDuplicates: true }
          )
      } catch (subErr) {
        console.error('Subscriber enroll from lead failed (non-fatal):', subErr)
      }
    }

    const resend = getResend()

    // 1. Deliver the guide to the lead. This is the promise, so it must succeed.
    const guide = guideEmail(cleanName)
    const { error: guideError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: cleanEmail,
      subject: guide.subject,
      html: guide.html,
      text: guide.text,
    })

    if (guideError) {
      console.error('Resend guide email failed:', guideError)
      return NextResponse.json({ error: 'Could not send the guide. Please try again.' }, { status: 502 })
    }

    // 2. Notify the owner. Best-effort — never block the lead on this.
    try {
      const notify = leadNotifyEmail(cleanName, cleanEmail)
      await resend.emails.send({
        from: FROM_EMAIL,
        to: LEAD_NOTIFY_EMAIL,
        replyTo: cleanEmail,
        subject: notify.subject,
        html: notify.html,
        text: notify.text,
      })
    } catch (notifyErr) {
      console.error('Lead notification email failed (non-fatal):', notifyErr)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
