import type { Metadata } from 'next'
import Link from 'next/link'
import VoiceAgentWaitlistForm from './_components/VoiceAgentWaitlistForm'
import VoiceAgentFooter from './_components/VoiceAgentFooter'
import VoiceAgentUseCaseCard from './_components/VoiceAgentUseCaseCard'
import {
  PhoneIcon,
  VoicemailIcon,
  ClockIcon,
  ReceiptIcon,
} from './_components/icons/UseCaseIcons'

/**
 * Brand-exception note (see docs/features/voice-agent-waitlist.md):
 * docs/BRAND-KIT.md requires "Book a Discovery Call" as the sitewide primary
 * CTA. This route is a scoped exception - its only CTA is "Join the
 * Waitlist" - because the spec for this page requires waitlist-only capture
 * for a not-yet-built offering. No discovery-call CTA appears on this route.
 */

const TITLE = 'AI Voice Agent — Coming Soon | AI by Design'
const DESCRIPTION =
  'A future voice-agent offering for small businesses. Join the waitlist for updates on after-hours calls, customer questions, message-taking, and restaurant workflows.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/voice-agent' },
  openGraph: {
    type: 'website',
    url: 'https://aixdesign.dev/voice-agent',
    siteName: 'AI by Design',
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    creator: '@aixdesign',
  },
}

const USE_CASES = [
  {
    heading: 'Customer service',
    body: 'A planned way to handle routine questions using information your business approves, with a clear handoff when a person is needed.',
    icon: <PhoneIcon />,
  },
  {
    heading: 'Voicemail replacement',
    body: 'A planned alternative to the voicemail beep: collect the caller’s reason for calling and the details your team needs to follow up.',
    icon: <VoicemailIcon />,
  },
  {
    heading: 'After-hours coverage',
    body: 'Planned call handling when your team is off the clock, so callers can leave a useful request without waiting for business hours.',
    icon: <ClockIcon />,
  },
  {
    heading: 'Restaurants and order-taking',
    body: 'We’re exploring restaurant questions and order-request capture. Menu rules, order confirmation, and staff handoff would need to be defined before launch.',
    icon: <ReceiptIcon />,
  },
]

export default function VoiceAgentPage() {
  return (
    <main className="min-h-screen bg-background bg-gold-radial">
      {/* Header */}
      <header className="w-full px-6 py-6">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <Link href="/" aria-label="AI by Design home">
            {/* Plain <img>, not next/image: local SVGs need dangerouslyAllowSVG in
                next.config.js, which is out of scope for this isolated build. */}
            <img src="/brand/aixdesign-lockup.svg" alt="AI by Design" width={140} height={28} />
          </Link>
          <a
            href="#waitlist"
            className="min-h-[44px] text-sm font-medium text-gold underline-offset-4 hover:underline flex items-center"
          >
            Join the Waitlist
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="section text-center">
        <p className="text-sm font-medium tracking-[0.2em] text-gold">COMING SOON</p>
        <h1 className="mt-4 text-[40px] font-semibold leading-[1.05] tracking-[-0.02em] text-white md:text-[64px]">
          AI Voice Agent
        </h1>
        <p className="mt-6 text-lg text-white md:text-xl">
          Planned phone coverage for the calls you can&apos;t get to.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-stone-400">
          We&apos;re developing a voice-agent offering for small businesses: after-hours call
          handling, routine customer questions, and clearer message-taking. Restaurant and
          order-taking workflows are also under consideration.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <a href="#waitlist" className="cta-btn min-h-[44px] px-8 py-3 text-sm">
            Join the Waitlist
          </a>
          <p className="text-sm text-stone-400">
            Not available yet. Join for development and launch updates.
          </p>
        </div>
        <p className="mt-10 text-sm text-stone-400">
          AI by Design — Stop learning about AI. Start running on it.
        </p>
      </section>

      <hr className="gold-rule mx-auto max-w-[900px]" />

      {/* Use cases */}
      <section className="section-wide">
        <h2 className="text-center text-2xl font-semibold tracking-[-0.02em] text-white md:text-3xl">
          What we&apos;re designing for
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-base text-stone-400">
          These are planned use cases, not features available today.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {USE_CASES.map((useCase, index) => (
            <VoiceAgentUseCaseCard
              key={useCase.heading}
              heading={useCase.heading}
              body={useCase.body}
              icon={useCase.icon}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* Lean trust / design section */}
      <section className="section text-center">
        <h2 className="text-2xl font-semibold tracking-[-0.02em] text-white md:text-3xl">
          Built around the business. Not a generic script.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-stone-400">
          The design priorities are simple: business-approved information, clear limits, and a
          human handoff when needed. We&apos;re using early interest to decide which workflows to
          build first.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-base text-stone-400">
          Joining the waitlist does not create an account or provide access to a working product.
        </p>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="section flex flex-col items-center text-center">
        <h2 className="text-2xl font-semibold tracking-[-0.02em] text-white md:text-3xl">
          Tell us where calls get stuck.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-stone-400">
          Leave your email for updates. If you want, tell us what kind of business you run and
          which calls you need help with.
        </p>
        <div className="mt-8 w-full max-w-[560px]">
          <VoiceAgentWaitlistForm />
        </div>
        <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-stone-400">
          We&apos;ll store your email and any business details you share to manage this waitlist
          and send product updates. This does not subscribe you to the AI by Design newsletter.
          You can ask to leave the list at{' '}
          <a href="mailto:hello@aixdesign.dev" className="text-gold hover:underline">
            hello@aixdesign.dev
          </a>
          . See our{' '}
          <Link href="/privacy" className="text-gold hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </section>

      <VoiceAgentFooter />
    </main>
  )
}
