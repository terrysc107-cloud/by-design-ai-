import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Isolated persistence + validation for the /voice-agent pre-launch waitlist.
 * Deliberately independent of lib/newsletter.ts, lib/emails.ts, lib/resend.ts,
 * and lib/drip.ts - this waitlist never enrolls anyone in the newsletter,
 * drip sequence, or CRM. See docs/features/voice-agent-waitlist.md.
 */

export const VOICE_AGENT_WAITLIST_TABLE = 'bda_voice_agent_waitlist'
export const VOICE_AGENT_WAITLIST_SOURCE = '/voice-agent'
export const VOICE_AGENT_WAITLIST_CONSENT_VERSION = 'voice-agent-waitlist-v1'

const EMAIL_MAX_LENGTH = 254
const BUSINESS_TYPE_MAX_LENGTH = 200

// Same practical shape rule used elsewhere in this codebase (app/api/subscribe,
// app/api/intake): local@domain.tld, no embedded whitespace.
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Belt-and-suspenders beyond EMAIL_SHAPE: reject any other ASCII control
// character that \s doesn't already cover (stray C0 bytes or DEL).
function hasControlChar(value: string): boolean {
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i)
    const isC0 = code < 32
    const isDel = code === 127
    if (isC0 || isDel) return true
  }
  return false
}

export interface VoiceAgentWaitlistInput {
  email: string
  business_type: string | null
  consent: true
}

export type WaitlistValidationResult =
  | { valid: true; input: VoiceAgentWaitlistInput }
  | { valid: false; errors: Record<string, string> }

// Only these keys are ever accepted. Anything else (a client-supplied id,
// timestamp, source, or consent_version) fails the whole request - those
// values are always server-assigned.
const ALLOWED_KEYS = new Set(['email', 'business_type', 'consent', 'company_url'])

export function validateVoiceAgentWaitlistInput(value: unknown): WaitlistValidationResult {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return { valid: false, errors: { _: 'Invalid request.' } }
  }
  const body = value as Record<string, unknown>

  for (const key of Object.keys(body)) {
    if (!ALLOWED_KEYS.has(key)) {
      return { valid: false, errors: { _: 'Invalid request.' } }
    }
  }

  const errors: Record<string, string> = {}

  let email = ''
  if (typeof body.email !== 'string') {
    errors.email = 'Enter a valid email address.'
  } else {
    const trimmed = body.email.trim()
    if (
      !trimmed ||
      trimmed.length > EMAIL_MAX_LENGTH ||
      hasControlChar(trimmed) ||
      !EMAIL_SHAPE.test(trimmed)
    ) {
      errors.email = 'Enter a valid email address.'
    } else {
      // Lowercase only - preserve +tags and dots, no provider-specific rewriting.
      email = trimmed.toLowerCase()
    }
  }

  let businessType: string | null = null
  if (body.business_type !== undefined) {
    if (typeof body.business_type !== 'string') {
      errors.business_type = 'Keep this to 200 characters or fewer.'
    } else {
      const trimmed = body.business_type.trim()
      if (trimmed.length > BUSINESS_TYPE_MAX_LENGTH) {
        errors.business_type = 'Keep this to 200 characters or fewer.'
      } else {
        businessType = trimmed.length > 0 ? trimmed : null
      }
    }
  }

  if (body.consent !== true) {
    errors.consent = "Confirm you'd like updates about this offering."
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors }
  }

  return { valid: true, input: { email, business_type: businessType, consent: true } }
}

/**
 * Insert into bda_voice_agent_waitlist only. Duplicates are ignored atomically
 * by the unique constraint on email - no pre-insert existence check, no update
 * of an existing row, and the caller sees the same success either way.
 */
export async function insertVoiceAgentWaitlist(
  client: SupabaseClient,
  input: VoiceAgentWaitlistInput
): Promise<void> {
  const { error } = await client.from(VOICE_AGENT_WAITLIST_TABLE).upsert(
    {
      email: input.email,
      business_type: input.business_type,
      source: VOICE_AGENT_WAITLIST_SOURCE,
      consent_version: VOICE_AGENT_WAITLIST_CONSENT_VERSION,
    },
    { onConflict: 'email', ignoreDuplicates: true }
  )
  if (error) throw error
}
