# The Augmented Operator — Autonomous Draft, Slack Approval, One Pipeline

**Status:** Approved 2026-08-20 · not yet implemented
**Author:** Claude Code (planning session) · **Owner:** Terry Scott
**Scope:** Replace three competing newsletter generators with one scheduled Claude Code cloud routine,
a private mobile preview, Slack button approval, and the existing idempotent Resend send path.

---

## 1. Context

Terry receives Vercel approval emails for the newsletter but **cannot see, read, or manage the draft**.
The approval email carries only a subject line, a shell command, and a one-click *Approve & Send* button
— so the send decision is made blind. There is no browser-viewable rendering of an issue anywhere.

Worse, three separate systems are converging on the same job. A Hermes cron created 2026-08-20
**first fires Mon 2026-08-24 08:00 ET**; a Vercel cron already fires **Mon 07:00 ET**. Neither can see the
other, so from Aug 24 there would be two competing Issue #N candidates every Monday.

**Target:** one weekly agent drafts the issue, renders it as on-brand mobile HTML, and posts it to Slack
with a private preview link and Approve / Revise / Reject buttons. Terry taps Approve on his phone. It
sends. Nothing ever sends on silence.

### Decisions recorded this session

| # | Decision |
|---|---|
| D1 | **A Claude Code scheduled cloud routine is the single generator.** Retire both the Vercel and Hermes generators. |
| D2 | **Cris is out of the loop.** No compose UI, no editor tokens, no paste step. |
| D3 | **Slack Block Kit buttons** approve, with typed thread commands as a fallback. |
| D4 | **Approval sends immediately**, unless outside business hours — then it holds to the next window. |
| D5 | **Private tokenized preview** while draft; publishes to the public canonical page on send. |

D2 supersedes the earlier plan to build Cris a paste-and-send surface. She keeps read visibility in the
Slack channel but has no required step. This also resolves the earlier conflict with `SKILL.md` — Terry
is once again the sole approver, matching both the skill and his standing rule that he approves all
outbound email.

---

## 2. Current state — findings

### 2.1 Three generators, one job 🔴

| When (ET) | System | What it does |
|---|---|---|
| Mon 07:00 | `vercel.json:24` → `/api/cron/newsletter-generate` | OpenAI drafts, writes a real `bda_newsletter_issues` row at `draft`, emails a one-click approve link, inserts 2 social promos |
| Mon 08:00 | Hermes cron `d63180209c04` | Researches + drafts a *different* issue, posts to Slack thread `1787230779.708419` in `#ai-x-design`. Never fired yet |
| Mon 08:00 | `vercel.json:12` → `/api/cron/content-generate` | Tops up social drafts — same minute as Hermes |
| Daily 13:30 | `vercel.json:28` → `/api/cron/newsletter-send` | Drains **any** `approved` issue to the full list |

**Both generators must be retired.** The cloud routine replaces them.

### 2.2 No way to view a draft

`app/newsletter/page.tsx` is a **marketing signup page only** (95 lines). There is **no
`app/newsletter/[slug]/`, no archive, no admin, no preview route.** The only renderings available today:
terminal (`scripts/newsletter-review.ts --show`), a test email (`--send-test`, `:98-113`), or shipping it.
`lib/emails.ts:189-245` `newsletterIssueEmail()` is the only full-fidelity renderer and is reachable only
from Node.

### 2.3 Resend reality (verified live this session)

- `aixdesign.dev` — **verified, sending enabled** ✅
- **0 broadcasts ever sent**, **0 templates**
- **1 segment, "General" — empty.** Account-wide across all four brands
- **Open + click tracking OFF** on `aixdesign.dev` — no engagement metrics today

The real list is Supabase `bda_subscribers`; `app/api/subscribe/route.ts:41-54` writes there, not to
Resend contacts. **Keep sending through the app** — a Resend-segment mirror would fork the source of
truth, break the `unsubscribe_token` → `/api/unsubscribe` mapping, and discard the ledger.

### 2.4 Send path is solid — preserve it

`lib/newsletter.ts:329-448` `sendNextBatch()` must not be rewritten:

1. Claims oldest `approved`/`sending` issue (`:335-345`)
2. Compare-and-set `approved → sending` (`:347-353`)
3. **Inserts the ledger row `pending` BEFORE sending**; PG `23505` → `continue` (`:384`) — *the entire idempotency guarantee*
4. `List-Unsubscribe` + `List-Unsubscribe-Post: One-Click` (`:399`)
5. Recomputes completion, flips to `sent` (`:421-437`)

**Two defects:** a subscriber joining mid-send re-opens a `sent` issue (`:364-372`, `:421-436`), and
correctness degrades past **~5000 subscribers** (`:325-327`).

### 2.5 Security gaps

| Gap | Location | Risk |
|---|---|---|
| `approve` is a bare **GET** with token in URL | `app/api/newsletter/approve/route.ts:10-14` | Mail scanner / prefetcher can approve → next cron sends |
| `NEWSLETTER_AUTONOMOUS=true` → straight to `approved` | `app/api/cron/newsletter-generate/route.ts:46-48` | Full list mailed same day, zero humans. Unset locally; **must verify unset in Vercel** |
| `CRON_SECRET` unset ⇒ every cron route public | all 7 routes use `if (secret && ...)` | Anyone can trigger generate/send |
| Daily live social publish | `app/api/cron/content-publish/route.ts:30` `publishApproved({live:true})` | One stray bulk-approve pushes AI copy to LinkedIn |

### 2.6 Schema is undocumented

**Zero migrations, zero `CREATE TABLE` in the repo.** Schema lives only in Supabase
(`supabase-crimson-ladder`, `README.md:77`), inferred from `IssueRow` (`lib/newsletter.ts:39-58`). The
`UNIQUE(issue_id, subscriber_id)` constraint the idempotency design rests on is **unversioned and unverified**.

### 2.7 Slack app constraint ⚠️

The Hermes gateway Slack app runs **Socket Mode** (`SLACK_APP_TOKEN`, launchd
`ai.hermes.gateway.plist`). Socket Mode delivers interactivity over the socket, **not** to an HTTP request
URL — so pointing Block Kit buttons at `aixdesign.dev` would conflict with Hermes.

**⇒ Create a separate Slack app, "AI by Design Newsletter"**, with HTTP interactivity and its own bot
token, installed to the same workspace. It posts and receives button clicks; Hermes is untouched.

### 2.8 Git state

- Branch `feat/coaching-and-intel`, **ahead 2, behind 0** — `649a68b`, `099f794` (docs-only)
- `git status --short`: one line, `?? .ai/` (untracked handoff log)
- Working tree otherwise **clean** — safe to branch from
- Repo is GitHub-connected (`terrysc107-cloud`), which the cloud routine requires

### 2.9 Smaller issues

- `tsx` is not a declared dependency, yet every operational script needs it
- `pickIssueImages()` (`lib/newsletter.ts:202-204`) hardcoded to one CDN asset — every issue looks identical
- `lib/weekly-intel.ts:85` scrapes an undocumented Yahoo Finance endpoint with a spoofed UA; fails silently
- `README.md` stale; `memory/DECISIONS.md` has **no** newsletter entry
- Cadence mismatch: `docs/BRAND-KIT.md:433` says Tuesday; crons generate Monday
- `NewsletterSignup` prop union (`components/sections/NewsletterSignup.tsx:8`) narrower than the API's 5 sources

---

## 3. Target architecture

```
Mon 08:00 ET   Claude Code cloud routine  (the ONLY generator)
               reads .claude/skills/augmented-operator/
               live web research → citations → 700–1,100 word draft
               POST /api/newsletter/ingest   (Bearer INGEST_TOKEN)
                    ↓
Vercel         validate → dedupe by iso_week → insert bda_newsletter_issues (draft)
               mint preview_token → render mobile HTML
               post to Slack: summary + preview link + [Approve][Revise][Reject]
                    ↓
Terry (phone)  taps Preview → reads the real mobile rendering
               taps Approve
                    ↓
               POST /api/slack/interactions   (Slack signature verified)
               in business hours → send now
               outside          → set scheduled_send_at, hold
                    ↓
               sendNextBatch() → Resend → bda_newsletter_sends ledger
               publish canonical /newsletter/<slug>
                    ↓
               Slack thread reply: recipients · sent · failed · live URL
```

**Retired:** `/api/cron/newsletter-generate` **and** Hermes cron `d63180209c04`.
**Kept:** `/api/cron/newsletter-send` as a **safety net and hold-release** — it resumes a stalled batch
and releases issues held outside business hours. Moves from daily to hourly.

### Why a cloud routine generates

It runs whether or not Terry's Mac is awake, does genuine multi-step web research with citation
checking, and produces the 700–1,100 word sectioned format the editorial model specifies.
`generateIssue()` produces 250–450 words from RSS headlines with no citations. Vercel functions cap at
60s, which is not enough for real research.

### What each system owns

| Concern | Owner |
|---|---|
| Research, drafting, citations, social derivatives | **Claude Code cloud routine** |
| Review surface, approval, status, blockers, results | **Slack** |
| Workflow state, send ledger, subscribers, tokens | **Supabase** |
| Preview, canonical page, archive, SEO, sending | **Vercel / Next.js** |
| Source packs, screenshots, research exports, working visuals | **Google Drive** (never the archive, never the sender) |

---

## 4. Data model

### Migration 001 — document existing schema

New directory `supabase/migrations/`. Captures reality with `CREATE TABLE IF NOT EXISTS` /
`ADD COLUMN IF NOT EXISTS` so it is safe against the live DB. **Must verify and assert**
`UNIQUE(issue_id, subscriber_id)` on `bda_newsletter_sends`.

Tables: `bda_newsletter_issues`, `bda_newsletter_sends`, `bda_subscribers`, `bda_leads`,
`bda_bookings`, `bda_intake`, `bda_content_queue`.

### Migration 002 — new columns on `bda_newsletter_issues`

| Column | Type | Purpose |
|---|---|---|
| `slug` | `text UNIQUE` | canonical URL |
| `issue_number` | `int` | "Issue #12" |
| `title` | `text` | web headline, distinct from email subject |
| `body_html` | `text` | rendered mobile email HTML |
| `iso_week` | `text UNIQUE` | **`2026-W35` — the duplicate-draft guard** |
| `published_at` | `timestamptz` | web page live; null = not on archive |
| `preview_token` | `text UNIQUE` | private preview access |
| `scheduled_send_at` | `timestamptz` | business-hours hold |
| `source` | `text default 'cloud-routine'` | provenance |
| `sources` | `jsonb` | citation list |
| `approved_by` | `text` | Slack user ID that tapped Approve |
| `slack_channel` / `slack_ts` | `text` | thread to reply into |
| `revision_notes` | `jsonb` | history of `revise:` requests |

`UNIQUE(iso_week)` makes the ingest endpoint naturally idempotent — a rerun of the routine updates the
existing draft rather than creating a second one.

Add `'held'` to `IssueStatus`:

```
draft → approved → sending → sent
   ↘ held ↗          ↘ failed
   ↘ canceled
```

### Migration 003 — API tokens

```
bda_api_tokens
  id · token_hash · label ('cloud-routine' | 'hermes-fallback')
  scopes text[] · expires_at · last_used_at · revoked_at · created_at
```

Hashed, never raw. Scopes: `ingest`, `approve`.

### Migration 004 — link social to its issue

Add `issue_id uuid` to `bda_content_queue`. Promos stay unapprovable until the parent issue is `sent`.

---

## 5. User journeys

### The routine (Monday 08:00 ET, unattended)
1. Reads `.claude/skills/augmented-operator/SKILL.md` (the editorial model, ported into the repo so the cloud routine can see it — it cannot read `~/.hermes/skills`).
2. Researches, picks one thesis, writes 700–1,100 words in the fixed section template, collects citations.
3. `POST /api/newsletter/ingest` with a bearer token and the `iso_week` key.
4. Never sends. Never publishes. Never posts to Slack directly — the API does that, so the Slack token stays in Vercel.

### Terry (Monday, phone)
1. Slack shows: issue #, title, one-line thesis, word count, source count, **live subscriber count**, `DRAFT — NOT APPROVED`, a preview link, and three buttons.
2. Taps **Preview** → `/newsletter/preview/<token>` renders the exact mobile email HTML. Not indexed, not in the archive, not guessable.
3. Taps **Approve** → read-back confirmation, then send (or hold).
4. Or **Revise** → a modal for notes; the routine picks them up on its next run. Or **Reject** → `canceled`.
5. Gets a threaded reply with the outcome and the live canonical URL.

### Fallback path
If buttons break, Terry types `approve issue` / `revise: ...` / `reject` in the thread and the Hermes
gateway calls the same API with a scoped token. Verified as part of the test matrix, not left theoretical.

---

## 6. Phases

### Phase 0 — Stop the collision (before Aug 24) 🔴

| File | Change |
|---|---|
| `vercel.json` | **Remove** `/api/cron/newsletter-generate` (`:23-26`) |
| `app/api/cron/newsletter-generate/route.ts` | Return `410 Gone` unless `?force=1`. Keeps a manual fallback, kills the schedule |
| Hermes `cron/jobs.json` job `d63180209c04` | **Disable** (`enabled: false`). Do not delete until the routine has shipped one clean issue |
| Vercel dashboard (Terry) | **Verify `NEWSLETTER_AUTONOMOUS` is unset.** Verify `CRON_SECRET` is set |
| `app/api/newsletter/approve/route.ts` | GET renders a confirm page; new POST performs the transition |

**Acceptance:** No draft appears from either generator Mon Aug 24. `curl` on the approve URL changes
nothing. Existing `approved` issues still send.

**Independently shippable, and closes the highest-severity risk.**

---

### Phase 1 — Schema + migrations

`supabase/migrations/001_baseline.sql` … `004_content_queue_issue_link.sql` per §4.
Update `lib/newsletter.ts:23` `IssueStatus` and `:39-58` `IssueRow`. Add `tsx` to `devDependencies`;
add `npm run newsletter:*` scripts.

**Acceptance:** Applies cleanly to a Supabase branch, re-runs as a no-op, `UNIQUE(issue_id, subscriber_id)` confirmed. Existing send path regression-passes.

---

### Phase 2 — Mobile email renderer + preview + canonical pages

| File | Purpose |
|---|---|
| `lib/newsletter-render.ts` | **New.** One function → mobile-first on-brand HTML, used by email, preview, and web page. Single source of truth for rendering |
| `app/newsletter/preview/[token]/page.tsx` | Private preview. `noindex`, 404 on bad/expired token |
| `app/newsletter/[slug]/page.tsx` | Canonical page. **404 unless `published_at` set.** OG/Twitter metadata, JSON-LD Article |
| `app/newsletter/archive/page.tsx` | Reverse-chronological published issues |
| `app/newsletter/page.tsx` | Add "Read past issues" → archive; keep the signup hero |
| `app/sitemap.ts` | One entry per published issue (currently only `/newsletter`, `:22`) |
| `lib/emails.ts` | Point `newsletterIssueEmail()` at the shared renderer |

Mobile-first bar: single column, ≤600px table shell, ≥16px body, ≥44px tap targets, no external CSS,
inline styles only, dark-safe. Brand tokens from `docs/BRAND-KIT.md` (gold `#C9A84C` on `#1E1B17`, Geist).
Verify in Gmail iOS, Apple Mail, and Outlook before Phase 4.

**Acceptance:** Preview and sent email render byte-identically. Published issue appears at
`/newsletter/<slug>`, in the archive and sitemap; 404 while unpublished. Preview is `noindex` and
inaccessible without the token.

---

### Phase 3 — Ingest API + the cloud routine

| File | Purpose |
|---|---|
| `.claude/skills/augmented-operator/SKILL.md` | **Port** the editorial model into the repo so the routine can read it |
| `lib/api-auth.ts` | Bearer-token hash/verify, scope check, `last_used_at` |
| `app/api/newsletter/ingest/route.ts` | `POST` validate → upsert on `iso_week` → mint `preview_token` → render → post to Slack |
| `lib/slack.ts` | `chat.postMessage` + Block Kit builder + threaded replies |
| `scripts/mint-api-token.ts` | Terry mints/revokes tokens |

Ingest validation is strict: word count in range, required sections present, ≥1 citation, no banned
words (`lib/newsletter.ts:111`), CTA URL on an allowed host. Invalid payload → `422` **and a Slack
warning**, never a silent drop.

Schedule the routine via `/schedule` for Mon 08:00 ET against this repo.

**Acceptance:** Routine produces a draft row, a preview link, and a Slack message with working buttons.
Running it twice in one week updates one row — never creates two.

---

### Phase 4 — Slack approval + send

| File | Purpose |
|---|---|
| `app/api/slack/interactions/route.ts` | **New Slack app**, HTTP interactivity. Verify `X-Slack-Signature` HMAC against `SLACK_SIGNING_SECRET`, reject timestamps >5 min old (replay guard). Routes Approve / Revise / Reject |
| `lib/send-window.ts` | Business-hours logic, America/New_York, DST-aware |
| `app/api/newsletter/send-now/route.ts` | Guarded release: `draft → approved`, publish canonical page, loop `sendNextBatch()`, reply to Slack |
| `lib/newsletter.ts:335-345` | Add `scheduled_send_at.is.null,scheduled_send_at.lte.now()` to the claim query — the **only** change to the send path |
| `vercel.json` | `/api/cron/newsletter-send` daily → **hourly**, to release holds promptly |

Send window: **Mon–Fri 09:00–17:00 ET** (confirm with Terry). Outside → status `held`,
`scheduled_send_at` = next window open, Slack says exactly when it will go.

Approval preconditions — all must hold, else the button returns an error in-thread:
valid Slack signature · Slack user ID is Terry's · `status === 'draft'` · issue not already sent.

**Acceptance:** Tapping Approve in business hours sends within seconds and replies with counts. Tapping
outside hours holds and states the scheduled time. A forged POST without a valid signature is rejected.
Double-tapping Approve sends exactly one email per subscriber.

---

### Phase 5 — Social separation

- `app/api/cron/content-publish/route.ts:30` → `live:false` during rollout; flip back deliberately
- Promos carry `issue_id`; publisher skips any whose parent issue is not `sent`
- Move promo generation out of the retired generate cron into `send-now`

**Acceptance:** No social post can precede its newsletter. Dry-run logs intended posts without publishing.

---

### Phase 6 — Docs + cleanup

- ~~Copy this plan to `docs/plans/2026-08-20-augmented-operator-newsletter-workflow.md`~~ ✅ done 2026-08-20
- `memory/DECISIONS.md` — record D1–D5 (currently no newsletter entry at all)
- `README.md` — document the real pipeline
- `docs/BRAND-KIT.md:433` — reconcile the Tuesday cadence
- Hermes `SKILL.md` — mark generation retired; keep the editorial model as the source for the ported repo skill
- `.gitignore` — add `.ai/`
- Delete Hermes cron `d63180209c04` once one clean issue has shipped

---

## 7. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Two/three drafts collide Aug 24 | 🔴 High | **Phase 0 before Aug 24** |
| `NEWSLETTER_AUTONOMOUS` set in prod → autonomous blast | 🔴 High | Terry verifies; Phase 0 deletes the branch |
| Slack interactivity conflicts with Hermes Socket Mode | 🟠 Med | **Separate Slack app** (§2.7) |
| Forged Slack POST triggers a send | 🟠 Med | Signature verify + timestamp replay guard + user allowlist |
| Approve-by-GET prefetch | 🟠 Med | POST + confirm page |
| Routine drafts something off-brand and nobody reads it | 🟠 Med | Preview link is the whole point; ingest validation rejects banned words / missing citations |
| Routine fails silently, no issue that week | 🟠 Med | If no draft by Mon 12:00 ET, the hourly cron posts a Slack warning |
| Mid-send subscriber re-opens a `sent` issue | 🟠 Med | Snapshot `recipient_total` at claim; compare ledger to snapshot, not live count |
| No prod schema backup before migration | 🟠 Med | Supabase branch first; `IF NOT EXISTS` only |
| DST error in the send window | 🟡 Low | IANA `America/New_York`, never fixed offsets; unit-tested across a DST boundary |
| >5000 subscribers | 🟡 Low | Documented ceiling; revisit at 2000 |

### Security & privacy
- No Supabase or Resend key reaches the browser; all writes go through server routes.
- Ingest and approve tokens stored hashed, scoped, expiring, individually revocable.
- Slack requests verified by HMAC signature with a replay window; approver Slack ID allowlisted.
- Preview tokens are unguessable, `noindex`, and expire once the issue is sent.
- Subscriber emails never appear in Slack or the preview — only an aggregate count.
- The routine holds an `ingest`-scoped token only; it **cannot approve or send**.

---

## 8. Test matrix

| # | Test | Expected |
|---|---|---|
| 1 | GET approve URL via curl | Page renders; status unchanged |
| 2 | Ingest with invalid bearer | 401 |
| 3 | Ingest twice, same `iso_week` | One row, updated — not two |
| 4 | Ingest payload missing citations / too short | 422 + Slack warning |
| 5 | Preview with bad token | 404 |
| 6 | Preview page headers | `noindex`; absent from sitemap |
| 7 | Slack POST, bad signature | 401 |
| 8 | Slack POST, timestamp 10 min old | 401 (replay) |
| 9 | Approve from a non-allowlisted Slack user | 403 |
| 10 | Approve at 14:00 ET Tue | Sends immediately; Slack reply with counts |
| 11 | Approve at 23:00 ET Sat | `held`; `scheduled_send_at` = Mon 09:00 ET; stated in Slack |
| 12 | Double-tap Approve within 2s | Exactly one email per subscriber |
| 13 | Resend failure mid-batch | Ledger `failed`; next hourly run resumes, no dupes |
| 14 | Subscriber joins mid-send | Issue completes; no re-send of a prior issue |
| 15 | Unpublished slug | 404 |
| 16 | Sent issue | Public page 200, in archive + sitemap, OG tags correct |
| 17 | Unsubscribe from a real send | `status = 'unsubscribed'`; excluded next issue |
| 18 | Slack token invalid at send time | Send succeeds; warning logged |
| 19 | Send-window unit tests across a DST boundary | Correct ET handling |
| 20 | Typed `approve issue` fallback | Same result as the button |
| 21 | Migration re-run | No-op |
| 22 | **Full dress rehearsal to a 3-address test list** | End-to-end green |

**Test 22 is the gate for go-live.**

---

## 9. Rollout / rollback

**Branch:** `feat/newsletter-autopilot` off `feat/coaching-and-intel` (clean tree, ahead 2, safe).
Confirm which branch production deploys from before merging. Add `.ai/` to `.gitignore`.

| Step | Action | Rollback |
|---|---|---|
| 1 | Phase 0 → merge → deploy → disable Hermes cron | Restore `vercel.json` entry; re-enable Hermes job |
| 2 | Migrations on a Supabase **branch**, verify, then prod | Additive only — new columns unused by old code |
| 3 | Phases 1–4 on preview; dress rehearsal to a test list | Don't merge |
| 4 | Merge; schedule the routine; **first live issue with Terry watching** | Revoke ingest token → routine can't write |
| 5 | Phase 5–6 after one clean issue ships | Independent, revertible |

**Kill switches, in order of severity:**
1. Revoke the ingest token → no new drafts.
2. Set the Slack app's interactivity URL to nothing → no button approvals.
3. Remove `/api/cron/newsletter-send` from `vercel.json` → nothing sends at all.

The CLI path (`scripts/newsletter-review.ts`) stays functional throughout as a manual fallback.

**Observability:** structured logs on ingest, approve, and send (`issue_id`, recipients, sent, failed,
duration); `approved_by` as the audit trail; Slack read-back is the human-visible signal; a missing
Monday draft raises a Slack warning by 12:00 ET. Consider enabling Resend open/click tracking on
`aixdesign.dev` — currently off, so there are no engagement metrics at all today.

---

## 10. Open decisions

1. **Business-hours window** — proposing Mon–Fri 09:00–17:00 ET. Confirm.
2. **Which branch does production deploy from?** Must confirm before merging.
3. **Current active subscriber count?** Determines whether a send completes in one 60s pass.
4. **Issue numbering** — continue from an existing count, or start at #1?
5. **Vercel plan** — hourly crons need Pro. Seven crons already exist, which implies Pro; verify.
6. **Enable Resend open/click tracking?** Off today; on = metrics, but adds link wrapping.
7. **Does Cris keep any role?** D2 removes her required step; she retains channel visibility.

---

## 11. Recommended first batch

**Ship Phase 0 immediately, standalone.** Small, high-value, independently deployable, and it closes the
highest-severity risk before the Aug 24 collision:

1. Remove the generate cron from `vercel.json`
2. `410 Gone` guard on `app/api/cron/newsletter-generate/route.ts`
3. Disable Hermes cron `d63180209c04`
4. Approve GET → confirm page, POST → transition
5. Terry verifies `NEWSLETTER_AUTONOMOUS` unset and `CRON_SECRET` set in Vercel

Then Phases 1–4 as one continuous build (schema → renderer/pages → ingest/routine → Slack/send), gated
on the Test 22 dress rehearsal before anything reaches the real list.

---

## 12. Verification

- **Phase 0:** `curl` the approve URL, confirm no status change; confirm no draft row appears Mon Aug 24 from either generator.
- **Phase 2:** `npm run build`; hit the preview and canonical routes on a preview deploy; check `/sitemap.xml`; send one test to Gmail iOS, Apple Mail, and Outlook and compare against the preview.
- **Phase 3:** Invoke the routine manually; assert one row, valid preview link, working Slack message. Re-invoke; assert still one row.
- **Phase 4:** Playwright/`curl` the signature-verification cases; approve against a 3-address test list; assert exactly one `bda_newsletter_sends` row per address; verify the hold path by approving with the clock outside the window.
- **Regression:** run `scripts/newsletter-review.ts --list/--show` and confirm the manual fallback still works.
