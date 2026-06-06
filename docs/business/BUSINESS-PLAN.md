# AI by Design — Business Plan

> The economic model the CEO steers toward. Targets are starter drafts — Chairman edits to reality.
> Source of truth for positioning/voice: `docs/BRAND-KIT.md`. Source of truth for funnel mechanics:
> `README.md` + `memory/DECISIONS.md`.

---

## 1. What the business is
AI by Design is an **AI business coaching & consulting agency**. We diagnose the bottleneck, design
the system, and ship a lean, autonomous custom solution — tool-agnostic, outcome-led. The only
front-door conversion is a **free discovery call**.

## 2. Offer ladder (revenue lines)
| Offer | Shape | Pricing model | Role in the model |
|---|---|---|---|
| **AI Coaching** | 1:1 / team sessions | per-session or package | low-friction entry; cash now |
| **Consulting** | diagnostic engagement | fixed fee | scopes the build; qualifies fit |
| **Custom Solution Build** | automations / AI workflows / internal tools | fixed project fee | the core deliverable |
| **Operating Partner (Retainer)** | we run + tune + grow the system | monthly recurring | **the asset** — predictable MRR, enterprise value |

> *Chairman to set the actual numbers.* Placeholder framing: builds are project-priced to scope;
> retainers are the strategic goal because recurring revenue is what makes the business sellable.

## 3. The funnel (already built)
Visitor → `/guide` lead magnet → Resend 4-email nurture → **Book a discovery call** (Calendly) →
`/intake` (AI-reviewed prep) → call → proposal → engagement. Instrumented with GA4 + Meta Pixel
conversion events. See `README.md` for the technical flow.

## 4. Unit economics (fill once data exists)
```
Booked pipeline   = discovery_calls × close_rate × avg_engagement_value
Recurring (MRR)   = active_retainers × avg_retainer_price
CAC               = channel spend ÷ engagements closed (per channel)
Gross margin      = revenue − variable platform − ad spend
```
- Primary cost base is **owner time** + a light platform stack (Supabase, Vercel, Resend, OpenAI,
  Postiz, domain). Low fixed cost → high margin once demand is flowing.

## 5. Go-to-market priority (low-CAC first)
1. **SEO content** — blog + programmatic (industry × bottleneck) pages. Compounding, durable, $0 media.
2. **Organic social** — repurpose the content; build-in-public + teardowns (`BRAND-KIT.md §9`).
3. **Direct outreach** — targeted, personal, to ideal-fit owners/operators.
4. **Paid** — only after the funnel converts organically; Pixel + retargeting already wired.

## 6. North-star + supporting metrics
- **North star:** qualified **discovery calls booked / month** → **engagements closed**.
- Supporting: leads captured, lead→booking %, intake-completion %, organic sessions, retainer MRR.

## 7. Targets (Chairman edits)
| Horizon | Target |
|---|---|
| Launch quarter (Jun–Sep 2026) | First 5 calls → first paid engagement → first retainer |
| +6 months | Repeatable inbound (SEO ranking), 2–3 active retainers |
| +12 months | Owner-light demand gen; predictable MRR book |
