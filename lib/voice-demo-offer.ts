/**
 * Managed-offer terms for /voice-agent. Imported ONLY by server components
 * (VoiceAgentExperience), never by a 'use client' file, so the recommended
 * numbers below never ship in a browser bundle while unapproved. A test
 * enforces that import rule.
 */

export interface VoiceDemoOffer {
  /** Publication gate. While false, no price, minute allowance, overage, or term is rendered or asked about. */
  approved: boolean
  /** Recommended terms from the 2026-11-07 plan. Edited here and nowhere else; read only via publishedOffer(). */
  pricing: { setupUsd: number; monthlyUsd: number; includedMinutes: number; overagePerMinuteUsd: number; initialTermDays: number }
  unpublished: { title: string; note: string; budgetQuestion: string }
  headline: string
  body: string
  included: string[]
  scopedSeparately: string[]
}

/**
 * To publish pricing: Terry signs off, then set `approved: true` (one line,
 * reviewed in its own commit). Until then the page shows `unpublished` copy.
 */
export const VOICE_DEMO_OFFER: VoiceDemoOffer = {
  approved: false,
  pricing: { setupUsd: 1500, monthlyUsd: 499, includedMinutes: 250, overagePerMinuteUsd: 0.45, initialTermDays: 90 },
  unpublished: {
    title: 'Priced to your shop',
    note: 'Pricing depends on your call volume and setup. We walk through it on a short fit call, and nothing is agreed until it is in writing.',
    budgetQuestion: 'Is a managed monthly service something you could budget for?',
  },
  headline: 'Managed for you, not another app to learn.',
  body: 'We configure, launch, and run your receptionist. You get the leads. We handle the tuning.',
  included: [
    'Configuration for your services, area, hours, and escalation rules',
    'A lead summary to the owner after every captured call',
    'Monitoring, answer tuning, and support from AIxDesign',
    'A monthly review of calls and results with you',
  ],
  scopedSeparately: [
    'CRM, calendar, dispatch, or payment integrations',
    'Multilingual support',
    'Multiple locations or high call volume',
    'Custom APIs',
  ],
}

export interface PublishedOffer {
  /** Monthly amount, e.g. "$499"; the page appends "per month". */
  main: string
  sub: string
  terms: [label: string, value: string][]
  budgetQuestion: string
}

const usd = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0 })}`

/** The only path from the pricing numbers to the page. Null unless approved. */
export function publishedOffer(offer: VoiceDemoOffer = VOICE_DEMO_OFFER): PublishedOffer | null {
  if (!offer.approved) return null
  const p = offer.pricing
  return {
    main: usd(p.monthlyUsd),
    sub: `from go-live, plus ${usd(p.setupUsd)} setup due at kickoff`,
    terms: [
      ['Included', `${p.includedMinutes} completed receptionist minutes a month`],
      ['Beyond that', `${usd(p.overagePerMinuteUsd)} per completed minute`],
      ['Term', `${p.initialTermDays}-day initial term, then month to month`],
    ],
    budgetQuestion: `Does ${usd(p.setupUsd)} setup and ${usd(p.monthlyUsd)} a month fit?`,
  }
}

/** Offer copy that renders while unapproved; scanned by the copy guardrail test. */
export const VOICE_DEMO_OFFER_COPY_STRINGS: string[] = [
  ...Object.values(VOICE_DEMO_OFFER.unpublished),
  VOICE_DEMO_OFFER.headline,
  VOICE_DEMO_OFFER.body,
  ...VOICE_DEMO_OFFER.included,
  ...VOICE_DEMO_OFFER.scopedSeparately,
]
