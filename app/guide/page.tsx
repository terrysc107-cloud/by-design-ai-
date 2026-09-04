import type { Metadata } from 'next'
import Image from 'next/image'
import GuideForm from '@/components/sections/GuideForm'
import { ASSETS, DISCOVERY_CALL_URL } from '@/lib/cta'
import { AFFILIATION_DISCLAIMER, COURSE_NAME, COURSE_PRICE, courseUrl } from '@/lib/education'

export const metadata: Metadata = {
  title: 'The Board Method — a free guide | AI by Design',
  description:
    'Five steps that take AI from something you operate to a board that runs on a schedule and hands you a meeting you can act on. Seven pages, free.',
  alternates: { canonical: '/guide' },
  openGraph: {
    type: 'website',
    url: 'https://aixdesign.dev/guide',
    siteName: 'AI by Design',
    title: 'The Board Method',
    description:
      'Five steps that take AI from something you operate to a board that runs on a schedule and hands you a meeting you can act on.',
    images: ['https://aixdesign.dev/guide-mockup-light.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Board Method',
    description: 'Five steps to an AI board that runs your standing work on a schedule.',
    images: ['https://aixdesign.dev/guide-mockup-light.jpg'],
  },
}

/**
 * THE LANDING PAGE. This is the link that gets posted.
 *
 * /guide used to serve the entire guide, free and ungated, with a text link to
 * a form on the homepage. So the social link gave away everything and then
 * asked a reader who already had what they came for to click through to a page
 * full of competing CTAs. The full guide now lives, unlisted, at /guide/read.
 *
 * NO NAV, BY DESIGN. Every link in a header is an exit. This page has one ask
 * and the only other links on it are the two rungs below, which are the ask
 * after this one. The masthead is a wordmark, not a menu.
 *
 * NAME AND EMAIL, both required. `bda_leads.name` is NOT NULL, and every drip
 * email opens with a first name, so an anonymous signup produces six emails
 * addressed to "there".
 *
 * THE COURSE AND CONSULTING GET FOUR LINES BETWEEN THEM. They are here so a
 * reader learns the ladder exists, not to be sold on this page. Anything longer
 * competes with the form, and the form is the only thing this page is for.
 */
export default function GuideLandingPage() {
  return (
    <main className="min-h-screen bg-background text-white">
      <div className="max-w-5xl mx-auto px-6">
        <header className="pt-10 pb-2">
          <span className="text-lg font-semibold tracking-tight">
            ai<span className="text-gold">x</span>design
          </span>
        </header>

        {/* The offer and the form, side by side, above the fold. */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center pt-10 md:pt-16 pb-16">
          <div className="order-2 md:order-1">
            <Image
              src={ASSETS.guideMockupLight}
              alt="The Board Method, a seven-page guide"
              width={520}
              height={681}
              className="block w-full h-auto border border-gold/20"
              priority
            />
          </div>

          <div className="order-1 md:order-2 flex flex-col gap-6">
            <p className="text-gold text-[10px] tracking-[0.35em] uppercase font-medium">
              Free guide
            </p>
            <h1 className="text-3xl md:text-[2.75rem] font-semibold tracking-tight leading-[1.08]">
              Your AI only works on the days you sit down.
            </h1>
            <p className="text-white/60 text-base leading-relaxed">
              The Board Method is five steps that take AI from something you operate to a board
              that reads your real numbers on a schedule and hands you a meeting you can act on.
              Seven pages. No coding.
            </p>

            <ul className="flex flex-col gap-3 border-t border-white/10 pt-6">
              {[
                'The charter line that decides how a seat behaves when two options conflict',
                'Why floors surface problems that targets hide',
                'The failure nobody warns you about: scheduled work dies silently',
                'Four checks that tell a useful run from a plausible one',
                'How autonomy gets earned in steps, and stays revocable',
              ].map(item => (
                <li key={item} className="flex gap-3 text-white/60 text-sm leading-relaxed">
                  <span className="text-gold/60 shrink-0" aria-hidden="true">
                    →
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <GuideForm location="guide-landing" className="pt-2" />
          </div>
        </section>

        {/* The ladder, in four lines. Enough to know it exists. */}
        <section className="border-t border-white/10 py-12">
          <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase font-medium mb-7">
            After the guide
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5">
            <div className="bg-background pr-6 sm:pr-8 py-1 flex flex-col gap-2">
              <h2 className="text-white text-base font-semibold">
                {COURSE_NAME}{' '}
                <span className="text-gold font-normal text-sm">{COURSE_PRICE}</span>
              </h2>
              <p className="text-white/50 text-sm leading-relaxed">
                The self-paced course. Empty folder to a board that runs on a schedule.{' '}
                <a
                  href={courseUrl('guide-landing-course')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold/80 underline underline-offset-4 hover:text-gold"
                >
                  See it
                </a>
              </p>
            </div>
            <div className="bg-background sm:pl-8 py-1 flex flex-col gap-2">
              <h2 className="text-white text-base font-semibold">Have it built with you</h2>
              <p className="text-white/50 text-sm leading-relaxed">
                We find the bottleneck, design the system, build it with you.{' '}
                <a
                  href={DISCOVERY_CALL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold/80 underline underline-offset-4 hover:text-gold"
                >
                  Book a call
                </a>
              </p>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 py-8 flex flex-col gap-2">
          <p className="text-white/30 text-xs">AI by Design · aixdesign.dev</p>
          <p className="text-white/25 text-xs leading-relaxed max-w-xl">
            {AFFILIATION_DISCLAIMER}
          </p>
        </footer>
      </div>
    </main>
  )
}
