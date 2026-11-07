/**
 * Contract, sanitizer, proxy-handler, analytics, and copy tests for the
 * /voice-agent live phone demo. Upstream is always a stubbed fetch: nothing
 * here can reach the real demo service or any provider.
 *
 *   npx --yes tsx --test tests/voice-demo.test.ts
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  validateSessionRequest,
  validateStatusRequest,
  validateLeadRequest,
  parseUpstreamSession,
  parseUpstreamStatus,
  parseUpstreamLead,
  sanitizeAnalyticsParams,
  coarseSource,
  getOrCreateAnalyticsSessionId,
  formatPhoneNumber,
  telHref,
} from '../lib/voice-demo'
import { createHmac } from 'node:crypto'
import { readVoiceDemoConfig, createVoiceDemoHandlers, deriveNetworkKey, type VoiceDemoDependencies } from '../lib/voice-demo-server'
import { VOICE_DEMO_COPY_STRINGS as PAGE_COPY, VOICE_DEMO_DISCLOSURE, VERTICAL_CARDS } from '../lib/voice-demo-content'
import { VOICE_DEMO_OFFER_COPY_STRINGS } from '../lib/voice-demo-offer'

const VOICE_DEMO_COPY_STRINGS = [...PAGE_COPY, ...VOICE_DEMO_OFFER_COPY_STRINGS]
import { checkPost } from '../lib/content-guardrail'

const TOKEN = 'bt_' + 'a'.repeat(40)
const VALID_LEAD = {
  name: 'Dana Reyes',
  business_name: 'Reyes Towing',
  email: 'Dana@Example.com ',
  phone: '(215) 555-0147',
  business_type: 'towing',
  monthly_calls: '150_400',
  missed_calls: 'often',
  timeline: '30_days',
  budget: 'fits',
  recap_consent: true,
  sales_follow_up_consent: false,
  company_url: '',
}

// ── Browser input validation ──────────────────────────────────────────────

test('session request accepts each launch vertical', () => {
  for (const v of ['towing', 'mechanic', 'auto_detailing']) {
    const r = validateSessionRequest({ vertical: v })
    assert.ok(r.ok, v)
    assert.equal(r.ok && r.value.vertical, v)
  }
})

test('session request rejects unknown vertical and non-objects', () => {
  assert.equal(validateSessionRequest({ vertical: 'salon' }).ok, false)
  assert.equal(validateSessionRequest(null).ok, false)
  assert.equal(validateSessionRequest([]).ok, false)
})

test('attribution keeps only well-formed utm fields and drops PII-shaped values', () => {
  const r = validateSessionRequest({
    vertical: 'towing',
    attribution: { utm_source: 'linkedin', utm_campaign: 'voice demo', utm_medium: 'a@b.com', email: 'x@y.com', utm_term: 'x'.repeat(200) },
  })
  assert.ok(r.ok)
  assert.deepEqual(r.ok && r.value.attribution, { utm_source: 'linkedin', utm_campaign: 'voice demo' })
})

test('status request requires a high-entropy token, never a six-digit code', () => {
  assert.ok(validateStatusRequest({ browser_token: TOKEN }).ok)
  assert.equal(validateStatusRequest({ browser_token: '123456' }).ok, false)
  assert.equal(validateStatusRequest({ browser_token: '../../etc/passwd' + 'a'.repeat(30) }).ok, false)
  assert.equal(validateStatusRequest({}).ok, false)
})

test('lead request normalizes a valid submission', () => {
  const r = validateLeadRequest(VALID_LEAD)
  assert.ok(r.ok)
  if (!r.ok) return
  assert.equal(r.value.email, 'dana@example.com')
  assert.equal(r.value.phone, '+12155550147')
  assert.equal(r.value.recap_consent, true)
  assert.equal(r.value.sales_follow_up_consent, false)
  assert.equal('company_url' in r.value, false)
})

test('lead request reports field errors for missing and invalid fields', () => {
  const r = validateLeadRequest({ ...VALID_LEAD, name: ' ', email: 'nope', monthly_calls: 'lots', budget: undefined })
  assert.equal(r.ok, false)
  if (r.ok) return
  for (const key of ['name', 'email', 'monthly_calls', 'budget']) assert.ok(r.fields[key], key)
})

test('consents are separate and default to false; non-boolean consent is rejected', () => {
  const r = validateLeadRequest({ ...VALID_LEAD, recap_consent: undefined, sales_follow_up_consent: undefined })
  assert.ok(r.ok)
  assert.equal(r.ok && r.value.recap_consent, false)
  assert.equal(r.ok && r.value.sales_follow_up_consent, false)
  assert.equal(validateLeadRequest({ ...VALID_LEAD, sales_follow_up_consent: 'yes' }).ok, false)
})

test('optional phone may be blank; an invalid phone is rejected', () => {
  const blank = validateLeadRequest({ ...VALID_LEAD, phone: '' })
  assert.ok(blank.ok)
  assert.equal(blank.ok && blank.value.phone, undefined)
  assert.equal(validateLeadRequest({ ...VALID_LEAD, phone: '12' }).ok, false)
})

test('oversized text is rejected', () => {
  assert.equal(validateLeadRequest({ ...VALID_LEAD, business_name: 'x'.repeat(201) }).ok, false)
})

// ── Upstream response sanitizers ──────────────────────────────────────────

test('session sanitizer keeps only public-safe fields', () => {
  const s = parseUpstreamSession({
    browser_token: TOKEN, call_code: '482913', phone_number: '+18885550123',
    expires_at: '2026-11-07T15:00:00Z', profile: 'mechanic', internal_id: 'x', code_hash: 'y',
  })
  assert.deepEqual(s, {
    browser_token: TOKEN, call_code: '482913', phone_number: '+18885550123',
    expires_at: '2026-11-07T15:00:00.000Z', vertical: 'mechanic',
  })
})

test('session sanitizer rejects malformed code, phone, token, or date', () => {
  const base = { browser_token: TOKEN, call_code: '482913', phone_number: '+18885550123', expires_at: '2026-11-07T15:00:00Z', profile: 'towing' }
  assert.equal(parseUpstreamSession({ ...base, call_code: '48291' }), null)
  assert.equal(parseUpstreamSession({ ...base, phone_number: '555-0123' }), null)
  assert.equal(parseUpstreamSession({ ...base, browser_token: 'short' }), null)
  assert.equal(parseUpstreamSession({ ...base, expires_at: 'tomorrow' }), null)
})

test('status sanitizer strips PII, transcripts, and provider ids from owner output', () => {
  const s = parseUpstreamStatus({
    state: 'completed',
    call_sid: 'CA123',
    transcript: 'full transcript',
    owner_output: {
      vertical: 'towing', need: 'Flat tire, sedan', urgency: 'urgent', service_requested: 'Tire change',
      preferred_timing: 'As soon as possible', missing_information: ['Exact mile marker', 42],
      summary: 'Caller has a flat on the shoulder.\u0000', recommended_action: 'Call back within 5 minutes.',
      example_notification: 'New towing lead: flat tire.', caller_phone: '+12155550147', caller_name: 'Dana',
    },
  })
  assert.ok(s)
  assert.equal(s.state, 'completed')
  assert.deepEqual(Object.keys(s).sort(), ['owner_output', 'state'])
  const o = s.owner_output!
  assert.equal('caller_phone' in o, false)
  assert.equal('caller_name' in o, false)
  assert.deepEqual(o.missing_information, ['Exact mile marker'])
  assert.equal(o.summary, 'Caller has a flat on the shoulder.')
})

test('status sanitizer omits owner output until completed and rejects unknown states', () => {
  assert.deepEqual(parseUpstreamStatus({ state: 'in_call', owner_output: { summary: 'x' } }), { state: 'in_call' })
  assert.equal(parseUpstreamStatus({ state: 'dispatched' }), null)
  assert.equal(parseUpstreamStatus({ state: 'completed', owner_output: { vertical: 'towing', summary: '' } }), null)
})

test('lead sanitizer requires a known tier upstream but never passes the tier to the browser', () => {
  assert.deepEqual(parseUpstreamLead({ tier: 'sales_qualified', email_confirmation_sent: true, score: 13 }), {
    email_confirmation_sent: true,
  })
  assert.equal(parseUpstreamLead({ tier: 'vip' }), null)
})

test('lead sanitizer never fakes a confirmation email', () => {
  for (const sent of [undefined, 'true', 1, null, false]) {
    assert.deepEqual(parseUpstreamLead({ tier: 'review_qualified', email_confirmation_sent: sent }), { email_confirmation_sent: false })
  }
})

test('phone formatting and tel href', () => {
  assert.equal(formatPhoneNumber('+18885550123'), '(888) 555-0123')
  assert.equal(telHref('+18885550123'), 'tel:+18885550123')
})

// ── Analytics ─────────────────────────────────────────────────────────────

const SID = 'vs_' + '0123456789abcdef'.repeat(2)

test('analytics params keep only anonymous session id, profile, and coarse source', () => {
  assert.deepEqual(
    sanitizeAnalyticsParams({
      session_id: SID, profile: 'towing', source: 'social',
      vertical: 'towing', tier: 'sales_qualified', utm_source: 'newsletter', utm_campaign: 'x',
      email: 'a@b.com', name: 'Dana', browser_token: TOKEN, call_code: '123456',
    }),
    { session_id: SID, profile: 'towing', source: 'social' },
  )
})

test('analytics params drop malformed session ids, unknown profiles, and arbitrary sources', () => {
  assert.deepEqual(sanitizeAnalyticsParams({ session_id: TOKEN, profile: 'boats', source: 'linkedin' }), {})
  assert.deepEqual(sanitizeAnalyticsParams({ session_id: 'a@b.com', source: 'a@b.com' }), {})
})

test('coarse source maps utm values onto a fixed allowlist and never echoes raw values', () => {
  assert.equal(coarseSource(''), 'direct')
  assert.equal(coarseSource('?utm_source=LinkedIn&utm_campaign=voice'), 'social')
  assert.equal(coarseSource('?utm_source=google'), 'search')
  assert.equal(coarseSource('?utm_source=google&utm_medium=cpc'), 'paid')
  assert.equal(coarseSource('?utm_medium=email&utm_source=dana@example.com'), 'email')
  assert.equal(coarseSource('?utm_source=dana@example.com'), 'other')
  assert.equal(coarseSource('?utm_source=acme-partner-123'), 'other')
  assert.equal(coarseSource('?gclid=abc'), 'direct')
})

function memoryStorage() {
  const m = new Map<string, string>()
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), m }
}

test('anonymous session id is random, well-formed, stable per storage, and unrelated to the demo token', () => {
  const a = memoryStorage()
  const first = getOrCreateAnalyticsSessionId(a)
  assert.match(first, /^vs_[a-f0-9]{32}$/)
  assert.equal(getOrCreateAnalyticsSessionId(a), first)
  assert.notEqual(getOrCreateAnalyticsSessionId(memoryStorage()), first)
  assert.deepEqual(sanitizeAnalyticsParams({ session_id: first }), { session_id: first })
  // A tampered stored value is replaced, never forwarded.
  a.m.set([...a.m.keys()][0], 'dana@example.com')
  assert.match(getOrCreateAnalyticsSessionId(a), /^vs_[a-f0-9]{32}$/)
})

test('anonymous session id still works when storage is unavailable or throws', () => {
  assert.match(getOrCreateAnalyticsSessionId(null), /^vs_[a-f0-9]{32}$/)
  const throwing = { getItem: () => { throw new Error('denied') }, setItem: () => { throw new Error('denied') } }
  assert.match(getOrCreateAnalyticsSessionId(throwing), /^vs_[a-f0-9]{32}$/)
})

test('browser analytics calls in the demo UI pass no tier, utm, or raw query values', () => {
  const src = readFileSync(new URL('../lib/analytics.ts', import.meta.url), 'utf8')
  assert.match(src, /sanitizeAnalyticsParams/)
  for (const file of ['app/voice-agent/_components/VoiceDemoLauncher.tsx', 'app/voice-agent/_components/VoiceDemoQualificationForm.tsx']) {
    const ui = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
    const calls = ui.match(/trackVoiceDemoEvent\([^)]*\)/g) ?? []
    assert.ok(calls.length > 0, file)
    for (const c of calls) assert.doesNotMatch(c, /tier|utm|vertical:|readAttribution/, `${file}: ${c}`)
  }
})

// ── Config ────────────────────────────────────────────────────────────────

test('config requires https base url (or localhost), a real secret, and a separate network-key secret', () => {
  const secret = 's'.repeat(32)
  const nk = 'n'.repeat(32)
  const env = { VOICE_DEMO_API_BASE_URL: 'https://demo.example.com/', VOICE_DEMO_API_SECRET: secret, VOICE_DEMO_NETWORK_KEY_SECRET: nk }
  assert.equal(readVoiceDemoConfig({}), null)
  assert.equal(readVoiceDemoConfig({ ...env, VOICE_DEMO_API_BASE_URL: 'http://demo.example.com' }), null)
  assert.equal(readVoiceDemoConfig({ ...env, VOICE_DEMO_API_SECRET: 's'.repeat(31) }), null) // service requires >= 32
  assert.equal(readVoiceDemoConfig({ ...env, VOICE_DEMO_NETWORK_KEY_SECRET: undefined }), null)
  assert.equal(readVoiceDemoConfig({ ...env, VOICE_DEMO_NETWORK_KEY_SECRET: 'n'.repeat(31) }), null)
  assert.equal(readVoiceDemoConfig({ ...env, VOICE_DEMO_NETWORK_KEY_SECRET: secret }), null) // must differ from the service secret
  assert.deepEqual(readVoiceDemoConfig(env), { baseUrl: 'https://demo.example.com', secret, networkKeySecret: nk })
  assert.ok(readVoiceDemoConfig({ ...env, VOICE_DEMO_API_BASE_URL: 'http://127.0.0.1:8080' }))
})

test('config accepts only a bare https site origin for the upstream Origin header', () => {
  const env = { VOICE_DEMO_API_BASE_URL: 'https://demo.example.com', VOICE_DEMO_API_SECRET: 's'.repeat(32), VOICE_DEMO_NETWORK_KEY_SECRET: 'n'.repeat(32) }
  assert.equal(readVoiceDemoConfig({ ...env, VOICE_DEMO_SITE_ORIGIN: 'https://aixdesign.dev' })?.origin, 'https://aixdesign.dev')
  for (const bad of ['http://aixdesign.dev', 'https://aixdesign.dev/', 'https://aixdesign.dev/voice-agent', 'aixdesign.dev', 'null']) {
    assert.equal(readVoiceDemoConfig({ ...env, VOICE_DEMO_SITE_ORIGIN: bad }), null, bad)
  }
})

test('network key is a keyed HMAC of the address: 43-char base64url, stable, secret-dependent, never the raw address', () => {
  const a = deriveNetworkKey('203.0.113.9', NK_SECRET)
  assert.match(a, /^[A-Za-z0-9_-]{43}$/)
  assert.equal(deriveNetworkKey('203.0.113.9', NK_SECRET), a)
  assert.notEqual(deriveNetworkKey('203.0.113.10', NK_SECRET), a)
  assert.notEqual(deriveNetworkKey('203.0.113.9', 'other-' + NK_SECRET), a)
  assert.ok(!a.includes('203.0.113.9'))
  // Matches an independent HMAC-SHA256 so the service's 43-char check holds.
  assert.equal(a, createHmac('sha256', NK_SECRET).update('voice-demo-network-key:v1:203.0.113.9').digest('base64url'))
})

// ── Proxy handlers ────────────────────────────────────────────────────────

const ORIGIN = 'https://aixdesign.dev'
const SECRET = 'test-secret-' + 'z'.repeat(24)
const NK_SECRET = 'network-key-secret-' + 'k'.repeat(24)

interface Call { url: string; init: RequestInit }

function harness(respond: (call: Call) => Response | Promise<Response>, overrides: Partial<VoiceDemoDependencies> = {}) {
  const calls: Call[] = []
  const logs: unknown[] = []
  const deps: VoiceDemoDependencies = {
    config: () => ({ baseUrl: 'https://voice.example.test', secret: SECRET, networkKeySecret: NK_SECRET, origin: ORIGIN }),
    fetch: (async (url: string | URL, init?: RequestInit) => {
      const call = { url: String(url), init: init ?? {} }
      calls.push(call)
      return respond(call)
    }) as typeof fetch,
    limit: () => ({ allowed: true }),
    log: (event, fields) => logs.push([event, fields]),
    ...overrides,
  }
  return { handlers: createVoiceDemoHandlers(deps), calls, logs }
}

function req(path: string, body: unknown, headers: Record<string, string> = {}) {
  return new Request(`${ORIGIN}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: ORIGIN, 'x-forwarded-for': '203.0.113.9', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })
const UPSTREAM_SESSION = { browser_token: TOKEN, call_code: '482913', phone_number: '+18885550123', expires_at: '2026-11-07T15:00:00Z', profile: 'towing' }

// Verbatim shapes from the voice service (call-voice-assistant-demo app/web_demo.py, pinned by its
// tests/test_web_demo.py). If either side changes, these tests and that repo's tests must change together.
const SERVICE_TOKEN = 'Q2xhdWRlLXRlc3QtdG9rZW4tbm90LXJlYWwtMDAwMDA'
const SERVICE_SESSION = { browser_token: SERVICE_TOKEN, call_code: '048213', phone_number: '+15555550100', expires_at: '2026-11-07T15:15:00Z', profile: 'mechanic' }
const SERVICE_OWNER_OUTPUT = {
  vertical: 'mechanic',
  need: 'Brakes',
  urgency: 'standard',
  service_requested: 'Brake pad replacement (per axle)',
  preferred_timing: 'Tomorrow morning drop-off',
  missing_information: ['drive status'],
  summary: 'Simulated mechanic and auto repair call. Captured: vehicle, symptoms. Caller wording is withheld in this public demo.',
  recommended_action: 'Call back to confirm the details and offer a time. Still needed: drive status.',
  example_notification: 'New simulated mechanic and auto repair lead (standard): Brakes, Brake pad replacement (per axle), Tomorrow morning drop-off. Call back to confirm the details and offer a time. Still needed: drive status.',
}

test('the service session shape passes the sanitizer and maps profile to vertical', () => {
  assert.deepEqual(parseUpstreamSession(SERVICE_SESSION), {
    browser_token: SERVICE_TOKEN, call_code: '048213', phone_number: '+15555550100',
    expires_at: '2026-11-07T15:15:00.000Z', vertical: 'mechanic',
  })
})

test('the service status shapes pass the sanitizer, and completed owner output survives unchanged', () => {
  for (const state of ['awaiting_call', 'in_call', 'failed', 'expired'] as const) {
    assert.deepEqual(parseUpstreamStatus({ state, profile: 'mechanic' }), { state })
  }
  assert.deepEqual(parseUpstreamStatus({ state: 'completed', profile: 'mechanic', owner_output: SERVICE_OWNER_OUTPUT }), {
    state: 'completed', owner_output: SERVICE_OWNER_OUTPUT,
  })
  // The old {status: ...} shape is not accepted.
  assert.equal(parseUpstreamStatus({ status: 'completed', owner_output: SERVICE_OWNER_OUTPUT }), null)
})

test('not configured returns 503 without calling upstream', async () => {
  const { handlers, calls } = harness(() => json({}), { config: () => null })
  const res = await handlers.session(req('/api/voice-demo/session', { vertical: 'towing' }))
  assert.equal(res.status, 503)
  assert.equal((await res.json()).error, 'not_configured')
  assert.equal(calls.length, 0)
})

test('cross-origin and non-JSON requests are rejected', async () => {
  const { handlers, calls } = harness(() => json({}))
  assert.equal((await handlers.session(req('/api/voice-demo/session', { vertical: 'towing' }, { origin: 'https://evil.test' }))).status, 403)
  assert.equal((await handlers.session(req('/api/voice-demo/session', { vertical: 'towing' }, { 'content-type': 'text/plain' }))).status, 415)
  assert.equal(calls.length, 0)
})

test('oversized body is rejected', async () => {
  const { handlers } = harness(() => json({}))
  const res = await handlers.lead(req('/api/voice-demo/lead', { ...VALID_LEAD, name: 'x'.repeat(9000) }))
  assert.equal(res.status, 413)
})

test('session proxies with server-side secret and keyed network key, and returns sanitized session', async () => {
  const { handlers, calls, logs } = harness(() => json({ ...UPSTREAM_SESSION, internal: 'secret-ish' }, 201))
  const res = await handlers.session(req('/api/voice-demo/session', { vertical: 'towing', attribution: { utm_source: 'linkedin' } }))
  assert.equal(res.status, 200)
  assert.equal(res.headers.get('cache-control'), 'no-store')
  const text = await res.text()
  const networkKey = deriveNetworkKey('203.0.113.9', NK_SECRET)
  assert.doesNotMatch(text, new RegExp(SECRET))
  assert.doesNotMatch(text, /internal|203\.0\.113\.9/)
  assert.ok(!text.includes(networkKey), 'network key never reaches the browser')
  assert.deepEqual(JSON.parse(text), {
    browser_token: TOKEN, call_code: '482913', phone_number: '+18885550123', expires_at: '2026-11-07T15:00:00.000Z', vertical: 'towing',
  })
  assert.equal(calls.length, 1)
  assert.equal(calls[0].url, 'https://voice.example.test/v1/web-demo/sessions')
  assert.equal(calls[0].init.method, 'POST')
  assert.deepEqual(calls[0].init.headers, {
    Authorization: `Bearer ${SECRET}`, Accept: 'application/json', 'Content-Type': 'application/json', Origin: ORIGIN,
  })
  assert.deepEqual(JSON.parse(String(calls[0].init.body)), { profile: 'towing', network_key: networkKey, attribution: { utm_source: 'linkedin' } })
  assert.doesNotMatch(String(calls[0].init.body), /203\.0\.113\.9/)
  const logged = JSON.stringify(logs)
  assert.ok(!logged.includes(networkKey) && !logged.includes('203.0.113.9'), 'network key and address never logged')
})

test('upstream Origin header is omitted when no site origin is configured', async () => {
  const { handlers, calls } = harness(() => json(UPSTREAM_SESSION, 201), {
    config: () => ({ baseUrl: 'https://voice.example.test', secret: SECRET, networkKeySecret: NK_SECRET }),
  })
  await handlers.session(req('/api/voice-demo/session', { vertical: 'towing' }))
  assert.equal('Origin' in (calls[0].init.headers as Record<string, string>), false)
})

test('upstream failure, malformed body, and network error never leak details', async () => {
  for (const respond of [
    () => json({ error: 'db password wrong at 10.0.0.4' }, 500),
    () => json({ browser_token: 'x' }),
    () => { throw new Error('ECONNREFUSED 10.0.0.4') },
  ]) {
    const { handlers } = harness(respond)
    const res = await handlers.session(req('/api/voice-demo/session', { vertical: 'mechanic' }))
    assert.equal(res.status, 502)
    const text = await res.text()
    assert.doesNotMatch(text, /10\.0\.0\.4|password|ECONNREFUSED/)
  }
})

test('upstream 429 and local rate limit both surface as 429', async () => {
  const upstream = harness(() => json({}, 429))
  assert.equal((await upstream.handlers.session(req('/api/voice-demo/session', { vertical: 'towing' }))).status, 429)
  const local = harness(() => json(UPSTREAM_SESSION), { limit: () => ({ allowed: false, retryAfterSeconds: 30 }) })
  const res = await local.handlers.session(req('/api/voice-demo/session', { vertical: 'towing' }))
  assert.equal(res.status, 429)
  assert.equal(res.headers.get('retry-after'), '30')
  assert.equal(local.calls.length, 0)
})

test('status POSTs the token in the upstream body, never the path or query, and maps 404 to expired', async () => {
  const { handlers, calls, logs } = harness(() => json({ error: 'not_found' }, 404))
  const res = await handlers.status(req('/api/voice-demo/status', { browser_token: TOKEN }))
  assert.equal(res.status, 200)
  assert.deepEqual(await res.json(), { state: 'expired' })
  assert.equal(calls[0].url, 'https://voice.example.test/v1/web-demo/sessions/status')
  assert.ok(!calls[0].url.includes(TOKEN))
  assert.equal(calls[0].init.method, 'POST')
  assert.deepEqual(JSON.parse(String(calls[0].init.body)), { browser_token: TOKEN })
  assert.equal((calls[0].init.headers as Record<string, string>).Authorization, `Bearer ${SECRET}`)
  assert.equal((calls[0].init.headers as Record<string, string>)['Content-Type'], 'application/json')
  assert.ok(!JSON.stringify(logs).includes(TOKEN))
})

test('status proxies the exact service shape through to the browser', async () => {
  const { handlers } = harness(() => json({ state: 'completed', profile: 'mechanic', owner_output: SERVICE_OWNER_OUTPUT }))
  const res = await handlers.status(req('/api/voice-demo/status', { browser_token: SERVICE_TOKEN }))
  assert.deepEqual(await res.json(), { state: 'completed', owner_output: SERVICE_OWNER_OUTPUT })
})

test('status returns sanitized owner output on completion', async () => {
  const { handlers } = harness(() => json({
    state: 'completed', call_sid: 'CA1',
    owner_output: { vertical: 'auto_detailing', need: 'Full detail', urgency: 'flexible', service_requested: 'Interior', preferred_timing: 'Saturday', missing_information: [], summary: 'SUV with pet hair.', recommended_action: 'Send package range.', example_notification: 'New detailing lead.', caller_email: 'a@b.com' },
  }))
  const text = await (await handlers.status(req('/api/voice-demo/status', { browser_token: TOKEN }))).text()
  assert.doesNotMatch(text, /a@b\.com|CA1/)
  assert.equal(JSON.parse(text).owner_output.summary, 'SUV with pet hair.')
})

test('lead validation errors return field messages without calling upstream', async () => {
  const { handlers, calls } = harness(() => json({}))
  const res = await handlers.lead(req('/api/voice-demo/lead', { ...VALID_LEAD, email: 'bad' }))
  assert.equal(res.status, 400)
  assert.ok((await res.json()).fields.email)
  assert.equal(calls.length, 0)
})

test('lead honeypot returns generic success without forwarding', async () => {
  const { handlers, calls } = harness(() => json({}))
  const res = await handlers.lead(req('/api/voice-demo/lead', { ...VALID_LEAD, company_url: 'http://spam' }))
  assert.equal(res.status, 200)
  assert.deepEqual(await res.json(), { success: true, email_confirmation_sent: false })
  assert.equal(calls.length, 0)
})

test('lead forwards normalized payload with separate consents and returns only the confirmation flag', async () => {
  const { handlers, calls, logs } = harness(() => json({ tier: 'review_qualified', email_confirmation_sent: true, lead_id: 'L1', score: 9 }))
  const res = await handlers.lead(req('/api/voice-demo/lead', { ...VALID_LEAD, browser_token: TOKEN }))
  assert.equal(res.status, 200)
  assert.deepEqual(await res.json(), { success: true, email_confirmation_sent: true })
  const sent = JSON.parse(String(calls[0].init.body))
  assert.equal(calls[0].url, 'https://voice.example.test/v1/web-demo/leads')
  assert.equal(sent.email, 'dana@example.com')
  assert.equal(sent.recap_consent, true)
  assert.equal(sent.sales_follow_up_consent, false)
  assert.equal(sent.browser_token, TOKEN)
  assert.equal('company_url' in sent, false)
  assert.doesNotMatch(JSON.stringify(logs), /@|Dana|Reyes|2155550147/)
})

test('lead endpoint is not built in the voice service yet (Task 8): a 404 upstream is a handled 502', async () => {
  const { handlers } = harness(() => json({ detail: 'Not Found' }, 404))
  const res = await handlers.lead(req('/api/voice-demo/lead', VALID_LEAD))
  assert.equal(res.status, 502)
  assert.deepEqual(await res.json(), { error: 'upstream_unavailable' })
})

// ── Isolation ─────────────────────────────────────────────────────────────

test('demo files never send mail, write the site database, or touch private voice systems', () => {
  const files = [
    'lib/voice-demo.ts', 'lib/voice-demo-server.ts', 'lib/voice-demo-client.ts', 'lib/voice-demo-content.ts', 'lib/voice-demo-offer.ts',
    'app/api/voice-demo/session/route.ts', 'app/api/voice-demo/status/route.ts', 'app/api/voice-demo/lead/route.ts',
    'app/voice-agent/_components/VoiceDemoLauncher.tsx', 'app/voice-agent/_components/VoiceDemoQualificationForm.tsx',
    'app/voice-agent/_components/VoiceDemoOwnerView.tsx', 'app/voice-agent/_components/VoiceAgentExperience.tsx',
  ]
  const forbiddenImports = ['lib/resend', 'lib/emails', 'lib/newsletter', 'lib/drip', 'lib/supabase', 'api/subscribe', 'twilio', 'openai']
  const forbiddenText = [/lts-voice-receptionist/i, /terry-ai-call-assistant/i, /hermes-voice-gateway/i, /tom-gateway/i]
  for (const file of files) {
    const src = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
    const imports = src.split('\n').filter((l) => /^\s*import\b.*from\b/.test(l)).join('\n')
    for (const bad of forbiddenImports) assert.ok(!imports.includes(bad), `${file} imports ${bad}`)
    for (const re of forbiddenText) assert.doesNotMatch(src, re, file)
  }
})

test('client-bundled demo files never read the service secret or base URL', () => {
  for (const file of ['lib/voice-demo-client.ts', 'app/voice-agent/_components/VoiceDemoLauncher.tsx', 'app/voice-agent/_components/VoiceDemoQualificationForm.tsx']) {
    const src = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
    assert.doesNotMatch(src, /VOICE_DEMO_API_(SECRET|BASE_URL)|voice-demo-server/, file)
  }
})

// ── Copy and offer guardrails ─────────────────────────────────────────────

test('disclosure states AI, transcription, and simulation before the number', () => {
  assert.match(VOICE_DEMO_DISCLOSURE, /\bAI\b/)
  assert.match(VOICE_DEMO_DISCLOSURE, /transcri/i)
  assert.match(VOICE_DEMO_DISCLOSURE, /simulat/i)
  assert.match(VOICE_DEMO_DISCLOSURE, /no real (tow|service)/i)
})

test('launch verticals are exactly towing, mechanic, auto detailing', () => {
  assert.deepEqual(VERTICAL_CARDS.map((c) => c.vertical), ['towing', 'mechanic', 'auto_detailing'])
})

// Pricing gate and confirm-email-first tests: tests/voice-demo-offer.test.ts

test('page copy passes the claims guardrail and contains no em or en dashes', () => {
  for (const text of VOICE_DEMO_COPY_STRINGS) {
    const r = checkPost(text)
    assert.ok(r.ok, `${text.slice(0, 60)}: ${r.ok ? '' : r.violations[0].why}`)
    assert.doesNotMatch(text, /[–—]/, text.slice(0, 60))
  }
})
