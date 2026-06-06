# AI by Design — AI CEO

An in-repo, recurring AI partner that runs the growth plan, advises the Chairman (the owner), and
earns more responsibility over time. **Automation is not switched on** — the Chairman triggers a
run each week. The CEO advises; the Chairman decides on money, vision, and anything irreversible.

## Current setup
- **Rank:** L1 — Operator (drafts + content PRs + advice; no spend, no external sends)
- **Cadence:** weekly (one board meeting)
- **Comms:** Chairman only (no VA/Resend yet — unlocked by promotion)
- **Promoter:** the Chairman, sole authority (`PROMOTION-LADDER.md`)
- **North-star metric:** qualified discovery calls booked / month → closed engagements

## Files
| File | Purpose |
|---|---|
| [`CHAIRMAN-NOTES.md`](./CHAIRMAN-NOTES.md) | **Your inbox to the CEO** — ideas, direction, financials, promotions; read first each run |
| [`CHARTER.md`](./CHARTER.md) | Identity, mandate, **decision rights**, **guardrails** |
| [`PROMOTION-LADDER.md`](./PROMOTION-LADDER.md) | The CEO's own goals + how he earns L2→L4 |
| [`OKRS.md`](./OKRS.md) | Quarterly objectives + key results |
| [`METRICS-SNAPSHOT.md`](./METRICS-SNAPSHOT.md) | The numbers he reasons over |
| [`METRICS-SOURCES.md`](./METRICS-SOURCES.md) | Where each number comes from (Supabase/GA4) + read-only safety |
| [`metrics-queries.sql`](./metrics-queries.sql) | **Read-only** query pack the CEO runs against the `bda_*` Supabase tables |
| [`DECISION-LOG.md`](./DECISION-LOG.md) | Track record + audit trail |
| [`CONTENT-QUEUE.md`](./CONTENT-QUEUE.md) | Drafts awaiting Chairman approval to send/post |
| [`BOARD-MEETINGS/`](./BOARD-MEETINGS/) | Weekly board reports (`TEMPLATE.md`) |
| [`PLAYBOOKS/`](./PLAYBOOKS/) | SOPs: weekly meeting, SEO content, content PRs |

## How to run a weekly board meeting
Start a session and paste:

> **You are the AI by Design AI CEO.** Read `docs/business/ceo/CHAIRMAN-NOTES.md` first (act on
> my open items), then `CHARTER.md` and `PROMOTION-LADDER.md`, then run
> `docs/business/ceo/PLAYBOOKS/WEEKLY-BOARD-MEETING.md` end to end. Operate at **L1**: draft and
> open content PRs (prioritise SEO), but do not spend, post, or email externally — put those as
> recommendations in your board report. Update the `ceo/` files, file this week's report in
> `BOARD-MEETINGS/`, log decisions, and end with a clear "Asks for the Chairman" list.

**To give the CEO ideas or change direction anytime:** add them to `CHAIRMAN-NOTES.md` — it's read
first on every run.

**Metrics:** the funnel lives in Supabase tables `bda_leads`, `bda_bookings`, `bda_intake`. Wire the
Supabase MCP **read-only** (pin the project ref + `--read-only`) and the CEO refreshes
`METRICS-SNAPSHOT.md` itself via `metrics-queries.sql`. Traffic comes from **GA4** (now wired on the
site) via the Analytics/Supermetrics MCP. Revenue $ (closed engagements) is manual until tracked —
the CEO will flag that gap.

## To promote him later
Review his `DECISION-LOG.md` track record against `PROMOTION-LADDER.md`. If criteria are met,
update his rank in `CHARTER.md §1` and expand the §4 decision-rights table. To wire L2 powers
(Resend to VAs, scheduled runs via Postiz, scheduled weekly runs), that's a separate build — ask
and I'll scope it.

> **Reality note:** this is a disciplined operating system, not magic. The CEO is only as good as
> the metrics you feed it and the judgment you apply to its recommendations. Start by trusting it
> with low-risk work (content, drafts, analysis) and expand the mandate as it proves itself.
