import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import NoiseBg from '@/components/effects/NoiseBg'
import GoldRule from '@/components/ui/GoldRule'
import { DISCOVERY_CALL_URL } from '@/lib/cta'

const packages = [
  {
    name: 'AI Strategy Call',
    price: '$149',
    detail: '60 minutes',
    bestFor: 'Owner with a messy idea, tool stack, or bottleneck',
    bullets: [
      'Clarify the real constraint in your business',
      'Map where AI or automation can create leverage',
      'Leave with a simple next-action plan',
    ],
  },
  {
    name: '30-Day AI Operating System Sprint',
    price: '$499',
    detail: '3 sessions + async support',
    bestFor: 'Founder who wants coaching plus implementation direction',
    bullets: [
      'Workflow audit and priority map',
      'AI-assisted operating rhythm for leads, clients, or delivery',
      'Implementation checklist you or your team can execute',
    ],
    featured: true,
  },
  {
    name: 'Operating Partner Retainer',
    price: '$1,500+/mo',
    detail: 'Monthly advisory + system tuning',
    bestFor: 'Team that needs an AI systems partner, not another app',
    bullets: [
      'Ongoing coaching for decision-making and execution',
      'Automation roadmap and workflow improvements',
      'Review, refine, and scale the system over time',
    ],
  },
]

export default function CoachingPage() {
  return (
    <main id="top" className="relative min-h-screen bg-background overflow-x-hidden text-white">
      <NoiseBg />
      <Header />

      <section className="section-wide pt-32 md:pt-40">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.35em] text-gold/70">
            AI Coaching by Design
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Stop collecting AI tools. Start building an operating system.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/55 md:text-lg">
            Coaching for owners and operators who know AI matters, but need help turning it into better decisions,
            cleaner workflows, and real business leverage.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={DISCOVERY_CALL_URL}
              target="_blank"
              rel="noreferrer"
              className="border border-gold bg-gold px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#1E1B17] transition-colors hover:bg-transparent hover:text-gold"
            >
              Book a Discovery Call
            </a>
            <Link
              href="/guide"
              className="border border-white/15 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70 transition-colors hover:border-gold/50 hover:text-gold"
            >
              Read the Free Guide
            </Link>
          </div>
        </div>
      </section>

      <GoldRule />

      <section className="section-wide">
        <div className="grid gap-5 md:grid-cols-3">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`flex flex-col border p-6 ${pkg.featured ? 'border-gold/60 bg-gold/[0.06]' : 'border-gold/15 bg-white/[0.02]'}`}
            >
              {pkg.featured && (
                <span className="mb-4 w-fit border border-gold/35 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-gold">
                  Best beta offer
                </span>
              )}
              <h2 className="text-xl font-semibold text-white">{pkg.name}</h2>
              <p className="mt-3 text-3xl font-semibold text-gold">{pkg.price}</p>
              <p className="mt-1 text-sm text-white/40">{pkg.detail}</p>
              <p className="mt-5 text-sm leading-relaxed text-white/55">{pkg.bestFor}</p>
              <ul className="mt-6 space-y-3 text-sm leading-relaxed text-white/65">
                {pkg.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <GoldRule />

      <section className="section-wide">
        <div className="mx-auto max-w-3xl border border-gold/20 bg-white/[0.02] p-8 text-center md:p-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold/70">How it works</p>
          <h2 className="mt-4 text-2xl font-semibold md:text-3xl">A coaching call should create decisions, not homework piles.</h2>
          <div className="mt-8 grid gap-4 text-left md:grid-cols-3">
            {['Diagnose the bottleneck', 'Design the operating rhythm', 'Ship the next useful system'].map((step, i) => (
              <div key={step} className="border border-white/10 p-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-gold/60">Step {i + 1}</p>
                <p className="mt-3 text-sm text-white/70">{step}</p>
              </div>
            ))}
          </div>
          <a
            href={DISCOVERY_CALL_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex border border-gold px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold transition-colors hover:bg-gold hover:text-[#1E1B17]"
          >
            Start with a free discovery call
          </a>
        </div>
      </section>

      <GoldRule />
      <Footer />
    </main>
  )
}
