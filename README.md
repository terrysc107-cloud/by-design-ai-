# By Design AI

AI automation agency landing page + lead funnel. Built with Next.js 14 App
Router, Resend (transactional + nurture email), Supabase (lead/booking storage),
Stripe Checkout, Framer Motion, and Lenis smooth scroll.

---

## 1. Project Overview

A dark, luxury landing page for By Design AI (aixdesign.dev). The funnel:

1. Visitor downloads the free guide via the lead magnet form.
2. They instantly receive the guide PDF by email (Resend) and are stored in
   Supabase, enrolled in a 4-email nurture drip.
3. The drip nurtures them toward booking a free discovery call.
4. When they book via Calendly, a webhook logs the booking and emails the owner.

All emails are sent as HTML (with plain-text fallbacks).

---

## 2. Local Setup

```bash
git clone <repo-url>
cd by-design-ai-

npm install

cp .env.example .env.local
# Fill in all values in .env.local (see Section 3)

npm run dev
# Open http://localhost:3000
```

---

## 3. Environment Variables

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...` / `sk_live_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_test_...` / `pk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret — see Section 4 |
| `JOTFORM_WEBHOOK_URL` | Jotform webhook submission URL — see Section 5 |
| `RESEND_API_KEY` | Resend API key (`re_...`) — powers all email. See Section 5b |
| `RESEND_FROM_EMAIL` | Verified sender, e.g. `By Design AI <hello@aixdesign.dev>`. Defaults to `onboarding@resend.dev` for testing |
| `LEAD_NOTIFY_EMAIL` | Inbox for new-lead + booking alerts. Defaults to `terrysc107@gmail.com` |
| `SUPABASE_URL` | Supabase project URL (`https://acouuzccqkcpyrckrgwg.supabase.co`). See Section 5c |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase **service-role** key (server-only secret, bypasses RLS). See Section 5c |
| `CRON_SECRET` | Random string protecting the drip cron endpoint. See Section 5d |
| `CALENDLY_WEBHOOK_SIGNING_KEY` | Calendly webhook signing key (recommended). See Section 5e |
| `GUIDE_PDF_URL` | Optional override for the guide PDF. Defaults to `<NEXT_PUBLIC_SITE_URL>/guide.pdf` |
| `NEXT_PUBLIC_SITE_URL` | Full site URL, no trailing slash. Local: `http://localhost:3000`. Prod: `https://aixdesign.dev` |

**Never commit `.env.local`.** It is gitignored.

---

## 4. Stripe Setup

1. [Stripe Dashboard](https://dashboard.stripe.com) → **Developers → API Keys**.
2. Copy **Secret key** → `STRIPE_SECRET_KEY`, **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. Local webhook: `stripe listen --forward-to localhost:3000/api/webhook` → copy the `whsec_...` → `STRIPE_WEBHOOK_SECRET`.
4. Production webhook: **Developers → Webhooks → Add Endpoint** → `https://aixdesign.dev/api/webhook`, event `checkout.session.completed` → copy the signing secret to Vercel.

---

## 5. Jotform Webhook Setup

1. [Jotform](https://jotform.com) → your form → **Settings → Integrations → Webhooks**.
2. Add your webhook URL → copy it to `JOTFORM_WEBHOOK_URL`.

The webhook fires after every successful Stripe payment.

---

## 5b. Resend Setup (All Email)

Resend powers the guide delivery, the 4-email nurture drip, and owner
notifications. All emails are sent as HTML with plain-text fallbacks.

1. Sign up at [resend.com](https://resend.com) → **API Keys → Create API Key** → `RESEND_API_KEY`.
2. **Domains → Add Domain** → `aixdesign.dev`, add the DNS records (auto-configured if your DNS is on Vercel).
3. Once **Verified**, set `RESEND_FROM_EMAIL` to `By Design AI <hello@aixdesign.dev>`.
4. Set `LEAD_NOTIFY_EMAIL` to where you want lead/booking alerts.

> Until the domain is verified, leave `RESEND_FROM_EMAIL` unset — it falls back
> to `onboarding@resend.dev`, which only delivers to your own account email.

---

## 5c. Supabase Setup (Lead & Booking Storage)

Leads and bookings live in Supabase (project `supabase-crimson-ladder`, tables
`bda_leads` and `bda_bookings`, RLS enabled with no public policies — only the
server's service-role key can access them).

1. Supabase dashboard → **Project Settings → API**.
2. Copy the **Project URL** → `SUPABASE_URL`.
3. Copy the **`service_role`** secret key → `SUPABASE_SERVICE_ROLE_KEY`.

> The service-role key bypasses Row Level Security and is used only in server-side
> API routes — never exposed to the browser.

View/export leads any time: **Table Editor → bda_leads**.

---

## 5d. Drip Nurture Sequence

After downloading the guide, a lead is enrolled in a 4-email nurture sequence
sent by a daily cron (`/api/cron/drip`, scheduled in `vercel.json`):

| When | Email |
|------|-------|
| Day 0 | Guide delivery (PDF) |
| Day 2 | What AI actually does for your business |
| Day 4 | The first thing you should automate |
| Day 7 | A workflow that books calls while you sleep |
| Day 10 | Want me to build one for you? (book a call) |

Every drip email has a one-click unsubscribe link (`/api/unsubscribe`) and a
`List-Unsubscribe` header.

**Setup:** set `CRON_SECRET` to any random string in Vercel. Vercel Cron sends it
automatically as a Bearer token; the endpoint rejects anything else. Test
manually with `GET /api/cron/drip?secret=<CRON_SECRET>`.

---

## 5e. Calendly Webhook (Booking Alerts)

When someone books a call, Calendly POSTs to `/api/calendly`, which logs the
booking to `bda_bookings` and emails you (`LEAD_NOTIFY_EMAIL`).

1. Get a Calendly **Personal Access Token** (Integrations → API & Webhooks; webhooks require a paid Calendly plan).
2. Create a webhook subscription:
   ```bash
   curl -X POST https://api.calendly.com/webhook_subscriptions \
     -H "Authorization: Bearer <YOUR_CALENDLY_TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{
       "url": "https://aixdesign.dev/api/calendly",
       "events": ["invitee.created", "invitee.canceled"],
       "organization": "<YOUR_ORG_URI>",
       "scope": "organization"
     }'
   ```
3. The response includes a **signing key** → set it as `CALENDLY_WEBHOOK_SIGNING_KEY`.

> Calendly also emails the host natively on every booking; this webhook adds your
> own branded alert plus a queryable/exportable record.

---

## 5f. The Guide PDF

The downloadable guide lives at `public/guide.pdf` (served from
`https://aixdesign.dev/guide.pdf`) and is referenced by the delivery email via
`GUIDE_PDF_URL`. It was designed in Canva to match the site's espresso + gold
theme. To update it, edit the Canva design, export to PDF, and replace
`public/guide.pdf`. A web version of the same content is also at `/guide`.

---

## 6. Vercel Deployment

1. [vercel.com](https://vercel.com) → **Add New Project** → import from GitHub (Next.js auto-detected).
2. **Settings → Environment Variables** → add every variable from Section 3 (use **Production** scope; add **Preview** too if you want preview deploys to send email):
   - `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
   - `JOTFORM_WEBHOOK_URL`
   - `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `LEAD_NOTIFY_EMAIL`
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
   - `CRON_SECRET`, `CALENDLY_WEBHOOK_SIGNING_KEY`
   - `NEXT_PUBLIC_SITE_URL`
3. **Deploy.** Env-var changes require a redeploy to take effect.

---

## 7. Custom Domain

1. Vercel Project → **Settings → Domains** → add `aixdesign.dev`.
2. Follow Vercel's DNS instructions at your registrar.
3. Set `NEXT_PUBLIC_SITE_URL` to `https://aixdesign.dev` and redeploy.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion v11 |
| Scroll | Lenis v1 |
| Email | Resend |
| Database | Supabase (Postgres) |
| Payments | Stripe v16 |
| Hosting | Vercel |
