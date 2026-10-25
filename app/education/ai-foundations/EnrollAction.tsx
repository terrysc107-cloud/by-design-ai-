'use client'

import NewsletterSignup from '@/components/sections/NewsletterSignup'
import { trackConversion } from '@/lib/analytics'
import { FOUNDATIONS_PRICE, foundationsCheckoutUrl } from '@/lib/education'

type Props = {
  /** utm_content slug for the placement. */
  placement: string
  /** Waitlist form is too heavy for the hero; it links down to the pricing card instead. */
  compact?: boolean
}

/**
 * The one buy control on the page. On sale: a link to the GHL checkout that
 * fires checkout_start. Not on sale: a waitlist (or a jump to it), never a price.
 */
export default function EnrollAction({ placement, compact = false }: Props) {
  const href = foundationsCheckoutUrl(placement)

  if (href) {
    return (
      <a
        href={href}
        className="fdn-btn"
        onClick={() => trackConversion('checkout_start', { location: placement, item: 'ai-foundations' })}
      >
        Enroll in AI Foundations, {FOUNDATIONS_PRICE}
      </a>
    )
  }

  if (compact) {
    return (
      <a href="#enroll" className="fdn-btn">
        Join the waitlist
      </a>
    )
  }

  return (
    <NewsletterSignup
      source="ai-foundations"
      theme="light"
      eyebrow="Waitlist"
      cta="Join the waitlist →"
      heading="Be first in when enrollment opens."
      blurb="One email when AI Foundations opens, plus the occasional practical note on using AI at work. Unsubscribe any time."
    />
  )
}
