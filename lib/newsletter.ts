import { getOpenAI, OPENAI_MODEL } from './openai'
import { getSupabase } from './supabase'
import { getResend, FROM_EMAIL, SITE_URL } from './resend'
import { newsletterIssueEmail } from './emails'
import { getAllPosts } from './blog'
import { ASSETS } from './cta'
import { collectWeeklyIntel, formatWeeklyIntelForPrompt, type WeeklyIntel } from './weekly-intel'

/**
 * Newsletter engine — generates a weekly email issue in the AI by Design voice
 * (docs/BRAND-KIT.md), stores it in bda_newsletter_issues, and sends it to all
 * active bda_subscribers in resumable, idempotent batches.
 *
 * Mirrors the content engine split: generate → (human-approve) → send. The
 * approval gate lives between insert (status 'draft') and send (claims only
 * 'approved'/'sending'); a fully-autonomous path flips new issues straight to
 * 'approved'. See app/api/cron/newsletter-*.
 *
 * Server-only — uses OpenAI + the service-role Supabase client (bypasses RLS).
 */

// ── Types ───────────────────────────────────────────────────────────────────
export type IssueStatus = 'draft' | 'approved' | 'sending' | 'sent' | 'failed' | 'canceled'

export interface IssueSection {
  heading: string
  body: string
}

export interface GeneratedIssue {
  subject: string
  preheader: string
  intro: string
  body: IssueSection[]
  cta_label: string
  cta_url: string
}

export interface IssueRow extends GeneratedIssue {
  id: string
  status: IssueStatus
  approval_token: string
  lane: string
  preheader: string
  featured_post_slug: string | null
  featured_post_title: string | null
  featured_post_url: string | null
  hero_image_url: string | null
  inline_image_url: string | null
  recipient_total: number | null
  sent_count: number
  failed_count: number
  created_at: string
  approved_at: string | null
  send_started_at: string | null
  sent_at: string | null
  updated_at: string
}

export const ISSUE_TABLE = 'bda_newsletter_issues'
export const SEND_TABLE = 'bda_newsletter_sends'

// ── Generation ────────────────────────────────────────────────────────────--
export interface GenerateIssueOptions {
  /** audience lane label, e.g. 'general'. Defaults to 'general'. */
  lane?: string
  /** feature + link the latest published blog post as the issue's main CTA. Default true. */
  featureLatestPost?: boolean
  /** current AI/news/market snapshot collected before the model writes. */
  intel?: WeeklyIntel
}

interface LatestPost {
  slug: string
  title: string
  description: string
  url: string
}

function latestPost(): LatestPost | null {
  const posts = getAllPosts()
  if (posts.length === 0) return null
  const p = posts[0]
  return { slug: p.slug, title: p.title, description: p.description, url: `${SITE_URL}/blog/${p.slug}` }
}

function buildSystemPrompt(): string {
  // Same voice + hard rules as lib/content-engine.ts buildSystemPrompt, adapted
  // from a LinkedIn post to a weekly email newsletter issue.
  return `You are the newsletter engine for AI by Design (aixdesign.dev), an AI business coaching & consulting agency. You write a short WEEKLY EMAIL newsletter that teaches ONE practical AI/automation move someone can actually use in their business.

THE READER: a busy solo operator or small-business owner — often in or around the medical/healthcare world, but the lesson should be useful to any operator. They run a lot by hand (follow-ups, scheduling, admin, lead lists). They're skeptical of hype, allergic to jargon, and time-poor. They don't think "I need AI" — they think "I'm drowning in busywork."

THE GOAL: be genuinely useful in 2 minutes of reading. Teach one workflow or pattern they could set up themselves. The soft business goal is that they trust us and eventually book a free discovery call — but the issue earns that by being useful, not by pitching.

EDITORIAL SHAPE:
- This is a weekly operator intelligence note, not a breaking-news roundup.
- Use the scraped AI/news and market snapshot as raw context. Do not summarize every item.
- Pick ONE practical angle from the week: a tool shift, architecture pattern, business use case, or warning that a busy owner can act on.
- You may mention a stock or market move only if it helps explain what operators should pay attention to. Do not give investment advice.
- Include one small "try this" or "steal this" move.
- Make it engaging: one sharp observation, one useful implementation detail, and one bonus idea are better than generic coverage.

VOICE (non-negotiable):
- Direct, not corporate. Short sentences. No fluff.
- Builder, not guru. Show the work, not motivation.
- Calm authority. You've seen the broken setup before; you're impressed by what runs without them, not by complexity.
- Generous. The issue should be worth reading even if they never hire us.

HARD RULES:
- NEVER use these words: synergy, cutting-edge, revolutionary, disruptive, leverage, "AI-powered", ninja, rockstar, guru, "let's hop on a call".
- NEVER claim a specific client result, percentage, or testimonial we cannot prove. Speak from lived operator experience instead ("Most operators I see...", "I used to...").
- No emoji spam. At most one tasteful emoji, usually none.
- Email format: a strong subject line, a one-line preheader, a short intro, then 2–4 short sections each with a clear heading and a tight paragraph. Easy to skim on a phone.
- Concrete and specific: name a real task, a real trigger, a real tool category, a real 3-step recipe. No vague "AI can help you save time."
- Keep the whole issue tight — roughly 250–450 words across intro + sections.
- Do NOT write a CTA button or links yourself — the system appends the call-to-action. End your last section as useful content, not a pitch.

Return ONLY valid JSON, no prose around it.`
}

function buildUserPrompt(feature: LatestPost | null, intel: WeeklyIntel): string {
  const featureBlock = feature
    ? `\nThis week, the issue should naturally lead toward this new blog post (the system will add the "read the full post" button after your content, so reference the idea but DO NOT paste a link): "${feature.title}" — ${feature.description}\nMake the intro + sections set up the topic of that post so the reader wants to read it.\n`
    : `\nThere is no featured post this week — make the issue a standalone practical lesson. The system will add a button inviting them to grab the free guide.\n`
  return `Write this week's AI by Design newsletter issue.${featureBlock}

${formatWeeklyIntelForPrompt(intel)}

Use the snapshot above to make the issue feel current, but do not turn the email into a list of headlines. Choose the most useful thread for a business operator and translate it into a practical workflow, architecture idea, use case, or decision rule.

Return JSON in exactly this shape:
{
  "subject": "<inbox subject line, under ~60 chars, specific and curiosity-driven, no clickbait>",
  "preheader": "<one-line inbox preview, ~80 chars, complements the subject>",
  "intro": "<1–2 short opening paragraphs that hook the reader, plain text, \\n between paragraphs>",
  "body": [
    { "heading": "<short section heading>", "body": "<one tight paragraph, plain text, \\n allowed>" }
  ],
  "cta_label": "<3–5 word button label fitting the issue, e.g. 'Read the full post' or 'Grab the free guide'>"
}
The "body" array must have 2 to 4 sections.`
}

/**
 * Generate one newsletter issue. Calls OpenAI and returns a parsed, validated
 * issue. The cta_url is set deterministically by the caller (insertIssue uses
 * the featured post or the guide). Throws on missing key / unusable output.
 */
export async function generateIssue(opts: GenerateIssueOptions = {}): Promise<GeneratedIssue> {
  const feature = (opts.featureLatestPost ?? true) ? latestPost() : null
  const intel = opts.intel ?? (await collectWeeklyIntel())

  const completion = await getOpenAI().chat.completions.create({
    model: OPENAI_MODEL,
    temperature: 0.8,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: buildSystemPrompt() },
      { role: 'user', content: buildUserPrompt(feature, intel) },
    ],
  })

  const raw = completion.choices[0]?.message?.content?.trim()
  if (!raw) throw new Error('Newsletter engine returned an empty response.')

  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error('Newsletter engine returned invalid JSON.')
  }

  const subject = typeof parsed.subject === 'string' ? parsed.subject.trim() : ''
  const preheader = typeof parsed.preheader === 'string' ? parsed.preheader.trim() : ''
  const intro = typeof parsed.intro === 'string' ? parsed.intro.trim() : ''
  const bodyRaw = Array.isArray(parsed.body) ? parsed.body : []
  const body: IssueSection[] = bodyRaw
    .map(s => ({
      heading: typeof (s as IssueSection)?.heading === 'string' ? (s as IssueSection).heading.trim() : '',
      body: typeof (s as IssueSection)?.body === 'string' ? (s as IssueSection).body.trim() : '',
    }))
    .filter(s => s.heading && s.body)
  const ctaLabel = typeof parsed.cta_label === 'string' && parsed.cta_label.trim() ? parsed.cta_label.trim() : 'Read more'

  if (!subject || !intro || body.length === 0) {
    throw new Error('Newsletter engine produced an incomplete issue (need subject, intro, and at least one section).')
  }

  // cta_url filled by insertIssue based on the featured post; default to guide.
  const cta_url = feature ? feature.url : `${SITE_URL}/guide`
  return { subject, preheader, intro, body, cta_label: ctaLabel, cta_url }
}

// ── Images (reuse brand assets; single swap point for higgsfield later) ──────
/**
 * Pick 1–2 absolute https image URLs for an issue. Email clients require
 * absolute URLs. Currently reuses the hosted brand assets from lib/cta.ts; to
 * generate per-issue art later, write the URLs onto the issue row and the email
 * template will prefer them.
 */
export function pickIssueImages(_lane?: string): { hero: string; inline: string | null } {
  return { hero: ASSETS.sectionBg, inline: null }
}

// ── Persistence (mirrors lib/content-queue.ts) ───────────────────────────────
export async function insertIssue(
  gen: GeneratedIssue,
  extra: {
    lane: string
    featured?: { slug: string; title: string; url: string } | null
    images: { hero: string; inline: string | null }
  }
): Promise<IssueRow> {
  const row = {
    subject: gen.subject,
    preheader: gen.preheader,
    intro: gen.intro,
    body: gen.body,
    cta_label: gen.cta_label,
    cta_url: extra.featured ? extra.featured.url : gen.cta_url,
    featured_post_slug: extra.featured?.slug ?? null,
    featured_post_title: extra.featured?.title ?? null,
    featured_post_url: extra.featured?.url ?? null,
    hero_image_url: extra.images.hero,
    inline_image_url: extra.images.inline,
    lane: extra.lane,
    status: 'draft' as const,
  }
  const { data, error } = await getSupabase().from(ISSUE_TABLE).insert(row).select().single()
  if (error) throw new Error(`Failed to insert issue: ${error.message}`)
  return data as IssueRow
}

export async function getIssueById(id: string): Promise<IssueRow | null> {
  const { data, error } = await getSupabase().from(ISSUE_TABLE).select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(`Failed to load issue ${id}: ${error.message}`)
  return (data as IssueRow) ?? null
}

/** Resolve a full id or short id-prefix (uuid columns reject ilike — match in JS). */
export async function resolveIssueId(idOrPrefix: string): Promise<IssueRow> {
  const exact = await getIssueById(idOrPrefix)
  if (exact) return exact
  const { data, error } = await getSupabase()
    .from(ISSUE_TABLE)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500)
  if (error) throw new Error(`Failed to resolve ${idOrPrefix}: ${error.message}`)
  const matches = ((data ?? []) as IssueRow[]).filter(r => r.id.startsWith(idOrPrefix))
  if (matches.length === 0) throw new Error(`No newsletter issue matches "${idOrPrefix}".`)
  if (matches.length > 1) throw new Error(`"${idOrPrefix}" is ambiguous (${matches.length} matches) — use more characters.`)
  return matches[0]
}

export async function listIssues(status?: IssueStatus, limit = 50): Promise<IssueRow[]> {
  let q = getSupabase().from(ISSUE_TABLE).select('*').order('created_at', { ascending: false }).limit(limit)
  if (status) q = q.eq('status', status)
  const { data, error } = await q
  if (error) throw new Error(`Failed to list issues: ${error.message}`)
  return (data ?? []) as IssueRow[]
}

async function patchIssue(id: string, fields: Record<string, unknown>): Promise<void> {
  const { error } = await getSupabase()
    .from(ISSUE_TABLE)
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(`Failed to update issue ${id}: ${error.message}`)
}

export async function setIssueStatus(id: string, status: IssueStatus): Promise<void> {
  const extra: Record<string, unknown> = { status }
  if (status === 'approved') extra.approved_at = new Date().toISOString()
  await patchIssue(id, extra)
}

export async function setIssueFields(id: string, fields: Partial<IssueRow>): Promise<void> {
  await patchIssue(id, fields as Record<string, unknown>)
}

// ── Sending (resumable + idempotent) ─────────────────────────────────────────
export interface SendTickResult {
  issueId: string | null
  subject: string | null
  processed: number
  sent: number
  failures: number
  done: boolean
  remaining: number
}

interface SubscriberRow {
  id: string
  email: string
  name: string | null
  unsubscribe_token: string
}

async function countActiveSubscribers(): Promise<number> {
  const { count, error } = await getSupabase()
    .from('bda_subscribers')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'active')
  if (error) throw new Error(`Failed to count subscribers: ${error.message}`)
  return count ?? 0
}

async function countLedger(issueId: string): Promise<number> {
  const { count, error } = await getSupabase()
    .from(SEND_TABLE)
    .select('id', { count: 'exact', head: true })
    .eq('issue_id', issueId)
  if (error) throw new Error(`Failed to count sends: ${error.message}`)
  return count ?? 0
}

/**
 * Claim the oldest approved/sending issue and send ONE batch (default 100).
 * Resumable: a re-run recomputes who's already in the ledger and continues.
 * Idempotent: a unique(issue_id, subscriber_id) row is reserved BEFORE the send,
 * so overlapping ticks / retries can never email the same subscriber twice.
 *
 * Note: the not-yet-sent set is computed by over-fetching active subscribers and
 * filtering in JS. Fine for lists up to a few thousand; swap to a `not exists`
 * RPC for true scale.
 */
export async function sendNextBatch(opts: { batchSize?: number } = {}): Promise<SendTickResult> {
  const batchSize = opts.batchSize ?? 100
  const supabase = getSupabase()
  const none: SendTickResult = { issueId: null, subject: null, processed: 0, sent: 0, failures: 0, done: true, remaining: 0 }

  // 1. Claim the oldest issue ready to send.
  const { data: claim, error: claimErr } = await supabase
    .from(ISSUE_TABLE)
    .select('*')
    .in('status', ['approved', 'sending'])
    .order('approved_at', { ascending: true, nullsFirst: true })
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()
  if (claimErr) throw new Error(`Failed to claim issue: ${claimErr.message}`)
  if (!claim) return none
  const issue = claim as IssueRow

  if (issue.status === 'approved') {
    await supabase
      .from(ISSUE_TABLE)
      .update({ status: 'sending', send_started_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', issue.id)
      .eq('status', 'approved')
  }

  // 2. Who has already been written to the ledger for this issue?
  const { data: already, error: ledErr } = await supabase
    .from(SEND_TABLE)
    .select('subscriber_id')
    .eq('issue_id', issue.id)
  if (ledErr) throw new Error(`Failed to read ledger: ${ledErr.message}`)
  const sentSet = new Set((already ?? []).map(r => (r as { subscriber_id: string }).subscriber_id))

  // 3. Fetch active subscribers not yet in the ledger; take the next batch.
  const windowSize = Math.min(sentSet.size + batchSize, 5000)
  const { data: subs, error: subErr } = await supabase
    .from('bda_subscribers')
    .select('id, email, name, unsubscribe_token')
    .eq('status', 'active')
    .order('created_at', { ascending: true })
    .limit(windowSize)
  if (subErr) throw new Error(`Failed to fetch subscribers: ${subErr.message}`)
  const todo = ((subs ?? []) as SubscriberRow[]).filter(s => !sentSet.has(s.id)).slice(0, batchSize)

  // 4. Per-recipient: reserve → send → mark.
  const resend = getResend()
  let sent = 0
  let failures = 0
  for (const sub of todo) {
    // Reserve via the unique constraint. 23505 → another tick owns it; skip.
    const { error: reserveErr } = await supabase
      .from(SEND_TABLE)
      .insert({ issue_id: issue.id, subscriber_id: sub.id, email: sub.email, status: 'pending' })
    if (reserveErr) {
      if ((reserveErr as { code?: string }).code === '23505') continue
      // Unexpected reserve failure: skip this recipient this tick, retry next.
      console.error(`Reserve failed for ${sub.email}:`, reserveErr.message)
      continue
    }

    const unsubscribeUrl = `${SITE_URL}/api/unsubscribe?list=subscribers&token=${sub.unsubscribe_token}`
    try {
      const mail = newsletterIssueEmail(issue, sub.name ?? undefined, unsubscribeUrl)
      const { data: r, error: sendErr } = await resend.emails.send({
        from: FROM_EMAIL,
        to: sub.email,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        headers: { 'List-Unsubscribe': `<${unsubscribeUrl}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' },
      })
      if (sendErr) throw sendErr
      await supabase
        .from(SEND_TABLE)
        .update({ status: 'sent', resend_id: r?.id ?? null, sent_at: new Date().toISOString() })
        .eq('issue_id', issue.id)
        .eq('subscriber_id', sub.id)
      sent++
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      await supabase
        .from(SEND_TABLE)
        .update({ status: 'failed', error: msg.slice(0, 500) })
        .eq('issue_id', issue.id)
        .eq('subscriber_id', sub.id)
      console.error(`Newsletter send failed for ${sub.email}:`, msg)
      failures++
    }
  }

  // 5. Completion: every active subscriber accounted for in the ledger.
  const [activeCount, ledgerCount] = await Promise.all([countActiveSubscribers(), countLedger(issue.id)])
  const remaining = Math.max(0, activeCount - ledgerCount)
  const done = remaining === 0

  const { data: sentRows } = await supabase
    .from(SEND_TABLE)
    .select('status')
    .eq('issue_id', issue.id)
  const sentTotal = (sentRows ?? []).filter(r => (r as { status: string }).status === 'sent').length
  const failedTotal = (sentRows ?? []).filter(r => (r as { status: string }).status === 'failed').length

  await patchIssue(issue.id, {
    sent_count: sentTotal,
    failed_count: failedTotal,
    recipient_total: activeCount,
    ...(done ? { status: 'sent', sent_at: new Date().toISOString() } : {}),
  })

  return {
    issueId: issue.id,
    subject: issue.subject,
    processed: todo.length,
    sent,
    failures,
    done,
    remaining,
  }
}
