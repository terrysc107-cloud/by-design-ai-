/**
 * Education product config — the single source of truth for the AI by Design
 * education surface (`/education`, `/education/claude-code`).
 *
 * The self-paced course lives on a separate platform (runyouraiboard.com).
 * Every outbound link is tagged so the course platform can attribute traffic
 * back to a specific placement on aixdesign.dev.
 *
 * UTM convention (extends docs/BRAND-KIT.md §10 for outbound links):
 *   utm_source  = aixdesign.dev   (always — this site is the referrer)
 *   utm_medium  = referral        (always — site-to-site, not a paid/social placement)
 *   utm_campaign= claude-code-for-operators
 *   utm_content = placement slug, e.g. 'education-hub-primary'
 */

export const COURSE_URL = 'https://runyouraiboard.com'

/** Self-paced course price. One-time, no subscription. */
export const COURSE_PRICE = '$57'

export const COURSE_NAME = 'My AI Board'

/**
 * The live offer. Waitlist open, no date set.
 *
 * 'The Build Lab', not 'AI by Design Claude Code Build Lab': this page IS
 * AI by Design, so the prefix is redundant, and the product's own name is
 * whatever runyouraiboard.com calls it. Must match BUILD_LAB.name in the
 * course repo's lib/course-config.ts — two spellings of one product is two
 * products. Qualify it with an eyebrow ("A live session") in the markup rather
 * than baking context into the name.
 *
 * NO PRICE HERE, deliberately. The course repo owns that number; duplicating it
 * means two repos to update every time it moves, and a stale price on a
 * marketing page is a quote you have to honour.
 */
export const LIVE_LAB_NAME = 'The Build Lab'

/**
 * The founding cohort's date and price.
 *
 * ⚠️ MIRRORS `BUILD_LAB.dateDisplay` and `BUILD_LAB.priceDisplay` in the course
 * repo's lib/course-config.ts. If you change one, change the other.
 *
 * The comment above LIVE_LAB_NAME says there is deliberately NO price here,
 * which was right for as long as the Lab had nothing to sell: a duplicated
 * price is two repos to update and a stale quote you have to honour. That
 * changed on 2026-09-03 when Terry scheduled the run. A live cohort with a date
 * and eight seats is news, and news is the entire reason these pages exist. A
 * marketing page that says "no date yet" about a run that opens in ten weeks is
 * worse than a duplicated number, because it actively talks the reader out of
 * the thing we want them to do.
 *
 * SET BOTH TO null THE MOMENT THE RUN CLOSES OR MOVES. While these are
 * non-null, `/education` and `/education/claude-code` assert a date to the
 * public that only the course repo and the `ccc_lab_sessions` row can actually
 * honour. Seat counts are deliberately NOT mirrored: those are computed from
 * real registrations, server-side, on the course platform, and a seat count
 * copied into this repo would be a number nothing can back.
 */
export const LIVE_LAB_DATE: string | null = 'Wednesdays from November 18, 2026'
export const LIVE_LAB_PRICE: string | null = '$997'

/**
 * Required on every page in the education surface. The course teaches a
 * third-party tool; we are not affiliated with its maker and must not imply it.
 */
export const AFFILIATION_DISCLAIMER =
  'Independent educational product by AI by Design. Not affiliated with or endorsed by Anthropic.'

/**
 * Builds a UTM-tagged link to the course platform.
 * @param content Placement slug identifying which CTA on which page was clicked.
 */
export function courseUrl(content: string): string {
  const params = new URLSearchParams({
    utm_source: 'aixdesign.dev',
    utm_medium: 'referral',
    utm_campaign: 'claude-code-for-operators',
    utm_content: content,
  })
  return `${COURSE_URL}/?${params.toString()}`
}

/**
 * Builds a UTM-tagged link to the Build Lab waitlist on the course platform.
 *
 * Points at the course platform rather than /newsletter because the waitlist
 * hands signups straight back here: POST /api/build-lab/waitlist calls this
 * site's /api/subscribe with source:'build-lab', which sends the Lab
 * confirmation and adds them to the newsletter list. So a visitor who joins the
 * waitlist is on the newsletter too — one click, both outcomes, and we learn
 * which placement drove it.
 *
 * @param content Placement slug identifying which CTA on which page was clicked.
 */
export function labWaitlistUrl(content: string): string {
  const params = new URLSearchParams({
    utm_source: 'aixdesign.dev',
    utm_medium: 'referral',
    utm_campaign: 'claude-code-for-operators',
    utm_content: content,
  })
  return `${COURSE_URL}/build-lab?${params.toString()}`
}

/**
 * The board loop — the spine of the course, and the thing the education pages
 * are allowed to describe as "the method".
 *
 * ⚠️ MIRRORS `BOARD_LOOP` in the course repo's lib/course-config.ts.
 *
 * This replaced the six-step developer loop (inspect → plan → build → review →
 * test → ship) that these pages carried until 2026-09-03. That loop is real,
 * but it is the DEV PACK's spine, not the course's. The course was rewritten
 * for a solopreneur who has never written code — an audit found only 6 of 49
 * lessons a non-coder could finish unmodified — and a marketing page promising
 * the developer curriculum to that buyer produces refunds. Copy that welcomes a
 * beginner into lessons about test suites is not a tone problem, it is a
 * mis-sale.
 *
 * "Act" is a step on purpose. The course says plainly that the board does not
 * act; a loop ending at "Decide" would quietly imply otherwise, and the most
 * common way a board fails is that nobody does anything with what it produced.
 */
export const BOARD_LOOP = [
  { step: 'Brief', detail: 'Say what the run is for, what to read, and what not to do.' },
  { step: 'Gather', detail: 'Keep the four files true. Stale inputs produce confident nonsense.' },
  { step: 'Run', detail: 'On a schedule, so it happens on days you never sit down.' },
  { step: 'Review', detail: 'Trace every claim to a number. Expect it to name what it did not have.' },
  { step: 'Decide', detail: 'Log the decision and what would reverse it.' },
  { step: 'Act', detail: 'The board does not do this part. You do.' },
] as const

/**
 * THE LADDER, as a marketing surface only.
 *
 * ⚠️ MIRRORS `LADDER` in the course repo's lib/course-config.ts, which is the
 * authority. That repo owns checkout; this one owns none of it.
 *
 * NO PRICES ON UNBUYABLE RUNGS, deliberately, and this is the same rule that
 * already keeps a price off LIVE_LAB_NAME above. A price rendered here is a
 * quote we have to honour, and every rung except the course is `available:
 * false` — so a number on one of them would be a quote for something nobody can
 * buy, aging in a repo nobody edits when the price moves. `priceDisplay` is
 * therefore populated for the course alone, from COURSE_PRICE, which is the one
 * number this repo already duplicates and the one a visitor can actually act on.
 *
 * `available: false` renders as "what's next", never as a CTA. Nothing here
 * manufactures urgency, invents a date, or implies a seat count — the course
 * repo fails its build on all three and this surface holds the same line.
 */
export interface LadderRung {
  id: 'course' | 'kit' | 'build-lab' | 'board-room' | 'install'
  rung: number
  name: string
  /** One line: what this rung IS. */
  promise: string
  /** Who has outgrown the rung below. */
  forWho: string
  /** Populated only where someone can buy today. See the note above. */
  priceDisplay: string | null
  available: boolean
}

export const LADDER: readonly LadderRung[] = [
  {
    id: 'course',
    rung: 1,
    /**
     * The course repo calls this rung "The Course", which reads fine on a page
     * where it is the only product. Here it sits directly under a card headed
     * "My AI Board" at the same price, and two names for one thing at one price
     * reads as two products. Use the product's own name.
     */
    name: COURSE_NAME,
    promise:
      'Build your own AI board: a few narrow assistants that read your real numbers on a schedule and hand you a meeting you can act on. No coding.',
    forWho:
      'You run something small and you are tired of AI that only works when you are sitting in front of it.',
    priceDisplay: COURSE_PRICE,
    available: true,
  },
  {
    id: 'kit',
    rung: 2,
    name: 'The Operating Company Kit',
    promise:
      "My board, filled in: four more seats with the reporting lines between them, the real playbooks, and three months of meetings it actually produced.",
    forWho:
      "You have one seat running and you want the org, plus the archive of someone else's board working and getting things wrong.",
    priceDisplay: null,
    available: false,
  },
  {
    id: 'build-lab',
    rung: 3,
    name: LIVE_LAB_NAME,
    promise:
      'A four-week live cohort, in a small group, where you stand up your own AI board on your own numbers and watch every decision, including the ones that go wrong.',
    forWho: 'You want it built with you, in your business, not adapted from a template alone.',
    // Scheduled 2026-09-03, so this rung stops being "next" and starts being a
    // thing someone can buy. It is the one exception to the no-prices rule
    // above, for the reason given on LIVE_LAB_PRICE.
    priceDisplay: LIVE_LAB_PRICE,
    available: true,
  },
  {
    id: 'board-room',
    rung: 4,
    name: 'The Board Room',
    promise:
      'Your board stays current, and you watch mine run. Every month: the archive of a real board working on a real business, and the updates that keep your copy true as the tools move.',
    forWho: 'You have a board running and you would rather not be the one maintaining it.',
    priceDisplay: null,
    available: false,
  },
  {
    id: 'install',
    rung: 5,
    name: 'The Install',
    promise:
      'We build your AI operating company with you over a few weeks, then hand you the keys and the documentation.',
    forWho: 'You would rather buy the outcome of the work than do the work.',
    priceDisplay: null,
    available: false,
  },
] as const

/**
 * Builds a UTM-tagged link to the ladder page on the course platform.
 * @param content Placement slug identifying which CTA on which page was clicked.
 */
export function ladderUrl(content: string): string {
  const params = new URLSearchParams({
    utm_source: 'aixdesign.dev',
    utm_medium: 'referral',
    utm_campaign: 'claude-code-for-operators',
    utm_content: content,
  })
  return `${COURSE_URL}/ladder?${params.toString()}`
}
