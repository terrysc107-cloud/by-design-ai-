# Claude Code Course Integration

How the AI by Design education surface on `aixdesign.dev` relates to the
separate course platform at `claudecodeclass.com`.

**Status:** built, not launched. See [Launch blockers](#launch-blockers).
**Last updated:** 2026-07-16

---

## 1. Product boundaries

Two products, two systems, one brand. Keeping the line clear is what keeps the
claims honest.

| | Self-paced course | Live lab |
|---|---|---|
| Name | **Claude Code Class** | **AI by Design Claude Code Build Lab** |
| Status | Live, purchasable | **Planned.** Not scheduled, not for sale |
| Price | **$97 one-time**, lifetime access | None set |
| Lives at | `claudecodeclass.com` | Nowhere yet |
| Checkout | On the course platform | **Does not exist** |
| Role of aixdesign.dev | Marketing surface + referral only | Announcement only |

### What aixdesign.dev does and does not do

- **Does:** describe both products, explain the method, send qualified traffic
  to the course platform with UTM tags.
- **Does not:** take payment, hold enrollment state, know who bought, or gate
  anything. There is no course auth, no Supabase table, and no webhook in this
  repo. Every education page is a static server component.

### Positioning guardrail

`memory/DECISIONS.md` and `docs/BRAND-KIT.md` both position AI by Design as a
coaching and consulting agency that ships custom systems — explicitly *not* a
course-seller ("unlike course-sellers … who hand you a Notion doc and walk
away"). The education surface is deliberately built as a **secondary** path
that does not contest that:

- The primary CTA everywhere is still **Book a Discovery Call**. Both education
  pages end with the shared `FinalCTA` component — the same one the homepage
  uses, unmodified.
- `Education` is a plain nav link at the same visual weight as `Blog` and
  `Newsletter`. It is not a button, not gold, not above the CTA.
- Both pages state that hiring the build is a legitimate alternative to
  learning it, and route that reader to the discovery call.

If education ever starts pulling traffic away from discovery calls, this is the
tension to revisit — the ordering above is the lever.

### Claim rules (non-negotiable)

Every page in `/education/**` must be free of:

- Testimonials, student counts, or social proof of any kind — we have none we
  can substantiate.
- Speed guarantees ("ship in a weekend"), earnings claims, or outcome promises.
- Invented dates, seat counts, countdowns, "only N left", or any other
  manufactured scarcity.
- Any implication of a relationship with Anthropic.

The affiliation disclaimer is **required on every education page** and is
rendered from a single constant so it cannot drift:

> Independent educational product by AI by Design. Not affiliated with or
> endorsed by Anthropic.

Source: `AFFILIATION_DISCLAIMER` in `lib/education.ts`.

---

## 2. Files

| Path | Role |
|---|---|
| `lib/education.ts` | Single source of truth: course URL, price, names, disclaimer, `courseUrl()` UTM builder |
| `app/education/page.tsx` | Education hub — principles, catalog, education↔consulting relationship |
| `app/education/claude-code/page.tsx` | Course detail — method, capstone, fit, live-lab notice |
| `components/layout/Header.tsx` | Added `Education` nav link (`hidden md:inline`) |
| `components/layout/Footer.tsx` | Added `Education` link to the legal-row nav |
| `app/sitemap.ts` | Added both education routes |

Nothing else was touched. No API routes, no Supabase, no env vars, no
dependencies.

---

## 3. CTA URLs

All outbound course links are built by `courseUrl(content)` in
`lib/education.ts`. Never hardcode the URL in a page — the UTM tags are the
only attribution we have.

**Convention** (extends `docs/BRAND-KIT.md` §10 for outbound links — §10 covers
inbound social links *to* aixdesign.dev, so `utm_source` is inverted here):

```
utm_source   = aixdesign.dev            (always — this site is the referrer)
utm_medium   = referral                 (always — site-to-site, not paid/social)
utm_campaign = claude-code-for-operators
utm_content  = <placement slug>
```

**Live placements:**

| Placement | `utm_content` | Resulting URL |
|---|---|---|
| `/education` course card | `education-hub-primary` | `https://claudecodeclass.com/?utm_source=aixdesign.dev&utm_medium=referral&utm_campaign=claude-code-for-operators&utm_content=education-hub-primary` |
| `/education/claude-code` hero | `course-page-hero` | …`&utm_content=course-page-hero` |
| `/education/claude-code` footer | `course-page-footer` | …`&utm_content=course-page-footer` |

**Internal / non-course CTAs:**

| Placement | Target | Why |
|---|---|---|
| Live lab (both pages) | `/newsletter` | The only honest ask — there is nothing to sell. No mailto path was added; the newsletter already exists and is the documented announcement channel. |
| Both pages, closing | Calendly, via `FinalCTA` → `bookDiscoveryCall()` | Preserves the primary conversion goal |

---

## 4. Launch blockers

Do not link to `/education` from anywhere public until these clear.

1. **The course platform must actually say "Claude Code Class" at
   $97.** These pages assert the name and price; `claudecodeclass.com` is
   mid-refresh. If the destination still shows the old branding or a different
   price, the pages are lying. **Verify before launch.**
2. **The course platform must accept UTM query params on `/`** without
   redirecting them away. Load one of the URLs in §3 and confirm the params
   survive to the landing page and into its analytics.
3. **The capstone description must match the real curriculum.** The page
   promises a build-your-own-internal-tool capstone and a six-step
   inspect→plan→build→review→test→ship loop. Someone who knows the course
   contents must confirm both are accurate.
4. **Terry to review the education↔consulting framing.** It intentionally tells
   readers that hiring the build is a fine alternative to buying the course.
   That is honest, and it costs course conversions. Confirm that trade is wanted.
5. **No OG image for the education routes.** They inherit the site-wide
   `app/opengraph-image.png`, which is consulting-branded. Acceptable to launch;
   worth fixing if the pages get shared.

Not a blocker, but track it: the live lab section is the only thing on the site
promising a future product. If it sits unscheduled for months it reads as
vaporware. Either ship it or delete the section.

---

## 5. Rollback

The integration is additive and self-contained. Removing it cannot break
anything else.

**Full removal:**

```bash
rm -rf app/education lib/education.ts docs/CLAUDE-CODE-COURSE-INTEGRATION.md
```

Then revert the three one-hunk edits:

- `components/layout/Header.tsx` — remove the `/education` `<Link>`
- `components/layout/Footer.tsx` — remove the `/education` `<Link>`
- `app/sitemap.ts` — remove the two education entries

No data migration, no env cleanup, no cache purge. Nothing else imports
`lib/education.ts`.

**Partial rollback — hide the pages but keep the code:** remove the two nav
links and the two sitemap entries. The routes stay reachable by direct URL,
which is enough for review links, and drop out of search over time.

**Kill the live lab only:** delete the "planned" `<article>` on `/education`
and the "A live version is being designed" section on `/education/claude-code`.
Leave `LIVE_LAB_NAME` in place if it is coming back.

---

## 6. Future work

### Analytics

Nothing on these pages is instrumented today beyond the inherited `FinalCTA`
`book_call` event. To close the loop, in rough priority order:

1. **Track course-link clicks.** `trackConversion()` in `lib/analytics.ts` only
   accepts `'lead' | 'intake' | 'book_call' | 'subscribe'`. Add a
   `course_click` event (GA `select_content`, Meta `ViewContent` or a custom
   event) and fire it from the outbound `<a>`s. Requires making those CTAs
   client components — hence deferred, since the UTM tags already give the
   destination the attribution.
2. **Attribute education newsletter signups.** `NewsletterSignup` currently
   accepts `source: 'newsletter' | 'footer' | 'blog'`, and
   `app/api/subscribe/route.ts` hard-fails anything outside that set back to
   `'newsletter'`. To add an `'education'` source you must (a) widen the union
   in the component, (b) add `'education'` to `ALLOWED_SOURCES` in the route,
   and (c) **confirm the Supabase `bda_subscribers.source` column has no CHECK
   constraint rejecting the new value** — unverified, and the reason this was
   not done here. Until then the education pages link to `/newsletter` rather
   than embedding a signup form, so nothing is silently mis-attributed.
3. **Close the loop on revenue.** The course platform owns checkout, so
   aixdesign.dev cannot know a UTM click became a $97 sale. Either read it from
   the platform's own analytics, or pass a click id through and reconcile later.

### Publishing

- Announce in the newsletter — the education surface is the natural payload for
  an issue, and blockers §4.1–4.3 must clear first.
- Add education-specific OG images (`app/education/opengraph-image.png` and
  `app/education/claude-code/opengraph-image.png`) before promoting the links.
- Consider `Course` JSON-LD on `/education/claude-code` via the existing
  `components/seo/JsonLd.tsx`. Only after §4.1 confirms name and price, since
  structured data with a wrong price is worse than none.
- If the live lab gets a real date and checkout, it becomes its own page —
  do not bolt a purchase flow onto `/education`.
