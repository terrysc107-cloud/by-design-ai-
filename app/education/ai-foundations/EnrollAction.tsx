'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import NewsletterSignup from '@/components/sections/NewsletterSignup'
import { trackConversion } from '@/lib/analytics'
import { FOUNDATIONS_PRICE, foundationsCheckoutUrl } from '@/lib/education'

type Props = {
  /** utm_content slug for the placement. */
  placement: string
  /** Waitlist form is too heavy for the hero; it links down to the pricing card instead. */
  compact?: boolean
}

type AffiliateManager = {
  init: (locationId: string, backend: string, cookieDomain: string) => void
  trackLead: (lead: { email: string }) => Promise<unknown>
}
declare global {
  interface Window {
    affiliateManager?: AffiliateManager
  }
}

/**
 * GHL Affiliate Manager (campaign "AI Foundations - Staffly Digital").
 * Partners share aixdesign.dev/education/ai-foundations?am_id=<id>. am.js keeps
 * that id in a cookie; GHL pays commission when a Stripe charge's email matches
 * a lead sent with trackLead. The GHL checkout is on another domain and can't
 * read the cookie, so referred visitors give their email here first.
 */
function isReferred() {
  return new URLSearchParams(window.location.search).has('am_id') || document.cookie.includes('am_id=')
}

function ReferredCheckout({ href, placement }: { href: string; placement: string }) {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)

  const go = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    trackConversion('checkout_start', { location: placement, item: 'ai-foundations' })
    // Never block the sale on the tracker: give it 2s, then go to checkout regardless.
    await Promise.race([
      window.affiliateManager?.trackLead({ email: email.trim() }).catch(() => {}),
      new Promise(r => setTimeout(r, 2000)),
    ])
    window.location.href = href
  }

  return (
    <form onSubmit={go} className="flex flex-col gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Your email address"
        aria-label="Email address"
        className="px-4 py-3 text-sm bg-white border border-[#D7E0EB] text-[#09111F] outline-none focus:border-[#2878FF]"
      />
      <button type="submit" disabled={busy} className="fdn-btn disabled:opacity-60">
        {busy ? 'Opening checkout…' : `Continue to checkout, ${FOUNDATIONS_PRICE}`}
      </button>
      <p className="text-xs opacity-70">Use this same email at checkout.</p>
    </form>
  )
}

/**
 * The one buy control on the page. On sale: a link to the GHL checkout that
 * fires checkout_start (or, for partner referrals, an email step first). Not on
 * sale: a waitlist (or a jump to it), never a price.
 */
export default function EnrollAction({ placement, compact = false }: Props) {
  const href = foundationsCheckoutUrl(placement)
  const [referred, setReferred] = useState(false)
  useEffect(() => setReferred(isReferred()), [])

  if (href) {
    return (
      <>
        <Script
          id="ghl-affiliate-manager"
          src="https://api.staffly.digital/js/am.js"
          strategy="afterInteractive"
          onLoad={() =>
            window.affiliateManager?.init('ho6WmH1yhCyFjdJAkqGA', 'https://backend.leadconnectorhq.com', '.aixdesign.dev')
          }
        />
        {referred && compact ? (
          <a href="#enroll" className="fdn-btn">
            Enroll in AI Foundations, {FOUNDATIONS_PRICE}
          </a>
        ) : referred ? (
          <ReferredCheckout href={href} placement={placement} />
        ) : (
          <a
            href={href}
            className="fdn-btn"
            onClick={() => trackConversion('checkout_start', { location: placement, item: 'ai-foundations' })}
          >
            Enroll in AI Foundations, {FOUNDATIONS_PRICE}
          </a>
        )}
      </>
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
