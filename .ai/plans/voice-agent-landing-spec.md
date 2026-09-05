# BUILD 2 SPEC

## 1. Objective and implementation boundaries

Implement one isolated pre-launch landing page in:

`/Users/terry/code/by-design-ai-`

Public route:

`https://aixdesign.dev/voice-agent`

The page introduces a future small-business AI voice-agent offering and captures waitlist interest.

It is separate from Terry’s private Tom voice gateway. Do not publish Tom’s name, private phone numbers, gateway hostname, personal-assistant functionality, internal architecture, or private session details.

Implementer: Claude Sonnet 5.

### Conversion goal

One action only:

“Join the Waitlist”

Capture:

- Required email.
- Optional business type / intended use.
- Explicit agreement to receive updates about this future offering.

No pricing, booking flow, live demo, checkout, phone-number provisioning, or operational voice-agent integration.

### Delivery boundary

Implement code and a reviewable SQL migration.

Do not:

- Apply the migration to Supabase.
- Create a paid Supabase branch.
- Change production secrets.
- Deploy production.
- Send confirmation, marketing, or notification emails.
- Add waitlist entrants to newsletter/drip/CRM tables.
- Commit or push unrelated changes.

Migration application and live database verification require Terry’s approval.

## 2. Verified starting point

Read-only inspection established:

1. The app uses Next.js App Router.
2. `/voice-agent` is not an existing route.
3. `docs/BRAND-KIT.md` defines the public identity and visual system.
4. `lib/newsletter.ts` imports `getSupabase` from `lib/supabase.ts`.
5. `getSupabase()` uses:
   - `SUPABASE_URL`.
   - `SUPABASE_SERVICE_ROLE_KEY`.
   - Existing fallback names `SUPABASE_SERVICE_KEY` and `service_role`.
   - A server-side service-role client with session persistence disabled.

6. `.env.local` contains assignments for `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Values were not displayed or tested against Supabase. No additional secret is needed by this design.

7. Newsletter subscriptions currently use `bda_subscribers`.
8. `/api/subscribe` also enrolls entrants into `bda_leads` and may send email. Do not call or reuse that route for this waitlist.
9. Existing tables use a `bda_` prefix. Use `bda_voice_agent_waitlist` for consistency.
10. `components/layout/Footer.tsx` includes a newsletter signup, not just legal links.
11. `app/layout.tsx` supplies Geist Sans, global styles, analytics, and metadata.
12. The project has Playwright installed and an existing `npx --yes tsx` script convention, but no general test script in `package.json`.
13. Existing intake uses a `company_url` honeypot. No reusable rate-limiter was found in the inspected API/lib code.
14. The existing privacy page discusses contact/business information and Supabase but does not specifically describe this new waitlist.

### Existing changes that must be preserved

Tracked modifications:

- `app/page.tsx`.
- `app/education/page.tsx`.
- `app/blog/[slug]/page.tsx`.
- `.ai/HANDOFF.md`.

Additional untracked work observed:

- `components/sections/TheBoardReel.tsx`.
- `components/ui/FiveThingsVideo.tsx`.
- `content/blog/five-things-a-real-ai-board-has.mdx`.
- `public/video/`.
- `video/`.

None of these files or directories may be edited, deleted, renamed, formatted, staged, or committed as part of this build.

This specification deliberately requires no modification to any existing source file.

## 3. Brand requirements and explicit conflict resolution

### 3.1 Exact brand-kit values

Use these values from `docs/BRAND-KIT.md`:

| Item | Required value |
|---|---|
| Primary display name | AI by Design |
| Lowercase lockup | aixdesign |
| Optional typographic variant | AI × Design |
| Retired name | By Design AI — do not use |
| Primary domain | aixdesign.dev |
| Primary tagline | Stop learning about AI. Start running on it. |
| Alternative problem-led tagline | Your business, solved by design. |
| Alternative ops-led tagline | Lean systems. Autonomous outcomes. |
| Existing sitewide primary CTA | Book a Discovery Call |
| Existing sitewide CTA destination | https://calendly.com/terrysc107/15-min-ai-discovery-call |
| Landing-page tone | Confident, premium, minimal |

Use “AI by Design” in visible publisher copy and metadata.

Use the existing `aixdesign` SVG lockup if a compact logo is desirable:

`/brand/aixdesign-lockup.svg`

If using the typographic variant, use the actual multiplication glyph `×`, not the letter `x`.

Do not invent a new logo or independent product brand.

### 3.2 CTA conflict: document the exception

The brand kit explicitly says the primary CTA must always be “Book a Discovery Call.”

This build explicitly requires waitlist-only capture.

Both requirements cannot be followed literally on the same page.

For implementation, treat the user’s specific waitlist-only requirement as a route-scoped exception:

- `/voice-agent` primary CTA: “Join the Waitlist”.
- No discovery-call CTA on this route.
- Do not change `docs/BRAND-KIT.md`.
- Do not change global CTA constants or existing pages.
- Record the exception in the new feature document for Terry’s review.

Do not claim this page follows the brand kit’s primary-CTA hard rule without exception.

### 3.3 Exact visual tokens

Use existing Tailwind tokens:

| Token | Value |
|---|---|
| `background` | `#1E1B17` |
| `gold` | `#C9A84C` |
| `gold-dim` | `rgba(201,168,76,0.15)` |
| `gold-border` | `rgba(201,168,76,0.4)` |
| Primary text | `#FFFFFF` |
| Secondary text | `#A8A29E` / `stone-400` |

Typography:

- Geist Sans.
- Existing `var(--font-geist-sans)`.
- Weights 400, 500, 600, 700.
- Display tracking: `-0.02em`.
- Normal body tracking.

Rules:

- Gold on dark, not gold on white.
- Gold text must be at least 14 px.
- Do not reproduce existing tiny gold labels that conflict with the kit.
- Do not break the wordmark across lines.
- No glowing AI brains, robot imagery, blue circuit overlays, or fake product screenshots.

Spacing from the existing global system:

- `.section`: 900 px maximum width.
- `.section-wide`: 1,200 px maximum width.
- Desktop section padding: 96 px vertical, 24 px horizontal.
- Mobile section padding: 72 px vertical, 20 px horizontal.
- Use existing 1 px gold rules and restrained 2 px corner treatment.

Use a static `bg-gold-radial` background. A new animation or video is unnecessary.

## 4. Exact file ownership

All paths below are relative to `/Users/terry/code/by-design-ai-`.

### Create only

1. `app/voice-agent/page.tsx`
   - Server-rendered route, metadata, sections.

2. `app/voice-agent/_components/VoiceAgentWaitlistForm.tsx`
   - Client form and submission states.

3. `app/voice-agent/_components/VoiceAgentFooter.tsx`
   - Route-local legal footer matching the existing footer’s visual language, without its newsletter form.

4. `app/api/voice-agent-waitlist/route.ts`
   - New POST endpoint.

5. `lib/voice-agent-waitlist.ts`
   - Table constant, validation types, normalization, insert contract.
   - No newsletter or email imports.

6. `lib/voice-agent-waitlist-handler.ts`
   - Testable request handler with injected persistence and limiter dependencies.

7. `lib/voice-agent-waitlist-rate-limit.ts`
   - Small bounded, process-local abuse limiter.

8. `docs/migrations/voice-agent-waitlist.sql`
   - Review-only table migration.
   - No automatic execution.

9. `docs/features/voice-agent-waitlist.md`
   - Brand exception, schema, env reuse, operations, acceptance, rollback.

10. `tests/voice-agent-waitlist.test.ts`
    - Validation, handler, persistence-contract tests.

11. `tests/voice-agent-waitlist-rate-limit.test.ts`.

12. `scripts/test-voice-agent-page.mjs`
    - Browser acceptance using installed Playwright and Node assertions.

### Read-only dependencies

- `docs/BRAND-KIT.md`.
- `app/page.tsx`.
- `app/layout.tsx`.
- `app/globals.css`.
- `tailwind.config.ts`.
- `components/layout/Footer.tsx`.
- `components/ui/GoldRule.tsx`.
- `lib/supabase.ts`.
- `lib/newsletter.ts`.
- `app/api/subscribe/route.ts`.
- `app/api/intake/route.ts`.
- `app/privacy/page.tsx`.
- `package.json`.
- Lockfiles.
- Existing coordination and memory documents.

Do not edit global navigation, footer, sitemap, robots, shared components, package scripts, dependency files, or global styles.

## 5. Exact page content

Use “AI Voice Agent” as a descriptive working product title, not as a claim of a registered or finalized standalone brand.

### 5.1 Header

- Existing AI by Design lockup linking to `/`.
- Text link: “Join the Waitlist” → `#waitlist`.
- No existing global header import if it adds a discovery CTA.
- No dropdown or new navigation system.

### 5.2 Hero

Eyebrow:

“COMING SOON”

H1:

“AI Voice Agent”

One-liner:

“Planned phone coverage for the calls you can’t get to.”

Subhead:

“We’re developing a voice-agent offering for small businesses: after-hours call handling, routine customer questions, and clearer message-taking. Restaurant and order-taking workflows are also under consideration.”

Primary CTA:

“Join the Waitlist”

Supporting disclosure:

“Not available yet. Join for development and launch updates.”

Place the brand’s exact primary tagline in a secondary publisher line, not as a replacement for the product explanation:

“AI by Design — Stop learning about AI. Start running on it.”

No availability date, “launching next month,” limited-seat language, or implied invitation guarantee.

### 5.3 Use-case section

Heading:

“What we’re designing for”

Intro:

“These are planned use cases, not features available today.”

Four cards:

1. Customer service

   “A planned way to handle routine questions using information your business approves, with a clear handoff when a person is needed.”

2. Voicemail replacement

   “A planned alternative to the voicemail beep: collect the caller’s reason for calling and the details your team needs to follow up.”

3. After-hours coverage

   “Planned call handling when your team is off the clock, so callers can leave a useful request without waiting for business hours.”

4. Restaurants and order-taking

   “We’re exploring restaurant questions and order-request capture. Menu rules, order confirmation, and staff handoff would need to be defined before launch.”

Do not claim orders will be placed, paid, accepted, allergy-checked, or sent to a POS system.

### 5.4 Lean trust/design section

Heading:

“Built around the business. Not a generic script.”

Body:

“The design priorities are simple: business-approved information, clear limits, and a human handoff when needed. We’re using early interest to decide which workflows to build first.”

Clarifying line:

“Joining the waitlist does not create an account or provide access to a working product.”

Do not add certification badges, compliance claims, customer logos, testimonials, metrics, or integration promises.

### 5.5 Waitlist section

Anchor:

`id="waitlist"`

Heading:

“Tell us where calls get stuck.”

Body:

“Leave your email for updates. If you want, tell us what kind of business you run and which calls you need help with.”

Fields:

1. Email
   - Label: “Email address”.
   - Required.
   - `type="email"`.
   - `autocomplete="email"`.
   - Maximum 254 characters.

2. Optional interest
   - Label: “Business type or use case (optional)”.
   - Text input or short textarea.
   - Maximum 200 characters.
   - Placeholder: “Restaurant orders, after-hours service calls, customer questions…”

3. Consent
   - Required, unchecked checkbox.
   - Label: “Email me about this voice-agent offering.”
   - Do not bundle newsletter enrollment.

4. Honeypot
   - Name: `company_url`.
   - Hidden from visual layout and assistive navigation.
   - Not keyboard-focusable.
   - Empty for legitimate submissions.

Submit button:

“Join the Waitlist”

Submitting label:

“Joining…”

Success message:

“You’re on the list. We’ll email you with updates about this offering.”

Error message:

“We couldn’t save your request. Please try again.”

Validation messages:

- “Enter a valid email address.”
- “Keep this to 200 characters or fewer.”
- “Confirm you’d like updates about this offering.”

Privacy disclosure:

“We’ll store your email and any business details you share to manage this waitlist and send product updates. This does not subscribe you to the AI by Design newsletter. You can ask to leave the list at hello@aixdesign.dev.”

Link to `/privacy`.

Do not say a confirmation email was sent. This build does not send one.

### 5.6 Footer

Create a route-local footer matching the existing:

- Dark background.
- Gold-toned border.
- 1,200 px maximum width.
- Similar legal-row spacing.
- AI by Design name.
- Copyright.
- Blog, Education, Privacy Policy, Terms of Service links.

Do not import `components/layout/Footer.tsx`, because its newsletter form violates waitlist-only capture.

Do not change that shared component.

Use readable secondary text rather than copying low-contrast styles uncritically.

## 6. Supabase schema contract

New table:

`public.bda_voice_agent_waitlist`

Use the same Supabase project selected by `getSupabase()`. Do not hardcode a project reference or create a second client configuration.

### Columns

| Column | Type | Nullability/default | Purpose |
|---|---|---|---|
| `id` | `uuid` | Primary key, default `gen_random_uuid()` | Internal record identifier |
| `email` | `text` | Not null | Normalized email |
| `business_type` | `text` | Nullable | Optional business/use-case interest |
| `created_at` | `timestamptz` | Not null, default `now()` | Server-assigned signup time |
| `source` | `text` | Not null, default `'/voice-agent'` | Fixed route attribution |
| `consent_version` | `text` | Not null | Disclosure version accepted |

Exact fixed values:

- `source`: `"/voice-agent"`.
- `consent_version`: `"voice-agent-waitlist-v1"`.

Use `created_at` as the initial consent/submission timestamp. No separate update timestamp is necessary because this build never updates existing entrants.

### Constraints

1. Named unique constraint on `email`.
2. Email must equal `lower(btrim(email))`.
3. Email length between 3 and 254 characters.
4. Basic email shape constraint consistent with the server’s practical validation.
5. `business_type` must be null or trimmed, nonempty text at most 200 characters.
6. `source` must equal `'/voice-agent'`.
7. `consent_version` must equal `'voice-agent-waitlist-v1'`.

Do not add:

- Foreign keys to subscribers/leads.
- Newsletter status.
- Drip stages.
- Phone number.
- Pricing tier.
- Raw IP address.
- User-agent history.
- Product account identifiers.
- An update trigger.

### Access control

The migration must:

1. Create only this new table and its constraints/indexes.
2. Enable RLS.
3. Revoke table privileges from `PUBLIC`, `anon`, and `authenticated`.
4. Create no anonymous or authenticated row-access policy.
5. Explicitly configure service-role table privileges needed for server insertion and verification.
6. Avoid security-definer functions, public RPCs, or broad schema grants.
7. Leave all existing tables, policies, functions, and grants unchanged.

The browser must never receive Supabase service-role credentials or insert directly.

### Migration safety

`docs/migrations/voice-agent-waitlist.sql` must:

- Clearly state “REVIEW REQUIRED — DO NOT AUTO-APPLY”.
- Use a transaction.
- Contain no database/project connection secret.
- Fail visibly if a conflicting table already exists rather than silently accepting an incompatible schema.
- Include commented verification queries for columns, constraints, RLS, and grants.
- Keep rollback guidance commented and explicit about data loss.

Do not execute the migration during implementation, build, test startup, deployment hooks, or application startup.

## 7. API and function contracts

### 7.1 Endpoint

`POST /api/voice-agent-waitlist`

Request:

- `Content-Type: application/json`.
- Same-origin browser request.
- Body:
  - `email: string`.
  - `business_type?: string`.
  - `consent: true`.
  - `company_url?: string`.

Reject unknown fields, including client-supplied timestamps, IDs, source, or consent version.

### 7.2 Validation types

In `lib/voice-agent-waitlist.ts`:

`type VoiceAgentWaitlistInput`

Fields:

- `email: string`.
- `business_type: string | null`.
- `consent: true`.

`type WaitlistValidationResult`

Discriminated union:

- Valid result containing normalized input.
- Invalid result containing field errors.

Functions:

`validateVoiceAgentWaitlistInput(value: unknown): WaitlistValidationResult`

`insertVoiceAgentWaitlist(client: SupabaseClient, input: VoiceAgentWaitlistInput): Promise<void>`

Constants:

- `VOICE_AGENT_WAITLIST_TABLE = "bda_voice_agent_waitlist"`.
- `VOICE_AGENT_WAITLIST_SOURCE = "/voice-agent"`.
- `VOICE_AGENT_WAITLIST_CONSENT_VERSION = "voice-agent-waitlist-v1"`.

Keep the helper independent of newsletter/email modules.

Passing the existing Supabase client into the helper provides a test seam without introducing another configured client.

### 7.3 Testable handler

In `lib/voice-agent-waitlist-handler.ts`:

`createVoiceAgentWaitlistHandler(deps: WaitlistHandlerDependencies): (request: Request) => Promise<Response>`

Dependencies:

- `configured: () => boolean`.
- `persist: (input: VoiceAgentWaitlistInput) => Promise<void>`.
- `limit: (key: string) => RateLimitDecision`.
- `now: () => number` where needed for deterministic tests.
- Safe logging function accepting event code and sanitized diagnostic fields only.

The route exports:

`async POST(request: NextRequest): Promise<Response>`

It binds:

- `hasSupabase`.
- `getSupabase`.
- New waitlist insert helper.
- Process-local limiter.

Use the Node runtime.

Do not initialize Supabase at module import or page render. Missing environment configuration must not prevent the static landing page from rendering or building.

### 7.4 Request processing order

1. Reject unsupported content type.
2. Validate browser Origin.
3. Enforce actual streamed-body limit of 4 KiB, even without a trustworthy Content-Length header.
4. Parse JSON safely.
5. Require a plain object.
6. Apply the honeypot rule.
7. Validate and normalize fields.
8. Apply abuse limit.
9. Check Supabase configuration.
10. Insert into the waitlist table.
11. Return success only after the database operation succeeds.

Origin rule:

- Require Origin for this browser-only endpoint.
- Match the actual same-origin deployment URL.
- Support localhost and preview deployments.
- Do not use wildcard CORS or accept arbitrary cross-origin requests.
- Do not treat Origin validation as authentication or a substitute for abuse controls.

### 7.5 Normalization

Email:

- Must be a string.
- Trim outer whitespace.
- Lowercase.
- Enforce maximum 254 characters.
- Use the project’s practical shape rule after trimming.
- Reject whitespace and control characters inside the address.
- Preserve `+` tags and dots; do not perform provider-specific rewriting.

Business type:

- Optional.
- Undefined or empty/whitespace-only → null.
- Non-string supplied values → validation error.
- Trim outer whitespace.
- Preserve capitalization and meaningful punctuation.
- Reject more than 200 characters rather than silently truncating.
- Treat it as text, never HTML.

Consent:

- Require the boolean `true`.
- Reject missing, false, strings, numbers, and truthy objects.

### 7.6 Insert and duplicate behavior

Use the existing Supabase client with:

- Table: `bda_voice_agent_waitlist`.
- Inserted fields:
  - Normalized email.
  - Normalized business type.
  - Fixed source.
  - Fixed consent version.
- Omit `created_at` and `id` so the database assigns them.

Use conflict handling equivalent to:

- Conflict target: `email`.
- Ignore duplicates: true.
- No update of existing rows.

A repeated submission must not:

- Reset signup time.
- Replace an existing business type with blank text.
- Overwrite someone else’s record using their email.
- Enroll the address in another list.
- Reveal whether the address was already present.

Both new and duplicate submissions return the same public success shape.

Do not perform a pre-insert existence check. Let the unique constraint handle races atomically.

### 7.7 Responses

Success:

- HTTP 200.
- `{"success":true}`.

Validation:

- HTTP 400.
- Stable generic error and permitted field-error map.

Other errors:

- 403: invalid/missing Origin.
- 413: payload too large.
- 415: unsupported content type.
- 429: rate limited, with `Retry-After`.
- 503: Supabase missing, table unavailable, or service temporarily unavailable.

Never return:

- Email address.
- Row ID.
- Subscriber existence.
- Raw SQL/PostgREST errors.
- Supabase URL/key.
- Stack trace.

All responses:

- `Cache-Control: no-store`.

A honeypot submission returns the same generic success response without persistence, matching the existing intake anti-bot pattern. Document this deliberate exception to normal success-means-persisted semantics.

### 7.8 Abuse controls without new secrets

Implement a bounded process-local limiter:

- Three submissions per normalized email per ten minutes.
- Sixty valid submission attempts per process per minute.
- Store a SHA-256 digest of normalized email as the local key, not the raw address.
- Maximum 2,000 retained email buckets.
- Prune expired buckets.
- Use an injectable monotonic clock.
- Apply limits to duplicate attempts too.

Do not add Redis, Turnstile, CAPTCHA credentials, or a new managed service.

Do not rely on unverified `X-Forwarded-For` values as a secure client identity.

Document that this is basic burst protection, not a global distributed limit across serverless instances. Honeypot, unique constraint, payload limits, and process-local throttling are the scoped baseline. Persistent abuse would require a separately approved platform-level control.

## 8. Numbered implementation plan

### 8.1 Protect existing work

1. Re-read `git status --short`.
2. Record hashes of all existing modified/untracked files in the protected list.
3. Check whether any proposed new path now exists.
4. If a proposed path has been created by another agent, stop rather than overwriting it.
5. Do not stash, reset, clean, rebase, or run a repository-wide formatter.
6. Do not modify `.ai/HANDOFF.md` for coordination; use the new feature document only.

### 8.2 Implement validation tests first

Create the unit test file and cover:

- Valid email.
- Trim/lowercase behavior.
- Optional business interest.
- Consent enforcement.
- Invalid body shapes.
- Unknown fields.
- Length boundaries.
- Duplicate insert semantics.

Use Node’s test/assert modules through the existing `tsx` execution convention. Do not add a new test framework or change `package.json`.

### 8.3 Implement the isolated persistence helper

Create `lib/voice-agent-waitlist.ts`.

Its production caller receives `getSupabase()` from the existing library. It must not instantiate a new project client.

Test that the helper targets only the new table and supplies the fixed source/consent values.

### 8.4 Prepare the review-only SQL

Create `docs/migrations/voice-agent-waitlist.sql` from the schema contract.

Review it for:

- One new table only.
- Unique email.
- Explicit RLS and grants.
- No public read or write.
- No subscriber/lead/drip changes.
- No secret.
- No auto-application mechanism.

Do not run it.

### 8.5 Implement the API boundary

Create the handler factory, limiter, and route.

Keep request parsing and error handling deterministic.

Do not import:

- `lib/newsletter.ts`.
- `lib/emails.ts`.
- `lib/resend.ts`.
- `lib/drip.ts`.
- `/api/subscribe`.

A missing table must yield a visible, retryable form error—not a fake success or fallback subscription.

### 8.6 Implement the client form

Create `VoiceAgentWaitlistForm.tsx`.

State machine:

- `idle`.
- `submitting`.
- `success`.
- `error`.

Requirements:

1. Use a semantic form.
2. Associate visible labels with fields.
3. Keep the consent checkbox unchecked initially.
4. Disable submit while submitting.
5. Prevent repeated clicks from dispatching parallel requests.
6. Preserve input on failure.
7. Clear or replace the form on success.
8. Use `role="status"` / `aria-live="polite"` for success and submission updates.
9. Use accessible error association and focus the first invalid field.
10. Use a bounded request timeout and permit explicit retry.
11. Treat malformed success responses as failure.
12. Never store email/business interest in localStorage, URLs, or analytics payloads.
13. Send only to `/api/voice-agent-waitlist`.

Do not claim delivery of an email.

### 8.7 Implement the server-rendered page

Create `app/voice-agent/page.tsx`.

Keep it a Server Component. Only the form needs client behavior.

Use this order:

1. Route-local header.
2. Hero.
3. Gold rule.
4. Four use-case cards.
5. Lean design/trust section.
6. Waitlist form.
7. Route-local footer.

Layout:

- Single-column on mobile.
- Two-column card grid on tablet/desktop.
- Reasonable maximum line length.
- Form maximum width around 560 px.
- Primary heading responsive from roughly 40 px to 64 px.
- Body text at least 16 px.
- Gold labels/buttons at least 14 px.
- Visible keyboard focus.
- Minimum 44 px interactive targets.
- No horizontal overflow at 320 px.
- No hero video or large new imagery.
- No new motion dependency.

Use existing root layout and global tokens without editing them.

### 8.8 Implement metadata

Export route metadata using the existing Next.js pattern.

Title:

“AI Voice Agent — Coming Soon | AI by Design”

Description:

“A future voice-agent offering for small businesses. Join the waitlist for updates on after-hours calls, customer questions, message-taking, and restaurant workflows.”

Canonical:

`/voice-agent`

Open Graph:

- Type: website.
- URL: `https://aixdesign.dev/voice-agent`.
- Site name: AI by Design.
- Same route title and description.

Twitter:

- `summary_large_image`.
- Same route title and description.
- Existing creator convention: `@aixdesign`.

Reuse existing site image assets rather than introducing generated artwork.

Verify the rendered canonical is the new route, not the inherited `/` canonical.

Do not add Product/Offer structured data, pricing, ratings, or availability assertions.

Do not modify the global sitemap in this isolated build.

### 8.9 Document the review gates

Create `docs/features/voice-agent-waitlist.md` with:

- Scope.
- File list.
- Route-specific CTA exception.
- Working product title.
- Exact existing environment variable names reused.
- New schema and migration location.
- No newsletter/drip enrollment.
- No email sends.
- Duplicate behavior.
- Abuse-control limitations.
- Privacy disclosure.
- SQL approval gate.
- Local verification commands.
- Live verification steps after approval.
- Rollback procedure.

Flag the existing privacy policy’s lack of waitlist-specific wording. The route must include the explicit disclosure specified above. Terry should review whether the general policy needs a separate future update; do not edit the privacy route in this build.

### 8.10 Verify isolation

After implementation:

1. Re-run `git status --short`.
2. Compare protected-file hashes.
3. Confirm there are no tracked-file modifications introduced by this build.
4. Confirm only the allowed new paths were added.
5. Inspect imports to ensure no newsletter or private gateway dependency.
6. Do not stage or commit unrelated work.

Explicit expected result:

No existing modified/uncommitted file is touched. All implementation source changes are new isolated files.

## 9. Explicit test list

### 9.1 Validation tests

1. Valid email succeeds.
2. Outer whitespace is trimmed before validation.
3. Email is lowercased.
4. Plus-addressing is preserved.
5. Internal whitespace is rejected.
6. Missing email is rejected.
7. Non-string email is rejected.
8. Email over 254 characters is rejected.
9. Null/array/non-object body is rejected.
10. Invalid JSON is rejected by the handler.
11. Unknown fields are rejected.
12. Business type omitted → null.
13. Blank business type → null.
14. Non-string business type is rejected.
15. Business type over 200 characters is rejected.
16. Meaningful casing/punctuation is preserved.
17. Consent must be boolean true.
18. Client-supplied timestamp/source/ID is rejected.

### 9.2 API and persistence tests

1. Correct same-origin request is accepted.
2. Missing/foreign Origin is rejected.
3. Unsupported content type → 415.
4. Oversize body → 413.
5. Missing Content-Length does not bypass the byte limit.
6. Honeypot returns generic success without persistence.
7. Missing Supabase configuration → 503.
8. Missing table → 503, not fake success.
9. Database failure → safe error without row/email details.
10. New insert writes only to `bda_voice_agent_waitlist`.
11. Insert includes source and consent version.
12. Timestamp and ID are not supplied by the client/helper.
13. Duplicate ignore behavior returns generic success.
14. Duplicate submission does not update the existing row.
15. Concurrent duplicate requests result in one database row after integration verification.
16. No newsletter, lead, drip, Resend, or CRM operation occurs.
17. API responses are non-cacheable.
18. Logs contain no email, interest text, secrets, or raw database error.
19. Client/server error contracts remain consistent.
20. Success is not returned before persistence completes, except the documented honeypot path.

### 9.3 Rate-limit tests

1. First allowed attempts succeed.
2. Per-email threshold returns 429.
3. Global process threshold returns 429.
4. Retry-After is valid.
5. Expired buckets reset.
6. Retained buckets remain bounded.
7. Hash keys do not retain raw email.
8. Duplicates consume the same email bucket.
9. Normalization prevents case/whitespace bypass.
10. Tests use injected time rather than sleeps.

### 9.4 Browser and page tests

Using `scripts/test-voice-agent-page.mjs`:

1. `/voice-agent` renders without hydration errors.
2. Heading and coming-soon language are present.
3. Four planned use cases are present.
4. No pricing or checkout.
5. No live demo.
6. No claims of existing customers, testimonials, results, or launched functionality.
7. No Tom/private gateway references.
8. Only one email-capture form is present.
9. Footer does not contain the shared newsletter form.
10. Primary CTA is “Join the Waitlist”.
11. Primary CTA reaches the form.
12. Labels and consent are accessible.
13. Missing consent blocks submission.
14. Loading state disables duplicate submit.
15. Success follows a successful mocked API response.
16. Network/503/malformed-response failures remain visible and preserve input.
17. Browser request contains only approved fields.
18. No email/interest value is placed in the URL.
19. No horizontal overflow at 320, 375, 768, and 1,440 px.
20. Keyboard navigation and focus states work.
21. Reduced-motion preference does not hide content.
22. Canonical, title, description, Open Graph, and Twitter metadata are route-specific.
23. Footer links resolve.
24. Browser console has no new runtime errors.
25. Service-role configuration is absent from browser assets.
26. Existing homepage, education page, and a known existing blog page remain reachable without source changes.

Browser tests must intercept the waitlist POST by default. They must not submit data to production.

### 9.5 SQL review and approved integration tests

Before approval:

- Review the SQL text and contracts.
- Use mocked persistence for automated tests.
- Mark real persistence acceptance as pending.

After Terry approves migration application to the verified newsletter project:

1. Apply the reviewed migration through the approved process.
2. Read back the exact table schema.
3. Verify RLS and grants.
4. Verify anonymous and authenticated direct read/write are denied.
5. Submit an approved synthetic test address through the route.
6. Read back that exact row with privileged server access.
7. Verify normalized email, timestamp, interest, source, and consent version.
8. Submit the same address again with different interest text.
9. Verify one row remains and original timestamp/interest are unchanged.
10. Verify no corresponding row was added to newsletter/lead tables.
11. Remove only the approved synthetic test row using a separately authorized administrative action.

Do not test with a real prospective customer’s address.

## 10. Verification commands and interpretation

From `/Users/terry/code/by-design-ai-`:

- `npx --yes tsx --test tests/voice-agent-waitlist.test.ts tests/voice-agent-waitlist-rate-limit.test.ts`
- `npx tsc --noEmit --incremental false`
- `npm run check:claims`
- `npm run build`

Start a local preview on an available loopback port using the existing Next.js command, then run:

`VOICE_AGENT_TEST_BASE_URL=http://127.0.0.1:3100 node scripts/test-voice-agent-page.mjs`

Use port 3100 only if it is available; otherwise pass the actual chosen port.

Important:

- The existing `check:claims` script tests the existing content guardrail. It does not automatically prove this new page’s claims are acceptable. New page-copy assertions and human review are still required.
- Record pre-existing build/type failures separately. Do not edit protected files to repair unrelated failures.
- A full build may generate framework artifacts. Do not include generated artifacts in this feature’s source changes.
- Use the existing lockfile/dependencies; do not rewrite them.
- Report actual command results, not expected results.

## 11. Release and rollback

Before public release:

1. Terry reviews the page copy, including the working product title.
2. Terry reviews the route-scoped CTA exception.
3. Terry reviews the waitlist/privacy disclosure.
4. Terry approves the SQL migration.
5. Schema and RLS are read back after application.
6. End-to-end persistence is verified.
7. A deployment containing only the approved feature changes is prepared.
8. Existing unrelated in-flight changes are not accidentally promoted.

Do not deploy a working-looking form backed by a nonexistent table and call the build complete.

If SQL approval is pending, report:

“Page and API implementation verified with mocks; live waitlist persistence pending migration approval.”

Rollback:

- Remove or revert only this build’s new route, API, helper, component, test, and documentation files.
- Do not automatically drop the table if it contains real waitlist entries.
- Preserve collected data until Terry explicitly approves deletion or migration.

## 12. Definition of Done

- [ ] `/voice-agent` is a new isolated route.
- [ ] The page clearly describes a future offering, not a currently usable product.
- [ ] The offering is not presented as Terry’s private Tom system.
- [ ] Product title, one-liner, subhead, four use cases, lean trust section, form, and footer are present.
- [ ] Brand name variants, tagline, typography, colors, spacing, and imagery restrictions are followed.
- [ ] The waitlist-only CTA exception is explicitly documented rather than hidden.
- [ ] No pricing, live demo, invented case study, customer claim, result, or launch date appears.
- [ ] Only the voice-agent waitlist captures email on this route.
- [ ] Newsletter, drip, CRM, and email-sending paths are untouched.
- [ ] Supabase access reuses the existing newsletter project client.
- [ ] No new secret is required or exposed.
- [ ] `bda_voice_agent_waitlist` has the specified columns, constraints, RLS, and access restrictions.
- [ ] SQL exists as a reviewable migration and is not automatically applied.
- [ ] Duplicate submissions are safe, atomic, and non-enumerating.
- [ ] Validation, consent, honeypot, payload limits, and bounded abuse controls are implemented.
- [ ] Form loading, success, failure, retry, and accessibility states work.
- [ ] Metadata and canonical URL are route-specific.
- [ ] Responsive browser tests, unit tests, type checking, claims checks, and build results are reported honestly.
- [ ] Real persistence is verified after migration approval, or explicitly remains pending.
- [ ] No existing modified/uncommitted file is touched.
- [ ] No existing route, shared footer, global navigation, stylesheet, package file, lockfile, or handoff document is modified.
- [ ] Final diff contains only the allowed new files.
- [ ] Claude completes a final brand, truthfulness, privacy, security, database, and scope review before declaring completion.
