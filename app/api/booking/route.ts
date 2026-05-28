import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export const runtime = 'nodejs'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_LEN = { name: 100, email: 200, phone: 40, note: 2000 }

function esc(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    const email = typeof body?.email === 'string' ? body.email.trim() : ''
    const phone = typeof body?.phone === 'string' ? body.phone.trim() : ''
    const note = typeof body?.note === 'string' ? body.note.trim() : ''

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
    }
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 })
    }
    if (
      name.length > MAX_LEN.name ||
      email.length > MAX_LEN.email ||
      phone.length > MAX_LEN.phone ||
      note.length > MAX_LEN.note
    ) {
      return NextResponse.json({ error: 'Submission too long.' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    const notifyTo = process.env.BOOKING_NOTIFY_EMAIL
    const from = process.env.BOOKING_FROM_EMAIL

    if (!apiKey || !notifyTo || !from) {
      console.error('Booking email not configured: missing RESEND_API_KEY, BOOKING_NOTIFY_EMAIL, or BOOKING_FROM_EMAIL')
      return NextResponse.json({ error: 'Email is not configured. Please try again later.' }, { status: 500 })
    }

    const resend = new Resend(apiKey)

    const safe = {
      name: esc(name),
      email: esc(email),
      phone: phone ? esc(phone) : '',
      note: note ? esc(note).replace(/\n/g, '<br>') : '',
    }

    const notifyHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1E1B17; max-width: 560px;">
        <h2 style="margin: 0 0 16px; font-size: 18px;">New booking request</h2>
        <table style="border-collapse: collapse; width: 100%; font-size: 14px;">
          <tr><td style="padding: 8px 0; color: #777; width: 90px;">Name</td><td style="padding: 8px 0;">${safe.name}</td></tr>
          <tr><td style="padding: 8px 0; color: #777;">Email</td><td style="padding: 8px 0;"><a href="mailto:${safe.email}" style="color: #C9A84C;">${safe.email}</a></td></tr>
          ${safe.phone ? `<tr><td style="padding: 8px 0; color: #777;">Phone</td><td style="padding: 8px 0;">${safe.phone}</td></tr>` : ''}
          ${safe.note ? `<tr><td style="padding: 8px 0; color: #777; vertical-align: top;">Note</td><td style="padding: 8px 0; line-height: 1.5;">${safe.note}</td></tr>` : ''}
        </table>
        <p style="margin-top: 24px; font-size: 12px; color: #999;">Reply directly to this email to follow up with ${safe.name}.</p>
      </div>
    `.trim()

    const confirmHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1E1B17; max-width: 560px; line-height: 1.55;">
        <p style="margin: 0 0 16px;">Hi ${safe.name},</p>
        <p style="margin: 0 0 16px;">
          Thanks for reaching out — your booking request came through.
        </p>
        <p style="margin: 0 0 16px;">
          I'll personally review what you sent and reply within 1 business day with a couple of times that work to jump on a 15-minute call.
        </p>
        <p style="margin: 0 0 16px;">
          If anything urgent comes up in the meantime, just reply to this email.
        </p>
        <p style="margin: 24px 0 4px;">— Terry</p>
        <p style="margin: 0; color: #999; font-size: 12px;">By Design AI</p>
      </div>
    `.trim()

    const [notifyRes, confirmRes] = await Promise.all([
      resend.emails.send({
        from,
        to: notifyTo,
        subject: `New booking request — ${name}`,
        replyTo: email,
        html: notifyHtml,
      }),
      resend.emails.send({
        from,
        to: email,
        subject: 'We got your booking request — By Design AI',
        replyTo: notifyTo,
        html: confirmHtml,
      }),
    ])

    if (notifyRes.error) {
      console.error('Resend notify error:', notifyRes.error)
      return NextResponse.json({ error: 'Could not send request. Please try again.' }, { status: 502 })
    }
    if (confirmRes.error) {
      console.error('Resend confirm error:', confirmRes.error)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Booking route error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
