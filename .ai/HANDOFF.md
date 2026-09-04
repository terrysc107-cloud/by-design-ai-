
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

<!-- AUTO-STATE (regenerated by claude_handoff.sh — safe to ignore, safe to delete) -->

_Current repo state, refreshed automatically. This block is replaced, never appended —
it is not a handoff. Real checkpoints live above, newest first._

- Updated: 2026-09-03 21:16:18 EDT
- Branch: feat/coaching-and-intel
- Last commit: 1873cf1 feat(funnel): repoint to runyouraiboard.com, sync brand, illustrate the guide
- Working tree: 1 uncommitted file(s)

<!-- END AUTO-STATE -->
