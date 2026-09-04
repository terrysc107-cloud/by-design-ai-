
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


<!-- AUTO-STATE (regenerated by claude_handoff.sh — safe to ignore, safe to delete) -->

_Current repo state, refreshed automatically. This block is replaced, never appended —
it is not a handoff. Real checkpoints live above, newest first._

- Updated: 2026-09-03 21:39:45 EDT
- Branch: feat/board-funnel-and-content
- Last commit: 08c0411 docs: handoff checkpoint for the board funnel work
- Working tree: clean

<!-- END AUTO-STATE -->
