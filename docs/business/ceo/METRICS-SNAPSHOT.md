# AI by Design — Metrics Snapshot

> The numbers the CEO reasons over. Refreshed each weekly run from `metrics-queries.sql` (Supabase
> funnel) + GA4 (traffic). Closed-engagement $ is Chairman-supplied until a table exists.
> **Aggregates only — never paste individual lead/client PII here.**

**Last updated:** 2026-06-07 (no read possible — pre-traffic; GA4 read access not yet connected) · **By:** CEO

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
- [x] GA4 live on the site (`G-NC4HE7FP07`, 2026-06-06) — recording sessions + conversion events.
- [ ] GA4 **read access** (Analytics MCP) for the CEO's weekly traffic pull — not yet connected.
- [ ] No `bda_engagements` table → closed revenue is manual.
- [ ] No close-rate baseline (need first cohort of discovery calls).

---

### Baseline note
Foundation shipped + **deployed to production on aixdesign.dev** 2026-06-05 (brand, SEO, analytics,
funnel, header/hero). This is **pre-traffic** — the first job is to instrument the numbers above
(Supabase ref + GA4 ID from the Chairman), then drive the first discovery calls. Reason
qualitatively until the snapshot has real values.

**2026-06-07 update — clean prod deploy confirmed.** The site is live and clean in production at
`https://aixdesign.dev`: typecheck + prod build green, **21 routes**, full SEO surface, hero subhead
sharpened, 17 stale branches deleted (repo clean on `main`). **Still pre-traffic** — all funnel
values remain 0 by design and traffic has not started. GA4 is *recording* on-site but the CEO has
**no read access** yet (Analytics MCP not connected), so no traffic numbers can be pulled this week.
Close-rate + typical engagement value remain Chairman-supplied blanks. No numbers fabricated.
