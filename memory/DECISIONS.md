# Decisions

Record important product, technical, and execution decisions here.

## Product Brief

**What are we building?**
By Design AI — an AI business coaching & consulting agency. We diagnose the bottleneck in an owner's business, design the right system, and ship a lean, autonomous custom solution. The primary conversion goal is booking a free discovery call.

**Who is it for?**
Business owners, operators, and small teams (2–20 people) drowning in tools, tabs, and tasks that don't add up to outcomes. Coaches, consultants, and service founders running everything in their head. Operators inheriting a half-built stack who need a sane operating system, not more software. Agencies and creators who want AI-powered leverage without hiring.

**What does success look like?**
A visitor lands on the site, understands immediately that this is an AI coaching & consulting agency that ships *lean, autonomous, custom solutions* (not a tool-reseller or course), sees the offer shape clearly, and books a free 30-minute discovery call. No payment friction at the point of entry — the CTA is always "Book a Discovery Call."

**Offer shape:**
- AI Coaching (1:1 and team)
- Consulting (diagnostic engagements)
- Custom Solution Builds (automations, AI workflows, integrations, internal tools)
- Operating Partner / Retainer (we run, tune, and grow the system)

**Toolbox (we use what fits — we are NOT a tool-led shop):**
Go High Level is one tool among many. The full toolbox: OpenAI / Claude, Make.com, n8n, Zapier, GHL, Stripe, Twilio, Supabase, Notion, Airtable, Google Workspace, and custom Node / Next.js when nothing off-the-shelf works.

**Hard rule:** Never lead a bio, post, page, or pitch with "GHL specialist" or any other tool name. Lead with the *problem we solve* and the *outcome*. Mention tools only when they're relevant to the example.

**Primary CTA:** Book a Discovery Call (calendar link — set in lib/cta.ts)

**Core stack:** Go High Level · Make.com · n8n · OpenAI · Stripe · Twilio · Google Workspace · Custom Webhooks

**Repositioned from:** North Star Personal OS ($2,500 paid checkout) → GHL Agency (free discovery call lead gen) → AI Business Coaching & Consulting Agency (tool-agnostic; GHL is one tool, not the identity)

**Date:** 2026-05-25 (last repositioning: 2026-06-03)

## Resend Email Integration

**Date:** 2026-05-30

Wired Resend into the lead magnet flow (`/api/lead`). On submit, the route now:
1. Sends the lead a branded "here's your guide" email (link to `/guide` + discovery-call CTA) — this is the hard promise, so a send failure returns an error to the form.
2. Sends the owner a best-effort new-lead notification (reply-to = lead's email).

- Helper: `lib/resend.ts` (lazy client, FROM_EMAIL / LEAD_NOTIFY_EMAIL / SITE_URL config)
- Templates: `lib/emails.ts` (`guideEmail`, `leadNotifyEmail`)
- Env vars: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `LEAD_NOTIFY_EMAIL` (documented in README §3 / §5b)
- Sender domain must be verified in Resend; falls back to `onboarding@resend.dev` for testing.

## Brand Kit

**Date:** 2026-06-03

Established the brand kit as the single source of truth for identity, voice,
visual system, and social setup. Lives at `docs/BRAND-KIT.md`.

Key decisions captured:
- Positioning: **AI business coaching & consulting agency** shipping lean,
  autonomous, custom solutions. Tool-agnostic. GHL is one tool, not the
  identity — never lead with it.
- Primary handle: `@bydesignai` (claim on every platform; fallbacks documented).
- Display name: **By Design AI** everywhere.
- Tagline (primary): *Stop learning about AI. Start running on it.*
- Brand pair: gold `#C9A84C` on background `#1E1B17`; Geist Sans.
- Domain / brand email: `aixdesign.dev` / `hello@aixdesign.dev`.
- Offer shape: Coaching · Consulting · Custom Builds · Operating Partner
  (retainer).
- Content pillars: bottleneck teardowns, build-in-public, primitives,
  proof & principles (2·1·2·1/wk).
- Every post ends with one of two CTAs: free guide (soft) or Book a 30-min
  discovery call (hard).
- All social links must use the UTM convention defined in §10 so the
  Supabase `leads` table can attribute source.

Open follow-ups (also tracked in BRAND-KIT §13):
- Build `/links` page on aixdesign.dev as the link-in-bio hub.
- Drop logo SVGs + OG image into `public/brand/`.
- Wire Calendly webhook to tag GHL contact with `source:{utm_source}`.
