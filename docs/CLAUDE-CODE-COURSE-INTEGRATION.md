> **2026-09-25 update:** Build Lab now has a new series/application surface at `/build-lab` and an authenticated student/instructor workspace at `/lab-studio`. The historical founding run is at `/build-lab/legacy`. This repo no longer mirrors dates or prices. Historical sections below describe the previous offer; use the course repo `docs/build-lab/CLAUDE-HANDOFF.md` for the new launch contract. Existing paid registrations must be reconciled before moving anyone to a new cohort.

# Course Integration

How the AI by Design education surface on `aixdesign.dev` relates to the
separate course platform at `runyouraiboard.com`.

**Status:** live copy synced to the current product. Publishing blocked on the
items in [Launch blockers](#launch-blockers).
**Last updated:** 2026-09-03

> **Renamed twice.** The product was `Claude Code Class` at $97 on
> `claudecodeclass.com`, then `My AI Board` at $57 on `runyouraiboard.com`
> (2026-08-28). The old domain still resolves, so no existing link is broken.
> If you find "Claude Code Class" anywhere in this repo, it is stale.

---

## 1. Product boundaries

Two products, two systems, one brand. Keeping the line clear is what keeps the
claims honest.

| | Self-paced course | Live lab |
|---|---|---|
| Name | **My AI Board** | **The Build Lab** |
| Status | Live, purchasable | **Waitlist only.** No date, not for sale |
| Price | **$57 one-time**, lifetime access | Set in the course repo, not shown here |
| Lives at | `runyouraiboard.com` | `runyouraiboard.com/build-lab` |
| Checkout | On the course platform | Built, gated behind `BUILD_LAB.status` |
| Role of aixdesign.dev | Marketing surface + referral only | Waitlist referral only |

**The course is now a board course, not a coding course.** An audit of the
original 49 lessons found only 6 that a non-coder could complete unmodified, so
the developer curriculum moved to a **Dev Pack** add-on and the board path
became the product. The buyer is a solopreneur who has never written code.
Anything on this site that promises the six-step developer loop (inspect, plan,
build, review, test, ship) is selling the add-on to the wrong person, and that
is a refund. The board path's spine is `BOARD_LOOP` in `lib/education.ts`.

**There is a five-rung ladder** above the course: the Kit, the Build Lab, the
Board Room, and the Install. It is mirrored into `LADDER` in `lib/education.ts`
and rendered on `/education`, with prices shown only for rungs someone can
actually buy today. See the note on that constant for why.

### What aixdesign.dev does and does not do

- **Does:** describe both products, explain the method, send qualified traffic
  to the course platform with UTM tags.
- **Does not:** take payment, hold enrollment state, know who bought, or gate
  anything. There is no course auth, no Supabase table, and no webhook in this
  repo. Every education page is a static server component.

### Positioning: co-equal paths

**CHANGED 2026-09-03 by Terry.** This section used to say the opposite, and the
history matters because the old rule was deliberate rather than accidental.

The retired rule read: education is a **secondary** path, the primary CTA
everywhere stays Book a Discovery Call, and the `Education` nav link is "not a
button, not gold, not above the CTA". It existed because `memory/DECISIONS.md`
positions AI by Design as a coaching and consulting agency and explicitly *not*
a course-seller. It also named its own trigger for revisiting: *"If education
ever starts pulling traffic away from discovery calls, this is the tension to
revisit."*

Terry revisited it. The course now has a live $57 checkout and its own funnel,
and the two offers are **co-equal**:

- `components/sections/TwoPaths.tsx` on the homepage is the fork: learn it, or
  hire it. One grid, two columns of equal width, the same heading scale and the
  same button treatment on both sides. **If one column ever gets the gold fill
  and the other gets a text link, the page has quietly picked a winner again.**
  Co-equal is a layout claim, so the layout has to honour it.
- `Education` moved to the `sm` breakpoint in the header and `Coaching` moved
  back to `md`. The nav row cannot hold both at `sm` without wrapping to two
  lines, so this was a swap, not an addition.
- Both education pages still route to the discovery call at the end, and both
  still say plainly that hiring the build is a legitimate alternative to
  learning it. That was always honest and it stays.

The two buyers are different people. Someone who wants to learn the system is
not a warmed-up lead for a done-for-you engagement, which is why the content
engine keeps them in separate lanes (see below) and why a board-lane post must
never ask for a discovery call.

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
| `lib/education.ts` | Also holds `BOARD_LOOP` and the `LADDER` mirror. Both carry cross-repo sync warnings |
| `components/sections/TwoPaths.tsx` | Homepage fork: learn it or hire it. The co-equal claim, in layout |
| `components/layout/Header.tsx` | `Education` nav link at `sm`, `Coaching` at `md` |
| `components/layout/Footer.tsx` | Added `Education` link to the legal-row nav |
| `app/sitemap.ts` | Added both education routes |

The content engine is separate but related, and its board lane sells this
course: `lib/content-engine.ts` (`LANES.board`), `lib/content-guardrail.ts` (the
claim gate), `scripts/check-claims.ts` (its test), and the two content crons.

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
| `/education` course card | `education-hub-primary` | `https://runyouraiboard.com/?utm_source=aixdesign.dev&utm_medium=referral&utm_campaign=claude-code-for-operators&utm_content=education-hub-primary` |
| `/education/claude-code` hero | `course-page-hero` | …`&utm_content=course-page-hero` |
| `/education/claude-code` footer | `course-page-footer` | …`&utm_content=course-page-footer` |
| Homepage `TwoPaths` learn column | `home-two-paths-learn` | …`&utm_content=home-two-paths-learn` |

`ladderUrl(content)` builds the same shape against `/ladder` on the course
platform.

**Internal / non-course CTAs:**

| Placement | Target | Why |
|---|---|---|
| Live lab (both pages) | `/newsletter` | The only honest ask — there is nothing to sell. No mailto path was added; the newsletter already exists and is the documented announcement channel. |
| Both pages, closing | Calendly, via `FinalCTA` → `bookDiscoveryCall()` | Preserves the primary conversion goal |

---

## 4. Launch blockers

Do not link to `/education` from anywhere public until these clear.

1. ~~The course platform must say the right name at the right price.~~ **DONE
   2026-09-03.** `lib/education.ts` reads `My AI Board` / `$57` /
   `runyouraiboard.com`, matching `BRAND` and `PRODUCT` in the course repo's
   `lib/course-config.ts`. The live $57 Stripe price exists
   (`price_1U9Res…`, created 2026-08-29).
2. **Confirm `NEXT_PUBLIC_STRIPE_PRICE_ID` in Vercel points at that $57 price.**
   Cannot be checked from a local session. The checkout route asserts the live
   Stripe amount against config and returns **503 rather than charging the wrong
   amount**, so a stale env var means every buy button on both sites fails
   safely and silently. Terry only.
3. **The course platform must accept UTM query params on `/`** without
   redirecting them away. Load one of the URLs in §3 and confirm the params
   survive to the landing page and into its analytics.
4. ~~The capstone description must match the real curriculum.~~ **DONE
   2026-09-03.** The developer loop and the Lead Follow-Up Command Center
   capstone were removed from `/education/claude-code`; the page now describes
   the board path and `BOARD_LOOP`.
5. ~~Terry to review the education↔consulting framing.~~ **DONE 2026-09-03.**
   He chose co-equal paths. See [Positioning](#positioning-co-equal-paths).
6. **No OG image for the education routes.** They inherit the site-wide
   `app/opengraph-image.png`, which is consulting-branded. This matters more now
   than it did: the content engine's board lane exists specifically to get these
   links shared. Worth fixing before the first board-lane post ships.

The live-lab section is no longer the vaporware risk it was flagged as, because
the waitlist is real and takes no deposit. It becomes one again if it sits
undated for months. `BUILD_LAB.status` in the course repo is the switch, and a
CHECK constraint on `ccc_lab_sessions` refuses `scheduled` without a real date
and a real price.

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
