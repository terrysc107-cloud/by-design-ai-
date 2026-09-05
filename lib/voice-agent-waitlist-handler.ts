import { validateVoiceAgentWaitlistInput, type VoiceAgentWaitlistInput } from './voice-agent-waitlist'

/**
 * Testable request handler for POST /api/voice-agent-waitlist. All I/O
 * (persistence, rate limiting, config check, clock, logging) is injected so
 * this can be unit-tested without a real Supabase client or network.
 *
 * Enforces the exact processing order the feature spec requires:
 * content-type -> origin -> body-size -> JSON parse -> object shape ->
 * honeypot -> validate -> rate limit -> config check -> persist -> respond.
 */

export interface RateLimitDecision {
  allowed: boolean
  retryAfterSeconds?: number
}

export interface WaitlistHandlerDependencies {
  configured: () => boolean
  persist: (input: VoiceAgentWaitlistInput) => Promise<void>
  limit: (key: string) => RateLimitDecision
  now: () => number
  /** Sanitized diagnostics only - never pass raw email, interest text, or a database error message. */
  log: (event: string, fields?: Record<string, unknown>) => void
}

const MAX_BODY_BYTES = 4096

function jsonResponse(body: unknown, status: number, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...headers },
  })
}

/** Reads the body as a byte-bounded stream so an untrustworthy or missing
 * Content-Length header can never bypass the limit. Returns null if the
 * stream exceeds MAX_BODY_BYTES. */
async function readBodyWithLimit(request: Request): Promise<string | null> {
  const reader = request.body?.getReader()
  if (!reader) {
    const text = await request.text()
    if (Buffer.byteLength(text, 'utf8') > MAX_BODY_BYTES) return null
    return text
  }

  const chunks: Uint8Array[] = []
  let total = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    if (value) {
      total += value.byteLength
      if (total > MAX_BODY_BYTES) {
        await reader.cancel().catch(() => {})
        return null
      }
      chunks.push(value)
    }
  }
  const buf = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    buf.set(chunk, offset)
    offset += chunk.byteLength
  }
  return new TextDecoder().decode(buf)
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return false
  try {
    return new URL(request.url).origin === origin
  } catch {
    return false
  }
}

export function createVoiceAgentWaitlistHandler(deps: WaitlistHandlerDependencies) {
  return async function handleVoiceAgentWaitlistRequest(request: Request): Promise<Response> {
    // 1. Content type.
    const contentType = request.headers.get('content-type') ?? ''
    if (!contentType.toLowerCase().includes('application/json')) {
      return jsonResponse({ error: 'Unsupported content type.' }, 415)
    }

    // 2. Origin. This browser-only endpoint requires a same-origin request;
    // it is a CSRF guard, not authentication or an abuse control on its own.
    if (!isSameOrigin(request)) {
      deps.log('voice_agent_waitlist.origin_rejected')
      return jsonResponse({ error: 'Request origin not allowed.' }, 403)
    }

    // 3-4. Byte-bounded read, then parse.
    const bodyText = await readBodyWithLimit(request)
    if (bodyText === null) {
      return jsonResponse({ error: 'Request body too large.' }, 413)
    }

    let parsed: unknown
    try {
      parsed = bodyText.trim() ? JSON.parse(bodyText) : null
    } catch {
      return jsonResponse({ error: 'Invalid request.' }, 400)
    }

    // 5. Require a plain object.
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return jsonResponse({ error: 'Invalid request.' }, 400)
    }
    const body = parsed as Record<string, unknown>

    // 6. Honeypot: same generic success, deliberately skipping persistence -
    // matches the existing app/api/intake anti-bot pattern.
    if (typeof body.company_url === 'string' && body.company_url.trim().length > 0) {
      deps.log('voice_agent_waitlist.honeypot_triggered')
      return jsonResponse({ success: true }, 200)
    }

    // 7. Validate + normalize.
    const result = validateVoiceAgentWaitlistInput(body)
    if (!result.valid) {
      return jsonResponse({ error: 'Please check the form and try again.', fields: result.errors }, 400)
    }

    // 8. Abuse limit (applies to duplicates too).
    const decision = deps.limit(result.input.email)
    if (!decision.allowed) {
      deps.log('voice_agent_waitlist.rate_limited')
      return jsonResponse(
        { error: 'Too many requests. Please try again later.' },
        429,
        { 'Retry-After': String(decision.retryAfterSeconds ?? 60) }
      )
    }

    // 9. Supabase configured.
    if (!deps.configured()) {
      deps.log('voice_agent_waitlist.not_configured')
      return jsonResponse({ error: "We couldn't save your request. Please try again." }, 503)
    }

    // 10. Insert. A missing/misconfigured table surfaces as a visible,
    // retryable error - never a fake success.
    try {
      await deps.persist(result.input)
    } catch {
      deps.log('voice_agent_waitlist.persist_failed')
      return jsonResponse({ error: "We couldn't save your request. Please try again." }, 503)
    }

    // 11. Success only after persistence succeeds (honeypot is the one
    // documented exception, handled at step 6 above).
    return jsonResponse({ success: true }, 200)
  }
}
