import { NextRequest, NextResponse } from 'next/server'
import { getResend, FROM_EMAIL, SITE_URL } from '@/lib/resend'
import { intakeReminderEmail } from '@/lib/emails'
import { getSupabase, hasSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const MAX_REMINDERS = 3
const NEXT_GAP_MS = 36 * 60 * 60 * 1000 // ~1.5 days between reminders

// Daily cron: nudge prospects who booked a call but haven't completed the intake.
// Escalates in tone; stops once completed, once the call passes, or after 3 sends.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  const auth = req.headers.get('authorization')
  const qs = req.nextUrl.searchParams.get('secret')
  if (secret && auth !== `Bearer ${secret}` && qs !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!hasSupabase() || !process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Intake reminders not configured' }, { status: 503 })
  }

  const supabase = getSupabase()
  const resend = getResend()
  const now = new Date()
  const nowIso = now.toISOString()

  const { data: due, error } = await supabase
    .from('bda_bookings')
    .select('id, name, email, scheduled_at, intake_reminders_sent')
    .eq('status', 'created')
    .eq('intake_completed', false)
    .gt('scheduled_at', nowIso)
    .not('intake_next_reminder_at', 'is', null)
    .lte('intake_next_reminder_at', nowIso)
    .lt('intake_reminders_sent', MAX_REMINDERS)
    .order('intake_next_reminder_at', { ascending: true })
    .limit(100)

  if (error) {
    console.error('Intake reminder query failed:', error)
    return NextResponse.json({ error: 'Query failed' }, { status: 500 })
  }

  let sent = 0
  const failures: string[] = []

  for (const b of due ?? []) {
    const email = b.email as string | null
    if (!email) continue
    const stage = (b.intake_reminders_sent as number) ?? 0
    const intakeUrl = `${SITE_URL}/intake?email=${encodeURIComponent(email)}`
    try {
      const mail = intakeReminderEmail((b.name as string) || 'there', intakeUrl, stage)
      const { error: sendErr } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
      })
      if (sendErr) throw sendErr

      const nextCount = stage + 1
      // Schedule the next reminder, but never after the call itself.
      let nextAt: string | null = null
      if (nextCount < MAX_REMINDERS) {
        const candidate = new Date(now.getTime() + NEXT_GAP_MS)
        const callTime = b.scheduled_at ? new Date(b.scheduled_at as string) : null
        nextAt = callTime && candidate >= callTime ? null : candidate.toISOString()
      }
      await supabase
        .from('bda_bookings')
        .update({ intake_reminders_sent: nextCount, intake_next_reminder_at: nextAt })
        .eq('id', b.id)
      sent++
    } catch (err) {
      console.error(`Intake reminder failed for ${email}:`, err)
      failures.push(email)
    }
  }

  return NextResponse.json({ ok: true, processed: due?.length ?? 0, sent, failures })
}
