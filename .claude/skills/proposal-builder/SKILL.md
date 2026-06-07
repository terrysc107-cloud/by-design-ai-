---
name: proposal-builder
description: >
  Turn audit findings or scoped recommendations into a branded, client-ready
  proposal with scope, tiers, pricing, and a close. Use after running
  ai-ops-audit or site-audit, or when the user says "write the proposal,"
  "scope this engagement," "send them a quote," or has discovery notes that
  need to become a sellable document. Produces a plain, clean, copy-paste-ready
  proposal (Google Docs / DocuSign optimized) under the By Design AI or Scott
  Advisory Group brand. Closes on the problem and ROI before the price — never
  leads with the number.
---

# Proposal Builder Skill

## Purpose
Compress the slowest step in the sales cycle: turning a diagnosis into a
document a client can say yes to. Input: audit output, discovery notes, or a
scoped recommendation. Output: a proposal that sells the outcome, justifies the
price with the prospect's own numbers, and makes signing the easy next step.

## Operating Rules
- **Sell the outcome, not the deliverable.** "Recover ~6 hrs/week and stop
  losing leads" beats "build an n8n workflow." Lead with their result.
- **Price is justified, never asserted.** Anchor every price to the ROI math
  from the audit. The number should feel small next to what it returns.
- **Problem before price.** Structure the doc so they're nodding at the cost
  of the problem before they see the fee.
- **Tier to create a choice between yeses, not yes/no.** Three tiers; the
  middle is the target, the top makes the middle look reasonable, the bottom
  is the foot-in-the-door.
- **One clear next action.** End with a single signable/bookable step, not
  "let me know your thoughts."
- **Formatting:** plain, clean, no decorative styling or colored cells.
  Optimized for paste into Google Docs or DocuSign. Natural, human, direct
  language — formal but conversational, zero AI-sounding filler.

## Brand Resolution (ask if unclear)
- **By Design AI** — AI ops / automation / integration work. Dark/purple/orange
  aesthetic in design assets; proposal copy stays clean text.
- **Scott Advisory Group (SAG)** — executive advisory, litigation support,
  expert-witness work.
Pick the brand that matches the service before drafting.

## Proposal Structure
1. **Title + one-line outcome** — "[Client]: [the result they get]"
2. **The situation** — 2-3 sentences mirroring their words back. Proves you
   listened. No selling yet.
3. **What it's costing** — the leak in hours/$/risk, using their own numbers
   from the audit. This is the section that sells.
4. **The approach** — what gets built/done, in plain outcomes. Enough to show
   competence, not enough to hand over the how for free.
5. **Tiers** — three options, scoped and priced:
   - **Entry** — the quick win / audit. Low friction, lands the relationship.
   - **Core** (target) — the anchor build. Maps to the main ROI.
   - **Ongoing** — retainer for monitoring/iteration, if a system warrants it.
   For each: what's included, timeline, price, and the outcome it returns.
6. **Why this works / why me** — short. The operator credibility line
   ("I run multiple businesses on AI systems I built myself"), one relevant
   proof point. Not a resume.
7. **Next step** — single action: book the kickoff via [BDA_BOOKING_LINK] or
   sign to start. Scheduling routes through By Design AI — do not create
   calendar events here.

## Pricing Logic
- Anchor to ROI: if the build returns $X/mo, the fee is a fraction of the
  first-year return. Show that math.
- BDA reference points: AI Ops Audit $2,500 / 90-Day Integration $10K /
  Inner Circle $2,500-mo. Adjust to the audit, don't just paste defaults.
- Nonprofit/SMB low-budget: flat project fee (committee-approvable) or
  pro-bono-for-testimonial when the logo/case study outvalues the fee.
- Never quote a price without the problem-cost section above it.

## Output
A clean proposal as copy-paste text by default. Offer a .docx version only if
the user signals a formal/sendable deliverable (then route through the docx
skill via Claude Code).

## Practice Mode (default ON)
Close with 2-4 lines:
- Whether the pricing anchored strongly to ROI or leaned on default numbers.
- One way to tighten the close on the next proposal.
