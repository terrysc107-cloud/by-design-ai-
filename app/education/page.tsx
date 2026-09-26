import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

import { DISCOVERY_CALL_URL } from '@/lib/cta'
import {
  AFFILIATION_DISCLAIMER,
  LADDER,
  COURSE_NAME,
  COURSE_PRICE,
  LIVE_LAB_NAME,
  courseUrl,
  labWaitlistUrl,
} from '@/lib/education'
import './education.css'

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
    body: 'Tools change every few months. A repeatable way of working, written down in files you own, outlives all of them.',
  },
  {
    title: 'You finish with something running',
    body: 'Every course ends in a working system you built yourself, on a schedule, not a folder of notes and a certificate.',
  },
  {
    title: 'Written for operators',
    body: 'For people who run a business and want leverage. No coding, no computer science, and no hype reel.',
  },
]

export default function EducationPage() {
  return (
    <main className="education-page relative min-h-screen overflow-x-hidden">
      <Header />

      <section className="section pt-32 md:pt-40">
        <div className="education-hero max-w-3xl mx-auto">
          <p className="text-gold text-[10px] tracking-[0.35em] uppercase font-medium mb-4">
            Education
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold text-white tracking-tight leading-tight">
            Learn to build the systems.
          </h1>
          <p className="text-white/55 text-base md:text-lg leading-relaxed mt-5">
            AI by Design builds custom systems for business owners, and teaches the same method
            to the owners who would rather build it themselves. Two ways in, one system.
            Independent, practical, and priced honestly.
          </p>
          <div className="education-hero__actions">
            <a href="#available" className="cta-btn">Explore what&apos;s available ↓</a>
            <Link href="/education/claude-code" className="education-text-link">Preview the first course <span>→</span></Link>
          </div>
          <div className="education-system" aria-label="The AI by Design learning loop: business signals become scheduled agent work, review, and action">
            <div className="education-system__rail" aria-hidden="true"><i /><i /><i /><i /></div>
            {[
              ['01', 'Your signals', 'Numbers + context'],
              ['02', 'Agent seats', 'Narrow responsibilities'],
              ['03', 'Scheduled run', 'Work without prompting'],
              ['04', 'Decision brief', 'A meeting you can act on'],
            ].map(([number, title, note]) => (
              <div className="education-system__node" key={number}>
                <span>{number}</span><strong>{title}</strong><small>{note}</small>
              </div>
            ))}
          </div>

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
      <section id="available" className="section education-catalog pt-0">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            What&apos;s available
          </h2>

          {/* Self-paced course — live and purchasable */}
          <article className="education-offer education-offer--course mt-8 border border-gold/25 bg-[#23201b]/40 p-8">
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
              Build your own AI board: a few narrow assistants that read your real numbers on a
              schedule and hand you a meeting you can act on. You start from an empty folder and
              you do not write any code.
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
                className="education-text-link"
              >
                See what&apos;s inside
              </Link>
            </div>
          </article>

          {/* Cohort schedules and tuition are owned by the course platform. */}
          <article
            id="lab"
            className="education-offer education-offer--lab mt-6 scroll-mt-28 border border-gold/25 bg-[#23201b]/40 p-8 grid gap-8"
          >
            <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-[10px] tracking-[0.25em] uppercase text-gold border border-gold/40 px-2.5 py-1">
                Live cohort
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-white/40">
                Four-week programs · personalized preparation
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight">
              {LIVE_LAB_NAME}
            </h3>
            <p className="text-white/55 text-sm md:text-base leading-relaxed mt-3">
              Start with Your AI Operating Company: define your agent’s identity, teach it your business,
              and build your CEO and board. Your business questionnaire shapes a reviewed preparation
              plan, weekly deliverables, and live feedback. Future labs explore content, follow-up,
              websites, and operations.
            </p>
            <p className="text-white/70 text-sm mt-4">See the current tuition, application details, and scheduled cohorts on the Build Lab platform.</p>
            <div className="mt-6">
              <a
                href={labWaitlistUrl('education-hub-lab')}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-btn inline-block px-8 py-4 text-xs tracking-widest"
              >
                Explore the labs →
              </a>
            </div>
            </div>
          </article>

          <p className="text-white/35 text-xs leading-relaxed mt-8">{AFFILIATION_DISCLAIMER}</p>
        </div>
      </section>

      {/* The ladder.

          Rungs above the course are shown WITHOUT prices and WITHOUT CTAs, and
          that is deliberate rather than an omission. Only the course can be
          bought today; a price printed beside something nobody can buy is a
          quote we would have to honour, aging in a repo nobody edits when the
          real number moves in the course platform. See the note on LADDER in
          lib/education.ts. Nothing here invents a date, a seat count, or a
          countdown. */}
      <section className="section pt-0">
        <div className="max-w-3xl mx-auto border-t border-white/10 pt-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            Where it goes after that
          </h2>
          <p className="text-white/50 text-sm md:text-base leading-relaxed mt-4 max-w-xl">
            Each step is the same idea with more of the work done for you. Most people never
            leave the first one, and that is a fine outcome.
          </p>

          <ol className="education-ladder mt-8 border border-white/10">
            {LADDER.map((rung, i) => (
              <li
                key={rung.id}
                className={`flex gap-5 p-6 ${i > 0 ? 'border-t border-white/10' : ''} ${
                  rung.available ? '' : 'opacity-70'
                }`}
              >
                <span className="text-gold/50 text-xs font-mono pt-1 shrink-0 w-6">
                  {String(rung.rung).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                    <h3 className="text-gold text-sm font-semibold tracking-wide">{rung.name}</h3>
                    {rung.available && rung.priceDisplay ? (
                      <span className="text-white/70 text-xs">{rung.priceDisplay}</span>
                    ) : (
                      <span className="text-[10px] tracking-[0.25em] uppercase text-white/35">
                        Planned next step
                      </span>
                    )}
                  </div>
                  <p className="text-white/55 text-sm leading-relaxed">{rung.promise}</p>
                  <p className="text-white/35 text-xs leading-relaxed mt-2">{rung.forWho}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Education → custom builds */}
      <section className="section education-choice pt-0">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            Learning it and hiring it are both fine.
          </h2>
          <p className="text-white/55 text-sm md:text-base leading-relaxed mt-4">
            The courses and the consulting are the same system at two levels of done-for-you. If
            you have the time and want the skill, learn it. The method is the whole point and you
            keep it. If what you actually need is the system running by next quarter, that is what
            AI by Design builds for clients, and a discovery call is the faster path.
          </p>
          <p className="text-white/55 text-sm md:text-base leading-relaxed mt-4">
            Plenty of people do both: take the course, build the first version themselves, then
            bring us in for the parts that need to be bulletproof.
          </p>
          <div className="education-choice__actions">
            <div><span>Build it yourself</span><strong>{COURSE_NAME}</strong><a href={courseUrl('education-closing-course')} target="_blank" rel="noopener noreferrer">Get the course — {COURSE_PRICE} →</a></div>
            <div><span>Have it built with you</span><strong>Start with the bottleneck</strong><a href={DISCOVERY_CALL_URL} target="_blank" rel="noopener noreferrer">Book a discovery call ↗</a></div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
