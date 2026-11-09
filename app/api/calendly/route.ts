import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { getResend, FROM_EMAIL, LEAD_NOTIFY_EMAIL, SITE_URL } from '@/lib/resend'
import { bookingNotifyEmail, intakeInviteEmail } from '@/lib/emails'
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

  let body: Record<string, unknown>
  try {
    body = JSON.parse(raw) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const eventName = typeof body.event === 'string' ? body.event : ''
  const payload = body.payload && typeof body.payload === 'object'
    ? body.payload as Record<string, unknown>
    : {}
  const scheduled = payload.scheduled_event && typeof payload.scheduled_event === 'object'
    ? payload.scheduled_event as Record<string, unknown>
    : {}

  const booking = {
    name: typeof payload.name === 'string' ? payload.name : null,
    email: typeof payload.email === 'string' ? payload.email : null,
    eventType: typeof scheduled.name === 'string' ? scheduled.name : null,
    scheduledAt: typeof scheduled.start_time === 'string' ? scheduled.start_time : null,
    uri: typeof payload.uri === 'string'
      ? payload.uri
      : typeof scheduled.uri === 'string'
        ? scheduled.uri
        : null,
    status: eventName === 'invitee.canceled' ? 'canceled' : 'created',
  }

  const isNew = eventName === 'invitee.created'

  // Log the booking (best-effort). New bookings get a first intake reminder
  // scheduled ~24h out; cancellations clear any pending reminder.
  if (hasSupabase()) {
    try {
      const record: Record<string, unknown> = {
        name: booking.name,
        email: booking.email,
        event_type: booking.eventType,
        scheduled_at: booking.scheduledAt,
        status: booking.status,
        calendly_uri: booking.uri,
        raw: body,
      }
      if (isNew) {
        const firstReminder = new Date(Date.now() + 24 * 60 * 60 * 1000)
        const callTime = booking.scheduledAt ? new Date(booking.scheduledAt) : null
        // Don't schedule a reminder after the call itself.
        record.intake_completed = false
        record.intake_reminders_sent = 0
        record.intake_next_reminder_at =
          callTime && firstReminder >= callTime ? null : firstReminder.toISOString()
      } else {
        record.intake_next_reminder_at = null
      }
      await getSupabase()
        .from('bda_bookings')
        .upsert(record, { onConflict: 'calendly_uri', ignoreDuplicates: false })
    } catch (dbErr) {
      console.error('Booking upsert failed (non-fatal):', dbErr)
    }
  }

  // On new bookings: notify the owner and invite the prospect to the intake.
  if (isNew && process.env.RESEND_API_KEY) {
    try {
      const mail = bookingNotifyEmail({
        name: booking.name ?? undefined,
        email: booking.email ?? undefined,
        eventType: booking.eventType ?? undefined,
        scheduledAt: booking.scheduledAt ?? undefined,
      })
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

    if (booking.email) {
      try {
        const intakeUrl = `${SITE_URL}/intake?email=${encodeURIComponent(booking.email)}`
        const invite = intakeInviteEmail(booking.name || 'there', intakeUrl)
        await getResend().emails.send({
          from: FROM_EMAIL,
          to: booking.email,
          subject: invite.subject,
          html: invite.html,
          text: invite.text,
        })
      } catch (mailErr) {
        console.error('Intake invite email failed (non-fatal):', mailErr)
      }
    }
  }

  return NextResponse.json({ ok: true })
}
