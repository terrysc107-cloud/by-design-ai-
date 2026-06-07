import { NextRequest, NextResponse } from 'next/server'
import { hasSupabase } from '@/lib/supabase'
import { PostizClient } from '@/lib/postiz'
import { publishApproved } from '@/lib/content-publish'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Daily cron: schedule any APPROVED posts to LinkedIn via Postiz, spread across
// the upcoming cadence slots. Only approved posts are ever published — drafts
// and rejected posts are untouched, so the human approval gate always holds.
const LANE = 'medical'

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

  try {
    const result = await publishApproved({ lane: LANE, live: true })
    return NextResponse.json({
      ok: true,
      scheduled: result.scheduled,
      skipped: result.skipped.length,
      approved: result.planned.length,
    })
  } catch (err) {
    console.error('content-publish cron failed:', err)
    return NextResponse.json({ error: 'Publish failed' }, { status: 500 })
  }
}
