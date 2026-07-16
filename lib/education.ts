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

/** Working name for the planned live offer. No date, no checkout, not for sale. */
export const LIVE_LAB_NAME = 'AI by Design Claude Code Build Lab'

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
