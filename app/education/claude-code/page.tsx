import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FinalCTA from '@/components/sections/FinalCTA'
import {
  AFFILIATION_DISCLAIMER,
  BOARD_LOOP,
  COURSE_NAME,
  COURSE_PRICE,
  LIVE_LAB_NAME,
  courseUrl,
  labWaitlistUrl,
} from '@/lib/education'
import '../education.css'

export const metadata: Metadata = {
  title: 'My AI Board — Self-Paced Course | AI by Design',
  description:
    `Build your own AI board: a few narrow assistants that read your real numbers on a schedule and hand you a meeting you can act on. No coding. ${COURSE_PRICE} one-time. Independent educational product by AI by Design.`,
  alternates: { canonical: '/education/claude-code' },
  openGraph: {
    type: 'website',
    url: 'https://aixdesign.dev/education/claude-code',
    title: 'My AI Board — AI by Design',
    description: `Build an AI board that runs your standing work on a schedule. ${COURSE_PRICE} one-time, self-paced.`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My AI Board — AI by Design',
    description: `Build an AI board that runs your standing work on a schedule. ${COURSE_PRICE} one-time, self-paced.`,
  },
}

/**
 * WHO THIS PAGE IS WRITTEN FOR, and it changed on 2026-09-03.
 *
 * These lists used to describe a developer: "comfortable in a terminal",
 * "you have tried AI coding tools", "this is a craft course". The course was
 * rebuilt for a solopreneur who has never written code, and the developer
 * curriculum moved to a separate Dev Pack add-on. Selling the old reader the
 * new product is a refund; selling the new reader the old page is worse,
 * because they self-select out before they ever buy.
 *
 * Mirrors WHO_ITS_FOR / WHO_ITS_NOT_FOR in the course repo's course-config.ts.
 */
const FOR_YOU = [
  'You run something small and want AI doing standing work, not one-off chats on the days you remember to open it.',
  'You have never written code and do not intend to start.',
  'You are an operator or consultant who wants to run this on your own business before running it for anyone else.',
  'You want the system in your own hands, not a report someone else generated.',
]

/**
 * Being explicit about who should not buy is a trust feature and a refund
 * reducer. Do not soften this into a second "who it's for" list.
 */
const NOT_FOR_YOU = [
  'You want AI to run the business for you. This builds a board that produces analysis and drafts. The decisions and the work stay yours.',
  'You are looking for passive income or a guaranteed outcome. This teaches a system, and what you do with it is on you.',
  'You want to learn to program. Nothing here teaches you to write code from zero.',
  'You want the finished system without doing the build. That is what our custom builds are for.',
]

export default function ClaudeCodeCoursePage() {
  return (
    <main className="education-page relative min-h-screen overflow-x-hidden">
      <Header />

      {/* Hero */}
      <section className="section pt-32 md:pt-40">
        <div className="max-w-3xl mx-auto">
          <nav className="mb-6" aria-label="Breadcrumb">
            <Link
              href="/education"
              className="text-[10px] tracking-[0.25em] uppercase text-white/40 hover:text-gold transition-colors"
            >
              ← Education
            </Link>
          </nav>

          <p className="text-gold text-[10px] tracking-[0.35em] uppercase font-medium mb-4">
            Self-paced course
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold text-white tracking-tight leading-tight">
            {COURSE_NAME}
          </h1>
          <p className="text-white/55 text-base md:text-lg leading-relaxed mt-5">
            Most AI only works on the days you sit down and open it. This course has you build a
            board instead: a few narrow assistants that read your real numbers{' '}
            <span className="text-white/80">on a schedule</span> and hand you a meeting you can
            act on. You start from an empty folder. You do not write any code.
          </p>

          <div className="flex flex-wrap items-center gap-5 mt-8">
            <a
              href={courseUrl('course-page-hero')}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn px-8 py-4 text-xs tracking-widest"
            >
              Get the course, {COURSE_PRICE} →
            </a>
            <span className="text-white/35 text-xs tracking-wide">
              One-time · Self-paced · Lifetime access
            </span>
          </div>
          <p className="text-white/30 text-xs mt-4">
            Hosted on runyouraiboard.com, the AI by Design course platform.
          </p>
        </div>
      </section>

      {/* The method */}
      <section className="section pt-0">
        <div className="max-w-3xl mx-auto border-t border-white/10 pt-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            The method
          </h2>
          <p className="text-white/55 text-sm md:text-base leading-relaxed mt-4">
            Six steps, in order, every time. It is deliberately boring, which is why it holds up
            on the weeks you are too busy to think about it. This is the same loop the AI by
            Design board runs on.
          </p>

          <ol className="mt-8 border border-white/10">
            {BOARD_LOOP.map((item, i) => (
              <li
                key={item.step}
                className={`flex gap-5 p-6 ${i > 0 ? 'border-t border-white/10' : ''}`}
              >
                <span className="text-gold/50 text-xs font-mono pt-1 shrink-0 w-6">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-gold text-sm font-semibold tracking-wide mb-2">
                    {item.step}
                  </h3>
                  <p className="text-white/55 text-sm leading-relaxed">{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Capstone */}
      <section className="section pt-0">
        <div className="max-w-3xl mx-auto border-t border-white/10 pt-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            What you walk out with
          </h2>
          <p className="text-white/55 text-sm md:text-base leading-relaxed mt-4">
            You start with an empty folder and finish with a board that runs without you sitting
            in front of it: four files it reads, at least one seat with a written charter, a
            schedule it runs on, and a meeting it hands you that traces every claim back to a
            number.
          </p>
          <div className="mt-8 grid gap-px sm:grid-cols-2 bg-white/5 border border-white/10">
            <div className="bg-background p-6">
              <h3 className="text-gold text-sm font-semibold tracking-wide mb-2">
                A board that runs on a schedule
              </h3>
              <p className="text-white/55 text-sm leading-relaxed">
                Yours, in your own folder, reading your own numbers. Not a chat window you have
                to remember to open.
              </p>
            </div>
            <div className="bg-background p-6">
              <h3 className="text-gold text-sm font-semibold tracking-wide mb-2">
                A way to tell a useful run from a plausible one
              </h3>
              <p className="text-white/55 text-sm leading-relaxed">
                The second seat is easier than the first because the method transfers. That is
                the real deliverable. The board is proof you have it.
              </p>
            </div>
          </div>
          <p className="text-white/35 text-xs leading-relaxed mt-6">
            How far you get depends on what you bring and how much time you put in. This is a
            method course, not a guarantee of a specific result.
          </p>
        </div>
      </section>

      {/* Fit */}
      <section className="section pt-0">
        <div className="max-w-3xl mx-auto border-t border-white/10 pt-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            Who it&apos;s for — and who it isn&apos;t
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-gold text-sm font-semibold tracking-wide mb-4">
                This is for you if
              </h3>
              <ul className="flex flex-col gap-3">
                {FOR_YOU.map(item => (
                  <li key={item} className="flex gap-3 text-white/55 text-sm leading-relaxed">
                    <span className="text-gold/60 shrink-0" aria-hidden="true">
                      →
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white/60 text-sm font-semibold tracking-wide mb-4">
                Skip it if
              </h3>
              <ul className="flex flex-col gap-3">
                {NOT_FOR_YOU.map(item => (
                  <li key={item} className="flex gap-3 text-white/40 text-sm leading-relaxed">
                    <span className="text-white/25 shrink-0" aria-hidden="true">
                      ×
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Live lab — waitlist open, still no date.
          Was "not scheduled and cannot be bought yet — no date, no price, no
          waitlist deposit". A price and a waitlist now exist, so only two of
          those four claims survive: there is still no date, and the waitlist
          still takes no deposit. Both are kept because both are true. */}
      <section className="section pt-0">
        <div className="max-w-3xl mx-auto border-t border-white/10 pt-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            There is a live version
          </h2>
          <p className="text-white/55 text-sm md:text-base leading-relaxed mt-4">
            <span className="text-white/80">{LIVE_LAB_NAME}</span> gives you four-week working
            sessions with a preparation plan for your business. Start with your AI CEO and board,
            bring weekly deliverables for review, and add capabilities through future labs.
            Dates, tuition, and applications are on the Build Lab platform.
          </p>
          <div className="mt-6">
            <a
              href={labWaitlistUrl('claude-code-page-lab')}
              className="text-[11px] tracking-widest uppercase text-gold/80 hover:text-gold transition-colors border-b border-gold/30 hover:border-gold pb-1"
            >
              {'Explore the labs'} →
            </a>
          </div>
        </div>
      </section>

      {/* Course → custom builds */}
      <section className="section pt-0">
        <div className="max-w-3xl mx-auto border-t border-white/10 pt-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            Where this fits with the rest of AI by Design
          </h2>
          <p className="text-white/55 text-sm md:text-base leading-relaxed mt-4">
            AI by Design does two things, and they are the same system at two levels of
            done-for-you. This course is how you build it yourself. The consulting work is us
            diagnosing the bottleneck and shipping the system that removes it, in your business,
            with you.
          </p>
          <p className="text-white/55 text-sm md:text-base leading-relaxed mt-4">
            If you get partway in and decide the build is not the best use of your time, that is
            a legitimate answer, not a failed sale. Book a discovery call and we will scope it as
            a custom build instead. Buying the course is not a prerequisite for anything, and the
            call is free either way.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <a
              href={courseUrl('course-page-footer')}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn px-8 py-4 text-xs tracking-widest"
            >
              Get the course, {COURSE_PRICE} →
            </a>
          </div>

          <p className="text-white/35 text-xs leading-relaxed mt-8">{AFFILIATION_DISCLAIMER}</p>
        </div>
      </section>

      <FinalCTA />
      <Footer />
    </main>
  )
}
