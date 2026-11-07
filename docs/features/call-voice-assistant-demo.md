# /voice-agent: AIxDesign Call Voice Assistant demo funnel (website side)

Plan: `by-design-ai-/.hermes/plans/2026-11-07_085200-call-voice-assistant-demo-platform.md`,
Task 11 and the website half of Task 12. The telephony service, profiles,
scoring, consent storage, email, Telegram, and metrics live in the separate
`call-voice-assistant-demo` repository. This site is only the sales surface
and a narrow server-to-server proxy.

## Page structure

1. Hero: "Call your future AI receptionist." with a real `VoiceDemoOwnerView` preview (labeled simulated)
2. Promise: "Never let an unanswered business call become an unworked lead."
3. Demo (`#demo`): choose towing / auto repair / auto detailing, read the AI + transcription + simulation disclosure, acknowledge it, then the number, `tel:` CTA, and six-digit code appear
4. Live status (polled) and owner-output reveal after the call
5. "Your version would know your shop." customization bridge
6. Managed offer (`#pricing`, the one Ink section). While `approved: false`: neutral managed-service / fit-call copy, no numbers
7. Qualification form (`#fit`) with separate recap and sales-follow-up consent. Success asks the prospect to confirm their email; no scheduling link on the page
8. Canonical 15-minute Calendly CTA (`lib/cta.ts`) only as a failure fallback on the page; for leads it arrives in the follow-up the service sends after the email is confirmed
9. FAQ (`#faq`): AI disclosure, uncertainty, emergencies, booking/dispatch limits, management, demo data

Mobile: a sticky `tel:` bar (number + code) shows below 640px while a call is pending.

## Files

| File | Role |
|---|---|
| `lib/voice-demo.ts` | I/O-free contract: types, browser input validators, upstream sanitizers, analytics allowlist |
| `lib/voice-demo-server.ts` | Config, proxy handlers (injected fetch/limit/log), production wiring |
| `lib/voice-demo-client.ts` | Typed browser boundary, sessionStorage resume, utm reader |
| `lib/voice-demo-content.ts` | All page copy, disclosure, FAQ (scanned by tests) |
| `lib/voice-demo-offer.ts` | Offer copy + gated pricing; imported only by the server component `VoiceAgentExperience` |
| `app/api/voice-demo/{session,status,lead}/route.ts` | Thin POST routes |
| `app/voice-agent/_components/VoiceDemoLauncher.tsx` | Vertical choice, disclosure gate, reveal, polling |
| `app/voice-agent/_components/VoiceDemoOwnerView.tsx` | Owner summary card |
| `app/voice-agent/_components/VoiceDemoQualificationForm.tsx` | Fit form |
| `app/voice-agent/_components/BookCallLink.tsx` | Canonical Calendly link |
| `tests/voice-demo.test.ts` | Unit + handler + isolation + copy + analytics tests (stubbed fetch only) |
| `tests/voice-demo-offer.test.ts` | Pricing gate and confirm-email-first success state |
| `tests/voice-demo-rate-limit.test.ts` | Shared-NAT / concurrent-user status polling limits |
| `scripts/test-voice-agent-page.mjs` | Playwright acceptance (all demo APIs mocked) |

Changed: `lib/analytics.ts` (browser demo events), `lib/voice-agent-waitlist-handler.ts`
(exported body/origin helpers), `lib/voice-agent-waitlist-rate-limit.ts` (optional limits;
defaults unchanged), `app/privacy/page.tsx`, `app/sitemap.ts`, `app/voice-agent/*`.

## Environment (server only)

| Variable | Meaning |
|---|---|
| `VOICE_DEMO_API_BASE_URL` | Demo service origin, `https://` (or `http://localhost` for dev). No query/hash. |
| `VOICE_DEMO_API_SECRET` | Bearer secret, at least 24 characters. Never `NEXT_PUBLIC_`. |

Either missing or invalid: every proxy route returns `503 {"error":"not_configured"}` and the
page shows "The live demo line is not open right now" with the Calendly fallback. The page
and build never depend on these values.

## Upstream contract the demo service must implement

All requests carry `Authorization: Bearer <secret>`; 8 s timeout; redirects refused.

- `POST /v1/web-demo/sessions` body `{ profile: "towing"|"mechanic"|"auto_detailing", attribution?: {utm_*} }`
  → 2xx `{ browser_token: [A-Za-z0-9_-]{32,128}, call_code: "\d{6}", phone_number: E.164, expires_at: ISO-8601, profile }`
- `GET /v1/web-demo/sessions/{browser_token}/status`
  → 2xx `{ state: "awaiting_call"|"in_call"|"completed"|"expired"|"failed", owner_output? }`; 404/410 is treated as `expired`.
  `owner_output` (required when completed): `vertical, need, urgency ("emergency"|"urgent"|"standard"|"flexible"), service_requested, preferred_timing, missing_information[], summary (non-empty), recommended_action, example_notification`.
- `POST /v1/web-demo/leads` body: validated lead (`name, business_name, email` lowercased, `phone?` E.164,
  `business_type, monthly_calls, missed_calls, timeline, budget`, `recap_consent`, `sales_follow_up_consent`,
  `browser_token?`, `attribution?`) → 2xx `{ tier: "sales_qualified"|"review_qualified"|"nurture"|"resource", email_confirmation_sent: boolean }`.
  The proxy requires a known `tier` (proof the service scored the lead) but returns only
  `{ success: true, email_confirmation_sent }` to the browser; the tier never reaches the page or analytics.
  `email_confirmation_sent` must be the literal `true` only when a double-opt-in email was actually
  sent; anything else renders "We have your answers and will reply by email." The service must put
  the canonical booking link (`DISCOVERY_CALL_URL`, 15-minute call) only in the follow-up it sends
  AFTER the email is confirmed, never in the confirmation request itself and never in this response.
- `429` from any endpoint is passed through as `429`. Anything else non-2xx, malformed, or a network error becomes `502 upstream_unavailable` with no upstream detail.

Everything the browser receives is rebuilt field-by-field by `parseUpstream*`; extra upstream
fields (provider IDs, transcripts, caller PII, scores) are dropped.

## Privacy and security rules enforced here

- Browser token and code never appear in a URL: status polling is `POST` with the token in the body; resume uses `sessionStorage`.
- The six-digit code is display-only; status lookups require the high-entropy token.
- Same-origin check, `application/json` only, 4 KB body cap, honeypot on the lead form.
- Process-local burst limits, keys hashed before storage. Status polling is scoped per demo
  token (40/min) with a separate per-address abuse ceiling (1,200/min, about 60 concurrent demos
  behind one NAT), so prospects sharing an office, campus, or mobile-carrier IP never throttle each
  other. Session (6/10 min) and lead (5/10 min) stay per address. The service is authoritative and
  should limit sessions per profile/number, not per IP alone.
- Logs carry event names and HTTP status only.
- Recap and sales-follow-up consent are separate, optional booleans; neither is inferred from calling or from the historical waitlist.

## Analytics event ownership (Task 12)

| Event | Owner |
|---|---|
| `voice_page_viewed`, `demo_started`, `vertical_selected`, `demo_number_revealed`, `owner_output_viewed`, `qualification_started`, `fit_request_submitted` | Browser (`trackVoiceDemoEvent`, GA4 event + Meta `trackCustom`) |
| `demo_call_connected`, `demo_call_completed`, `email_confirmed`, `lead_qualified`, `fit_call_scheduled`, `fit_call_attended`, `agreement_sent`, `setup_paid`, `receptionist_launched`, `month_3_retained` | Voice service `metrics.py` only |

The browser type cannot express server-owned events, so nothing is counted twice. Params pass an
allowlist of exactly three keys:

- `session_id`: `vs_` + 128 random bits from `crypto.getRandomValues`, stored in `sessionStorage`
  (`aix_voice_demo_analytics_sid`), per tab. Never derived from or sent with the demo token, code,
  or contact details, and never sent to the proxy or service.
- `profile`: `towing` | `mechanic` | `auto_detailing`.
- `source`: `coarseSource()` bucket of the landing URL, one of `direct|search|social|email|paid|other`.
  Raw `utm_*` values are never sent to analytics (they still go server-to-server as session/lead attribution).

No qualification tier and no free-text value is ever sent from the browser. Calendly clicks still
fire the existing `book_call` conversion with a fixed `source: 'voice_agent'`; "scheduled" comes
only from the authoritative Calendly webhook in the service.

## Historical waitlist

Deliberately retired from the page, not deleted: `VoiceAgentWaitlistForm.tsx` (marked retired),
`/api/voice-agent-waitlist`, `lib/voice-agent-waitlist*.ts`, their tests, and the
`bda_voice_agent_waitlist` table/rows are unchanged. Waitlist consent is not demo consent.

## Pricing

`VOICE_DEMO_OFFER.pricing` in `lib/voice-demo-offer.ts` holds the plan's recommended numbers
with `approved: false`. The only path from those numbers to the page is `publishedOffer()`,
which returns `null` while unapproved, so the page renders `VOICE_DEMO_OFFER.unpublished`
(managed service, priced on a short fit call, nothing agreed until in writing) and the fit form
asks a neutral budget question. No price, minute allowance, overage, or term is rendered, asked
about, or shipped in client JS (the offer module is server-component-only; tests enforce it).

To publish: after Terry signs off, set `approved: true` in its own reviewed commit. That alone
renders the price block, switches the nav label to "Pricing", and changes the budget question
to the configured setup and monthly amounts. `tests/voice-demo-offer.test.ts` asserts
`approved === false` today, so that test must be updated in the same commit, deliberately.
