import { NextRequest, NextResponse } from 'next/server'
import { getSupabase, hasSupabase } from '@/lib/supabase'
import { hasSheetsCreds, writeTab } from '@/lib/google-sheets'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Daily cron: mirror Supabase signups into the Google Sheet CRM (one tab each
// for leads, newsletter subscribers, and bookings). Read-only on Supabase;
// fully overwrites each tab so the Sheet is always an exact snapshot.
//
// Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`. Also accepts
// ?secret=<CRON_SECRET> for manual testing.
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  const auth = req.headers.get('authorization')
  const qs = req.nextUrl.searchParams.get('secret')
  if (secret && auth !== `Bearer ${secret}` && qs !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!hasSupabase()) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  }
  if (!hasSheetsCreds()) {
    return NextResponse.json(
      { error: 'CRM sheet not configured (set GOOGLE_SA_EMAIL, GOOGLE_SA_PRIVATE_KEY, CRM_SHEET_ID)' },
      { status: 503 }
    )
  }

  const supabase = getSupabase()
  const result: Record<string, number | string> = {}

  try {
    // ── Leads ────────────────────────────────────────────────────────────
    const { data: leads, error: leadErr } = await supabase
      .from('bda_leads')
      .select('created_at, name, email, source, drip_stage, unsubscribed, updated_at')
      .order('created_at', { ascending: false })
      .limit(5000)
    if (leadErr) throw leadErr
    result.leads = await writeTab(
      'Leads',
      ['Created', 'Name', 'Email', 'Source', 'Drip Stage', 'Unsubscribed', 'Updated'],
      (leads ?? []).map(l => [
        fmt(l.created_at),
        l.name,
        l.email,
        l.source,
        l.drip_stage,
        l.unsubscribed ? 'yes' : 'no',
        fmt(l.updated_at),
      ])
    )

    // ── Subscribers ──────────────────────────────────────────────────────
    const { data: subs, error: subErr } = await supabase
      .from('bda_subscribers')
      .select('created_at, email, name, source, status, updated_at')
      .order('created_at', { ascending: false })
      .limit(5000)
    if (subErr) throw subErr
    result.subscribers = await writeTab(
      'Subscribers',
      ['Created', 'Email', 'Name', 'Source', 'Status', 'Updated'],
      (subs ?? []).map(s => [
        fmt(s.created_at),
        s.email,
        s.name,
        s.source,
        s.status,
        fmt(s.updated_at),
      ])
    )

    // ── Bookings ─────────────────────────────────────────────────────────
    const { data: bookings, error: bookErr } = await supabase
      .from('bda_bookings')
      .select('created_at, name, email, event_type, scheduled_at, status, intake_completed')
      .order('created_at', { ascending: false })
      .limit(5000)
    if (bookErr) throw bookErr
    result.bookings = await writeTab(
      'Bookings',
      ['Created', 'Name', 'Email', 'Event Type', 'Scheduled At', 'Status', 'Intake Done'],
      (bookings ?? []).map(b => [
        fmt(b.created_at),
        b.name,
        b.email,
        b.event_type,
        fmt(b.scheduled_at),
        b.status,
        b.intake_completed ? 'yes' : 'no',
      ])
    )
  } catch (err) {
    console.error('CRM sync failed:', err)
    return NextResponse.json(
      { error: 'CRM sync failed', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true, synced: result })
}

// Human-friendly UTC timestamp for the Sheet (YYYY-MM-DD HH:MM).
function fmt(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 16).replace('T', ' ')
}
