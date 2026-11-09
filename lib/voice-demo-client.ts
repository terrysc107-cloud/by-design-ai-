import {
  parseUpstreamSession,
  parseUpstreamStatus,
  type Attribution,
  type DemoSession,
  type DemoStatus,
  type LeadRequest,
  type LeadResult,
  type Vertical,
} from './voice-demo'

/**
 * Typed browser boundary for the /api/voice-demo/* proxy routes. Every
 * response is re-checked with the same sanitizers the server uses, so a
 * malformed or unexpected body is a handled failure, never a crash. Tokens
 * and codes travel only in POST bodies and sessionStorage, never in URLs.
 */

export type ClientFailure = 'not_configured' | 'rate_limited' | 'invalid' | 'unavailable'
export type ClientResult<T> = { ok: true; data: T } | { ok: false; reason: ClientFailure; fields?: Record<string, string> }

const TIMEOUT_MS = 10_000
const STORAGE_KEY = 'aix_voice_demo_session'
const RESUME_GRACE_MS = 60 * 60_000

async function post<T>(path: string, body: unknown, parse: (data: unknown) => T | null): Promise<ClientResult<T>> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: 'no-store',
    })
    let data: unknown = null
    try {
      data = await res.json()
    } catch {
      data = null
    }
    if (res.ok) {
      const parsed = parse(data)
      return parsed ? { ok: true, data: parsed } : { ok: false, reason: 'unavailable' }
    }
    const error = (data as { error?: unknown } | null)?.error
    if (res.status === 503 && error === 'not_configured') return { ok: false, reason: 'not_configured' }
    if (res.status === 429) return { ok: false, reason: 'rate_limited' }
    if (res.status === 400) {
      const fields = (data as { fields?: unknown } | null)?.fields
      return { ok: false, reason: 'invalid', fields: typeof fields === 'object' && fields ? (fields as Record<string, string>) : undefined }
    }
    return { ok: false, reason: 'unavailable' }
  } catch {
    return { ok: false, reason: 'unavailable' }
  } finally {
    clearTimeout(timer)
  }
}

export function createDemoSession(vertical: Vertical, attribution?: Attribution): Promise<ClientResult<DemoSession>> {
  return post('/api/voice-demo/session', { vertical, attribution }, (d) =>
    parseUpstreamSession(typeof d === 'object' && d ? { ...d, profile: (d as { vertical?: unknown }).vertical } : d),
  )
}

export function fetchDemoStatus(browserToken: string): Promise<ClientResult<DemoStatus>> {
  return post('/api/voice-demo/status', { browser_token: browserToken }, parseUpstreamStatus)
}

/** Pass the output of validateLeadRequest plus the honeypot value; the server re-validates. */
export function submitFitRequest(input: LeadRequest & { company_url: string }): Promise<ClientResult<LeadResult>> {
  return post('/api/voice-demo/lead', input, (d): LeadResult | null =>
    typeof d === 'object' && d && (d as { success?: unknown }).success === true
      ? { email_confirmation_sent: (d as { email_confirmation_sent?: unknown }).email_confirmation_sent === true }
      : null,
  )
}

/** utm_* only, read from the landing URL. Never writes anything back into the URL. */
export function readAttribution(search: string): Attribution | undefined {
  const params = new URLSearchParams(search)
  const out: Attribution = {}
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const) {
    const v = params.get(key)
    if (v) out[key] = v.slice(0, 100)
  }
  return Object.keys(out).length > 0 ? out : undefined
}

// sessionStorage keeps the demo alive when a phone switches to the dialer and back.
export function saveDemoSession(session: DemoSession): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } catch {
    /* private mode: the demo still works for this page view */
  }
}

export function loadDemoSession(now = Date.now()): DemoSession | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    const session = parseUpstreamSession(
      typeof parsed === 'object' && parsed ? { ...parsed, profile: (parsed as { vertical?: unknown }).vertical } : null,
    )
    // expires_at bounds the call code; the reveal may arrive after it, so keep a
    // bounded grace window and let the service answer 'expired' authoritatively.
    if (!session || new Date(session.expires_at).getTime() + RESUME_GRACE_MS <= now) {
      clearDemoSession()
      return null
    }
    return session
  } catch {
    return null
  }
}

export function clearDemoSession(): void {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
