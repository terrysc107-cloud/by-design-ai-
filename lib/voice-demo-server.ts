import { createHmac } from 'node:crypto'
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
  /** Bearer secret shared with the voice service. */
  secret: string
  /** Website-only HMAC key for network keys. Never shared with the service, so it cannot reverse them. */
  networkKeySecret: string
  /** Sent as the upstream Origin header when set; must be in the service's allowed origins. */
  origin?: string
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

const MIN_SECRET = 32 // the service rejects shorter bearer secrets

export function readVoiceDemoConfig(env: Record<string, string | undefined>): VoiceDemoConfig | null {
  const rawUrl = env.VOICE_DEMO_API_BASE_URL?.trim()
  const secret = env.VOICE_DEMO_API_SECRET?.trim()
  const networkKeySecret = env.VOICE_DEMO_NETWORK_KEY_SECRET?.trim()
  const origin = env.VOICE_DEMO_SITE_ORIGIN?.trim()
  if (!rawUrl || !secret || secret.length < MIN_SECRET) return null
  if (!networkKeySecret || networkKeySecret.length < MIN_SECRET || networkKeySecret === secret) return null
  let url: URL
  try {
    url = new URL(rawUrl)
  } catch {
    return null
  }
  const secure = url.protocol === 'https:' || (url.protocol === 'http:' && LOCAL_HOSTS.has(url.hostname))
  if (!secure || url.search || url.hash) return null
  const config: VoiceDemoConfig = { baseUrl: url.toString().replace(/\/+$/, ''), secret, networkKeySecret }
  if (origin) {
    // Fail closed on anything but a bare https origin (the service enforces the same rule).
    try {
      const parsed = new URL(origin)
      if (parsed.protocol !== 'https:' || parsed.origin !== origin) return null
    } catch {
      return null
    }
    config.origin = origin
  }
  return config
}

/** Keyed, versioned HMAC-SHA256 of the visitor address, base64url (43 chars). The raw address never leaves this server. */
export function deriveNetworkKey(address: string, networkKeySecret: string): string {
  return createHmac('sha256', networkKeySecret).update(`voice-demo-network-key:v1:${address}`).digest('base64url')
}

function respond(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
  })
}

/** First hop of x-forwarded-for (set by Vercel). Hashed inside the limiter; HMAC'd before it goes upstream. */
function networkAddress(request: Request): string {
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
  body: unknown,
): Promise<{ status: number; data: unknown } | null> {
  try {
    // Every upstream call is a JSON POST: secrets, tokens, and network keys only ever travel in headers or the body.
    const res = await deps.fetch(`${config.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.secret}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(config.origin ? { Origin: config.origin } : {}),
      },
      body: JSON.stringify(body),
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
    deps.log('voice_demo.upstream_error', { path })
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
    const address = networkAddress(request)
    const config = gate('session', [['session', address]], deps)
    if (config instanceof Response) return config

    const upstream = await callUpstream(deps, config, '/v1/web-demo/sessions', {
      profile: input.value.vertical,
      network_key: deriveNetworkKey(address, config.networkKeySecret),
      ...(input.value.attribution ? { attribution: input.value.attribution } : {}),
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
    const config = gate('status', [['status', input.value.browser_token], ['status_ip', networkAddress(request)]], deps)
    if (config instanceof Response) return config

    // POST-only upstream too: the token is in the JSON body, never in a path, query, or access log.
    const upstream = await callUpstream(deps, config, '/v1/web-demo/sessions/status', { browser_token: input.value.browser_token })
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
    const config = gate('lead', [['lead', networkAddress(request)]], deps)
    if (config instanceof Response) return config

    // The voice service owns durable lead capture, qualification, consent evidence, and delivery.
    const upstream = await callUpstream(deps, config, '/v1/web-demo/leads', input.value)
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
    // Same 5 per 10 min per network as the service (keyed by the same address), so we deny first.
    session: createVoiceAgentWaitlistRateLimiter(now, { keyWindowMs: 10 * 60_000, keyMaxAttempts: 5, globalMaxAttempts: 120 }),
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
