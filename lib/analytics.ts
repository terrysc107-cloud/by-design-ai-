/**
 * Conversion tracking helper. Forwards a single semantic event to both
 * Google Analytics (gtag) and the Meta Pixel (fbq) using each platform's
 * standard event names. Silent no-op when neither tag is present, so the
 * site runs cleanly before the GA/Pixel env vars are set.
 */

import { coarseSource, getOrCreateAnalyticsSessionId, sanitizeAnalyticsParams, type Vertical } from './voice-demo'

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

/**
 * /voice-agent demo funnel events the BROWSER owns. Call connection and
 * completion, email confirmation, qualification tier, scheduling, payment,
 * launch, and retention are owned by the voice demo service (metrics.py) and
 * deliberately absent here, so no event can be counted from both sides.
 * See docs/features/call-voice-assistant-demo.md for the ownership table.
 */
export type VoiceDemoEvent =
  | 'voice_page_viewed'
  | 'demo_started'
  | 'vertical_selected'
  | 'demo_number_revealed'
  | 'owner_output_viewed'
  | 'qualification_started'
  | 'fit_request_submitted'

let voiceDemoSessionId: string | undefined

/**
 * Sends only an anonymous per-tab session id, the demo profile, and a coarse
 * source bucket (see coarseSource). Never a tier, raw utm value, token, code,
 * or contact detail: everything passes the sanitizeAnalyticsParams allowlist.
 */
export function trackVoiceDemoEvent(event: VoiceDemoEvent, params: { profile?: Vertical } = {}): void {
  if (typeof window === 'undefined') return
  try {
    if (!voiceDemoSessionId) {
      let storage: Storage | null = null
      try { storage = window.sessionStorage } catch { /* blocked */ }
      voiceDemoSessionId = getOrCreateAnalyticsSessionId(storage)
    }
    const clean = sanitizeAnalyticsParams({
      profile: params.profile,
      session_id: voiceDemoSessionId,
      source: coarseSource(window.location.search),
    })
    window.gtag?.('event', event, clean)
    window.fbq?.('trackCustom', event, clean)
  } catch {
    /* analytics must never break the UX */
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
