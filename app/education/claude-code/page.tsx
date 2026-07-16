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
  title: 'Claude Code Class — Self-Paced Course | AI by Design',
  description:
    'A self-paced course teaching one disciplined build loop — inspect, plan, build, review, test, ship — with Claude Code. $97 one-time. Independent educational product by AI by Design.',
  alternates: { canonical: '/education/claude-code' },
  openGraph: {
    type: 'website',
    url: 'https://aixdesign.dev/education/claude-code',
    title: 'Claude Code Class — AI by Design',
    description:
      'Learn one disciplined build loop and ship a real internal tool. $97 one-time, self-paced.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Claude Code Class — AI by Design',
    description:
      'Learn one disciplined build loop and ship a real internal tool. $97 one-time, self-paced.',
  },
}

const METHOD = [
  {
    step: 'Inspect',
    body: 'Before writing anything, read what is already there. Most bad AI output comes from a model guessing at context it was never given. You learn to make the machine look first.',
  },
  {
    step: 'Plan',
    body: 'Turn a vague want into a written, checkable plan you approve before any code exists. This is the step almost everyone skips, and it is the one that saves the day.',
  },
  {
    step: 'Build',
    body: 'Work in small, reversible pieces against the plan. You stay the one making decisions; the tool does the typing.',
  },
  {
    step: 'Review',
    body: 'Read the diff and judge it. You learn what a suspicious change looks like, so you can catch problems while they are still cheap.',
  },
  {
    step: 'Test',
    body: 'Actually run the thing and watch it behave. Passing tests are evidence; a confident summary is not.',
  },
  {
    step: 'Ship',
    body: 'Get it in front of real use, then handle what breaks. A tool that runs beats a perfect one that never leaves your laptop.',
  },
]

const FOR_YOU = [
  'You run a business or a team and keep hitting a wall that is obviously software-shaped.',
  'You have tried AI coding tools, gotten a demo that half-worked, and could not tell why.',
  'You are comfortable in a terminal, or willing to be uncomfortable in one for a few evenings.',
  'You want the method, not just the output — you plan to build more than one thing.',
]

const NOT_FOR_YOU = [
  'You want the finished system without doing the build. That is what our custom builds are for.',
  'You are looking for a business model, a side hustle, or income claims. This is a craft course.',
  'You want a comprehensive computer science education. This is a narrow, practical loop.',
  'You want a tool tour. Tools shift; this teaches a way of working that survives them.',
]

export default function ClaudeCodeCoursePage() {
  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      <NoiseBg />
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
            Most people use an AI coding tool like a slot machine: describe the thing, pull the
            lever, hope. This course replaces that with one disciplined loop you run every time —{' '}
            <span className="text-white/80">
              inspect → plan → build → review → test → ship
            </span>{' '}
            — and has you use it to build a real internal tool from an empty folder.
          </p>

          <div className="flex flex-wrap items-center gap-5 mt-8">
            <a
              href={courseUrl('course-page-hero')}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn px-8 py-4 text-xs tracking-widest"
            >
              Get the course — {COURSE_PRICE} →
            </a>
            <span className="text-white/35 text-xs tracking-wide">
              One-time · Self-paced · Lifetime access
            </span>
          </div>
          <p className="text-white/30 text-xs mt-4">
            Hosted on claudecodeclass.com — the AI by Design course platform.
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
            Six steps, in order, every time. It is deliberately boring — that is why it works
            under pressure. This is the same loop used to organize AI by Design builds.
          </p>

          <ol className="mt-8 border border-white/10">
            {METHOD.map((item, i) => (
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
                  <p className="text-white/55 text-sm leading-relaxed">{item.body}</p>
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
            The course ends with one standardized capstone: a Lead Follow-Up Command Center.
            You build it through the complete loop — brief, inspect, plan, scaffold, data,
            feature, tests, browser QA, deployment, and rollback — before adapting the method
            to your own business problem.
          </p>
          <div className="mt-8 grid gap-px sm:grid-cols-2 bg-white/5 border border-white/10">
            <div className="bg-background p-6">
              <h3 className="text-gold text-sm font-semibold tracking-wide mb-2">
                A tool you actually use
              </h3>
              <p className="text-white/55 text-sm leading-relaxed">
                A complete lead follow-up tool you can inspect, test, deploy, and change — not
                an unrelated set of disconnected code snippets.
              </p>
            </div>
            <div className="bg-background p-6">
              <h3 className="text-gold text-sm font-semibold tracking-wide mb-2">
                A loop you can repeat
              </h3>
              <p className="text-white/55 text-sm leading-relaxed">
                The second build is faster than the first because the method transfers. That is
                the actual deliverable — the tool is proof you have it.
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

      {/* Live lab — planned */}
      <section className="section pt-0">
        <div className="max-w-3xl mx-auto border-t border-white/10 pt-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            A live version is being designed
          </h2>
          <p className="text-white/50 text-sm md:text-base leading-relaxed mt-4">
            <span className="text-white/70">{LIVE_LAB_NAME}</span> will run the same loop as a
            live working session instead of a self-paced course. It is not scheduled and cannot
            be bought yet — no date, no price, no waitlist deposit. When it is real, newsletter
            subscribers hear first.
          </p>
          <div className="mt-6">
            <Link
              href="/newsletter"
              className="text-[11px] tracking-widest uppercase text-gold/80 hover:text-gold transition-colors border-b border-gold/30 hover:border-gold pb-1"
            >
              Hear about it in the newsletter →
            </Link>
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
            AI by Design is a coaching and consulting agency — the main work is diagnosing a
            bottleneck and shipping the custom system that removes it. This course teaches the
            method behind that work to people who would rather build it themselves.
          </p>
          <p className="text-white/55 text-sm md:text-base leading-relaxed mt-4">
            If you get partway in and decide the build is not the best use of your time, that is
            a legitimate answer. Book a discovery call and we will scope it as a custom build
            instead. Buying the course is not a prerequisite for anything, and the call is free
            either way.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <a
              href={courseUrl('course-page-footer')}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn px-8 py-4 text-xs tracking-widest"
            >
              Get the course — {COURSE_PRICE} →
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
