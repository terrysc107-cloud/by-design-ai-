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
