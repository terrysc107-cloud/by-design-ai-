import { getSupabase } from './supabase'
import type { GeneratedPost } from './content-engine'

/**
 * Data-access helpers for the bda_content_queue table. Server-only — uses the
 * service-role Supabase client (bypasses RLS). Shared by the content scripts
 * and the content cron routes so the queue logic lives in one place.
 */

export type ContentStatus = 'draft' | 'approved' | 'rejected' | 'scheduled' | 'posted'

export interface ContentRow {
  id: string
  lane: string
  pillar: string
  platform: string
  content: string
  asset: string | null
  status: ContentStatus
  scheduled_for: string | null
  postiz_post_id: string | null
  created_at: string
  updated_at: string
}

export const CONTENT_TABLE = 'bda_content_queue'

/** Insert generated posts as drafts. Returns the inserted rows. */
export async function insertDrafts(
  posts: GeneratedPost[],
  lane: string,
  platform = 'linkedin'
): Promise<ContentRow[]> {
  if (posts.length === 0) return []
  const rows = posts.map(p => ({
    lane,
    pillar: p.pillar,
    platform,
    content: p.content,
    status: 'draft' as const,
  }))
  const { data, error } = await getSupabase().from(CONTENT_TABLE).insert(rows).select()
  if (error) throw new Error(`Failed to insert drafts: ${error.message}`)
  return (data ?? []) as ContentRow[]
}

/** Count rows in a given status, optionally scoped to a lane. */
export async function countByStatus(status: ContentStatus, lane?: string): Promise<number> {
  let q = getSupabase().from(CONTENT_TABLE).select('id', { count: 'exact', head: true }).eq('status', status)
  if (lane) q = q.eq('lane', lane)
  const { count, error } = await q
  if (error) throw new Error(`Failed to count ${status}: ${error.message}`)
  return count ?? 0
}

/** List rows in a given status, oldest first. */
export async function listByStatus(
  status: ContentStatus,
  lane?: string,
  limit = 100
): Promise<ContentRow[]> {
  let q = getSupabase()
    .from(CONTENT_TABLE)
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: true })
    .limit(limit)
  if (lane) q = q.eq('lane', lane)
  const { data, error } = await q
  if (error) throw new Error(`Failed to list ${status}: ${error.message}`)
  return (data ?? []) as ContentRow[]
}

export async function getById(id: string): Promise<ContentRow | null> {
  const { data, error } = await getSupabase().from(CONTENT_TABLE).select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(`Failed to load ${id}: ${error.message}`)
  return (data as ContentRow) ?? null
}

/**
 * Resolve a full id or a short id-prefix (e.g. first 8 chars from --list) to a
 * single row. Throws if the prefix is ambiguous or matches nothing.
 *
 * Postgres `uuid` columns reject `ilike`, so prefix matching is done in JS over
 * recent rows rather than via a SQL filter.
 */
export async function resolveId(idOrPrefix: string): Promise<ContentRow> {
  const exact = await getById(idOrPrefix)
  if (exact) return exact
  const { data, error } = await getSupabase()
    .from(CONTENT_TABLE)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500)
  if (error) throw new Error(`Failed to resolve ${idOrPrefix}: ${error.message}`)
  const matches = ((data ?? []) as ContentRow[]).filter(r => r.id.startsWith(idOrPrefix))
  if (matches.length === 0) throw new Error(`No content row matches "${idOrPrefix}".`)
  if (matches.length > 1) {
    throw new Error(`"${idOrPrefix}" is ambiguous (${matches.length} matches) — use more characters.`)
  }
  return matches[0]
}

async function patch(id: string, fields: Record<string, unknown>): Promise<void> {
  const { error } = await getSupabase()
    .from(CONTENT_TABLE)
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(`Failed to update ${id}: ${error.message}`)
}

export async function setStatus(id: string, status: ContentStatus): Promise<void> {
  await patch(id, { status })
}

export async function setContent(id: string, content: string): Promise<void> {
  await patch(id, { content })
}

/** Mark a row scheduled after it's been queued in Postiz. */
export async function markScheduled(
  id: string,
  postizPostId: string | null,
  scheduledFor: string
): Promise<void> {
  await patch(id, { status: 'scheduled', postiz_post_id: postizPostId, scheduled_for: scheduledFor })
}
