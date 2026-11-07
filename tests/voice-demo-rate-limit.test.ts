/**
 * Shared-NAT regression tests for the /voice-agent proxy limits. Status
 * polling is limited per demo token; the network address only has a
 * separate, generous abuse ceiling. Upstream is always a stubbed fetch.
 *
 *   npx --yes tsx --test tests/voice-demo-rate-limit.test.ts
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createVoiceDemoHandlers, createVoiceDemoLimiter, type VoiceDemoDependencies } from '../lib/voice-demo-server'

const ORIGIN = 'https://aixdesign.dev'
const NAT_IP = '198.51.100.7'
const token = (i: number) => 'bt_' + String(i).padStart(40, '0')

function handlers(limit: VoiceDemoDependencies['limit'], onFetch: () => void = () => {}) {
  return createVoiceDemoHandlers({
    config: () => ({ baseUrl: 'https://voice.example.test', secret: 's'.repeat(32) }),
    fetch: (async () => {
      onFetch()
      return new Response(JSON.stringify({ state: 'in_call' }), { status: 200, headers: { 'content-type': 'application/json' } })
    }) as typeof fetch,
    limit,
    log: () => {},
  })
}

const poll = (h: ReturnType<typeof handlers>, browserToken: string, ip = NAT_IP) =>
  h.status(new Request(`${ORIGIN}/api/voice-demo/status`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: ORIGIN, 'x-forwarded-for': ip },
    body: JSON.stringify({ browser_token: browserToken }),
  }))

test('status checks the token scope first, then the network ceiling', async () => {
  const seen: [string, string][] = []
  await poll(handlers((scope, key) => { seen.push([scope, key]); return { allowed: true } }), token(1))
  assert.deepEqual(seen, [['status', token(1)], ['status_ip', NAT_IP]])
})

test('50 prospects behind one shared NAT can each poll a full 3-minute demo', () => {
  let clock = 0
  const limit = createVoiceDemoLimiter(() => clock)
  for (let tick = 0; tick < 60; tick++, clock += 3000) {
    for (let u = 0; u < 50; u++) {
      assert.equal(limit('status', token(u)).allowed, true, `user ${u} tick ${tick}`)
      assert.equal(limit('status_ip', NAT_IP).allowed, true, `ip user ${u} tick ${tick}`)
    }
  }
})

test('30 concurrent users through the real handler and limiter from one address all get 200', async () => {
  const h = handlers(createVoiceDemoLimiter(() => 0))
  const responses = await Promise.all(
    Array.from({ length: 30 }, (_, u) => Array.from({ length: 15 }, () => poll(h, token(u)))).flat(),
  )
  assert.deepEqual([...new Set(responses.map((r) => r.status))], [200])
})

test('one runaway token is limited without affecting other tokens on the same address', async () => {
  const h = handlers(createVoiceDemoLimiter(() => 0))
  const statuses: number[] = []
  for (let i = 0; i < 80; i++) statuses.push((await poll(h, token(1))).status)
  assert.ok(statuses.includes(429), 'runaway token never limited')
  assert.equal((await poll(h, token(2))).status, 200)
})

test('rotating fake tokens from one address hits the network ceiling; other addresses are unaffected', () => {
  const limit = createVoiceDemoLimiter(() => 0)
  let denied = -1
  for (let i = 0; i < 5000 && denied < 0; i++) if (!limit('status_ip', '192.0.2.1').allowed) denied = i
  assert.ok(denied >= 1000, `ceiling too tight for shared NAT: denied at ${denied}`)
  assert.equal(limit('status_ip', '192.0.2.2').allowed, true)
})

test('a network-ceiling denial returns 429 with Retry-After and never calls upstream', async () => {
  let fetched = 0
  const h = handlers((scope) => (scope === 'status_ip' ? { allowed: false, retryAfterSeconds: 12 } : { allowed: true }), () => { fetched++ })
  const res = await poll(h, token(1))
  assert.equal(res.status, 429)
  assert.equal(res.headers.get('retry-after'), '12')
  assert.equal(fetched, 0)
})
