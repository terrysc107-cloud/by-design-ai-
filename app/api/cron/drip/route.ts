import { NextRequest, NextResponse } from 'next/server'
import { getResend, FROM_EMAIL, SITE_URL } from '@/lib/resend'
import { dripEmail } from '@/lib/emails'
import { getSupabase, hasSupabase } from '@/lib/supabase'
import { nextDripDate, DRIP_TOTAL } from '@/lib/drip'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Daily cron: send each due lead their next drip email and advance the schedule.
// Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`. We also accept the
// secret as ?secret= for manual testing.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  const auth = req.headers.get('authorization')
  const qs = req.nextUrl.searchParams.get('secret')
  if (secret && auth !== `Bearer ${secret}` && qs !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!hasSupabase() || !process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Drip not configured' }, { status: 503 })
  }

  const supabase = getSupabase()
  const resend = getResend()
  const nowIso = new Date().toISOString()

  const { data: due, error } = await supabase
    .from('bda_leads')
    .select('id, name, email, drip_stage, created_at, unsubscribe_token')
    .eq('unsubscribed', false)
    .lt('drip_stage', DRIP_TOTAL)
    .not('drip_next_at', 'is', null)
    .lte('drip_next_at', nowIso)
    .order('drip_next_at', { ascending: true })
    .limit(100)

  if (error) {
    console.error('Drip query failed:', error)
    return NextResponse.json({ error: 'Query failed' }, { status: 500 })
  }

  let sent = 0
  const failures: string[] = []

  for (const lead of due ?? []) {
    const stage = (lead.drip_stage as number) + 1
    const unsubscribeUrl = `${SITE_URL}/api/unsubscribe?token=${lead.unsubscribe_token}`
    try {
      const mail = dripEmail(stage, lead.name as string, unsubscribeUrl)
      const { error: sendErr } = await resend.emails.send({
        from: FROM_EMAIL,
        to: lead.email as string,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        headers: { 'List-Unsubscribe': `<${unsubscribeUrl}>` },
      })
      if (sendErr) throw sendErr

      const createdAt = new Date(lead.created_at as string)
      const next = nextDripDate(createdAt, stage)
      await supabase
        .from('bda_leads')
        .update({
          drip_stage: stage,
          drip_next_at: next?.toISOString() ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', lead.id)
      sent++
    } catch (err) {
      console.error(`Drip send failed for ${lead.email}:`, err)
      failures.push(lead.email as string)
    }
  }

  return NextResponse.json({ ok: true, processed: due?.length ?? 0, sent, failures })
}
