import { Resend } from 'resend'

// Lazily instantiate so a missing key doesn't crash the build or unrelated routes.
let client: Resend | null = null

export function getResend(): Resend {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    throw new Error('RESEND_API_KEY is not set')
  }
  if (!client) {
    client = new Resend(key)
  }
  return client
}

// "AI by Design <hello@aixdesign.dev>" — must be a verified Resend domain/sender.
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'AI by Design <onboarding@resend.dev>'

// Where new-lead notifications are delivered.
export const LEAD_NOTIFY_EMAIL = process.env.LEAD_NOTIFY_EMAIL || 'terrysc107@gmail.com'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aixdesign.dev'
