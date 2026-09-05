---
## Handoff — 2026-09-05 (Claude) — the Five Things reel, shipped to four surfaces

### Active task
Terry: "ai x design prices for the build lab still says not available and we just made a
video can we add it to the site somewhere thats good content." He picked all four
placements offered.

### Where the price bug actually was
NOT in this repo. `lib/education.ts` already had `LIVE_LAB_PRICE = '$997'` and
`LIVE_LAB_DATE` set, and aixdesign.dev/education renders both correctly in production. The
stale flag was `available: false` on the `build-lab` LADDER rung in the COURSE repo
(~/code/micro-course-saas-template/lib/course-config.ts), which made
runyouraiboard.com/ladder print "Not open yet" next to $997. Fixed there; see that repo's
handoff.

### What changed here
1. **`components/ui/FiveThingsVideo.tsx`** (new) — click-to-play 9:16 player,
   `preload="none"`, poster frame, sharp corners, gold Watch button. No icon library and no
   hand-rolled SVG: this site has zero SVGs and draws arrows with `→`, so the play glyph is
   a CSS clip-path triangle.
2. **`components/sections/TheBoardReel.tsx`** (new) + `app/page.tsx` — new home-page
   section between TheAudit and TwoPaths. Asymmetric split, no CTA of its own: TwoPaths is
   the fork and its docblock forbids emphasising either path, so a button here would pick a
   winner one scroll early. The reel's own closing frame carries the Lab's ask.
3. **`app/education/page.tsx`** — the Build Lab card is now a two-column grid with the reel
   beside the copy, and gained `id="lab"` + `scroll-mt-28` so the new post can deep-link it.
4. **`content/blog/five-things-a-real-ai-board-has.mdx`** (new, ~640 words) + 
   **`app/blog/[slug]/page.tsx`** — registered `FiveThingsVideo` in `mdxComponents` so a
   post embeds the component by name rather than raw markup.
5. **`public/video/five-things.mp4`** (3.1MB, CRF 25 + faststart) and
   **`five-things-poster.jpg`** (56KB) — web encode of the 24MB master.
6. **`video/build-lab-five-things/`** — the HyperFrames source, previously untracked, plus
   the fix below and a new render.

### 🔴 Blocker found and fixed in the video itself
The reel's opening chat mock read: *"Here's my business again — we sell CRCST exam prep,
roughly 500 users, and I need this week's priorities…"* Two problems, on what was about to
be four public AI by Design surfaces: a cross-brand leak (this repo's own
`lib/content-guardrail.ts` CROSS_BRAND rule refuses `CRCST` by name, "these belong to
Terry's SPD and ATS channels, never to AI by Design"), and a user-count claim about a real
business, which the video's own BRIEF.md said would never appear in the render.

Fixed at source in `index.html` and `build.mjs` (one `PROMPT` string, typing is
length-independent at 46 fixed steps so timing is unchanged). It now reads *"same context
as last week, same numbers"*, which keeps the beat and drops the brand and the number. The
narration never said the line, so no VO regeneration was needed.

### Checks run — exact results
- `npx hyperframes check` — passed. Lint 0 errors / 2 warnings (file length, track density,
  both structural and pre-existing). Runtime, Layout, Motion, Contrast: 0 errors.
  Contrast 62/62 WCAG AA.
- `npm run render -- --video-bitrate 14M` — 2010 frames in 55.4s, 23.9MB, 1m 7.0s.
- Audio re-measured on the new render: **-13.8 LUFS** integrated, unchanged.
- 24-frame sweep of the re-rendered master, eyeballed: no brand names anywhere, GOALS and
  meeting metric VALUES still covered by gold redaction bars, CTA card still Nov 18 / Dec 2 /
  Dec 9 / Dec 16 + "Eight people" + runyouraiboard.com/build-lab.
- `npx tsc --noEmit` — clean.
- Playwright (headless chromium, dev server :3010):
  - `/education`, `/education#lab`, `/blog/five-things-a-real-ai-board-has`, `/` at 1280 and 390.
  - Anchor `#lab` lands the article at y=112 at both 390 and 1280, clear of the fixed header.
  - Player: **0** mp4 requests before the click, 1 after; then
    `paused:false, currentTime 2.7, duration 67, controls:true`.
  - Served frame screenshotted at t=2.4s: shows the corrected line, so the deployed encode
    is the fixed one and not a cache.
  - Every internal link in the new post resolves: /blog 200, 
    /blog/scheduled-ai-tasks-fail-silently 200, /education 200, /education#lab 200.
  - No console errors on any page.
- `npm run build` NOT run in either repo: the sandbox classifier denied it.

### Decisions
- The video file is duplicated into both repos rather than cross-linked, so neither
  marketing page depends on the other domain.
- Click-to-play with `preload="none"`, not muted autoplay: the reel is narrated, and
  autoplay would show the argument with the argument switched off at 3.1MB per visitor.
- The new home-page section deliberately ships without a CTA. See its docblock.
- The blog post makes no claim I could not verify. It says the board "has run every week
  since June" and does not restate the meeting count, which ages.

### Blockers / open
1. **Nothing is committed or pushed** in either repo. Terry's call.
2. `video/` is still untracked and its master render is 24MB. Decide whether the HyperFrames
   source belongs in this repo or its own before committing (carried over from 2026-09-04).
3. The reel bakes in "14 meetings", true as of 2026-09-04. It understates as the archive
   grows, so not urgent, but it is a future re-render trigger.
4. Still no music bed on the master (carried over from 2026-09-04).

### Exact next step
Terry watches the reel on /education, then decides whether to `git push` both repos. If any
placement should go, it is one `<FiveThingsVideo />` line per page.


---
## Handoff — 2026-07-16 18:29:02 EDT

- Repo: /Users/terry/code/by-design-ai-
- Branch: main
- Last commit: 8165500 Merge pull request #20 from terrysc107-cloud/claude/linkedin-playbook
- Note: Claude Code stopped/finished a response. Fill in summary, decisions, next steps, and blockers.

### Git status
```
 M components/layout/Header.tsx
 M lib/newsletter.ts
?? app/coaching/
?? docs/COACHING-FLOW-NOTES.md
?? lib/weekly-intel.ts
```

### Summary
- TODO: What changed?

### Decisions / assumptions
- TODO: Key choices Claude made.

### Next steps
- TODO: The next human/Hermes/Claude action.

### Blockers / warnings
- TODO: Anything unresolved, failing, risky, or needing the user.

---
## Handoff — 2026-07-16 23:04:38 EDT

- Repo: /Users/terry/code/by-design-ai-
- Branch: main
- Last commit: 8165500 Merge pull request #20 from terrysc107-cloud/claude/linkedin-playbook
- Note: Claude Code stopped/finished a response. Fill in summary, decisions, next steps, and blockers.

### Git status
```
 M components/layout/Header.tsx
 M lib/newsletter.ts
?? .ai/
?? app/coaching/
?? docs/COACHING-FLOW-NOTES.md
?? lib/weekly-intel.ts
```

### Summary
- TODO: What changed?

### Decisions / assumptions
- TODO: Key choices Claude made.

### Next steps
- TODO: The next human/Hermes/Claude action.

### Blockers / warnings
- TODO: Anything unresolved, failing, risky, or needing the user.

---
## Handoff — 2026-07-16 23:37:57 EDT

- Repo: /Users/terry/code/by-design-ai-
- Branch: main
- Last commit: 8165500 Merge pull request #20 from terrysc107-cloud/claude/linkedin-playbook
- Note: Claude Code stopped/finished a response. Fill in summary, decisions, next steps, and blockers.

### Git status
```
 M components/layout/Header.tsx
 M lib/newsletter.ts
?? .ai/
?? app/coaching/
?? docs/COACHING-FLOW-NOTES.md
?? lib/weekly-intel.ts
```

### Summary
- TODO: What changed?

### Decisions / assumptions
- TODO: Key choices Claude made.

### Next steps
- TODO: The next human/Hermes/Claude action.

### Blockers / warnings
- TODO: Anything unresolved, failing, risky, or needing the user.

---
## Handoff — 2026-07-17 10:50:36 EDT

- Repo: /Users/terry/code/by-design-ai-
- Branch: feat/coaching-and-intel
- Last commit: f923800 feat(education): point the live-lab blocks at the Build Lab waitlist
- Note: Claude Code stopped/finished a response. Fill in summary, decisions, next steps, and blockers.

### Git status
```
?? .ai/
```

### Summary
- TODO: What changed?

### Decisions / assumptions
- TODO: Key choices Claude made.

### Next steps
- TODO: The next human/Hermes/Claude action.

### Blockers / warnings
- TODO: Anything unresolved, failing, risky, or needing the user.

---
## Handoff — 2026-08-20 (Claude Code, planning session)

- Repo: /Users/terry/code/by-design-ai-
- Branch: feat/coaching-and-intel (ahead 2, behind 0 — both docs-only commits)
- Last commit: 649a68b docs: Techne now runs Opus on OpenRouter, not gpt-5.6-sol

### Active task
Audit and scope the AI by Design ("The Augmented Operator") newsletter workflow. **Planning only —
no product code, schema, cron, or production changes made.**

### What changed
- Created `docs/plans/2026-08-20-augmented-operator-newsletter-workflow.md` (approved plan).
- Nothing else. No code, schema, cron, or env changes.

### Files created
- `docs/plans/2026-08-20-augmented-operator-newsletter-workflow.md`

### Checks run
- `git status --short` → only `?? .ai/` (working tree otherwise clean).
- Live Resend read-only queries: `aixdesign.dev` verified + sending enabled; 0 broadcasts;
  0 templates; 1 segment ("General") which is EMPTY; open/click tracking OFF.
- Read: CLAUDE.md, memory/DECISIONS.md, docs/BRAND-KIT.md, vercel.json, all newsletter routes,
  lib/newsletter.ts, lib/weekly-intel.ts, lib/emails.ts, scripts/, app/newsletter/.
- Read: ~/.hermes/skills/business/ai-by-design-newsletter-operations/SKILL.md and
  ~/.hermes/cron/jobs.json (job d63180209c04).

### Decisions made (D1–D5, recorded in the plan)
1. A **Claude Code scheduled cloud routine** becomes the single generator.
2. **Cris is out of the loop** — no compose UI, no editor tokens.
3. **Slack Block Kit buttons** approve, typed thread commands as fallback.
4. Approval **sends immediately**, holds outside business hours.
5. **Private tokenized preview** while draft; publishes to canonical page on send.

### Blockers / warnings 🔴
- **Aug 24 collision:** three systems generate a newsletter Monday morning.
  `/api/cron/newsletter-generate` (Mon 07:00 ET) writes a real Supabase draft and emails a one-click
  Approve & Send link; Hermes cron `d63180209c04` (Mon 08:00 ET, never fired yet) drafts a different
  issue into Slack. They cannot see each other. **Phase 0 must ship before Mon 2026-08-24.**
- **`NEWSLETTER_AUTONOMOUS`** — if set to `true` in Vercel, a fresh issue flips straight to `approved`
  and mails the full list at 13:30 ET the same day with no human. Unset locally; **Terry must verify
  it is unset in the Vercel dashboard.** Cannot be checked from this session.
- **`CRON_SECRET`** — all 7 cron routes use `if (secret && ...)`, so if it is unset every cron route
  is publicly callable. Verify it is set in Vercel.
- `/api/newsletter/approve` is a bare GET with the token in the URL — a mail scanner or link
  prefetcher can approve an issue, and the daily cron then sends it.
- **Zero migrations in the repo.** The `UNIQUE(issue_id, subscriber_id)` constraint that the entire
  send-idempotency design depends on is unversioned and unverified.
- Hermes Slack app uses Socket Mode, which conflicts with an HTTP interactivity URL — the plan
  requires a **separate Slack app** for the newsletter buttons.

### Exact next step
Terry to give the go-ahead for **Phase 0** (stop the collision), which is independently shippable:
remove the generate cron from `vercel.json`, `410 Gone` guard on the generate route, disable Hermes
cron `d63180209c04`, convert approve to POST + confirm page, and verify the two Vercel env vars.

---
## Handoff - 2026-09-03 (Claude, Opus 5)

**Active task:** Repoint aixdesign.dev at the rebuilt course ("My AI Board"),
promote the Build Lab, and stand up a content engine lane that drives the funnel.

**Branch:** `feat/board-funnel-and-content`, off `feat/coaching-and-intel`.
One commit, `e631c56`. **NOT pushed, NOT merged, NOT deployed.**

### Decisions Terry made this session
1. **Co-equal paths.** Learn it or hire it, equal weight. This overrides the
   documented rule in `docs/CLAUDE-CODE-COURSE-INTEGRATION.md` that education is
   secondary and Book a Discovery Call is always primary. The doc now records
   both the old rule and why it changed.
2. **He will set a real Build Lab date.** Not given yet. See blockers.
3. **Post as AI by Design**, not as My AI Board.

### What changed
- `components/sections/TwoPaths.tsx` (new) on the homepage.
- `/education` renders the five-rung ladder; `/education/claude-code` teaches
  `BOARD_LOOP` instead of the retired developer loop; both had $97 in metadata.
- `lib/education.ts` gained `BOARD_LOOP` and a `LADDER` mirror, both with
  cross-repo sync warnings pointing at the course repo's `lib/course-config.ts`.
- `lib/content-engine.ts`: new `board` lane; `offer` and `hashtagHint` moved
  from the hardcoded system prompt onto the lane.
- `lib/content-guardrail.ts` (new) + `scripts/check-claims.ts` (new test).
- `lib/content-publish.ts`: Postiz channel pinned by id, not found by search.
- Both content crons run multi-lane.

### Checks run
- `npm run check` -> claim gate 18/18 cases, `next build` compiled clean.
- Browser QA (isolated headless Playwright, dev server) at 1440x900 and 390x844:
  homepage fork, `/education` ladder, `/education/claude-code`. Zero page errors.
- Stripe live read: the $57 price exists, `price_1U9ResCaFl8xeTFM04TS08rm`,
  created 2026-08-29 on account `acct_1TMjj5CaFl8xeTFM` ("claude code app").
- Postiz live read: 10 connected channels, **none of them AI by Design**. Five
  are SPD Cert Prep, five are ATS.

### Blockers - Terry only
1. **No AI by Design channel exists in Postiz.** The engine can generate and
   queue but has nowhere to publish. Connect at least a LinkedIn page, then set
   `POSTIZ_LINKEDIN_ID`. The publisher now refuses to guess rather than posting
   to an SPD or ATS channel.
2. **Build Lab date + seat cap.** Needed to flip `BUILD_LAB.status` to
   `scheduled` in the course repo. Requires all three together: a $497 Stripe
   price, a `ccc_lab_sessions` row (a CHECK constraint refuses `scheduled`
   without a real date and price), and the config flip.
3. **Verify `NEXT_PUBLIC_STRIPE_PRICE_ID` in Vercel** points at the $57 price.
   Checkout returns 503 rather than charging the wrong amount, so a stale value
   means every buy button fails silently on both sites.
4. Only the course rung can take money. No Stripe prices exist for the Kit
   ($297), Build Lab ($497) or Board Room ($29/mo).

### Risks / notes for the next session
- **Pre-existing, not introduced here:** a site-wide reduced-motion hydration
  mismatch in `GoldRule`, `TextReveal` and the `shouldReduce ? false : {...}`
  pattern. Reproduces on `/coaching` and `/medical` too. Users with
  "reduce motion" on get a full client re-render. Worth its own change.
- **The newsletter collision from the 2026-08-28 handoff was never fixed.**
  `vercel.json` still schedules `/api/cron/newsletter-generate` Mon 11:00 and
  Hermes cron `d63180209c04` still drafts a competing issue. That Phase 0 was
  due before 2026-08-24 and is now ten days overdue.
- `NEWSLETTER_AUTONOMOUS` and `CRON_SECRET` in Vercel are still unverified from
  that same handoff.
- The content engine generates LinkedIn TEXT only. The course repo has a
  Playwright card renderer at `social/` (five Board Method cards, four sizes)
  that is not wired to this queue. That is the obvious next build.

### Exact next step
Terry: connect an AI by Design LinkedIn channel in Postiz and give me the Build
Lab date and seat cap. Either one unblocks real work; both together turn the
funnel on. Nothing here is pushed, so review the branch first if you want.


---
## Handoff - 2026-09-04 (Claude, Opus 5) - Build Lab founding cohort

**Active task:** Schedule and build out the Build Lab as a four-week live cohort,
and finish the co-equal-paths repoint of aixdesign.dev.

**Two repos, two branches, NEITHER PUSHED, nothing deployed.**
- `by-design-ai-` -> `feat/board-funnel-and-content` (4 commits)
- `micro-course-saas-template` -> `feat/build-lab-founding-cohort` (2 commits)

### Decisions Terry made
1. Co-equal paths on aixdesign.dev (learn it / hire it). Overrides the old
   documented rule that education is secondary.
2. Build Lab is ONLINE, not in person, and not a webinar.
3. Four-week cohort, not a single session. Nov 18, Dec 2, Dec 9, Dec 16.
4. $997 founding price, up from $497. Eight seats, floor of 4 to run.
5. $997 BUNDLES the course and the Kit, as a pre-work gate.
6. Recording stops before the work block (real revenue is on screen).
7. Async thread between sessions, no SLA. No office hours in the gap week.
8. Post to social as AI by Design. Cris is connecting the Postiz channels.

### Live changes made OUTSIDE git (already in production)
- **Stripe**, live account `acct_1TMjj5CaFl8xeTFM`: created product
  `prod_VCB3xXth71vkTP` "The Build Lab" with price
  `price_1UBmhdCaFl8xeTFM52kUvf8z`, $997 one-time. Verified by read-back.
- **Supabase** `acouuzccqkcpyrckrgwg`, `ccc_lab_sessions` row `founding-run`:
  status `scheduled`, starts_at `2026-11-19 00:00Z` (7pm ET Nov 18), 120 min,
  America/New_York, capacity 8, price wired. Both CHECK constraints passed.
- **Local only:** added `NEXT_PUBLIC_STRIPE_BUILD_LAB_PRICE_ID` to the course
  repo's gitignored `.env.local` for QA. Vercel is a separate store.

### Checks run
- Course repo `npm run check`: truth linter passed (it accepts the date because
  a real row and a real price now back it) + build compiled.
- aixdesign `npm run check`: claim gate 18/18 + build compiled.
- Browser QA, isolated headless Playwright, zero page errors: `/build-lab`
  (renders $997, the four dates, "8 of 8 seats left" counted from the DB, the
  bundle and the recording policy), `/education`, `/education/claude-code`,
  homepage fork at 1440 and 390.
- Checkout: the three-way price assertion has all sides at 99700 (Stripe,
  config, row). Anonymous POST to `/api/build-lab/checkout` returns 401, not the
  503 it returned while unscheduled, so the config and session gates are open.
  NOT verified through a completed authenticated purchase.

### Blockers - Terry only
1. 🔴 **`NEXT_PUBLIC_STRIPE_BUILD_LAB_PRICE_ID` must be set in Vercel** to
   `price_1UBmhdCaFl8xeTFM52kUvf8z`, or the buy button 503s on a page that now
   advertises a date and eight seats.
2. 🔴 **Stripe writes got blocked by the permission classifier** partway through.
   The Kit ($297) and Board Room ($29/mo) prices DO NOT EXIST. Neither blocks
   Nov 18 (both rungs are `available: false`), but "payments for all options"
   is not done.
3. The retired $97 "Claude Code Mastery" price is still ACTIVE and was
   deliberately not archived, since deactivating a live price could break
   something not visible from here. Needs Terry's explicit yes.
4. Postiz still has zero AI by Design channels. Cris is on it. Set
   `POSTIZ_LINKEDIN_ID` once she is done.
5. Verify `NEXT_PUBLIC_STRIPE_PRICE_ID` in Vercel points at the $57 price. It
   is correct locally.

### The number that matters
`bda_subscribers` = 1. `ccc_lab_waitlist` = 0. `course_purchases` = 2, both
internal. There is no audience to launch this cohort to, and the content engine
cannot post until the channels exist. Ten weeks to find four buyers at $997.
**Go / no-go on Oct 21. Floor is 4 paid, not 8. Under 3, move the date.**

### Key artifact
`docs/BUILD-LAB-RUNBOOK.md` in the course repo is the facilitator run book:
the one rule, the four-block session template, all four session plans, show and
tell rotation, recording policy, failure modes, and the ops checklist.

### Still open from earlier handoffs, NOT addressed
- The newsletter cron collision (`/api/cron/newsletter-generate` Mon 11:00 vs
  Hermes cron `d63180209c04`). Phase 0 was due before 2026-08-24.
- `NEWSLETTER_AUTONOMOUS` and `CRON_SECRET` unverified in Vercel.
- Site-wide reduced-motion hydration mismatch in `GoldRule` / `TextReveal`,
  pre-existing, also hits `/coaching` and `/medical`.
- The content engine is LinkedIn text only. The course repo's `social/`
  Playwright card renderer is still not wired to the queue.

### Exact next step
Terry: set the Vercel env var and confirm whether to create the Kit and Board
Room prices. Then the only thing standing between here and a filled cohort is
distribution, which is Cris.


---
## Handoff - 2026-09-04 (Claude, Opus 5) - MERGED AND DEPLOYED

**Everything below is LIVE on aixdesign.dev and runyouraiboard.com.**

### Merged
- aixdesign PR #21 -> `main` (14 commits), plus 3 more pushed to main after.
- course repo PR #2 -> `main` (Build Lab founding cohort).
- Both deployed and verified live.

### What the live site said before this
`aixdesign.dev/education` was selling **"Claude Code Class" at $97**, linking to
claudecodeclass.com, teaching the developer loop, and reporting the Build Lab as
undated. The destination served "My AI Board" at $57. `/coaching` 404'd. The
Board Method guide had never shipped: `/guide` served the June magnet.

### Live now
- Co-equal paths on the homepage, ladder on `/education`, board-path curriculum.
- Build Lab purchasable: $997, Nov 18 / Dec 2 / Dec 9 / Dec 16, 8 seats, course
  and Kit bundled. `/api/build-lab/checkout` returns 401 (needs login) rather
  than 503, so the price wiring is good.
- `NEXT_PUBLIC_STRIPE_BUILD_LAB_PRICE_ID` set in Vercel **production**
  (`price_1UBmhdCaFl8xeTFM52kUvf8z`). Preview did NOT take; add it if preview
  deploys need to sell.
- Confirmed `NEXT_PUBLIC_STRIPE_PRICE_ID` in production = the live $57 price.
  That closes an old open question.

### Funnel, end to end, no gaps
guide -> PDF -> drip 1-6 -> course -> Build Lab -> consulting.
- **Drip extended 4 -> 6 stages** (days 2/4/7/10/14/21). Stage 5 is the Lab,
  stage 6 is the learn-it-or-hire-it fork. All six pass the claim gate.
  ⚠️ Anyone who already finished the old 4-stage sequence will now receive
  stages 5 and 6, since DRIP_TOTAL grew. Harmless at 1 subscriber; remember it
  before importing a list.
- **`public/guide.pdf` replaced.** It was still June's "10 Things In Your
  Business You Should Never Do Manually" while `/guide` sold The Board Method,
  so every new subscriber was promised one guide and emailed another.
- Homepage lead-magnet section, exit-intent modal and `/guide` metadata all
  still named the retired guide. Fixed.
- `/guide` could not capture a lead at all (only CTAs were the course and a
  call), so the drip was reachable only from the homepage. It now offers the PDF
  and the Lab.

### The Board Method PDF
- 7 A4 pages: dark cover, five step pages, closing ladder page. Brand tokens
  exactly (#1E1B17 / #C9A84C / Geist).
- Design canvas: https://claude.ai/code/artifact/0710dcb9-75ca-4be0-87e8-99b2b4a86d02
- Working files in `design/guide-pdf/`. `build.mjs` generates the five step
  artboards from one copy of the content; `render-pdf.mjs` renders them to
  `public/guide.pdf`, so the served file cannot fall behind the design.
  Re-run: `IMG_DIR=<jpgs> node design/guide-pdf/render-pdf.mjs`.
- **No prices or dates anywhere in the PDF**, deliberately. It lives on people's
  disks forever and a downloaded copy cannot be corrected.

### Still blocked - Terry only
1. 🔴 **Postiz has no AI by Design channels.** Cris is connecting them. Then set
   `POSTIZ_LINKEDIN_ID`. Until then nothing can post and the funnel has no
   traffic source.
2. 🔴 **Kit ($297) and Board Room ($29/mo) Stripe prices still do not exist.**
   The permission classifier blocked those writes after the Build Lab price went
   through. Create them in the dashboard or re-authorize.
3. The retired $97 "Claude Code Mastery" price is still ACTIVE and was
   deliberately not archived. Needs an explicit yes.
4. `NEXT_PUBLIC_STRIPE_BUILD_LAB_PRICE_ID` on Vercel **preview**.

### The number that still matters
`bda_subscribers` = 1, `ccc_lab_waitlist` = 0. Ten weeks to Nov 18.
**Go / no-go Oct 21. Floor is 4 paid, not 8. Under 3, move the date.**

### Not addressed, carried forward
- Newsletter cron collision (`/api/cron/newsletter-generate` Mon 11:00 vs Hermes
  cron `d63180209c04`). Overdue since 2026-08-24.
- `NEWSLETTER_AUTONOMOUS` and `CRON_SECRET` unverified in Vercel.
- Site-wide reduced-motion hydration mismatch in `GoldRule` / `TextReveal`.
- Content engine is LinkedIn text only; the course repo's `social/` card
  renderer is still not wired to the queue.
- `docs/social/BOARD-DEMO-RECORDING.md` is the demo recording plan, unrecorded.

### Exact next step
Cris finishes the channels. Everything else is built and live.


---
## Handoff - 2026-09-04 (Claude, Opus 5) - funnel + SEO, all live

Everything below is deployed on aixdesign.dev / runyouraiboard.com. Both repos on
`main`, clean, pushed.

### The funnel, end to end
`/guide` (gated landing page, name + email) -> guide email with the PDF ->
`/guide/thanks` -> 6-stage drip (days 2/4/7/10/14/21) -> course -> Build Lab ->
consulting.

- `/guide` is now a LANDING PAGE, not the guide. No nav, booklet, five bullets,
  form above the fold, four lines on the ladder. The full guide moved to
  `/guide/read`, which is **unlisted (noindex, out of the sitemap), NOT secured**.
- Newsletter signups now enter the drip too. `drip_next_at` is required or the
  cron never selects the row; `ignoreDuplicates: true` so a re-subscribe cannot
  reset someone mid-sequence. Both verified against prod, test rows removed.
- Hero flipped: guide primary, call secondary.

### Assets (all rendered from source, all regenerable)
`design/guide-pdf/` holds the working files and four renderers:
- `build.mjs` -> the five step artboards
- `render-pdf.mjs` -> `public/guide.pdf` (7 pages)
- `render-cover.mjs` -> `public/guide-cover.png`
- `render-mockup.mjs` -> `guide-mockup.png` (cutout) + `guide-mockup-light.jpg`
- `render-og.mjs` -> `public/guide-og.png` (1200x630 social card)
Design canvas: https://claude.ai/code/artifact/0710dcb9-75ca-4be0-87e8-99b2b4a86d02
`scripts/guide-art/render.mjs` renders the five step illustrations (now DARK, so
one set works in the dark email and on the light PDF/web pages).

### Emails
Rebuilt: warm serif stack ('Iowan Old Style', Charter, Georgia) instead of the
Arial/Roboto default, five type sizes, text masthead (images are blocked by
default), cover in the guide email, step illustration on drip stages 1-4.

### SEO
Five new articles as an interlinked cluster, each ending at `/guide`, plus the
pre-existing one. Sitemap now 17 URLs; `/coaching` had shipped in September and
was never listed. GA4 live (G-NC4HE7FP07). `CRON_SECRET` confirmed on Production.

### Stripe (account acct_1TMjj5CaFl8xeTFM)
All five products live, all env vars set on the course project:
course $57, Dev Pack $97 (ON SALE), Build Lab $997 (ON SALE), Kit $297 (held),
Board Room $29/mo (held). "Claude Code Mastery" archived.
Kit is held until its archive is genuinely three months deep (late November);
Board Room until there are customers. Both reasons are in course-config.ts.

### 🔴 Open
1. **Nobody has ever completed a real signup.** `bda_leads` = 0. The form ->
   thanks redirect was verified with a STUBBED api (local RESEND_API_KEY is a
   2-char placeholder), so the live send has never run. Terry is testing this
   himself before driving traffic.
2. `POSTIZ_API_URL` and `POSTIZ_API_KEY` are NOT set on the by-design-ai project.
   `POSTIZ_LINKEDIN_ID` IS set (XdesignAI, `cmtm9stym0ax1lm0yoda64poe`) — Cris
   connected it 2026-09-04. Without the API url+key nothing publishes.
3. No Google site-verification meta; Search Console may not be collecting.
4. The pre-existing post `speed-to-lead-first-automation` claims "up to 21x more
   likely" with no source. The claim gate flags it. Source it or soften it.
5. Build Lab: go/no-go **Oct 21**, floor 4 paid not 8.

### Carried forward, still not addressed
- Newsletter cron collision (`/api/cron/newsletter-generate` Mon 11:00 vs Hermes
  cron `d63180209c04`). Overdue since 2026-08-24.
- `NEWSLETTER_AUTONOMOUS` unverified in Vercel.
- Reduced-motion hydration mismatch in `GoldRule` / `TextReveal` (site-wide,
  pre-existing; the /guide branch one is fixed).
- `docs/social/BOARD-DEMO-RECORDING.md` — the demo recording plan, unrecorded.

### Exact next step
Terry does one real signup at /guide, confirms the email lands and the drip
schedules, then puts the link in his bio and drives traffic.


---
## Handoff — 2026-09-04 23:55 EDT — Build Lab "Five Things" short (TEST RENDER)

- Repo: /Users/terry/code/by-design-ai-  ·  Branch: main
- Project: `video/build-lab-five-things/` (UNTRACKED, uncommitted, not in git)

### Active task
Terry asked for a test render to judge the quality of the newly installed
`heygen-com/hyperframes` skill package, combined with the `aixdesign-five-things-shorts`
skill Hermes wrote. Deliverable: a Build Lab promo.

### What changed
Nothing in the site. One new untracked directory, `video/build-lab-five-things/`:
- `BRIEF.md` — route (product-launch-video), angle, redaction rule, verified-claims list
- `SCRIPT.md` — locked 198-word narration
- `build.mjs` — generates `index.html` from the VO timeline (edit this, not index.html)
- `scripts-build-captions.mjs` — groups whisper word timings into caption cues
- `assets/vo/*.mp3` — 8 ElevenLabs segments, Terry's clone
- `assets/fonts/` — Geist woff2 copied from the repo's own node_modules
- `renders/build-lab-five-things_2026-09-04_23-53-05.mp4` — the deliverable

### Angle
*Five things a real AI board has that a chat window doesn't* — charter, floors, schedule,
archive, meeting. The Build Lab is the last eight seconds; the board is the video. This
follows `docs/social/BUILD-LAB-REEL.md`'s reasoning: the Lab has no app, so filming the
sales page would just be an ad.

### 🔴 Redaction — how it was handled
`crcst-beta/docs/business/ceo/` was NOT filmed. Every file frame is a brand-styled
recreation. Where the narration says "real numbers," the frame shows the metric LABELS
with the VALUES covered by gold redaction bars — truthful, and no real figure, customer
or dollar amount is in the file.

### Verified claims (all re-checked 2026-09-04, sources in BRIEF.md)
4 sessions Nov 18 / Dec 2 / Dec 9 / Dec 16 · capacity 8 · 14 meetings since June ·
weekly cadence · Thanksgiving week skipped · runyouraiboard.com/build-lab returns 200.
No price, no seat-scarcity count, no outcome promise — per the five-things quality gate.

### Checks run — exact results
- `npx hyperframes check` — **passed**. Lint 0 errors / 2 warnings (file length, track
  density — both structural, accepted). Runtime, Layout, Motion, Contrast: 0 errors.
- Final MP4 probed: 1080x1920, 30fps, H.264 High, 67.0s, AAC 48kHz stereo.
- Audio: **-13.8 LUFS** integrated (spec ~-14), true peak **-1.0 dBFS** (spec says
  *below* -1.0 — it is AT the ceiling, not under it).
- Six frames extracted from the rendered file (not the composition) and eyeballed.

### Decisions
- Rendered at `--video-bitrate 14M`; the default pass came out at 705 kbps, which would
  band on the espresso gradient.
- VO segmented per beat so caption timing comes from real word timestamps.
- Motion follows `motion-doctrine`: LEFT current on the five list seams, an UP seam into
  the recap (chapter boundary), an inverse-zoom arrival into the CTA. Seams hand-authored
  to the vector law; the `seam-gate.mjs` verifier was NOT run.

### Blockers / open
1. **No music bed.** The five-things spec wants a minimal electronic pulse 10-16 dB under
   the voice. Skipped rather than ship an unlicensed or AI-slop track. `/media-use` can
   source one.
2. **True peak is -1.0, not below it.** Platforms accept this as the ceiling; a limiter
   pass would fix it properly.
3. **A few caption phrase breaks are awkward** ("run dated on disk.") — an artifact of the
   5-word cap on whisper groupings, not of the narration.
4. Nothing is committed. Decide whether `video/` belongs in this repo or in its own.

### Exact next step
Terry watches the MP4 (Taildropped to iphone172, exit 0, delivery confirmed against
`tailscale status`) and says whether the quality clears the bar. If yes: add a music bed,
then decide if this replaces or supplements the crcst feature-reel pipeline for AI by
Design content.


<!-- AUTO-STATE (regenerated by claude_handoff.sh — safe to ignore, safe to delete) -->

_Current repo state, refreshed automatically. This block is replaced, never appended —
it is not a handoff. Real checkpoints live above, newest first._

- Updated: 2026-09-05 12:26:55 EDT
- Branch: main
- Last commit: 9122c17 docs(social): fix the meeting count in the narration itself
- Working tree: 19 uncommitted file(s)

<!-- END AUTO-STATE -->
