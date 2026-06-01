# By Design AI

AI automation agency landing page + lead funnel. Built with Next.js 14 App
Router, Resend (transactional + nurture email), Supabase (lead/booking storage),
OpenAI (intake review), Framer Motion, and Lenis smooth scroll.

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
| `RESEND_API_KEY` | Resend API key (`re_...`) — powers all email. See Section 4 |
| `RESEND_FROM_EMAIL` | Verified sender, e.g. `By Design AI <hello@aixdesign.dev>`. Defaults to `onboarding@resend.dev` for testing |
| `LEAD_NOTIFY_EMAIL` | Inbox for new-lead + booking alerts. Defaults to `terrysc107@gmail.com` |
| `SUPABASE_URL` | Supabase project URL (`https://acouuzccqkcpyrckrgwg.supabase.co`). See Section 5 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase **service-role** key (server-only secret, bypasses RLS). See Section 5 |
| `CRON_SECRET` | Random string protecting the drip cron endpoint. See Section 6 |
| `CALENDLY_WEBHOOK_SIGNING_KEY` | Calendly webhook signing key (recommended). See Section 7 |
| `GUIDE_PDF_URL` | Optional override for the guide PDF. Defaults to `<NEXT_PUBLIC_SITE_URL>/guide.pdf` |
| `OPENAI_API_KEY` | OpenAI key (`sk-...`) — powers the AI review of discovery intake submissions. See Section 9 |
| `OPENAI_MODEL` | Optional model override for intake review. Defaults to `gpt-4o` |
| `NEXT_PUBLIC_SITE_URL` | Full site URL, no trailing slash. Local: `http://localhost:3000`. Prod: `https://aixdesign.dev` |

**Never commit `.env.local`.** It is gitignored.

---

## 4. Resend Setup (All Email)

Resend powers the guide delivery, the 4-email nurture drip, and owner
notifications. All emails are sent as HTML with plain-text fallbacks.

1. Sign up at [resend.com](https://resend.com) → **API Keys → Create API Key** → `RESEND_API_KEY`.
2. **Domains → Add Domain** → `aixdesign.dev`, add the DNS records (auto-configured if your DNS is on Vercel).
3. Once **Verified**, set `RESEND_FROM_EMAIL` to `By Design AI <hello@aixdesign.dev>`.
4. Set `LEAD_NOTIFY_EMAIL` to where you want lead/booking alerts.

> Until the domain is verified, leave `RESEND_FROM_EMAIL` unset — it falls back
> to `onboarding@resend.dev`, which only delivers to your own account email.

---

## 5. Supabase Setup (Lead & Booking Storage)

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

## 6. Drip Nurture Sequence

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

## 7. Calendly Webhook (Booking Alerts)

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

## 8. The Guide PDF

The downloadable guide lives at `public/guide.pdf` (served from
`https://aixdesign.dev/guide.pdf`) and is referenced by the delivery email via
`GUIDE_PDF_URL`. It was designed in Canva to match the site's espresso + gold
theme. To update it, edit the Canva design, export to PDF, and replace
`public/guide.pdf`. A web version of the same content is also at `/guide`.

---

## 9. Discovery Intake + AI Review

After a prospect books a call, they're directed to an in-depth intake
questionnaire at `/intake` (business basics, current infrastructure, staff,
AI readiness, goals). On submit:

1. The submission is stored in Supabase (`bda_intake`, RLS-locked).
2. OpenAI drafts a preliminary plan (quick wins, suggested stack, biggest risk,
   questions for the call).
3. You (`LEAD_NOTIFY_EMAIL`) get an email with the full submission + AI plan, so
   you arrive at the call with it already half-built. The prospect only sees a
   thank-you.

**Two ways the prospect reaches `/intake`:**
- **Calendly post-booking redirect** — in Calendly, open the event's
  **Confirmation Page** settings, choose "Redirect to an external site," set the
  URL to `https://aixdesign.dev/intake` (no query string — Calendly rejects
  `{...}` template vars in this field), and tick **"Pass event details to your
  redirected page"** so the invitee's email is appended automatically and the
  form pre-fills.
- **Email** — if the Calendly webhook is configured (paid plan), it also emails
  them the intake link automatically.

**Reminders:** a daily cron (`/api/cron/intake-reminders`) emails escalating
reminders to anyone who booked but hasn't completed the intake — gentle nudge →
"I need this to prep" → "risk of cancellation" — and stops once they complete it
or the call time passes. (Reuses `CRON_SECRET`.)

**Setup:**
1. Get an OpenAI API key → `OPENAI_API_KEY` (optionally pin `OPENAI_MODEL`).
2. If the key is missing or the AI call fails, the submission is still stored and
   you're still emailed it — the email just notes AI was unavailable.

---

## 10. Vercel Deployment

1. [vercel.com](https://vercel.com) → **Add New Project** → import from GitHub (Next.js auto-detected).
2. **Settings → Environment Variables** → add every variable from Section 3 (use **Production** scope; add **Preview** too if you want preview deploys to send email):
   - `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `LEAD_NOTIFY_EMAIL`
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
   - `CRON_SECRET`, `CALENDLY_WEBHOOK_SIGNING_KEY`
   - `OPENAI_API_KEY` (+ optional `OPENAI_MODEL`)
   - `NEXT_PUBLIC_SITE_URL`
3. **Deploy.** Env-var changes require a redeploy to take effect.

---

## 11. Custom Domain

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
| AI | OpenAI |
| Scheduling | Calendly |
| Hosting | Vercel |
