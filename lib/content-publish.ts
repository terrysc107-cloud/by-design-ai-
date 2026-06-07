import { PostizClient } from './postiz'
import { listByStatus, markScheduled } from './content-queue'
import { getLane } from './content-engine'

/**
 * Publishing layer — takes APPROVED posts from the queue and schedules them to
 * LinkedIn via Postiz, spreading them across a recurring weekly cadence.
 *
 * Pure and environment-agnostic: the only side effects are the Postiz API and
 * the queue. Asset upload is optional and injected via `readAsset`, so this
 * works identically from the CLI (node fs) and the Vercel cron (text-only).
 *
 * Cadence: LinkedIn slots on Tue/Wed/Thu at 14:00 UTC (~9–10am ET), per
 * BRAND-KIT §11. Posts are assigned to the next free slots, never doubling up
 * on a slot already taken by a previously-scheduled post.
 */

const SLOT_DAYS = [2, 3, 4] // 0=Sun … Tue/Wed/Thu
const SLOT_HOUR_UTC = 14

/** Compute the next `count` free posting slots after `now`, skipping `taken`. */
export function computeSlots(count: number, taken: Set<number>, now: Date): Date[] {
  const slots: Date[] = []
  const cur = new Date(now)
  cur.setUTCHours(SLOT_HOUR_UTC, 0, 0, 0)
  if (cur.getTime() <= now.getTime()) cur.setUTCDate(cur.getUTCDate() + 1)
  let guard = 0
  while (slots.length < count && guard < 500) {
    if (SLOT_DAYS.includes(cur.getUTCDay()) && cur.getTime() > now.getTime() && !taken.has(cur.getTime())) {
      slots.push(new Date(cur))
    }
    cur.setUTCDate(cur.getUTCDate() + 1)
    cur.setUTCHours(SLOT_HOUR_UTC, 0, 0, 0)
    guard++
  }
  return slots
}

/** Turn the bare lane URL inside a post into a tracked https link. */
export function applyUtm(content: string, laneUrl: string, lane: string): string {
  const tracked = `https://${laneUrl}?utm_source=linkedin&utm_medium=post&utm_campaign=${lane}`
  return content.split(laneUrl).join(tracked)
}

function extractPostId(res: unknown): string | null {
  if (res && typeof res === 'object') {
    const r = res as Record<string, unknown>
    if (typeof r.id === 'string') return r.id
    const posts = r.posts
    if (Array.isArray(posts) && posts[0] && typeof posts[0] === 'object') {
      const first = posts[0] as Record<string, unknown>
      if (typeof first.id === 'string') return first.id
    }
  }
  return null
}

export interface PlannedItem {
  id: string
  pillar: string
  date: string
  preview: string
}

export interface PublishResult {
  lane: string
  live: boolean
  planned: PlannedItem[]
  scheduled: number
  skipped: string[]
}

export interface PublishOptions {
  lane?: string
  limit?: number
  /** false (default) = compute the plan only; true = actually schedule to Postiz */
  live?: boolean
  now?: Date
  /** optional asset loader; when absent, posts are scheduled text-only */
  readAsset?: (repoRelativePath: string) => Promise<Uint8Array>
  log?: (msg: string) => void
}

export async function publishApproved(opts: PublishOptions = {}): Promise<PublishResult> {
  const lane = opts.lane ?? 'medical'
  const now = opts.now ?? new Date()
  const log = opts.log ?? (() => {})
  const laneMeta = getLane(lane)

  const approved = await listByStatus('approved', lane, opts.limit ?? 100)

  // Avoid colliding with slots already claimed by future scheduled posts.
  const scheduledRows = await listByStatus('scheduled', lane, 500)
  const taken = new Set<number>()
  for (const r of scheduledRows) {
    if (r.scheduled_for) {
      const t = new Date(r.scheduled_for).getTime()
      if (t > now.getTime()) taken.add(t)
    }
  }

  const slots = computeSlots(approved.length, taken, now)
  const planned: PlannedItem[] = approved.map((r, i) => ({
    id: r.id,
    pillar: r.pillar,
    date: slots[i]?.toISOString() ?? '(no slot available)',
    preview: r.content.split('\n')[0].slice(0, 70),
  }))

  if (!opts.live) {
    return { lane, live: false, planned, scheduled: 0, skipped: [] }
  }

  if (!PostizClient.isConfigured()) {
    throw new Error('Postiz not configured — set POSTIZ_API_URL and POSTIZ_API_KEY.')
  }
  const client = new PostizClient()
  const channels = await client.listIntegrations()
  const channel = channels.find(c => c.identifier?.toLowerCase() === 'linkedin' && !c.disabled)
  if (!channel) throw new Error('No connected LinkedIn channel found in Postiz.')

  let scheduled = 0
  const skipped: string[] = []
  for (let i = 0; i < approved.length; i++) {
    const row = approved[i]
    const slot = slots[i]
    if (!slot) {
      skipped.push(row.id)
      continue
    }
    try {
      let mediaIds: string[] | undefined
      if (row.asset && opts.readAsset) {
        const bytes = await opts.readAsset(row.asset)
        const mediaId = await client.uploadMedia(row.asset.split('/').pop() || 'asset.png', bytes)
        mediaIds = [mediaId]
      }
      const content = applyUtm(row.content, laneMeta.url, lane)
      const res = await client.schedulePost({
        integrationId: channel.id,
        content,
        mediaIds,
        date: slot.toISOString(),
        type: 'schedule',
      })
      await markScheduled(row.id, extractPostId(res), slot.toISOString())
      scheduled++
      log(`✓ scheduled ${row.id.slice(0, 8)} → ${slot.toISOString()}`)
    } catch (err) {
      skipped.push(row.id)
      log(`⤫ failed ${row.id.slice(0, 8)}: ${(err as Error).message}`)
    }
  }

  return { lane, live: true, planned, scheduled, skipped }
}
