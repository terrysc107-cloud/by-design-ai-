import { createHash } from 'node:crypto'

/**
 * Bounded, process-local abuse limiter for the /voice-agent waitlist.
 *
 * This is basic burst protection, not a global distributed limit — each
 * serverless instance has its own memory, so a determined attacker spread
 * across many cold starts is not stopped here. Honeypot, the DB unique
 * constraint, the request-body byte cap, and this limiter are the scoped
 * baseline for this build. Persistent abuse needs a separately approved
 * platform-level control (e.g. a shared store or edge rate limiter).
 */

export interface RateLimitDecision {
  allowed: boolean
  retryAfterSeconds?: number
}

const EMAIL_WINDOW_MS = 10 * 60 * 1000
const EMAIL_MAX_ATTEMPTS = 3
const GLOBAL_WINDOW_MS = 60 * 1000
const GLOBAL_MAX_ATTEMPTS = 60
const MAX_RETAINED_BUCKETS = 2000

interface Bucket {
  timestamps: number[]
}

/** SHA-256 of the normalized email — buckets never retain the raw address. */
export function hashEmailKey(normalizedEmail: string): string {
  return createHash('sha256').update(normalizedEmail).digest('hex')
}

function pruneWindow(timestamps: number[], windowMs: number, now: number): number[] {
  return timestamps.filter((t) => now - t < windowMs)
}

export function createVoiceAgentWaitlistRateLimiter(now: () => number = Date.now) {
  const emailBuckets = new Map<string, Bucket>()
  let globalTimestamps: number[] = []

  // ponytail: bounded LRU-by-insertion-order, not true least-recently-used;
  // good enough for a single-process burst limiter. Upgrade if bucket churn
  // ever needs real LRU semantics.
  function touch(key: string, bucket: Bucket) {
    emailBuckets.delete(key)
    emailBuckets.set(key, bucket)
    while (emailBuckets.size > MAX_RETAINED_BUCKETS) {
      const oldestKey = emailBuckets.keys().next().value
      if (oldestKey === undefined) break
      emailBuckets.delete(oldestKey)
    }
  }

  return function limit(normalizedEmail: string): RateLimitDecision {
    const current = now()

    globalTimestamps = pruneWindow(globalTimestamps, GLOBAL_WINDOW_MS, current)
    if (globalTimestamps.length >= GLOBAL_MAX_ATTEMPTS) {
      const oldest = globalTimestamps[0]
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((oldest + GLOBAL_WINDOW_MS - current) / 1000)),
      }
    }

    const key = hashEmailKey(normalizedEmail)
    const bucket = emailBuckets.get(key) ?? { timestamps: [] }
    bucket.timestamps = pruneWindow(bucket.timestamps, EMAIL_WINDOW_MS, current)
    if (bucket.timestamps.length >= EMAIL_MAX_ATTEMPTS) {
      const oldest = bucket.timestamps[0]
      touch(key, bucket)
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((oldest + EMAIL_WINDOW_MS - current) / 1000)),
      }
    }

    bucket.timestamps.push(current)
    globalTimestamps.push(current)
    touch(key, bucket)

    return { allowed: true }
  }
}

/** Shared singleton the API route binds to. Tests should build their own via
 * createVoiceAgentWaitlistRateLimiter(injectedClock) instead of using this. */
export const voiceAgentWaitlistRateLimit = createVoiceAgentWaitlistRateLimiter()
