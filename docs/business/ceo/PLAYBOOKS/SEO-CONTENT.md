# Playbook — SEO Content (the compounding channel)

> How the CEO produces top-tier SEO content for AI by Design. Two engines: **blog articles** (from
> the brand pillars) and **programmatic landing pages** (industry × bottleneck). Both ship as PRs.

## Why this is the priority
SEO content is the durable, low-CAC demand source: it compounds, costs no media spend, and each
piece doubles as social fuel. Aim every page at one job — **book a discovery call**.

---

## Engine A — Blog / resources hub
Source the topics from the 4 content pillars (`docs/BRAND-KIT.md §9`):
1. **Bottleneck teardowns** — "Here's where this kind of business leaks time, and the lean system that fixes it."
2. **Build-in-public** — "Watch us ship the custom solution" (the tool we picked and *why*).
3. **Primitives** — reusable prompts, AI workflows, automation recipes. "Steal this."
4. **Proof & principles** — permissioned client outcomes + the operating-system thinking.

**Per article:**
- One primary long-tail keyword + 2–3 secondary (intent: an owner with this bottleneck searching for help).
- Title + meta description; H1 matches search intent; scannable H2s; one clear discovery-call CTA.
- 800–1,500 words, builder voice, concrete (screenshots/steps), no fluff, no unprovable claims.
- Internal links to `/guide`, `/intake`, and related articles. Add to `app/sitemap.ts`.
- Repurpose into ≥2 social posts (drafted to `CONTENT-QUEUE.md`).

## Engine B — Programmatic landing pages (industry × bottleneck)
The "certification desert" playbook applied to AI: a page per **{audience} × {bottleneck}** that the
right buyer is literally searching for.
- Examples: "AI automation for clinics — stop drowning in admin", "Lead-follow-up automation for
  agencies", "AI systems for coaches running everything in their head", "Automated reporting for
  small teams".
- Each: keyword-aligned H1, the specific pain, the lean system that fixes it, proof slot, FAQ
  (with FAQPage JSON-LD when added), one discovery-call CTA.
- Keep a shared template/component so new pages are cheap to add; list them in the sitemap.
- Pull the **real** industry/bottleneck mix from `metrics-queries.sql` query #5 to prioritise pages
  that match actual intake demand.

---

## Quality + guardrails (every page)
- [ ] Targets a real search intent; title/meta/H1 aligned.
- [ ] One job: book a discovery call. Clear single CTA.
- [ ] Builder voice (`BRAND-KIT.md §2`); banned words avoided.
- [ ] **No results/outcome claims we can't show. No leading with a tool name.**
- [ ] No real client data without written permission.
- [ ] Added to `app/sitemap.ts`; canonical set; internally linked.
- [ ] Repurposed to social (drafted to queue).

## How it ships
Open a **PR** per article/page cluster using `CONTENT-PR.md`. At L1 the CEO opens the PR; the
Chairman reviews + merges. Track each in `DECISION-LOG.md` (Type: Content) and against OKR3.
