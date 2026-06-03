# Decisions

Record important product, technical, and execution decisions here.

## Product Brief

**What are we building?**
By Design AI — a specialist Go High Level agency site. The site profiles GHL setup/management, automation builds, and custom AI OS/workflow services. The primary conversion goal is booking a free discovery call.

**Who is it for?**
Agencies reselling GHL. Coaches and consultants on GHL. Local service businesses. Marketing teams with broken GHL setups. Businesses wanting AI layered into GHL.

**What does success look like?**
A visitor lands on the site, understands immediately that this is a GHL specialist agency, sees the services clearly, and books a free 30-minute discovery call. No payment friction at the point of entry — the CTA is always "Book a Discovery Call."

**Services offered:**
- GHL Account Setup & Configuration
- Snapshot Development & Deployment
- Automation & Workflow Builds
- AI-Powered Campaign Systems
- Custom Integrations (Make.com, n8n, Zapier, Stripe, webhooks)
- Ongoing GHL Management Retainer

**Primary CTA:** Book a Discovery Call (calendar link — set in lib/cta.ts)

**Core stack:** Go High Level · Make.com · n8n · OpenAI · Stripe · Twilio · Google Workspace · Custom Webhooks

**Repositioned from:** North Star Personal OS ($2,500 paid checkout) → GHL Agency (free discovery call lead gen)

**Date:** 2026-05-25

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
- Primary handle: `@bydesignai` (claim on every platform; fallbacks documented).
- Display name: **By Design AI** everywhere.
- Tagline (primary): *Stop learning about AI. Start running on it.*
- Brand pair: gold `#C9A84C` on background `#1E1B17`; Geist Sans.
- Domain / brand email: `aixdesign.dev` / `hello@aixdesign.dev`.
- Content pillars: build-in-public, teardowns, primitives, proof (2·1·2·1/wk).
- Every post ends with one of two CTAs: free guide (soft) or Book a 30-min
  discovery call (hard).
- All social links must use the UTM convention defined in §10 so the
  Supabase `leads` table can attribute source.

Open follow-ups (also tracked in BRAND-KIT §13):
- Build `/links` page on aixdesign.dev as the link-in-bio hub.
- Drop logo SVGs + OG image into `public/brand/`.
- Wire Calendly webhook to tag GHL contact with `source:{utm_source}`.
