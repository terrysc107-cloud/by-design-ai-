# AI by Design — Business Operating System

This folder is the **business brain** for AI by Design (`aixdesign.dev`): the strategy, the AI CEO
that runs the growth plan weekly, and the content engine. It's modeled on the proven SPD/ATS board
and adapted for an AI coaching & consulting agency.

## Structure
| Path | What it is |
|---|---|
| `BUSINESS-PLAN.md` | The economic model — offers, funnel, unit economics, targets |
| `GROWTH-TO-EXIT-ROADMAP.md` | Phased path launch → owner-light/sellable; current phase + gates |
| `ceo/` | The **AI CEO**: charter, OKRs, metrics, decision log, board meetings, playbooks |
| `cmo/` | The **content engine** output (SEO articles, social, assets) |

## The two loops
1. **Weekly CEO board meeting** — the CEO reads `ceo/CHAIRMAN-NOTES.md`, grounds in the charter +
   OKRs, reads the metrics, picks the top 3 moves, opens content PRs, drafts posts to the queue, and
   files a board report with clear asks. Start it with the prompt in `ceo/README.md`. **L1 = drafts
   + PRs + advice only; no spend or external sends.**
2. **Content production** — SEO blog + programmatic pages (the compounding channel), repurposed to
   social and scheduled via Postiz. See `ceo/PLAYBOOKS/SEO-CONTENT.md`.

## Quick start (Chairman)
1. Fill the seed facts in `ceo/CHAIRMAN-NOTES.md` (Supabase project ref, GA4 ID, close rate, priority audience).
2. Wire the Supabase MCP **read-only** + GA4 read access so the CEO can refresh metrics itself.
3. Run the first weekly board meeting (prompt in `ceo/README.md`).
4. Review its board report + "Asks for the Chairman," approve what you like, and let it compound.

> Guardrails live in `ceo/CHARTER.md §5`: never claim a result we can't show · never lead with a
> tool name · no client data without written permission · no spend/sends at L1.
