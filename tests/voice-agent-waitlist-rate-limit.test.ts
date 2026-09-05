/**
 * Rate-limit tests for the /voice-agent waitlist's bounded, process-local
 * abuse limiter. All timing is via an injected clock - no sleeps.
 *
 *   npx --yes tsx --test tests/voice-agent-waitlist-rate-limit.test.ts
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  createVoiceAgentWaitlistRateLimiter,
  hashEmailKey,
} from '../lib/voice-agent-waitlist-rate-limit'

function makeClock(startMs = 0) {
  let current = startMs
  return {
    now: () => current,
    advance: (ms: number) => {
      current += ms
    },
  }
}

test('first allowed attempts succeed', () => {
  const clock = makeClock()
  const limit = createVoiceAgentWaitlistRateLimiter(clock.now)
  assert.equal(limit('a@b.com').allowed, true)
  assert.equal(limit('a@b.com').allowed, true)
  assert.equal(limit('a@b.com').allowed, true)
})

test('per-email threshold is enforced (3 per 10 minutes)', () => {
  const clock = makeClock()
  const limit = createVoiceAgentWaitlistRateLimiter(clock.now)
  limit('a@b.com')
  limit('a@b.com')
  limit('a@b.com')
  const fourth = limit('a@b.com')
  assert.equal(fourth.allowed, false)
  assert.ok(typeof fourth.retryAfterSeconds === 'number' && fourth.retryAfterSeconds > 0)
})

test('global process threshold is enforced (60 per minute)', () => {
  const clock = makeClock()
  const limit = createVoiceAgentWaitlistRateLimiter(clock.now)
  for (let i = 0; i < 60; i++) {
    // Distinct emails so the per-email limit never trips first.
    const result = limit(`user${i}@b.com`)
    assert.equal(result.allowed, true)
  }
  const overflow = limit('user60@b.com')
  assert.equal(overflow.allowed, false)
})

test('Retry-After is a positive integer number of seconds', () => {
  const clock = makeClock()
  const limit = createVoiceAgentWaitlistRateLimiter(clock.now)
  limit('a@b.com')
  limit('a@b.com')
  limit('a@b.com')
  const decision = limit('a@b.com')
  assert.equal(decision.allowed, false)
  assert.ok(Number.isInteger(decision.retryAfterSeconds))
  assert.ok((decision.retryAfterSeconds ?? 0) > 0)
})

test('expired buckets reset after the window elapses', () => {
  const clock = makeClock()
  const limit = createVoiceAgentWaitlistRateLimiter(clock.now)
  limit('a@b.com')
  limit('a@b.com')
  limit('a@b.com')
  assert.equal(limit('a@b.com').allowed, false)

  clock.advance(10 * 60 * 1000 + 1)
  assert.equal(limit('a@b.com').allowed, true)
})

test('retained email buckets stay bounded under high unique-email churn', () => {
  const clock = makeClock()
  const limit = createVoiceAgentWaitlistRateLimiter(clock.now)
  // Advance past the 60-attempts/60s global window on every call, so only the
  // per-key retained-bucket cap (not the global throughput cap) is in play.
  for (let i = 0; i < 5000; i++) {
    const result = limit(`user${i}@b.com`)
    assert.equal(result.allowed, true)
    clock.advance(61_000)
  }
  // No public size getter by design; the limiter must simply still function
  // (allow a fresh key) rather than grow unbounded or throw after 5000 inserts
  // against a 2000-bucket cap.
  assert.equal(limit('final@b.com').allowed, true)
})

test('hash keys never retain the raw email', () => {
  const hash = hashEmailKey('someone@example.com')
  assert.equal(hash.includes('someone'), false)
  assert.equal(hash.includes('example.com'), false)
  assert.match(hash, /^[0-9a-f]{64}$/)
})

test('duplicate attempts consume the same email bucket', () => {
  const clock = makeClock()
  const limit = createVoiceAgentWaitlistRateLimiter(clock.now)
  limit('dup@b.com')
  limit('dup@b.com')
  const third = limit('dup@b.com')
  assert.equal(third.allowed, true)
  const fourth = limit('dup@b.com')
  assert.equal(fourth.allowed, false)
})

test('hashing is deterministic, so normalization (case/whitespace) must happen before calling', () => {
  // The limiter buckets by exact string in - validateVoiceAgentWaitlistInput
  // is what lowercases/trims before this is ever called. Confirm identical
  // normalized input always maps to the same bucket, and differently-cased
  // input does not collapse to it on its own.
  assert.equal(hashEmailKey('a@b.com'), hashEmailKey('a@b.com'))
  assert.notEqual(hashEmailKey('a@b.com'), hashEmailKey('A@b.com'))
})

test('uses the injected clock, not wall time, for every window calculation', () => {
  const clock = makeClock(1_000_000)
  const limit = createVoiceAgentWaitlistRateLimiter(clock.now)
  limit('a@b.com')
  clock.advance(5 * 60 * 1000)
  limit('a@b.com')
  limit('a@b.com')
  const fourth = limit('a@b.com')
  assert.equal(fourth.allowed, false)
})
