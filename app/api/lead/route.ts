import { NextRequest, NextResponse } from 'next/server'
import { getResend, FROM_EMAIL, LEAD_NOTIFY_EMAIL } from '@/lib/resend'
import { guideEmail, leadNotifyEmail } from '@/lib/emails'

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json()

    if (!name || !email || typeof name !== 'string' || typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    if (!process.env.RESEND_API_KEY) {
      // Fail loudly in logs but don't break the form during local dev / before keys are set.
      console.error('RESEND_API_KEY not set — lead captured but no email sent:', `${name} <${email}>`)
      return NextResponse.json({ error: 'Email service not configured' }, { status: 503 })
    }

    const resend = getResend()

    // 1. Deliver the guide to the lead. This is the promise we made, so it must succeed.
    const guide = guideEmail(name)
    const { error: guideError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: guide.subject,
      html: guide.html,
      text: guide.text,
    })

    if (guideError) {
      console.error('Resend guide email failed:', guideError)
      return NextResponse.json({ error: 'Could not send the guide. Please try again.' }, { status: 502 })
    }

    // 2. Notify the owner of the new lead. Best-effort — never block the lead on this.
    try {
      const notify = leadNotifyEmail(name, email)
      await resend.emails.send({
        from: FROM_EMAIL,
        to: LEAD_NOTIFY_EMAIL,
        replyTo: email,
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
