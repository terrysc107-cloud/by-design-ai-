import type { Metadata } from 'next'
import Link from 'next/link'
import { COURSE_NAME, COURSE_PRICE, LIVE_LAB_DATE, LIVE_LAB_PRICE, courseUrl, labWaitlistUrl } from '@/lib/education'
import { DISCOVERY_CALL_URL } from '@/lib/cta'
import '../guide.css'

export const metadata: Metadata = {
  title: 'Your guide is on its way | AI by Design',
  description: 'The Board Method is in your inbox. Here is what comes after it.',
  // Nobody should reach this from search: it is a post-conversion page and it
  // reads as nonsense without the conversion.
  robots: { index: false, follow: false },
}

/**
 * The moment right after someone converts.
 *
 * Until this page existed, submitting the guide form swapped the form for one
 * line of text offering a link to the web version of the thing they had just
 * been emailed. That is the highest-intent moment in the entire funnel and it
 * asked for nothing.
 *
 * A real URL rather than an inline success state, for three reasons: the
 * homepage section and the exit-intent modal can both land here instead of
 * each growing their own upsell, it is measurable as a conversion, and it is
 * where a social post's link naturally ends up once someone acts on it.
 *
 * THE PDF LINK IS HERE, not just in the email. Email delivery is the single
 * most likely thing to fail or get filtered, and a person who never receives it
 * has already given us their address. Do not make the download conditional on
 * the email arriving.
 *
 * ORDERED CHEAPEST FIRST on purpose. Someone who just traded an email for a PDF
 * has told you exactly how much commitment they are ready for, and it is not a
 * $997 cohort. The call sits last because it is the largest ask, not because it
 * matters least.
 */
export default function GuideThanksPage() {
  return (
    <main className="guide-page guide-thanks min-h-screen bg-white">
      <div className="bg-zinc-950 text-white px-6 pt-20 pb-16">
        <div className="max-w-2xl mx-auto">
          <p className="text-amber-500 text-[10px] tracking-[0.4em] uppercase font-medium mb-6">
            You&apos;re in
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.1] mb-5">
            The Board Method is on its way.
          </h1>
          <p className="text-zinc-400 text-base md:text-lg leading-relaxed mb-8">
            Check your inbox. If it has not arrived in a couple of minutes it is probably in
            promotions or spam, so you can just take it directly.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="/guide.pdf"
              className="inline-block bg-amber-500 text-black px-8 py-4 text-xs tracking-widest uppercase font-semibold hover:bg-amber-400 transition-colors"
            >
              Download the PDF
            </a>
            <Link
              href="/guide/read"
              className="inline-block border border-zinc-700 text-zinc-300 px-8 py-4 text-xs tracking-widest uppercase hover:border-zinc-500 hover:text-white transition-colors"
            >
              Read it here
            </Link>
          </div>
        </div>
      </div>

      <div className="px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-zinc-900 tracking-tight">
            What comes after the guide
          </h2>
          <p className="text-zinc-600 text-sm md:text-base leading-relaxed mt-4">
            The guide is the shape of the system. These are the three ways people actually get one
            running. Over the next couple of weeks I will send you the parts that trip most people
            up, so you can also just read those and do nothing else.
          </p>

          <div className="mt-10 flex flex-col divide-y divide-zinc-200 border-t border-b border-zinc-200">
            <div className="py-7 flex flex-col gap-2">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h3 className="text-lg font-semibold text-zinc-900">{COURSE_NAME}</h3>
                <span className="text-amber-700 text-sm font-medium">{COURSE_PRICE} one-time</span>
              </div>
              <p className="text-zinc-600 text-sm leading-relaxed">
                The self-paced course. Empty folder to a board that runs on a schedule, with the
                four files as downloads. You do not write any code.
              </p>
              <a
                href={courseUrl('guide-thanks-course')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-700 text-sm font-medium underline underline-offset-4 hover:text-amber-800 w-fit mt-1"
              >
                See the course →
              </a>
            </div>

            <div className="py-7 flex flex-col gap-2">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h3 className="text-lg font-semibold text-zinc-900">The Build Lab</h3>
                {LIVE_LAB_PRICE && (
                  <span className="text-amber-700 text-sm font-medium">{LIVE_LAB_PRICE}</span>
                )}
              </div>
              <p className="text-zinc-600 text-sm leading-relaxed">
                A live cohort in a small group, building your board on your own numbers with the
                course and the Kit included.
                {LIVE_LAB_DATE ? ` Runs ${LIVE_LAB_DATE}.` : ''}
              </p>
              <a
                href={labWaitlistUrl('guide-thanks-lab')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-700 text-sm font-medium underline underline-offset-4 hover:text-amber-800 w-fit mt-1"
              >
                See how it runs →
              </a>
            </div>

            <div className="py-7 flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-zinc-900">Have it built with you</h3>
              <p className="text-zinc-600 text-sm leading-relaxed">
                We find the bottleneck costing you the most time, design the system that removes
                it, and build it with you. Starts with a free fifteen-minute call and there is
                nothing to prepare.
              </p>
              <a
                href={DISCOVERY_CALL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-700 text-sm font-medium underline underline-offset-4 hover:text-amber-800 w-fit mt-1"
              >
                Book a call →
              </a>
            </div>
          </div>

          <p className="text-zinc-500 text-xs leading-relaxed mt-8">
            None of these is required to use the guide. It works on its own and always will.
          </p>
        </div>
      </div>
    </main>
  )
}
