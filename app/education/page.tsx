import type { Metadata } from 'next'
import Link from 'next/link'
import NoiseBg from '@/components/effects/NoiseBg'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FinalCTA from '@/components/sections/FinalCTA'
import {
  AFFILIATION_DISCLAIMER,
  COURSE_NAME,
  COURSE_PRICE,
  LIVE_LAB_NAME,
  courseUrl,
} from '@/lib/education'

export const metadata: Metadata = {
  title: 'Education — Learn to Build the Systems | AI by Design',
  description:
    'Independent, practical AI education from AI by Design. Self-paced courses and planned live sessions for operators who want to build working systems, not collect theory.',
  alternates: { canonical: '/education' },
  openGraph: {
    type: 'website',
    url: 'https://aixdesign.dev/education',
    title: 'AI by Design — Education',
    description:
      'Practical AI education for operators. Learn the method we use to ship real systems.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI by Design — Education',
    description:
      'Practical AI education for operators. Learn the method we use to ship real systems.',
  },
}

const PRINCIPLES = [
  {
    title: 'Method over tools',
    body: 'Tools change every few months. A repeatable way of working — inspect, plan, build, review, test, ship — outlives all of them.',
  },
  {
    title: 'You finish with something real',
    body: 'Every course ends in a working build you made yourself, not a folder of notes and a certificate.',
  },
  {
    title: 'Written for operators',
    body: 'For people who run a business and want leverage. Not a computer science course, and not a hype reel.',
  },
]

export default function EducationPage() {
  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      <NoiseBg />
      <Header />

      <section className="section pt-32 md:pt-40">
        <div className="max-w-3xl mx-auto">
          <p className="text-gold text-[10px] tracking-[0.35em] uppercase font-medium mb-4">
            Education
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold text-white tracking-tight leading-tight">
            Learn to build the systems.
          </h1>
          <p className="text-white/55 text-base md:text-lg leading-relaxed mt-5">
            Most of what AI by Design does is build custom systems for business owners. Some
            people would rather learn to build it themselves — so we teach the same method we
            use to organize our own builds. Independent, practical, and priced honestly.
          </p>

          <div className="mt-12 grid gap-px sm:grid-cols-3 bg-white/5 border border-white/10">
            {PRINCIPLES.map(item => (
              <div key={item.title} className="bg-background p-6">
                <h2 className="text-gold text-sm font-semibold tracking-wide mb-2">
                  {item.title}
                </h2>
                <p className="text-white/55 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course catalog */}
      <section className="section pt-0">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            What&apos;s available
          </h2>

          {/* Self-paced course — live and purchasable */}
          <article className="mt-8 border border-gold/25 bg-[#23201b]/40 p-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-[10px] tracking-[0.25em] uppercase text-gold border border-gold/40 px-2.5 py-1">
                Self-paced
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-white/40">
                Available now
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight">
              {COURSE_NAME}
            </h3>
            <p className="text-white/55 text-sm md:text-base leading-relaxed mt-3">
              A self-paced course on using Claude Code as an operator&apos;s build tool. You
              learn one disciplined loop — inspect, plan, build, review, test, ship — and use it
              to take a real internal tool from an empty folder to something you actually run.
            </p>
            <p className="text-white/70 text-sm mt-4">
              <span className="text-gold font-semibold">{COURSE_PRICE}</span> one-time · lifetime
              access
            </p>
            <div className="flex flex-wrap items-center gap-5 mt-6">
              <a
                href={courseUrl('education-hub-primary')}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-btn px-8 py-4 text-xs tracking-widest"
              >
                Get the course →
              </a>
              <Link
                href="/education/claude-code"
                className="text-[11px] tracking-widest uppercase text-white/55 hover:text-gold transition-colors"
              >
                See what&apos;s inside
              </Link>
            </div>
          </article>

          {/* Live lab — planned, not for sale */}
          <article className="mt-6 border border-white/10 bg-white/[0.02] p-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-[10px] tracking-[0.25em] uppercase text-white/50 border border-white/20 px-2.5 py-1">
                Live
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-white/40">
                Planned — not yet scheduled
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-white/85 tracking-tight">
              {LIVE_LAB_NAME}
            </h3>
            <p className="text-white/50 text-sm md:text-base leading-relaxed mt-3">
              A live, hands-on version of the same method, run as a working session rather than a
              lecture. It is still being designed. There is no date, no price, and no way to buy
              it yet — when that changes, it will be announced in the newsletter first.
            </p>
            <div className="mt-6">
              <Link
                href="/newsletter"
                className="text-[11px] tracking-widest uppercase text-gold/80 hover:text-gold transition-colors border-b border-gold/30 hover:border-gold pb-1"
              >
                Hear about it in the newsletter →
              </Link>
            </div>
          </article>

          <p className="text-white/35 text-xs leading-relaxed mt-8">{AFFILIATION_DISCLAIMER}</p>
        </div>
      </section>

      {/* Education → custom builds */}
      <section className="section pt-0">
        <div className="max-w-3xl mx-auto border-t border-white/10 pt-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            Learning it and hiring it are both fine.
          </h2>
          <p className="text-white/55 text-sm md:text-base leading-relaxed mt-4">
            The courses and the consulting are the same craft pointed at two different problems.
            If you have time and want the skill, learn it — the method is the whole point, and
            you keep it. If what you actually need is the system running by next quarter, that is
            what AI by Design builds for clients, and a discovery call is the faster path.
          </p>
          <p className="text-white/55 text-sm md:text-base leading-relaxed mt-4">
            Plenty of people do both: take the course, build the first version themselves, then
            bring us in for the parts that need to be bulletproof.
          </p>
        </div>
      </section>

      <FinalCTA />
      <Footer />
    </main>
  )
}
