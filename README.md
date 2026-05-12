# By Design AI

Premium AI operations coaching landing page. Built with Next.js 14 App Router, Stripe Checkout, Jotform webhook integration, Framer Motion, and Lenis smooth scroll.

---

## 1. Project Overview

A dark, luxury landing page for the By Design AI Ops Audit — a $2,500 60-minute operational coaching session. Features:

- Stripe Checkout payment flow (server-side session creation)
- Jotform webhook trigger after successful payment
- Cinematic Framer Motion animations (parallax, text reveals, magnetic buttons)
- Lenis smooth scroll
- Animated gold gradient border card
- Film grain + ambient gold particle effects
- Full `prefers-reduced-motion` support
- Mobile sticky CTA bar
- Privacy Policy and Terms of Service pages

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

Copy `.env.example` to `.env.local` and fill in all values:

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Your Stripe secret key (`sk_test_...` for dev, `sk_live_...` for prod) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key (`pk_test_...` or `pk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret — see Section 4 for how to get this |
| `JOTFORM_WEBHOOK_URL` | Your Jotform webhook submission URL — see Section 5 |
| `NEXT_PUBLIC_SITE_URL` | Full site URL, no trailing slash. Local: `http://localhost:3000`. Production: `https://yourdomain.com` |

**Never commit `.env.local`.** It is gitignored.

---

## 4. Stripe Setup

### Step 1 — Get API Keys

1. Log in to [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Developers → API Keys**
3. Copy **Secret key** → `STRIPE_SECRET_KEY`
4. Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
5. Use **test mode** keys locally (`sk_test_...`, `pk_test_...`)

### Step 2 — Set Up Webhook (Local Development)

Install the Stripe CLI:

```bash
brew install stripe/stripe-cli/stripe
stripe login
stripe listen --forward-to localhost:3000/api/webhook
```

The CLI will print a `whsec_...` value — copy it to `STRIPE_WEBHOOK_SECRET` in `.env.local`.

Test a payment event:

```bash
stripe trigger checkout.session.completed
```

### Step 3 — Set Up Webhook (Production)

1. In Stripe Dashboard: **Developers → Webhooks → Add Endpoint**
2. Endpoint URL: `https://yourdomain.com/api/webhook`
3. Events to send: `checkout.session.completed`
4. Click **Add endpoint**, then copy the **Signing secret** (`whsec_...`)
5. Add this to Vercel as `STRIPE_WEBHOOK_SECRET` (it is different from the CLI secret)

---

## 5. Jotform Webhook Setup

1. Log in to [Jotform](https://jotform.com)
2. Open your intake form (create one if needed with 5 questions)
3. Go to **Settings → Integrations → Webhooks**
4. Click **Add Webhook**, paste your webhook URL (for local testing: use [webhook.site](https://webhook.site))
5. Copy the webhook URL → `JOTFORM_WEBHOOK_URL`

The webhook fires automatically after every successful Stripe payment. Payload sent:

```json
{
  "name": "Customer Name",
  "email": "customer@example.com",
  "paymentId": "pi_...",
  "timestamp": "2026-01-01T00:00:00.000Z",
  "product": "AI Ops Audit"
}
```

---

## 6. Vercel Deployment

### Step 1 — Import Project

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import from GitHub
3. Framework: **Next.js** (auto-detected)
4. Root directory: `/` (default)

### Step 2 — Environment Variables

In Vercel Project Settings → **Environment Variables**, add all five variables from Section 3:

- `STRIPE_SECRET_KEY` — use live key for production
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — use live key for production
- `STRIPE_WEBHOOK_SECRET` — use the production Dashboard webhook secret (NOT the CLI secret)
- `JOTFORM_WEBHOOK_URL`
- `NEXT_PUBLIC_SITE_URL` — set to your production domain, e.g. `https://bydesignai.com`

### Step 3 — Deploy

Click **Deploy**. Vercel runs `next build` automatically.

---

## 7. Custom Domain

1. In Vercel Project → **Settings → Domains**
2. Add your domain (e.g. `bydesignai.com`)
3. Follow Vercel's instructions to update DNS records at your registrar
4. After DNS propagates, update `NEXT_PUBLIC_SITE_URL` in Vercel env vars to match your domain
5. Redeploy to pick up the new env var

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion v11 |
| Scroll | Lenis v1 |
| Font | Geist Sans (Vercel) |
| Payments | Stripe v16 |
| Forms | Jotform webhook |
| Hosting | Vercel |
