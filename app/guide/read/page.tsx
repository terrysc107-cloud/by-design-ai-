import type { Metadata } from 'next'
import Link from 'next/link'
import { labWaitlistUrl } from '@/lib/education'
import Image from 'next/image'

const COURSE_URL = 'https://runyouraiboard.com/?utm_source=aixdesign.dev&utm_medium=referral&utm_campaign=board-method-guide'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'The Board Method: Build AI Employees That Run Without You | AI by Design',
  description:
    'A free guide to running your business on a board of AI employees. Charter, Floor, Run, Review, Promote — the five steps, the four files they read, and the honest limits of what this does.',
  alternates: { canonical: '/guide/read' },
  // UNLISTED, not secured. Moving the full guide off /guide stops it being the
  // thing a social link gives away and keeps it out of search, but anyone with
  // this URL can read it. Real gating would need auth, which is the wrong trade
  // for a lead magnet: the email address is what we are selling the PDF for,
  // and someone determined enough to guess a URL was never going to convert.
  openGraph: {
    type: 'article',
    url: 'https://aixdesign.dev/guide/read',
    title: 'The Board Method',
    description:
      'Five steps to AI employees that start work without you: Charter, Floor, Run, Review, Promote.',
  },
}

/**
 * THE BOARD METHOD — the free guide.
 *
 * Replaces "10 Automations Every Solo Operator Needs", which was a generic
 * listicle carrying invented figures ("3-8 leads lost per month"). Those numbers
 * came from nowhere, and this whole business is being built on the claim that we
 * only publish what we can support. The guide was contradicting the product.
 *
 * The `symptom` field is where those invented costs used to live. It now names
 * something the reader can check in their own week, which is more persuasive
 * than a fabricated dollar figure and happens to be true.
 */
const items = [
  {
    num: '01',
    title: 'Charter',
    image: '/guide/01-charter.png',
    problem:
      'Most people write a prompt. A prompt is what you ask this time, so every session starts from zero: you re-explain your business, it produces something generic, and nothing accumulates. A charter is who the seat is, in a file it reads before every single run.',
    symptom: 'You find yourself re-explaining your business at the start of every conversation.',
    fix:
      'One file, five sections: identity (what this seat owns), disposition (how it decides when two reasonable options conflict), mandate (three to five things it is for), guardrails (what it must never claim and never do), and cadence (when it runs). The disposition line does the most work and is the one people skip.',
    takeaway:
      'Write the disposition line first, and make it name something the seat will refuse or kill, including things it would otherwise prefer. "Thoughtful and strategic" describes nobody. "Kills campaigns that do not perform, including her own favourites" changes what it does.',
  },
  {
    num: '02',
    title: 'Floor',
    image: '/guide/02-floor.png',
    problem:
      'A target is a thing to reach, so it quietly becomes a ceiling: the number where attention stops. It also gives your seat nothing useful to say, because "you are at 68% of target" describes arithmetic rather than a situation.',
    symptom: 'Your AI tells you things look broadly fine. Every week. Regardless of the week.',
    fix:
      'Rewrite every goal as a minimum acceptable outcome. Not the aspiration, the number below which the month went badly. Then instruct the seat to report distance to the floor and whether it will clear it, never percent to target.',
    takeaway:
      'If your assistant has never flagged anything, it almost certainly has no floors to measure against. Nothing can be off track when there is no line to be under. That is a ten-minute fix.',
  },
  {
    num: '03',
    title: 'Run',
    image: '/guide/03-run.png',
    problem:
      'Everything most people do with AI is initiated by them. You decide there is work, you open a chat, you supply context. The ceiling is your attention, and nothing happens on a day you do not sit down.',
    symptom: 'Last week nothing happened, because you were busy doing the work.',
    fix:
      'One standing run against durable files, on a schedule. Start with a single daily or weekly job that reads your goals and numbers and tells you what changed and what is off its floor. Add a liveness check, because scheduled work dies silently and the failure is invisible.',
    takeaway:
      'Schedule exactly one run this week, then diary a reminder to confirm it actually fired. A schedule nobody verifies is a schedule that stops without telling you.',
  },
  {
    num: '04',
    title: 'Review',
    image: '/guide/04-review.png',
    problem:
      'Your board will produce something articulate every time. Articulate is free. The failure mode is not gibberish, it is a confident, well-written paragraph that could be about any business and quietly is not about yours.',
    symptom: 'You cannot tell which parts of the answer came from your actual numbers.',
    fix:
      'Four checks, under a minute. Does every claim trace to a number in your files? Did it name what it did not have, rather than filling the gap? Is it consistent with decisions you already made? Could you act on it today? Three of the four failures are fixed by one line in the brief.',
    takeaway:
      'Grade your most recent AI output against those four. The one that usually fails is the second, and the fix is telling it explicitly to report missing numbers instead of estimating them.',
  },
  {
    num: '05',
    title: 'Promote',
    image: '/guide/05-promote.png',
    problem:
      'Autonomy gets treated as a switch. Either you approve everything, which means the work only happens while you watch, or you turn approvals off and hope. The real question is never whether you trust it. It is which specific actions it has earned.',
    symptom: 'You are either approving every single action, or you stopped looking a while ago.',
    fix:
      'Four ranks, each naming what it unlocks and what stays gated. The seat requests a promotion citing its own decision log; you grant or hold; promotions are revocable. Some decisions never move at any rank, and writing that down is what makes the rest safe to climb.',
    takeaway:
      'Write down what your assistant may do today without asking, and one thing it must earn the right to do. That single sentence is the beginning of a ladder.',
  },
]

export default function GuidePage() {
  return (
    <div className="bg-white text-zinc-900 min-h-screen">
      {/* Header */}
      <div className="bg-zinc-950 text-white px-6 pt-20 pb-16">
        <div className="max-w-3xl mx-auto">
          <p className="text-amber-500 text-[10px] tracking-[0.4em] uppercase font-medium mb-6">
            Free Guide
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.1] mb-6">
            The Board Method
          </h1>
          <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-2xl">
            How to build a small board of AI employees that read your real numbers on a
            schedule and hand you a decision, instead of waiting for you to open a chat window.
          </p>
          <p className="text-zinc-600 text-xs tracking-widest uppercase mt-8">
            Read time: approx. 12 minutes
          </p>
        </div>
      </div>

      {/* Intro */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="space-y-5 text-zinc-600 text-base leading-relaxed">
          <p>
            You already know AI can help. The problem is that it only helps on days you
            remember to ask, and every session starts from nothing.
          </p>
          <p>
            A board fixes the remembering. It is a handful of narrow assistants, each with a
            defined job, running on a schedule against a folder of plain files that describe
            your business. Four files do most of the work: what you are trying to move, where
            your numbers stand, what you have already decided, and who is in your pipeline.
          </p>
          <p>
            None of this requires code, and none of it is tied to one AI tool. It is markdown
            files and a schedule, so it runs on whatever you already use.
          </p>
          <p className="text-zinc-900 font-medium">
            Five steps. Charter, Floor, Run, Review, Promote. Each one is a file you end up
            holding.
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="max-w-3xl mx-auto px-6 pb-20 space-y-16">
        {items.map((item) => (
          <div key={item.num} className="border-t border-zinc-200 pt-12">
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-amber-500 text-sm font-medium tracking-widest">{item.num}</span>
              <h2 className="text-xl md:text-2xl font-semibold text-zinc-900">{item.title}</h2>
            </div>

            {item.image ? (
              <div className="w-full relative mb-8 rounded-sm overflow-hidden border border-zinc-200">
                <Image
                  src={item.image}
                  alt={`A real ${item.title} file from a working board`}
                  width={1376}
                  height={768}
                  className="w-full h-auto block"
                />
              </div>
            ) : null}

            <div className="space-y-5 text-zinc-600 text-sm md:text-base leading-relaxed">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 font-medium mb-2">
                  The Problem
                </p>
                <p>{item.problem}</p>
              </div>

              <div className="bg-amber-50 border border-amber-200/60 px-5 py-4 rounded-sm">
                <p className="text-amber-700 text-sm font-medium">
                  How you know it is missing: {item.symptom}
                </p>
              </div>

              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 font-medium mb-2">
                  The Fix
                </p>
                <p>{item.fix}</p>
              </div>

              <div className="border-l-2 border-zinc-900 pl-5">
                <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 font-medium mb-2">
                  Your Next Step
                </p>
                <p className="text-zinc-900 font-medium">{item.takeaway}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* What it will not do — the honesty section */}
      <div className="max-w-3xl mx-auto px-6 pb-20">
        <div className="border-t border-zinc-200 pt-12">
          <h2 className="text-xl md:text-2xl font-semibold text-zinc-900 mb-6">
            What this will not do
          </h2>
          <div className="space-y-5 text-zinc-600 text-sm md:text-base leading-relaxed">
            <p>
              Worth saying plainly, because the failure is predictable. A board produces
              analysis, drafts, and reminders on a schedule. It does not make the decisions. It
              does not send the email. It cannot generate demand, and it will not notice that
              the one thing blocking you is a conversation you have been avoiding for a month.
            </p>
            <p>
              Run a board with nobody acting on it and you get very well organised reports about
              a business that is not moving.
            </p>
            <p className="text-zinc-900 font-medium">
              The honest promise is narrower and still worth it: it removes the excuse that you
              did not have the analysis. The work stays yours.
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-zinc-950 text-white px-6 py-20 text-center">
        <p className="text-amber-500 text-[10px] tracking-[0.4em] uppercase font-medium mb-6">
          Build It
        </p>
        <h2 className="text-2xl md:text-4xl font-semibold tracking-tight mb-4 max-w-xl mx-auto">
          You have the method. The course builds it with you.
        </h2>
        <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-md mx-auto mb-10">
          Everything above is the shape. The course is the build: the files, the schedule, the
          permissions that keep it contained, and how to tell a useful run from a plausible one.
          Written for people who have never coded.
        </p>
        <a
          href={COURSE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border border-amber-500 text-amber-500 px-10 py-4 text-xs tracking-widest uppercase hover:bg-amber-500 hover:text-black transition-colors duration-200"
        >
          See the course →
        </a>
        <p className="text-zinc-600 text-[10px] tracking-widest uppercase mt-6">
          One-time · Lifetime access
        </p>

        {/* The two hops this page used to be missing.
            Everything above routes to the course or to a call, so a reader who
            wanted the PDF, or who wanted it built with them, had nowhere to go:
            /guide is the lead magnet and it could not capture a lead, which
            left the whole drip sequence reachable only from the homepage. */}
        <div className="mt-12 pt-10 border-t border-zinc-800 max-w-lg mx-auto flex flex-col gap-3">
          <p className="text-zinc-400 text-sm leading-relaxed">
            Want this as a PDF?{' '}
            <Link
              href="/guide"
              className="text-amber-500 underline underline-offset-4 hover:text-amber-400"
            >
              Get the PDF
            </Link>{' '}
            and a short series on the parts people get stuck on.
          </p>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Would rather build it with people in the room?{' '}
            <a
              href={labWaitlistUrl('guide-page-lab')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 underline underline-offset-4 hover:text-amber-400"
            >
              The Build Lab
            </a>{' '}
            is a live cohort working on your own board.
          </p>
        </div>
        <p className="text-zinc-500 text-xs mt-10">
          Rather talk it through first?{' '}
          <a
            href="https://calendly.com/terrysc107/15-min-ai-discovery-call"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-300 underline underline-offset-4 hover:text-white"
          >
            Book a free 15-minute call
          </a>
          .
        </p>
      </div>

      {/* Footer */}
      <div className="bg-zinc-950 border-t border-white/5 px-6 py-6 text-center">
        <p className="text-zinc-600 text-xs">
          © 2026 AI by Design.{' '}
          <Link href="/" className="hover:text-zinc-400">
            aixdesign.dev
          </Link>
        </p>
      </div>
    </div>
  )
}
