import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { getResend, FROM_EMAIL, LEAD_NOTIFY_EMAIL } from '@/lib/resend'
import { bookingNotifyEmail } from '@/lib/emails'
import { getSupabase, hasSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// Verify Calendly's signature: header is "t=<unix>,v1=<hmac>" over `${t}.${body}`.
function verify(signature: string | null, body: string, key: string): boolean {
  if (!signature) return false
  const parts = Object.fromEntries(signature.split(',').map(p => p.split('=')))
  const t = parts['t']
  const v1 = parts['v1']
  if (!t || !v1) return false
  const expected = crypto.createHmac('sha256', key).update(`${t}.${body}`).digest('hex')
  try {
    return crypto.timingSafeEqual(Buffer.from(v1), Buffer.from(expected))
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const raw = await req.text()

  const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY
  if (signingKey) {
    const sig = req.headers.get('calendly-webhook-signature')
    if (!verify(sig, raw, signingKey)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  }

  let body: any
  try {
    body = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const eventName: string = body?.event ?? ''
  const payload = body?.payload ?? {}
  const scheduled = payload?.scheduled_event ?? {}

  const booking = {
    name: payload?.name ?? null,
    email: payload?.email ?? null,
    eventType: scheduled?.name ?? null,
    scheduledAt: scheduled?.start_time ?? null,
    uri: payload?.uri ?? scheduled?.uri ?? null,
    status: eventName === 'invitee.canceled' ? 'canceled' : 'created',
  }

  // Log the booking (best-effort).
  if (hasSupabase()) {
    try {
      await getSupabase()
        .from('bda_bookings')
        .upsert(
          {
            name: booking.name,
            email: booking.email,
            event_type: booking.eventType,
            scheduled_at: booking.scheduledAt,
            status: booking.status,
            calendly_uri: booking.uri,
            raw: body,
          },
          { onConflict: 'calendly_uri', ignoreDuplicates: false }
        )
    } catch (dbErr) {
      console.error('Booking upsert failed (non-fatal):', dbErr)
    }
  }

  // Notify the owner only on new bookings (not cancellations).
  if (eventName === 'invitee.created' && process.env.RESEND_API_KEY) {
    try {
      const mail = bookingNotifyEmail(booking)
      await getResend().emails.send({
        from: FROM_EMAIL,
        to: LEAD_NOTIFY_EMAIL,
        replyTo: booking.email ?? undefined,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
      })
    } catch (mailErr) {
      console.error('Booking notification failed (non-fatal):', mailErr)
    }
  }

  return NextResponse.json({ ok: true })
}
