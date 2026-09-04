import { NextRequest, NextResponse } from 'next/server'
import { hasSupabase } from '@/lib/supabase'
import { PostizClient } from '@/lib/postiz'
import { publishApproved } from '@/lib/content-publish'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Daily cron: schedule any APPROVED posts to LinkedIn via Postiz, spread across
// the upcoming cadence slots. Only approved posts are ever published; drafts and
// rejected posts are untouched, so the human approval gate always holds.
//
// Multi-lane since 2026-09-03, matching content-generate. Slot collision is
// computed per lane inside publishApproved, so running the lanes in sequence
// (not in parallel) is deliberate: the second lane must see the slots the first
// one just claimed, or both would schedule into the same Tuesday.
const LANES = ['medical', 'board'] as const

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
  if (!PostizClient.isConfigured()) {
    return NextResponse.json({ error: 'Postiz not configured' }, { status: 503 })
  }

  const lanes: Record<string, unknown> = {}
  let scheduledTotal = 0

  for (const lane of LANES) {
    try {
      const result = await publishApproved({ lane, live: true })
      scheduledTotal += result.scheduled
      lanes[lane] = {
        scheduled: result.scheduled,
        skipped: result.skipped.length,
        approved: result.planned.length,
      }
    } catch (err) {
      // A misconfigured channel or an API blip in one lane must not strand the
      // other lane's approved posts, which a human has already signed off on.
      console.error(`content-publish failed for lane "${lane}":`, err)
      lanes[lane] = { error: (err as Error).message }
    }
  }

  return NextResponse.json({ ok: true, scheduled: scheduledTotal, lanes })
}
