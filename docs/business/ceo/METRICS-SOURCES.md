# Metrics Sources — where the CEO's numbers come from

> Maps each metric to its real source so the CEO reasons on facts, not guesses. Three sources:
> **Supabase** (the funnel: leads/bookings/intakes), **GA4** (traffic + on-site behavior), and
> **the Chairman** (closed engagements / revenue $, until that's tracked in a table).

---

## ✅ Supabase: the funnel (read-only)

- **Project:** the AI by Design app DB — **project ref `[SET PROJECT REF]`** (read it from
  `SUPABASE_URL` in the Vercel env; fill it in here once confirmed). The org has other Supabase
  projects that are **different apps — never query them.**
- **How the CEO pulls metrics:** run the validated queries in **`metrics-queries.sql`** via the
  Supabase MCP (`execute_sql`, this project ref), **SELECT-only**.
- **Tables:** `bda_leads`, `bda_bookings`, `bda_intake` (see schema map below).

### 🔒 Enforcing read-only (do this to harden it)
The Charter forbids writes, and the query pack is all SELECTs — that's process control. For hard
enforcement, run the Supabase MCP server with the **`--read-only`** flag and pin
**`--project-ref [SET PROJECT REF]`**. Optional defense-in-depth: a dedicated read-only Postgres role.

---

## 🔒 Safety rules (read before any data access)
1. **Read-only, always.** The CEO may only **SELECT/read**. Never INSERT/UPDATE/DELETE, alter
   schema, or run migrations against production.
2. **No PII in reports.** Aggregate only (counts, sums, rates). **Never** paste an individual
   lead's or client's name/email/intake answers into a board report, a post, or the repo. (Charter §5.5.)
3. **The Chairman is the source of truth for revenue.** Supabase tells us *who entered the funnel*;
   the Chairman knows *which discovery calls closed into paid engagements* until that's tracked.
4. **No invented proof.** We never compute or publish results/outcome claims we can't show.

---

## Supabase tables → what they tell us
*(Inferred from the codebase — confirm columns with `list_tables` before querying.)*

| Metric | Table(s) | How |
|---|---|---|
| Total / new leads | `bda_leads` | row count; new = by `created_at` |
| Drip funnel health | `bda_leads` | distribution by `drip_stage` (0–4); unsubscribed rate |
| Unsubscribe rate | `bda_leads` | `unsubscribed = true` ÷ total |
| **Discovery calls booked** | `bda_bookings` | count by `status` (created/canceled), by `scheduled_at` |
| Intake completion rate | `bda_bookings` | `intake_completed = true` ÷ bookings (the serious-buyer filter) |
| Intake submissions | `bda_intake` | count; `ai_status` (pending/completed/failed) of AI review |
| **Budget mix of intakes** | `bda_intake` | distribution of `budget_range` (qualifies the pipeline) |
| Lead → booking conversion | `bda_leads` + `bda_bookings` | bookings ÷ leads over a window |

> Note: there's no revenue table yet. **Closed engagements / $ are Chairman-supplied** until a
> `bda_engagements` (or CRM) table is added. The CEO flags this gap every week until it's closed.

## GA4 → traffic + on-site funnel
- Sessions, top pages, traffic sources/channels, and the **conversion events** the site now fires
  (`generate_lead`, `submit_application`, `book_call` — see `lib/analytics.ts`).
- Pull via the Analytics / Supermetrics MCP (read-only). This answers "are content + campaigns
  driving the right visits, and where do they drop off." Meta Pixel (`Lead`/`SubmitApplication`/
  `Schedule`) mirrors these for ad attribution once a pixel ID is set.

---

## Revenue & cost estimation (the forecast method)

The CEO can estimate forward numbers from real funnel data. Keep it transparent — show the inputs.

### Pipeline / revenue estimate
```
Booked pipeline ≈ discovery_calls_booked × close_rate × avg_engagement_value
  close_rate           = Chairman-supplied actual (start with a conservative assumption, label it)
  avg_engagement_value = blend of build fee + retainer MRR (from BUSINESS-PLAN.md), Chairman-confirmed
Recurring (retainer) MRR ≈ active_retainers × avg_retainer_price
Projected revenue = closed one-time builds + retainer MRR + expected-to-close pipeline
```
- Use **trailing actuals** (last 4–8 weeks) for booking + close rates once enough data exists.
- **Label every projection as an estimate, not a guarantee.** State the assumptions and data window.

### Cost estimate
```
Platform: Supabase + Vercel + Resend + OpenAI + Postiz + domain  → mostly tiered/known monthly
Ad spend (if any) = Chairman-authorized, capped
Content/ops time = Chairman input
```

### Margin
```
Gross margin ≈ revenue − variable platform − ad spend
Net ≈ gross − fixed platform − ops
```
Report as **Conservative / Base / Upside**, tied to `../BUSINESS-PLAN.md`, with live inputs shown.

---

## Status / wiring checklist
- [ ] **Set the Supabase project ref** above (from `SUPABASE_URL`).
- [ ] Wire Supabase MCP read-only (`--read-only --project-ref [SET PROJECT REF]`).
- [ ] Wire **GA4** read access (Analytics/Supermetrics MCP) for traffic + conversion events.
- [ ] Add a `bda_engagements` table (or CRM link) so closed revenue stops being manual.
