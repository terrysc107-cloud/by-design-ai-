/**
 * Conversion tracking helper. Forwards a single semantic event to both
 * Google Analytics (gtag) and the Meta Pixel (fbq) using each platform's
 * standard event names. Silent no-op when neither tag is present, so the
 * site runs cleanly before the GA/Pixel env vars are set.
 */

export type ConversionEvent = 'lead' | 'intake' | 'book_call'

const GA_EVENT: Record<ConversionEvent, string> = {
  lead: 'generate_lead',
  intake: 'submit_application',
  book_call: 'book_call',
}

const META_EVENT: Record<ConversionEvent, string> = {
  lead: 'Lead',
  intake: 'SubmitApplication',
  book_call: 'Schedule',
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}

export function trackConversion(
  event: ConversionEvent,
  params?: Record<string, unknown>,
): void {
  if (typeof window === 'undefined') return
  try {
    window.gtag?.('event', GA_EVENT[event], params ?? {})
    window.fbq?.('track', META_EVENT[event], params ?? {})
  } catch {
    /* analytics must never break the UX */
  }
}
