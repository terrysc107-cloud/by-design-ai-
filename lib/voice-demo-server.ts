import { isSameOrigin, readBodyWithLimit } from './voice-agent-waitlist-handler'
import { createVoiceAgentWaitlistRateLimiter, type RateLimitDecision } from './voice-agent-waitlist-rate-limit'
import {
  parseUpstreamLead,
  parseUpstreamSession,
  parseUpstreamStatus,
  validateLeadRequest,
  validateSessionRequest,
  validateStatusRequest,
} from './voice-demo'

/**
 * Server-only proxy between the browser and the standalone voice demo
 * service. The browser never sees VOICE_DEMO_API_BASE_URL or the secret,
 * never sends a token in a URL, and only ever receives objects rebuilt by
 * the parseUpstream* sanitizers. All I/O is injected so tests run against a
 * stubbed fetch and can never reach the real service or a provider.
 */

export interface VoiceDemoConfig {
  baseUrl: string
  secret: string
}

/** `status` is keyed by demo token; `status_ip` is the separate per-address abuse ceiling. */
export type LimitScope = 'session' | 'status' | 'status_ip' | 'lead'

export interface VoiceDemoDependencies {
  config: () => VoiceDemoConfig | null
  fetch: typeof fetch
  /** `key` is a network address or (scope `status`) a demo token; the limiter hashes it before storage. */
  limit: (scope: LimitScope, key: string) => RateLimitDecision
  /** Sanitized diagnostics only: event names and status codes, never request bodies. */
  log: (event: string, fields?: Record<string, unknown>) => void
}

const UPSTREAM_TIMEOUT_MS = 8000
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]'])

export function readVoiceDemoConfig(env: Record<string, string | undefined>): VoiceDemoConfig | null {
  const rawUrl = env.VOICE_DEMO_API_BASE_URL?.trim()
  const secret = env.VOICE_DEMO_API_SECRET?.trim()
  if (!rawUrl || !secret || secret.length < 24) return null
  let url: URL
  try {
    url = new URL(rawUrl)
  } catch {
    return null
  }
  const secure = url.protocol === 'https:' || (url.protocol === 'http:' && LOCAL_HOSTS.has(url.hostname))
  if (!secure || url.search || url.hash) return null
  return { baseUrl: url.toString().replace(/\/+$/, ''), secret }
}

function respond(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
  })
}

/** First hop of x-forwarded-for (set by Vercel), hashed inside the limiter. */
function networkKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || request.headers.get('x-real-ip')?.trim() || 'unknown'
}

type Parsed = { ok: true; body: unknown } | { ok: false; response: Response }

async function readJson(request: Request, scope: LimitScope, deps: VoiceDemoDependencies): Promise<Parsed> {
  if (!(request.headers.get('content-type') ?? '').toLowerCase().includes('application/json')) {
    return { ok: false, response: respond({ error: 'unsupported_content_type' }, 415) }
  }
  if (!isSameOrigin(request)) {
    deps.log(`voice_demo.${scope}.origin_rejected`)
    return { ok: false, response: respond({ error: 'origin_not_allowed' }, 403) }
  }
  const text = await readBodyWithLimit(request)
  if (text === null) return { ok: false, response: respond({ error: 'too_large' }, 413) }
  try {
    return { ok: true, body: text.trim() ? JSON.parse(text) : null }
  } catch {
    return { ok: false, response: respond({ error: 'invalid_request' }, 400) }
  }
}

/** Checks each [scope, key] limit in order; the first denial wins. Keys are hashed inside the limiter. */
function gate(scope: LimitScope, checks: [LimitScope, string][], deps: VoiceDemoDependencies): Response | VoiceDemoConfig {
  for (const [limitScope, key] of checks) {
    const decision = deps.limit(limitScope, key)
    if (!decision.allowed) {
      deps.log(`voice_demo.${limitScope}.rate_limited`)
      return respond({ error: 'rate_limited' }, 429, { 'Retry-After': String(decision.retryAfterSeconds ?? 60) })
    }
  }
  const config = deps.config()
  if (!config) {
    deps.log(`voice_demo.${scope}.not_configured`)
    return respond({ error: 'not_configured' }, 503)
  }
  return config
}

async function callUpstream(
  deps: VoiceDemoDependencies,
  config: VoiceDemoConfig,
  path: string,
  init: { method: 'GET' | 'POST'; body?: unknown },
): Promise<{ status: number; data: unknown } | null> {
  try {
    const res = await deps.fetch(`${config.baseUrl}${path}`, {
      method: init.method,
      headers: {
        Authorization: `Bearer ${config.secret}`,
        Accept: 'application/json',
        ...(init.body === undefined ? {} : { 'Content-Type': 'application/json' }),
      },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    })
    let data: unknown = null
    try {
      data = await res.json()
    } catch {
      data = null
    }
    return { status: res.status, data }
  } catch {
    deps.log('voice_demo.upstream_error', { path: path.startsWith('/v1/web-demo/sessions/') ? 'status' : path })
    return null
  }
}

const UNAVAILABLE = () => respond({ error: 'upstream_unavailable' }, 502)
const UPSTREAM_LIMITED = () => respond({ error: 'rate_limited' }, 429, { 'Retry-After': '60' })

export function createVoiceDemoHandlers(deps: VoiceDemoDependencies) {
  async function session(request: Request): Promise<Response> {
    const parsed = await readJson(request, 'session', deps)
    if (!parsed.ok) return parsed.response
    const input = validateSessionRequest(parsed.body)
    if (!input.ok) return respond({ error: 'invalid_request', fields: input.fields }, 400)
    const config = gate('session', [['session', networkKey(request)]], deps)
    if (config instanceof Response) return config

    const upstream = await callUpstream(deps, config, '/v1/web-demo/sessions', {
      method: 'POST',
      body: { profile: input.value.vertical, ...(input.value.attribution ? { attribution: input.value.attribution } : {}) },
    })
    if (!upstream) return UNAVAILABLE()
    if (upstream.status === 429) return UPSTREAM_LIMITED()
    const result = upstream.status >= 200 && upstream.status < 300 ? parseUpstreamSession(upstream.data) : null
    if (!result) {
      deps.log('voice_demo.session.upstream_rejected', { status: upstream.status })
      return UNAVAILABLE()
    }
    return respond(result)
  }

  async function status(request: Request): Promise<Response> {
    const parsed = await readJson(request, 'status', deps)
    if (!parsed.ok) return parsed.response
    const input = validateStatusRequest(parsed.body)
    if (!input.ok) return respond({ error: 'invalid_request' }, 400)
    // Per demo token, so prospects sharing one NAT (office, campus, mobile carrier) never throttle each other.
    const config = gate('status', [['status', input.value.browser_token], ['status_ip', networkKey(request)]], deps)
    if (config instanceof Response) return config

    // Server-to-server only: the token is in the upstream path, never in a URL the browser or our logs see.
    const upstream = await callUpstream(deps, config, `/v1/web-demo/sessions/${encodeURIComponent(input.value.browser_token)}/status`, { method: 'GET' })
    if (!upstream) return UNAVAILABLE()
    if (upstream.status === 404 || upstream.status === 410) return respond({ state: 'expired' })
    if (upstream.status === 429) return UPSTREAM_LIMITED()
    const result = upstream.status >= 200 && upstream.status < 300 ? parseUpstreamStatus(upstream.data) : null
    if (!result) {
      deps.log('voice_demo.status.upstream_rejected', { status: upstream.status })
      return UNAVAILABLE()
    }
    return respond(result)
  }

  async function lead(request: Request): Promise<Response> {
    const parsed = await readJson(request, 'lead', deps)
    if (!parsed.ok) return parsed.response
    const body = parsed.body
    // Honeypot: generic success, nothing forwarded (matches the waitlist and intake pattern).
    if (typeof body === 'object' && body !== null && typeof (body as { company_url?: unknown }).company_url === 'string'
      && (body as { company_url: string }).company_url.trim().length > 0) {
      deps.log('voice_demo.lead.honeypot_triggered')
      return respond({ success: true, email_confirmation_sent: false })
    }
    const input = validateLeadRequest(body)
    if (!input.ok) return respond({ error: 'invalid_request', fields: input.fields }, 400)
    const config = gate('lead', [['lead', networkKey(request)]], deps)
    if (config instanceof Response) return config

    const upstream = await callUpstream(deps, config, '/v1/web-demo/leads', { method: 'POST', body: input.value })
    if (!upstream) return UNAVAILABLE()
    if (upstream.status === 429) return UPSTREAM_LIMITED()
    const result = upstream.status >= 200 && upstream.status < 300 ? parseUpstreamLead(upstream.data) : null
    if (!result) {
      deps.log('voice_demo.lead.upstream_rejected', { status: upstream.status })
      return UNAVAILABLE()
    }
    return respond({ success: true, ...result })
  }

  return { session, status, lead }
}

// ponytail: process-local limits (per serverless instance). The demo service
// enforces the authoritative limits; move to a shared store if abuse appears.
export function createVoiceDemoLimiter(now: () => number = Date.now): VoiceDemoDependencies['limit'] {
  const limiters: Record<LimitScope, (key: string) => RateLimitDecision> = {
    session: createVoiceAgentWaitlistRateLimiter(now, { keyWindowMs: 10 * 60_000, keyMaxAttempts: 6, globalMaxAttempts: 120 }),
    // Per token: polling every 3s is ~20/min plus visibility re-checks.
    status: createVoiceAgentWaitlistRateLimiter(now, { keyWindowMs: 60_000, keyMaxAttempts: 40, globalMaxAttempts: 6000 }),
    // Per address: ~60 concurrent demos behind one NAT; only stops token-rotation floods.
    status_ip: createVoiceAgentWaitlistRateLimiter(now, { keyWindowMs: 60_000, keyMaxAttempts: 1200, globalMaxAttempts: 6000 }),
    lead: createVoiceAgentWaitlistRateLimiter(now, { keyWindowMs: 10 * 60_000, keyMaxAttempts: 5, globalMaxAttempts: 60 }),
  }
  return (scope, key) => limiters[scope](key)
}

/** The production wiring used by the three route files. */
export const voiceDemoHandlers = createVoiceDemoHandlers({
  config: () => readVoiceDemoConfig(process.env),
  fetch: (...args: Parameters<typeof fetch>) => fetch(...args),
  limit: createVoiceDemoLimiter(),
  log: (event, fields) => console.log(JSON.stringify({ event, ...fields })),
})
