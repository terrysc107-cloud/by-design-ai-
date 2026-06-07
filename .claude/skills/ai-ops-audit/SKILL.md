---
name: ai-ops-audit
description: >
  Run a revenue-ranked AI operations audit on a business's workflows and tool
  stack. Use when a prospect or client describes their operations, lists their
  tools, or asks where AI/automation could save time or money — or when the
  user wants to productize the By Design AI "AI Ops Audit" ($2,500) offer.
  Triggers on a described business process, a tool/SaaS list, "where can AI
  help us," "audit our operations," or a discovery-call transcript. Produces a
  scored audit of automation opportunities ranked by ROI, an effort/impact
  map, and a scoped recommendation that feeds proposal-builder. Diagnoses and
  scopes — it does not build the automations.
---

# AI Ops Audit Skill

## Purpose
This is the productized version of the By Design AI flagship paid offer.
Input: how a business currently operates (workflows, tools, headcount,
volume, pain). Output: a ranked map of where AI/automation creates ROI, scoped
into a sellable engagement. This is the skill that justifies the price tag —
treat the output as a client deliverable, not a chat answer.

Output four blocks:
1. CURRENT-STATE MAP — how work flows today, where time/money leaks
2. OPPORTUNITY LEDGER — automation candidates, ranked by ROI
3. EFFORT/IMPACT MATRIX — what to do first, next, later
4. SCOPED RECOMMENDATION — the engagement to sell, handed to proposal-builder

## Operating Rules
- **Quantify everything in hours and dollars.** "Saves ~6 hrs/week" and
  "~$X/mo in labor" beat "improves efficiency." If the user didn't give
  numbers, ask for the 3 that matter (see Intake) or state assumptions.
- **Rank by ROI, not by coolness.** The flashiest AI use is rarely the
  highest-return one. Boring, high-frequency, repetitive tasks win.
- **Diagnose and scope only.** Name what to build and what it returns. The
  actual build is the paid engagement (and goes through automation-blueprint
  + Claude Code), never given away here.
- **Second-order effects.** Flag where automating one step shifts load
  downstream, creates a new failure point, or requires a human checkpoint.
- **Name the delivery-risk.** For each recommendation, mark whether the
  client operates it or the consultant is on the hook. Prefer client-operated
  systems — sell architecture, not availability.

## Intake (ask only what's missing)
Three numbers unlock the whole audit. Get them or assume + flag:
1. **Volume** — how many times does this process run? (per day/week/month)
2. **Time** — how long does each run take, and who does it?
3. **Cost of error/delay** — what does a mistake or a slow response cost?

Plus: current tools/SaaS in use, team size, and the single most painful
recurring task.

## Step 1 — CURRENT-STATE MAP
Lay out the workflow as it runs today: trigger → steps → tools → who does it →
output. Mark each step:
- 🟥 LEAK — manual, repetitive, error-prone, or slow
- 🟨 PARTIAL — semi-automated, brittle, or tool-fragmented
- 🟩 SOLID — leave it alone
End with the single biggest leak in hours/$ terms.

## Step 2 — OPPORTUNITY LEDGER
For each automation candidate, one row:
- **Task** — what gets automated
- **Trigger → Action** — plain-language flow
- **Returns** — hours/week + $/mo saved (or revenue/risk recovered)
- **AI role** — classify / draft / extract / route / monitor / decide
- **Who operates it** — client / consultant
Rank top to bottom by ROI.

## Step 3 — EFFORT/IMPACT MATRIX
Place each candidate:
- **Quick wins** (low effort, high impact) → do first, prove value fast
- **Anchor builds** (high effort, high impact) → the core engagement
- **Fill-ins** (low effort, low impact) → bundle or skip
- **Traps** (high effort, low impact) → decline, even if asked
The quick win is your entry hook. The anchor build is the real money.

## Step 4 — SCOPED RECOMMENDATION
Translate the matrix into a sellable engagement mapped to BDA offers:
- **AI Ops Audit ($2,500)** — this deliverable itself; the diagnostic.
- **90-Day AI Integration ($10K)** — the anchor build(s) delivered.
- **Inner Circle retainer ($2,500/mo)** — monitoring + iteration; justified
  only if there's a system worth watching (see client-dashboard / system-monitor).
Output: recommended tier, what it includes, the ROI math that justifies the
price, and the entry hook to start small. Hand all of this to proposal-builder.

## Practice Mode (default ON)
Close with 2-4 lines:
- The highest-ROI pattern this business revealed (reusable across clients).
- Whether this should be sold as audit-only, full build, or retainer — and why.
