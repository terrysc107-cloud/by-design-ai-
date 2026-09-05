/**
 * Validation, persistence-contract, and handler tests for the /voice-agent
 * waitlist. No real network or Supabase project involved anywhere here.
 *
 *   npx --yes tsx --test tests/voice-agent-waitlist.test.ts
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  validateVoiceAgentWaitlistInput,
  insertVoiceAgentWaitlist,
  VOICE_AGENT_WAITLIST_TABLE,
  VOICE_AGENT_WAITLIST_SOURCE,
  VOICE_AGENT_WAITLIST_CONSENT_VERSION,
  type VoiceAgentWaitlistInput,
} from '../lib/voice-agent-waitlist'
import {
  createVoiceAgentWaitlistHandler,
  type WaitlistHandlerDependencies,
} from '../lib/voice-agent-waitlist-handler'

// ── Validation ────────────────────────────────────────────────────────────

test('valid email succeeds', () => {
  const result = validateVoiceAgentWaitlistInput({ email: 'a@b.com', consent: true })
  assert.equal(result.valid, true)
})

test('outer whitespace is trimmed before validation', () => {
  const result = validateVoiceAgentWaitlistInput({ email: '  a@b.com  ', consent: true })
  assert.ok(result.valid)
  assert.equal(result.valid && result.input.email, 'a@b.com')
})

test('email is lowercased', () => {
  const result = validateVoiceAgentWaitlistInput({ email: 'A@B.COM', consent: true })
  assert.ok(result.valid)
  assert.equal(result.valid && result.input.email, 'a@b.com')
})

test('plus-addressing is preserved', () => {
  const result = validateVoiceAgentWaitlistInput({ email: 'a+tag@b.com', consent: true })
  assert.ok(result.valid)
  assert.equal(result.valid && result.input.email, 'a+tag@b.com')
})

test('internal whitespace is rejected', () => {
  const result = validateVoiceAgentWaitlistInput({ email: 'a b@c.com', consent: true })
  assert.equal(result.valid, false)
})

test('missing email is rejected', () => {
  assert.equal(validateVoiceAgentWaitlistInput({ consent: true }).valid, false)
})

test('non-string email is rejected', () => {
  assert.equal(validateVoiceAgentWaitlistInput({ email: 12345, consent: true }).valid, false)
})

test('email over 254 characters is rejected', () => {
  const email = `${'a'.repeat(250)}@b.com` // 256 chars
  assert.equal(validateVoiceAgentWaitlistInput({ email, consent: true }).valid, false)
})

test('null/array/non-object body is rejected', () => {
  assert.equal(validateVoiceAgentWaitlistInput(null).valid, false)
  assert.equal(validateVoiceAgentWaitlistInput([]).valid, false)
  assert.equal(validateVoiceAgentWaitlistInput('nope').valid, false)
})

test('unknown fields are rejected', () => {
  const result = validateVoiceAgentWaitlistInput({ email: 'a@b.com', consent: true, extra: 'x' })
  assert.equal(result.valid, false)
})

test('client-supplied timestamp/source/id is rejected', () => {
  const result = validateVoiceAgentWaitlistInput({
    email: 'a@b.com',
    consent: true,
    created_at: '2020-01-01',
    id: 'x',
    source: '/hacked',
  })
  assert.equal(result.valid, false)
})

test('business type omitted becomes null', () => {
  const result = validateVoiceAgentWaitlistInput({ email: 'a@b.com', consent: true })
  assert.ok(result.valid)
  assert.equal(result.valid && result.input.business_type, null)
})

test('blank business type becomes null', () => {
  const result = validateVoiceAgentWaitlistInput({ email: 'a@b.com', consent: true, business_type: '   ' })
  assert.ok(result.valid)
  assert.equal(result.valid && result.input.business_type, null)
})

test('non-string business type is rejected', () => {
  const result = validateVoiceAgentWaitlistInput({ email: 'a@b.com', consent: true, business_type: 5 })
  assert.equal(result.valid, false)
})

test('business type over 200 characters is rejected', () => {
  const result = validateVoiceAgentWaitlistInput({
    email: 'a@b.com',
    consent: true,
    business_type: 'x'.repeat(201),
  })
  assert.equal(result.valid, false)
})

test('meaningful casing and punctuation are preserved', () => {
  const result = validateVoiceAgentWaitlistInput({
    email: 'a@b.com',
    consent: true,
    business_type: 'Pizza & Wings, LLC!',
  })
  assert.ok(result.valid)
  assert.equal(result.valid && result.input.business_type, 'Pizza & Wings, LLC!')
})

test('consent must be boolean true', () => {
  assert.equal(validateVoiceAgentWaitlistInput({ email: 'a@b.com', consent: false }).valid, false)
  assert.equal(validateVoiceAgentWaitlistInput({ email: 'a@b.com', consent: 'true' }).valid, false)
  assert.equal(validateVoiceAgentWaitlistInput({ email: 'a@b.com', consent: 1 }).valid, false)
  assert.equal(validateVoiceAgentWaitlistInput({ email: 'a@b.com' }).valid, false)
})

// ── Persistence contract ─────────────────────────────────────────────────

interface RecordedCall {
  table: string
  row: Record<string, unknown>
  opts: Record<string, unknown>
}

function makeMockClient(errorToThrow?: { message: string }) {
  const calls: RecordedCall[] = []
  const client = {
    from(table: string) {
      return {
        upsert(row: Record<string, unknown>, opts: Record<string, unknown>) {
          calls.push({ table, row, opts })
          return Promise.resolve({ error: errorToThrow ?? null })
        },
      }
    },
  }
  return { client: client as unknown as SupabaseClient, calls }
}

test('insert targets only the waitlist table, with fixed source/consent, no id/timestamp', async () => {
  const { client, calls } = makeMockClient()
  await insertVoiceAgentWaitlist(client, { email: 'a@b.com', business_type: 'Salon', consent: true })
  assert.equal(calls.length, 1)
  assert.equal(calls[0].table, VOICE_AGENT_WAITLIST_TABLE)
  assert.equal(calls[0].row.email, 'a@b.com')
  assert.equal(calls[0].row.business_type, 'Salon')
  assert.equal(calls[0].row.source, VOICE_AGENT_WAITLIST_SOURCE)
  assert.equal(calls[0].row.consent_version, VOICE_AGENT_WAITLIST_CONSENT_VERSION)
  assert.equal('created_at' in calls[0].row, false)
  assert.equal('id' in calls[0].row, false)
})

test('duplicate insert ignores conflicts on email without updating', async () => {
  const { client, calls } = makeMockClient()
  await insertVoiceAgentWaitlist(client, { email: 'a@b.com', business_type: null, consent: true })
  assert.equal(calls[0].opts.onConflict, 'email')
  assert.equal(calls[0].opts.ignoreDuplicates, true)
})

test('insert failure surfaces as a thrown error', async () => {
  const { client } = makeMockClient({ message: 'relation does not exist' })
  await assert.rejects(() =>
    insertVoiceAgentWaitlist(client, { email: 'a@b.com', business_type: null, consent: true })
  )
})

// ── Handler ───────────────────────────────────────────────────────────────

function makeDeps(overrides: Partial<WaitlistHandlerDependencies> = {}) {
  const persisted: VoiceAgentWaitlistInput[] = []
  const logs: Array<{ event: string; fields?: Record<string, unknown> }> = []
  const deps: WaitlistHandlerDependencies = {
    configured: () => true,
    persist: async (input) => {
      persisted.push(input)
    },
    limit: () => ({ allowed: true }),
    now: () => 0,
    log: (event, fields) => {
      logs.push({ event, fields })
    },
    ...overrides,
  }
  return { deps, persisted, logs }
}

function makeRequest(opts: {
  origin?: string | null
  contentType?: string | null
  body?: string
}): Request {
  const headers = new Headers()
  if (opts.contentType !== null) headers.set('content-type', opts.contentType ?? 'application/json')
  if (opts.origin !== null) headers.set('origin', opts.origin ?? 'http://localhost:3000')
  return new Request('http://localhost:3000/api/voice-agent-waitlist', {
    method: 'POST',
    headers,
    body: opts.body ?? JSON.stringify({ email: 'a@b.com', consent: true }),
  })
}

test('accepts a correct same-origin request', async () => {
  const { deps, persisted } = makeDeps()
  const handler = createVoiceAgentWaitlistHandler(deps)
  const res = await handler(makeRequest({}))
  assert.equal(res.status, 200)
  const body = (await res.json()) as { success: boolean }
  assert.equal(body.success, true)
  assert.equal(persisted.length, 1)
})

test('missing origin is rejected with 403', async () => {
  const { deps } = makeDeps()
  const handler = createVoiceAgentWaitlistHandler(deps)
  const res = await handler(makeRequest({ origin: null }))
  assert.equal(res.status, 403)
})

test('foreign origin is rejected with 403', async () => {
  const { deps } = makeDeps()
  const handler = createVoiceAgentWaitlistHandler(deps)
  const res = await handler(makeRequest({ origin: 'https://evil.example' }))
  assert.equal(res.status, 403)
})

test('unsupported content type is rejected with 415', async () => {
  const { deps } = makeDeps()
  const handler = createVoiceAgentWaitlistHandler(deps)
  const res = await handler(makeRequest({ contentType: 'text/plain' }))
  assert.equal(res.status, 415)
})

test('oversize body is rejected with 413, regardless of Content-Length', async () => {
  const { deps } = makeDeps()
  const handler = createVoiceAgentWaitlistHandler(deps)
  const big = 'x'.repeat(5000)
  const res = await handler(
    makeRequest({ body: JSON.stringify({ email: 'a@b.com', consent: true, business_type: big }) })
  )
  assert.equal(res.status, 413)
})

test('honeypot returns generic success without persisting', async () => {
  const { deps, persisted } = makeDeps()
  const handler = createVoiceAgentWaitlistHandler(deps)
  const res = await handler(
    makeRequest({
      body: JSON.stringify({ email: 'a@b.com', consent: true, company_url: 'http://spam.example' }),
    })
  )
  const body = (await res.json()) as { success: boolean }
  assert.equal(res.status, 200)
  assert.equal(body.success, true)
  assert.equal(persisted.length, 0)
})

test('invalid JSON body is rejected with 400', async () => {
  const { deps } = makeDeps()
  const handler = createVoiceAgentWaitlistHandler(deps)
  const res = await handler(makeRequest({ body: '{not json' }))
  assert.equal(res.status, 400)
})

test('missing Supabase configuration returns 503 and does not persist', async () => {
  const { deps, persisted } = makeDeps({ configured: () => false })
  const handler = createVoiceAgentWaitlistHandler(deps)
  const res = await handler(makeRequest({}))
  assert.equal(res.status, 503)
  assert.equal(persisted.length, 0)
})

test('persistence failure (e.g. missing table) returns a safe 503, no raw error leaked', async () => {
  const { deps, logs } = makeDeps({
    persist: async () => {
      throw new Error('relation "bda_voice_agent_waitlist" does not exist')
    },
  })
  const handler = createVoiceAgentWaitlistHandler(deps)
  const res = await handler(makeRequest({}))
  const bodyText = await res.text()
  assert.equal(res.status, 503)
  assert.doesNotMatch(bodyText, /relation|does not exist/)
  assert.doesNotMatch(bodyText, /a@b\.com/)
  for (const entry of logs) {
    assert.doesNotMatch(JSON.stringify(entry), /relation|does not exist|a@b\.com/)
  }
})

test('success is never returned before persistence completes (except the honeypot path)', async () => {
  const { deps } = makeDeps({
    persist: async () => {
      throw new Error('down')
    },
  })
  const handler = createVoiceAgentWaitlistHandler(deps)
  const res = await handler(makeRequest({}))
  const body = (await res.json()) as { success?: boolean }
  assert.notEqual(body.success, true)
})

test('rate limiting returns 429 with a valid Retry-After header', async () => {
  const { deps } = makeDeps({ limit: () => ({ allowed: false, retryAfterSeconds: 42 }) })
  const handler = createVoiceAgentWaitlistHandler(deps)
  const res = await handler(makeRequest({}))
  assert.equal(res.status, 429)
  assert.equal(res.headers.get('Retry-After'), '42')
})

test('responses are marked non-cacheable', async () => {
  const { deps } = makeDeps()
  const handler = createVoiceAgentWaitlistHandler(deps)
  const res = await handler(makeRequest({}))
  assert.equal(res.headers.get('Cache-Control'), 'no-store')
})

// ── Isolation from newsletter/drip/CRM/email paths ──────────────────────────

test('waitlist source files never import newsletter, drip, email, or subscribe modules', () => {
  const forbidden = [
    'lib/newsletter',
    'lib/emails',
    'lib/resend',
    'lib/drip',
    'api/subscribe',
  ]
  const files = [
    'lib/voice-agent-waitlist.ts',
    'lib/voice-agent-waitlist-handler.ts',
    'lib/voice-agent-waitlist-rate-limit.ts',
    'app/api/voice-agent-waitlist/route.ts',
  ]
  for (const file of files) {
    const src = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
    // Only look at actual import lines, not comments that mention these
    // modules by name to explain why they're absent.
    const importLines = src
      .split('\n')
      .filter((line) => /^\s*import\b.*from\b/.test(line))
      .join('\n')
    for (const bad of forbidden) {
      assert.ok(!importLines.includes(bad), `${file} must not import ${bad}`)
    }
  }
})
