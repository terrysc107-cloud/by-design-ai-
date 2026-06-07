import { NextRequest, NextResponse } from 'next/server'
import { hasSupabase } from '@/lib/supabase'
import { sendNextBatch } from '@/lib/newsletter'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Daily cron: drain any approved newsletter issue to all active subscribers.
// Resumable + idempotent (per-recipient ledger). No-op when nothing is approved.
// Loops batches up to a wall-clock budget so one invocation drains as much as it
// can within maxDuration; the next daily tick (or a manual ?secret= call)
// resumes safely. Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`.
const BUDGET_MS = 50_000 // stop ~10s before maxDuration (60s) to finish cleanly
const MAX_LOOPS = 100

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  const auth = req.headers.get('authorization')
  const qs = req.nextUrl.searchParams.get('secret')
  if (secret && auth !== `Bearer ${secret}` && qs !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!hasSupabase() || !process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Newsletter send not configured' }, { status: 503 })
  }

  const start = Date.now()
  let batches = 0
  let sent = 0
  let failures = 0
  let processed = 0
  let lastIssueId: string | null = null
  let done = false
  let remaining = 0

  try {
    for (let i = 0; i < MAX_LOOPS; i++) {
      const r = await sendNextBatch({ batchSize: 100 })
      if (!r.issueId) {
        done = true
        break // nothing approved/sending
      }
      batches++
      sent += r.sent
      failures += r.failures
      processed += r.processed
      lastIssueId = r.issueId
      remaining = r.remaining
      done = r.done
      // No recipients processed this tick → no further progress possible now
      // (issue drained, or beyond the in-JS window for very large lists). Stop;
      // a later tick re-claims if anything remains.
      if (r.processed === 0) break
      if (Date.now() - start > BUDGET_MS) break
    }
    return NextResponse.json({ ok: true, batches, processed, sent, failures, lastIssueId, done, remaining })
  } catch (err) {
    console.error('newsletter-send cron failed:', err)
    return NextResponse.json(
      { error: 'Send failed', detail: err instanceof Error ? err.message : String(err), sent, failures },
      { status: 500 }
    )
  }
}
