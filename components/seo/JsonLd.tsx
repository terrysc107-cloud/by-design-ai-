const SITE_URL = 'https://aixdesign.dev'

/**
 * Organization + ProfessionalService structured data for AI by Design.
 * Rendered once in the root layout. Only includes facts we can stand behind
 * (per BRAND-KIT.md §14 — don't claim what we can't show). `sameAs` is left
 * out until the social profiles are live; add verified handles then.
 */
export default function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#organization`,
    name: 'AI by Design',
    alternateName: 'aixdesign',
    url: SITE_URL,
    logo: `${SITE_URL}/brand/aibydesign-wordmark.svg`,
    image: `${SITE_URL}/opengraph-image`,
    description:
      'AI by Design is an AI business coaching & consulting agency. We diagnose the bottleneck, design the system, and ship a lean, autonomous custom solution — tool-agnostic, outcome-led.',
    slogan: 'Stop learning about AI. Start running on it.',
    email: 'hello@aixdesign.dev',
    areaServed: 'Worldwide',
    priceRange: '$$',
    knowsAbout: [
      'AI business coaching',
      'AI consulting',
      'Business process automation',
      'Agentic AI workflows',
      'Custom software builds',
    ],
    serviceType: [
      'AI Coaching',
      'AI Consulting',
      'Custom Solution Builds',
      'Operating Partner Retainer',
    ],
    founder: { '@type': 'Person', name: 'Terry' },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'hello@aixdesign.dev',
      url: 'https://calendly.com/terrysc107/15-min-ai-discovery-call',
      availableLanguage: 'English',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
