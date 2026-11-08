/**
 * Shared, I/O-free contract for the /voice-agent live phone demo.
 *
 * Two trust boundaries meet here:
 *   1. Browser -> our proxy routes: validate* functions accept only known
 *      fields and enumerations, and normalize contact details.
 *   2. Demo service -> our proxy routes: parseUpstream* functions rebuild a
 *      public-safe object from scratch, so anything the service adds later
 *      (provider ids, transcripts, caller PII) can never reach the browser.
 *
 * The voice service owns scoring, consent persistence, and delivery. This
 * module never decides a lead tier.
 */

export const VOICE_DEMO_VERTICALS = ['towing', 'mechanic', 'auto_detailing'] as const
export type Vertical = (typeof VOICE_DEMO_VERTICALS)[number]

export const DEMO_STATES = ['awaiting_call', 'in_call', 'completed', 'expired', 'failed'] as const
export type DemoState = (typeof DEMO_STATES)[number]

export const LEAD_TIERS = ['sales_qualified', 'review_qualified', 'nurture', 'resource'] as const
export type LeadTier = (typeof LEAD_TIERS)[number]

export const URGENCY_LEVELS = ['emergency', 'urgent', 'standard', 'flexible'] as const
export type Urgency = (typeof URGENCY_LEVELS)[number]

export const BUSINESS_TYPES = ['towing', 'mechanic', 'auto_detailing', 'other_automotive', 'other'] as const
export const MONTHLY_CALLS = ['under_50', '50_150', '150_400', '400_plus'] as const
export const MISSED_CALLS = ['rarely', 'sometimes', 'often', 'after_hours'] as const
export const TIMELINES = ['now', '30_days', '90_days', 'exploring'] as const
export const BUDGETS = ['fits', 'discuss', 'not_now'] as const

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
export type Attribution = Partial<Record<(typeof UTM_KEYS)[number], string>>

export interface DemoSession {
  browser_token: string
  call_code: string
  phone_number: string
  expires_at: string
  vertical: Vertical
}

export interface OwnerOutput {
  vertical: Vertical
  need: string
  urgency: Urgency | ''
  service_requested: string
  preferred_timing: string
  missing_information: string[]
  summary: string
  recommended_action: string
  example_notification: string
}

export interface DemoStatus {
  state: DemoState
  owner_output?: OwnerOutput
}

export interface LeadRequest {
  name: string
  business_name: string
  email: string
  phone?: string
  business_type: (typeof BUSINESS_TYPES)[number]
  monthly_calls: (typeof MONTHLY_CALLS)[number]
  missed_calls: (typeof MISSED_CALLS)[number]
  timeline: (typeof TIMELINES)[number]
  budget: (typeof BUDGETS)[number]
  recap_consent: boolean
  sales_follow_up_consent: boolean
  browser_token?: string
  attribution?: Attribution
}

/** What the browser learns after a lead submission. The tier stays server-side:
 * scheduling is offered only in the follow-up sent after the email is confirmed. */
export interface LeadResult {
  email_confirmation_sent: boolean
}

export type Validation<T> = { ok: true; value: T } | { ok: false; fields: Record<string, string> }

// ── Primitives ────────────────────────────────────────────────────────────

const TOKEN_SHAPE = /^[A-Za-z0-9_-]{32,128}$/
const CODE_SHAPE = /^\d{6}$/
const E164_SHAPE = /^\+[1-9]\d{7,14}$/
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const UTM_VALUE_SHAPE = /^[A-Za-z0-9._+ -]{1,100}$/
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function oneOf<T extends readonly string[]>(list: T, value: unknown): value is T[number] {
  return typeof value === 'string' && (list as readonly string[]).includes(value)
}

/** Strips control characters, trims, and caps length. Non-strings become ''. */
function cleanText(value: unknown, max: number): string {
  if (typeof value !== 'string') return ''
  return value.replace(CONTROL_CHARS, '').trim().slice(0, max)
}

export function isBrowserToken(value: unknown): value is string {
  return typeof value === 'string' && TOKEN_SHAPE.test(value)
}

function readAttribution(value: unknown): Attribution | undefined {
  if (!isRecord(value)) return undefined
  const out: Attribution = {}
  for (const key of UTM_KEYS) {
    const v = value[key]
    if (typeof v === 'string' && UTM_VALUE_SHAPE.test(v.trim())) out[key] = v.trim()
  }
  return Object.keys(out).length > 0 ? out : undefined
}

/** US numbers only for now; returns +1 E.164 or null. */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  return null
}

export function formatPhoneNumber(e164: string): string {
  const m = /^\+1(\d{3})(\d{3})(\d{4})$/.exec(e164)
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : e164
}

export function telHref(e164: string): string {
  return `tel:${e164}`
}

// ── Browser -> proxy validation ───────────────────────────────────────────

export function validateSessionRequest(body: unknown): Validation<{ vertical: Vertical; attribution?: Attribution }> {
  if (!isRecord(body) || !oneOf(VOICE_DEMO_VERTICALS, body.vertical)) {
    return { ok: false, fields: { vertical: 'Choose towing, auto repair, or auto detailing.' } }
  }
  const attribution = readAttribution(body.attribution)
  return { ok: true, value: attribution ? { vertical: body.vertical, attribution } : { vertical: body.vertical } }
}

export function validateStatusRequest(body: unknown): Validation<{ browser_token: string }> {
  if (!isRecord(body) || !isBrowserToken(body.browser_token)) {
    return { ok: false, fields: { browser_token: 'Invalid demo session.' } }
  }
  return { ok: true, value: { browser_token: body.browser_token } }
}

export function validateLeadRequest(input: unknown): Validation<LeadRequest> {
  if (!isRecord(input)) return { ok: false, fields: { form: 'Invalid request.' } }
  const body: Record<string, unknown> = input
  const fields: Record<string, string> = {}

  const text = (key: string, label: string, max: number) => {
    const raw = body[key]
    if (typeof raw !== 'string' || raw.trim().length === 0) {
      fields[key] = `Enter ${label}.`
      return ''
    }
    if (raw.trim().length > max) {
      fields[key] = `Keep this to ${max} characters or fewer.`
      return ''
    }
    return cleanText(raw, max)
  }

  const name = text('name', 'your name', 120)
  const business_name = text('business_name', 'your business name', 200)

  const rawEmail = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!rawEmail || rawEmail.length > 254 || !EMAIL_SHAPE.test(rawEmail)) fields.email = 'Enter a valid email address.'

  let phone: string | undefined
  if (body.phone !== undefined && body.phone !== null && body.phone !== '') {
    const normalized = typeof body.phone === 'string' && body.phone.length <= 40 ? normalizePhone(body.phone) : null
    if (normalized) phone = normalized
    else fields.phone = 'Enter a 10-digit US number, or leave it blank.'
  }

  const choice = <T extends readonly string[]>(key: string, list: T, message: string): T[number] => {
    const v = body[key]
    if (!oneOf(list, v)) {
      fields[key] = message
      return list[0]
    }
    return v
  }
  const business_type = choice('business_type', BUSINESS_TYPES, 'Choose your type of business.')
  const monthly_calls = choice('monthly_calls', MONTHLY_CALLS, 'Choose your approximate monthly call volume.')
  const missed_calls = choice('missed_calls', MISSED_CALLS, 'Choose how often calls go unanswered.')
  const timeline = choice('timeline', TIMELINES, 'Choose a timeline.')
  const budget = choice('budget', BUDGETS, 'Choose how the pricing fits.')

  const consent = (key: string) => {
    const v = body[key]
    if (v === undefined) return false
    if (typeof v !== 'boolean') {
      fields[key] = 'Invalid consent value.'
      return false
    }
    return v
  }
  const recap_consent = consent('recap_consent')
  const sales_follow_up_consent = consent('sales_follow_up_consent')

  let browser_token: string | undefined
  if (body.browser_token !== undefined && body.browser_token !== null && body.browser_token !== '') {
    if (isBrowserToken(body.browser_token)) browser_token = body.browser_token
    else fields.browser_token = 'Invalid demo session.'
  }

  if (Object.keys(fields).length > 0) return { ok: false, fields }

  const value: LeadRequest = {
    name, business_name, email: rawEmail, business_type, monthly_calls, missed_calls, timeline, budget,
    recap_consent, sales_follow_up_consent,
  }
  if (phone) value.phone = phone
  if (browser_token) value.browser_token = browser_token
  const attribution = readAttribution(body.attribution)
  if (attribution) value.attribution = attribution
  return { ok: true, value }
}

// ── Demo service -> proxy sanitizers ──────────────────────────────────────

export function parseUpstreamSession(data: unknown): DemoSession | null {
  if (!isRecord(data)) return null
  const { browser_token, call_code, phone_number, expires_at, profile } = data
  if (!isBrowserToken(browser_token)) return null
  if (typeof call_code !== 'string' || !CODE_SHAPE.test(call_code)) return null
  if (typeof phone_number !== 'string' || !E164_SHAPE.test(phone_number)) return null
  if (typeof expires_at !== 'string') return null
  const expires = new Date(expires_at)
  if (Number.isNaN(expires.getTime())) return null
  if (!oneOf(VOICE_DEMO_VERTICALS, profile)) return null
  return { browser_token, call_code, phone_number, expires_at: expires.toISOString(), vertical: profile }
}

function parseOwnerOutput(data: unknown): OwnerOutput | null {
  if (!isRecord(data) || !oneOf(VOICE_DEMO_VERTICALS, data.vertical)) return null
  const summary = cleanText(data.summary, 600)
  if (!summary) return null
  const missing = Array.isArray(data.missing_information) ? data.missing_information : []
  return {
    vertical: data.vertical,
    need: cleanText(data.need, 200),
    urgency: oneOf(URGENCY_LEVELS, data.urgency) ? data.urgency : '',
    service_requested: cleanText(data.service_requested, 200),
    preferred_timing: cleanText(data.preferred_timing, 200),
    missing_information: missing.map((m) => cleanText(m, 160)).filter(Boolean).slice(0, 8),
    summary,
    recommended_action: cleanText(data.recommended_action, 300),
    example_notification: cleanText(data.example_notification, 400),
  }
}

export function parseUpstreamStatus(data: unknown): DemoStatus | null {
  if (!isRecord(data) || !oneOf(DEMO_STATES, data.state)) return null
  if (data.state !== 'completed') return { state: data.state }
  const owner_output = parseOwnerOutput(data.owner_output)
  return owner_output ? { state: 'completed', owner_output } : null
}

/** A known tier proves the service scored the lead; only the literal `true`
 * confirmation flag is passed on, so the page never claims an email it cannot prove. */
export function parseUpstreamLead(data: unknown): LeadResult | null {
  if (!isRecord(data) || !oneOf(LEAD_TIERS, data.tier)) return null
  return { email_confirmation_sent: data.email_confirmation_sent === true }
}

// ── Analytics ─────────────────────────────────────────────────────────────

export const ANALYTICS_SOURCES = ['direct', 'search', 'social', 'email', 'paid', 'other'] as const
export type AnalyticsSource = (typeof ANALYTICS_SOURCES)[number]

export interface VoiceDemoAnalyticsParams {
  session_id?: string
  profile?: Vertical
  source?: AnalyticsSource
}

const ANALYTICS_SESSION_SHAPE = /^vs_[a-f0-9]{32}$/
const ANALYTICS_SESSION_KEY = 'aix_voice_demo_analytics_sid'

/** Allowlist, not blocklist: only these three keys with valid values survive. */
export function sanitizeAnalyticsParams(params: Record<string, unknown>): VoiceDemoAnalyticsParams {
  const out: VoiceDemoAnalyticsParams = {}
  if (typeof params.session_id === 'string' && ANALYTICS_SESSION_SHAPE.test(params.session_id)) out.session_id = params.session_id
  if (oneOf(VOICE_DEMO_VERTICALS, params.profile)) out.profile = params.profile
  if (oneOf(ANALYTICS_SOURCES, params.source)) out.source = params.source
  return out
}

const SEARCH_SOURCES = new Set(['google', 'bing', 'duckduckgo', 'yahoo', 'ecosia', 'brave'])
const SOCIAL_SOURCES = new Set(['linkedin', 'facebook', 'fb', 'instagram', 'ig', 'x', 'twitter', 'youtube', 'tiktok', 'reddit', 'threads'])
const EMAIL_VALUES = new Set(['email', 'newsletter', 'resend'])
const PAID_MEDIUMS = new Set(['cpc', 'ppc', 'paid', 'paid_social', 'paidsocial', 'display', 'ads'])

/** Buckets the landing URL's utm values into a fixed list. Raw values never leave this function. */
export function coarseSource(search: string): AnalyticsSource {
  const params = new URLSearchParams(search)
  const source = (params.get('utm_source') ?? '').trim().toLowerCase()
  const medium = (params.get('utm_medium') ?? '').trim().toLowerCase()
  if (!source && !medium) return 'direct'
  if (PAID_MEDIUMS.has(medium)) return 'paid'
  if (EMAIL_VALUES.has(medium) || EMAIL_VALUES.has(source)) return 'email'
  if (SEARCH_SOURCES.has(source)) return 'search'
  if (SOCIAL_SOURCES.has(source) || medium === 'social') return 'social'
  return 'other'
}

type SessionStore = { getItem(key: string): string | null; setItem(key: string, value: string): void }

/**
 * Random per-tab id for joining funnel events. 128 random bits, generated in
 * the browser, never derived from or sent alongside the demo token, code, or
 * any contact detail, and never sent to our proxy. Pass sessionStorage; null
 * or a throwing store still yields a fresh id (the caller caches it).
 */
export function getOrCreateAnalyticsSessionId(storage: SessionStore | null): string {
  try {
    const existing = storage?.getItem(ANALYTICS_SESSION_KEY)
    if (existing && ANALYTICS_SESSION_SHAPE.test(existing)) return existing
  } catch {
    /* storage blocked: fall through to a fresh id */
  }
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  const id = 'vs_' + Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
  try {
    storage?.setItem(ANALYTICS_SESSION_KEY, id)
  } catch {
    /* ignore */
  }
  return id
}
