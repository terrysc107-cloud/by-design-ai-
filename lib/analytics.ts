/**
 * Conversion tracking helper. Forwards a single semantic event to both
 * Google Analytics (gtag) and the Meta Pixel (fbq) using each platform's
 * standard event names. Silent no-op when neither tag is present, so the
 * site runs cleanly before the GA/Pixel env vars are set.
 */

export type ConversionEvent =
  | 'lead'
  | 'intake'
  | 'book_call'
  | 'subscribe'
  // Added 2026-09-09 for the board's site-data layer. See
  // aixdesign/20-site-data-layer.md for what each one is supposed to answer.
  // Traffic source and page are deliberately NOT here: GA4 collects
  // session_source and page_view automatically, and duplicating them as custom
  // events would double-count.
  | 'cta_click'
  | 'scroll_depth'
  | 'checkout_start'
  | 'purchase'
  | 'waitlist_join'

const GA_EVENT: Record<ConversionEvent, string> = {
  lead: 'generate_lead',
  intake: 'submit_application',
  book_call: 'book_call',
  subscribe: 'newsletter_signup',
  // GA4 recommended names where one exists, so the standard reports work
  // without custom definitions.
  cta_click: 'select_content',
  scroll_depth: 'scroll',
  checkout_start: 'begin_checkout',
  purchase: 'purchase',
  waitlist_join: 'join_group',
}

const META_EVENT: Record<ConversionEvent, string> = {
  lead: 'Lead',
  intake: 'SubmitApplication',
  book_call: 'Schedule',
  subscribe: 'Subscribe',
  cta_click: 'ViewContent',
  scroll_depth: 'ViewContent',
  checkout_start: 'InitiateCheckout',
  purchase: 'Purchase',
  waitlist_join: 'CompleteRegistration',
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
