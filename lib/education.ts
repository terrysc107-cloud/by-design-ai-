/**
 * Education product config — the single source of truth for the AI by Design
 * education surface (`/education`, `/education/claude-code`).
 *
 * The self-paced course lives on a separate platform (claudecodeclass.com).
 * Every outbound link is tagged so the course platform can attribute traffic
 * back to a specific placement on aixdesign.dev.
 *
 * UTM convention (extends docs/BRAND-KIT.md §10 for outbound links):
 *   utm_source  = aixdesign.dev   (always — this site is the referrer)
 *   utm_medium  = referral        (always — site-to-site, not a paid/social placement)
 *   utm_campaign= claude-code-for-operators
 *   utm_content = placement slug, e.g. 'education-hub-primary'
 */

export const COURSE_URL = 'https://claudecodeclass.com'

/** Self-paced course price. One-time, no subscription. */
export const COURSE_PRICE = '$97'

export const COURSE_NAME = 'Claude Code Class'

/**
 * The live offer. Waitlist open, no date set.
 *
 * 'The Build Lab', not 'AI by Design Claude Code Build Lab': this page IS
 * AI by Design, so the prefix is redundant, and the product's own name is
 * whatever claudecodeclass.com calls it. Must match BUILD_LAB.name in the
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
