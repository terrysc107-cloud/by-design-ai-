# WEBSITE_HANDOFF: /voice-agent live demo funnel

Date: 2026-11-07 · Branch: `feat/voice-agent-demo-platform` · Worktree: `/Users/terry/code/by-design-ai-voice-demo`
Scope: plan Task 11 + website half of Task 12 (`.hermes/plans/2026-11-07_085200-call-voice-assistant-demo-platform.md`).
Details and the upstream API contract: `docs/features/call-voice-assistant-demo.md`.

## Status: implemented, NOT YET VERIFIED BY EXECUTION

The session that built this could not execute code: every `npm`, `npx`, `node`, and `tsx`
invocation (including `npm ci`) was blocked pending interactive approval, and the worktree
has no `node_modules`. Tests were written first (TDD), and the code was reviewed by hand
against them and against `tsconfig` (`strict`, TS 5.7), but **no test, type check, build,
claims check, or browser run has passed yet.** Treat every item below as unproven until the
commands in "Next step" pass.

| Check | Command | Result |
|---|---|---|
| Install | `npm ci` | NOT RUN (blocked) |
| Unit/handler/isolation/copy tests | `npx --yes tsx --test tests/voice-demo.test.ts tests/voice-agent-waitlist.test.ts tests/voice-agent-waitlist-rate-limit.test.ts` | NOT RUN (blocked) |
| Types | `npx tsc --noEmit --incremental false` | NOT RUN (blocked) |
| Claims gate | `npm run check:claims` | NOT RUN (blocked); copy is also scanned by `checkPost` inside `tests/voice-demo.test.ts` |
| Build | `npm run build` | NOT RUN (blocked) |
| Playwright acceptance | `npx next start -p 3100` then `VOICE_AGENT_TEST_BASE_URL=http://127.0.0.1:3100 node scripts/test-voice-agent-page.mjs` | NOT RUN (blocked) |
| Whitespace | `git diff --check` | PASS (no output) |

## What changed

- `/voice-agent` rebuilt as the demo funnel: hero ("Call your future AI receptionist."),
  promise, vertical choice (towing / auto repair / auto detailing), AI + transcription +
  simulation disclosure with required acknowledgement BEFORE the number, number + `tel:` CTA +
  six-digit code, mobile sticky call bar, polled live status, owner-output reveal,
  customization bridge, managed offer with recommended pricing flagged "pending final
  approval", qualification form with separate recap / sales-follow-up consent, canonical
  15-minute Calendly CTA (`lib/cta.ts`) for qualified tiers and as every failure fallback, FAQ.
- Server proxy routes `POST /api/voice-demo/{session,status,lead}` against
  `VOICE_DEMO_API_BASE_URL` + `VOICE_DEMO_API_SECRET` (server-only). Same-origin, JSON-only,
  4 KB cap, honeypot, hashed-IP burst limits, 8 s timeout, upstream responses rebuilt by
  allowlist sanitizers, no upstream detail leaked. Unconfigured → `503 not_configured` →
  page shows "live demo line is not open" + Calendly.
- Typed browser client (`lib/voice-demo-client.ts`); token/code never in URLs (POST body +
  sessionStorage resume after switching to the dialer).
- Analytics: browser-owned events only (`trackVoiceDemoEvent`), allowlisted params
  (`vertical`, `tier`, `utm_source`); server-owned events documented as the service's.
- Privacy policy: new "AI Receptionist Phone Demo" section; Twilio and Telegram added as
  processors; OpenAI entry extended. Sitemap: `/voice-agent` added.
- Brand: current kit (Paper/Ink/Electric Blue/Cyan, Geist, Voice waveform kept). Electric
  Blue deepened to `#1A5FD6` for filled buttons/links because `#2878FF` with white text is
  4.0:1 (fails AA). No gold, no robot imagery; the hero visual is the real owner-view component.
- Waitlist retired from the page without deletion (component marked RETIRED; route, libs,
  tests, table, and data unchanged). Waitlist helpers exported / limiter made configurable
  with unchanged defaults so the proxy reuses them.

**Not committed:** `git add` was also blocked, so all work is uncommitted in the worktree
(`git status --short`). Commit after verification passes, staging these paths explicitly:
`app/privacy/page.tsx app/sitemap.ts app/voice-agent app/api/voice-demo lib/analytics.ts
lib/voice-agent-waitlist-handler.ts lib/voice-agent-waitlist-rate-limit.ts lib/voice-demo*.ts
scripts/test-voice-agent-page.mjs tests/voice-demo.test.ts tests/voice-demo-offer.test.ts
tests/voice-demo-rate-limit.test.ts package.json package-lock.json docs/features/call-voice-assistant-demo.md
WEBSITE_HANDOFF.md .ai/HANDOFF.md memory/DECISIONS.md`, message
`feat: turn voice agent page into live demo funnel`. Tests: `tests/voice-demo.test.ts` (new),
`scripts/test-voice-agent-page.mjs` (rewritten; the previous version already asserted copy
the old page no longer had).

## Decisions made

- Upstream path/shape chosen to match plan Task 7 routes; documented as a contract the
  service must implement (`docs/features/call-voice-assistant-demo.md`).
- Status lookups are POST so the browser token never appears in any URL or access log.
- Lead tier comes only from the service; the site never scores. **Revised (review repair):**
  the tier is no longer returned to the browser at all, and no scheduling link is shown after a
  lead submits. See "Review repairs" below.
- Demo number comes from the session response, so it is never on the page before the
  disclosure is acknowledged.
- Privacy page edited for content only; it still uses the legacy gold layout (restyle out of scope).

## Unresolved external dependencies / risks

1. **Verification** (above) has not run. Highest priority.
2. **Demo service** (`call-voice-assistant-demo`) must implement the documented
   `/v1/web-demo/*` contract, bearer auth, 404/410 expiry, and its own authoritative rate limits.
3. **Env vars** `VOICE_DEMO_API_BASE_URL`, `VOICE_DEMO_API_SECRET` not set anywhere; set in
   Vercel only after the service has a staging hostname. Until then the page runs in its
   "line not open" fallback.
4. **Twilio demo number** not purchased (plan Task 13, needs Terry's approval).
5. **Pricing** is not approved. `VOICE_DEMO_OFFER.approved = false` (now in
   `lib/voice-demo-offer.ts`), so no numbers render. Publishing still needs Terry's approval
   and the 70% margin check.
6. **Privacy text promises behavior the service must deliver**: no audio storage, 30-day
   deletion of no-consent demo data, shorter transcript retention, email confirmation before
   recap/follow-up, separate consents. Verify against the service before release.
7. FAQ commits that every deployed receptionist discloses AI in its greeting; keep that true.
8. Rate limits on the site are per serverless instance (documented `ponytail:` ceiling).
9. OG image still uses the older executive-on-phone poster; a demo-specific share image is a follow-up.
10. Page is light-only (brand kit is light-first); no dark mode variant.

## Next step

Superseded by the command block in "Review repairs" below.

## Review repairs (2026-11-07, second Claude session) — NOT YET EXECUTED

Same constraint as before: every `npx`/`npm`/`node --import tsx` call was blocked pending
approval in this session (only `node --version` ran: v24.14.1). Tests were written first,
then the code; nothing below has passed yet.

1. **Unapproved pricing hidden.** Offer moved to `lib/voice-demo-offer.ts` (imported only by the
   server component `VoiceAgentExperience`, so numbers never ship in client JS).
   `publishedOffer()` is the only path to the numbers and returns `null` while
   `approved: false`; the page shows neutral "priced to your shop / short fit call / nothing
   agreed until in writing" copy, nav reads "Service", and the fit form asks "Is a managed
   monthly service something you could budget for?" (budget label is now a prop).
2. **Confirm email before scheduling.** Proxy still requires a known upstream `tier` but returns
   only `{ success, email_confirmation_sent }`. Success: "Check your inbox and confirm your email
   address." + "Once you confirm, we send your follow-up. It includes the link to book a 15-minute
   fit call." If `email_confirmation_sent !== true`: "We have your answers and will reply by
   email." No Calendly link in the success state. Contract note added for the service.
3. **Analytics.** Only `session_id` (`vs_` + 128 random bits, sessionStorage, per tab), `profile`,
   and `source` ∈ `direct|search|social|email|paid|other` via `coarseSource()`. Tier and raw
   `utm_source` removed. Privacy text updated to say so.
4. **Shared NAT.** Status limited per token (40/min) plus a separate per-address ceiling
   (1,200/min). `createVoiceDemoLimiter(now)` exported for tests. Session/lead limits unchanged
   (per address; see risk below).
5. **Next.js 15.5.24 → 15.5.29: NOT DONE.** Needs `npm install`, which was blocked; I did not
   hand-edit `package.json`/`package-lock.json` (fake integrity hashes would be worse than none).
6. Tests: `tests/voice-demo.test.ts` (updated), new `tests/voice-demo-offer.test.ts`,
   new `tests/voice-demo-rate-limit.test.ts`, Playwright script updated (pricing absent incl.
   client JS, confirm-email success, no-confirmation path, analytics param allowlist).

Risk: session (6/10 min) and lead (5/10 min) limits are still per address, so a large CGNAT
could hit them; the service is authoritative and should limit per number/profile.

Run, in this worktree:

```bash
npm install --save-exact next@15.5.29 eslint-config-next@15.5.29
git diff package.json package-lock.json   # expect only next/@next/* + eslint-config-next bumps
npm audit --omit=dev
npx --yes tsx --test tests/voice-demo.test.ts tests/voice-demo-offer.test.ts tests/voice-demo-rate-limit.test.ts tests/voice-agent-waitlist.test.ts tests/voice-agent-waitlist-rate-limit.test.ts
npx tsc --noEmit --incremental false
npm run check:claims
npm run build
npx next start -p 3100 &
VOICE_AGENT_TEST_BASE_URL=http://127.0.0.1:3100 node scripts/test-voice-agent-page.mjs
git diff --check
```

Fix any failures, commit (paths above), then do a visual pass at 320 / 390 / 768 / 1440 px. Do not deploy, set
production env vars, or purchase the number without Terry's explicit approval.
