# AI by Design — Metrics Snapshot

> The numbers the CEO reasons over. Refreshed each weekly run from `metrics-queries.sql` (Supabase
> funnel) + GA4 (traffic). Closed-engagement $ is Chairman-supplied until a table exists.
> **Aggregates only — never paste individual lead/client PII here.**

**Last updated:** 2026-06-05 (live read via Supabase MCP) · **By:** CEO

---

## Funnel (Supabase `bda_*`)
| Metric | Value | Source | Notes |
|---|---|---|---|
| Total leads | **0** | `bda_leads` | funnel just went live — pre-traffic |
| New leads (7d / 30d) | 0 / 0 | `bda_leads` | |
| Unsubscribe rate | n/a | `bda_leads` | |
| Discovery calls booked (total / active / 7d) | **0** | `bda_bookings` | the north-star input |
| Intake completion rate | n/a | `bda_bookings` | serious-buyer filter |
| Intakes (total / 30d) | **0** | `bda_intake` | |
| Budget mix of intakes | n/a | `bda_intake` | qualifies pipeline |
| Lead → booking conversion | n/a | derived | needs first leads |

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
- [x] Supabase project ref set (`acouuzccqkcpyrckrgwg`) + funnel readable via MCP (2026-06-05).
- [ ] GA4 read access (Analytics MCP) not yet wired; no real traffic numbers. **Awaiting GA4 ID.**
- [ ] No `bda_engagements` table → closed revenue is manual.
- [ ] No close-rate baseline (need first cohort of discovery calls).

---

### Baseline note
Foundation shipped + **deployed to production on aixdesign.dev** 2026-06-05 (brand, SEO, analytics,
funnel, header/hero). This is **pre-traffic** — the first job is to instrument the numbers above
(Supabase ref + GA4 ID from the Chairman), then drive the first discovery calls. Reason
qualitatively until the snapshot has real values.
