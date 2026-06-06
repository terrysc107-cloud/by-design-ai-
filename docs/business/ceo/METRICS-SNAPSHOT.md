# AI by Design — Metrics Snapshot

> The numbers the CEO reasons over. Refreshed each weekly run from `metrics-queries.sql` (Supabase
> funnel) + GA4 (traffic). Closed-engagement $ is Chairman-supplied until a table exists.
> **Aggregates only — never paste individual lead/client PII here.**

**Last updated:** _not yet captured_ · **By:** _—_

---

## Funnel (Supabase `bda_*`)
| Metric | Value | Source | Notes |
|---|---|---|---|
| Total leads | _—_ | `bda_leads` | |
| New leads (7d / 30d) | _—_ / _—_ | `bda_leads` | |
| Unsubscribe rate | _—_ | `bda_leads` | |
| Discovery calls booked (total / active / 7d) | _—_ | `bda_bookings` | the north-star input |
| Intake completion rate | _—_ | `bda_bookings` | serious-buyer filter |
| Intakes (total / 30d) | _—_ | `bda_intake` | |
| Budget mix of intakes | _—_ | `bda_intake` | qualifies pipeline |
| Lead → booking conversion | _—_ | derived | |

## Traffic (GA4)
| Metric | Value | Source | Notes |
|---|---|---|---|
| Sessions (7d / 30d) | _—_ | GA4 | |
| Top channels | _—_ | GA4 | organic / direct / social / referral |
| Top landing pages | _—_ | GA4 | which content pulls |
| `generate_lead` / `book_call` events | _—_ | GA4 | on-site conversions |

## Revenue (Chairman-supplied until tracked)
| Metric | Value | Notes |
|---|---|---|
| Engagements closed (lifetime) | _—_ | from discovery calls |
| Active retainers (MRR) | _—_ | the recurring book |
| Avg engagement value | _—_ | build fee + retainer |

---

## Known data gaps (closing these = OKR 1)
- [ ] Supabase project ref not set in `METRICS-SOURCES.md` / `metrics-queries.sql`.
- [ ] Supabase MCP not yet wired read-only.
- [ ] GA4 read access (Analytics MCP) not yet wired; no real traffic numbers.
- [ ] No `bda_engagements` table → closed revenue is manual.
- [ ] No close-rate baseline (need first cohort of discovery calls).

---

### Baseline note
Foundation shipped + **deployed to production on aixdesign.dev** 2026-06-05 (brand, SEO, analytics,
funnel, header/hero). This is **pre-traffic** — the first job is to instrument the numbers above
(Supabase ref + GA4 ID from the Chairman), then drive the first discovery calls. Reason
qualitatively until the snapshot has real values.
