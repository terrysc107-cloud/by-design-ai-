# /voice-agent — pre-launch waitlist

Status: **implementation complete, live persistence pending Terry's SQL approval.**

## Scope

An isolated, pre-launch landing page for a future small-business AI
voice-agent offering, at `https://aixdesign.dev/voice-agent`. Captures
waitlist interest only — no pricing, booking, live demo, or working voice
agent. Entirely separate from Terry's private Tom voice gateway: no private
name, phone number, hostname, or architecture detail from that system
appears anywhere in this build.

## Files

Created (all new, no existing file modified):

- `app/voice-agent/page.tsx` — server-rendered route + metadata
- `app/voice-agent/_components/VoiceAgentWaitlistForm.tsx` — client form
- `app/voice-agent/_components/VoiceAgentFooter.tsx` — route-local footer (no newsletter form)
- `app/api/voice-agent-waitlist/route.ts` — POST endpoint (Node runtime)
- `lib/voice-agent-waitlist.ts` — validation, normalization, insert contract
- `lib/voice-agent-waitlist-handler.ts` — testable request handler
- `lib/voice-agent-waitlist-rate-limit.ts` — bounded process-local limiter
- `docs/migrations/voice-agent-waitlist.sql` — review-only migration
- `tests/voice-agent-waitlist.test.ts`, `tests/voice-agent-waitlist-rate-limit.test.ts`
- `scripts/test-voice-agent-page.mjs` — Playwright acceptance script
- `docs/features/voice-agent-waitlist.md` — this document

Nothing in `components/layout/Footer.tsx`, global nav, sitemap, robots, or
`package.json` was touched.

## Brand exception (needs Terry's sign-off)

`docs/BRAND-KIT.md` states the sitewide primary CTA is always **"Book a
Discovery Call."** This route's spec explicitly requires waitlist-only
capture for an offering that doesn't exist yet, so `/voice-agent` is a
**route-scoped exception**:

- Primary and only CTA on this route: **"Join the Waitlist."**
- No discovery-call CTA anywhere on `/voice-agent`.
- `docs/BRAND-KIT.md` itself is unchanged; no global CTA constant was touched.

This page does **not** follow the brand kit's primary-CTA rule without
exception — flagging that explicitly rather than silently.

## Working product title

"AI Voice Agent" is used as a descriptive working title throughout the page
copy, not as a claim of a registered or finalized standalone brand. The
publisher of record stays "AI by Design" in the header, footer, metadata,
and a secondary tagline line in the hero.

## Environment variables reused (no new secret)

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (with existing fallbacks `SUPABASE_SERVICE_KEY`, `service_role`)

Both come from the existing `lib/supabase.ts` (`getSupabase()` / `hasSupabase()`).
No second Supabase client, no new project, no new env var. `getSupabase()` is
only called lazily inside the route's `persist` step — never at module import
or page render — so missing config never breaks the static page or the build.

## Schema

New table only: `public.bda_voice_agent_waitlist`. See
`docs/migrations/voice-agent-waitlist.sql` for the full reviewable DDL
(columns, constraints, RLS, grants, verification queries, rollback). No
existing table, policy, function, or grant is touched.

## No newsletter / drip / CRM / email

- Does not import `lib/newsletter.ts`, `lib/emails.ts`, `lib/resend.ts`, `lib/drip.ts`, or call `/api/subscribe`.
- Does not write to `bda_subscribers`, `bda_leads`, or any drip-stage column.
- Sends no confirmation, marketing, or notification email. The success
  message and privacy disclosure both say so explicitly — this build never
  claims an email was sent.
- `tests/voice-agent-waitlist.test.ts` includes an automated check that the
  waitlist source files contain no import of those modules.

## Duplicate behavior

`insertVoiceAgentWaitlist` upserts with `onConflict: 'email', ignoreDuplicates: true`
and no pre-insert existence check — the unique constraint on `email` handles
races atomically. A repeat submission:

- does not reset `created_at`,
- does not blank out an existing `business_type`,
- cannot overwrite someone else's row,
- enrolls nowhere else,
- gets the exact same `{"success":true}` response as a first-time signup (no
  enumeration of whether the address was already present).

## Abuse controls (and their limitation)

Honeypot (`company_url`), the 4 KiB streamed-body cap (enforced by actually
counting bytes, not trusting `Content-Length`), the database unique
constraint, and `lib/voice-agent-waitlist-rate-limit.ts` (3 attempts / email /
10 min, 60 attempts / process / minute, SHA-256'd email as the bucket key, 2000
retained buckets max) are the scoped baseline for this build.

This is **basic burst protection, not a global distributed limit** — each
serverless instance holds its own memory, so it does not stop abuse spread
across many cold starts. Persistent abuse would need a separately approved
platform-level control (shared store, edge rate limiter, Turnstile/CAPTCHA).
None of that was added here.

Origin validation (same-origin only, derived from the request's own URL, no
wildcard CORS) is a CSRF guard for this browser-only endpoint, not
authentication and not an abuse control on its own.

## Privacy disclosure

The waitlist section includes, verbatim, on the page itself (not just in this
doc):

> We'll store your email and any business details you share to manage this
> waitlist and send product updates. This does not subscribe you to the AI by
> Design newsletter. You can ask to leave the list at hello@aixdesign.dev.

**Flag for Terry:** `app/privacy/page.tsx` does not yet mention this waitlist
specifically (it covers the guide/discovery-call/intake flow). This build
intentionally does not edit the privacy route — recommend a future update to
`/privacy` once the offering and this waitlist are both live.

## SQL approval gate

`docs/migrations/voice-agent-waitlist.sql` is **review-only** — headed "REVIEW
REQUIRED — DO NOT AUTO-APPLY," wrapped in a transaction, no secret embedded,
fails loudly (no `if not exists`) if a conflicting table already exists.
Nothing in this repo applies it automatically. Terry must review and apply it
manually before real signups can be captured.

## Local verification

From `/Users/terry/code/by-design-ai-`:

```bash
npx --yes tsx --test tests/voice-agent-waitlist.test.ts tests/voice-agent-waitlist-rate-limit.test.ts
npx tsc --noEmit --incremental false
npm run check:claims
npm run build
```

Then, with a local preview running on an available loopback port:

```bash
VOICE_AGENT_TEST_BASE_URL=http://127.0.0.1:3100 node scripts/test-voice-agent-page.mjs
```

`npm run check:claims` is the existing content-guardrail test; it does not
specifically validate this page's copy. New page-copy claims still need human
review against §5 of the build spec.

## Live verification (after Terry approves the migration)

1. Apply `docs/migrations/voice-agent-waitlist.sql` to the correct project.
2. Read back columns, constraints, RLS, and grants (queries are commented in the migration file).
3. Confirm anon/authenticated direct read/write are denied.
4. Submit one approved synthetic test address through the live route.
5. Read back that row with privileged server access; verify normalized email,
   timestamp, business type, source, and consent version.
6. Resubmit the same address with different business-type text; verify still
   one row, with the original `created_at`/`business_type` unchanged.
7. Confirm no corresponding row appeared in `bda_subscribers` or `bda_leads`.
8. Remove only that synthetic row via a separately authorized admin action.

Until that happens, the honest status is: **page and API implementation
verified with mocks; live waitlist persistence pending migration approval.**

## Rollback

Remove this build's new files only (route, API, helper, component, test, and
doc files listed above). Do not drop `bda_voice_agent_waitlist` if it holds
real signups — preserve collected data until Terry explicitly approves
deletion. `docs/migrations/voice-agent-waitlist.sql` has a commented, explicit
drop-table rollback for the empty/never-applied case.
