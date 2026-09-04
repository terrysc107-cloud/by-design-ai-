'use client'

import { motion, useReducedMotion } from 'framer-motion'
import TextReveal from '@/components/ui/TextReveal'
import { bookDiscoveryCall } from '@/lib/cta'
import { COURSE_NAME, COURSE_PRICE, courseUrl } from '@/lib/education'

/**
 * THE FORK. Learn it, or hire it.
 *
 * Until 2026-09-03 this site had one conversion goal and education was
 * deliberately subordinate to it: docs/CLAUDE-CODE-COURSE-INTEGRATION.md set
 * the rule that the primary CTA is always Book a Discovery Call and that the
 * education nav link stays "not a button, not gold, not above the CTA". Terry
 * changed that on 2026-09-03 to co-equal paths, so the two offers now share a
 * section and neither is styled as the fallback.
 *
 * CO-EQUAL IS A LAYOUT CLAIM, so the layout has to honour it: one grid, two
 * columns of identical width, a shared hairline between them, and the same
 * heading scale on both sides. The moment one column gets the gold fill and the
 * other gets a text link, the page has quietly picked a winner again. The
 * difference between the columns is the ask, not the emphasis.
 *
 * The build path is a real fork rather than an upsell ladder because the two
 * buyers are different people. Someone who wants to learn the system is not a
 * warmed-up lead for a consulting engagement, and treating them as one is what
 * made the old page hedge.
 */
export default function TwoPaths() {
  const shouldReduce = useReducedMotion()

  const column = {
    hidden: shouldReduce ? { opacity: 1 } : { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  }
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: shouldReduce ? 0 : 0.12 } },
  }

  return (
    <section className="section-wide">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-3 max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            <TextReveal text="Learn to run on it, or have it built for you." />
          </h2>
          <p className="text-white/45 text-sm md:text-base leading-relaxed max-w-xl">
            Same system either way. The only question is who does the building.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gold/15"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {/* Learn it */}
          <motion.div variants={column} className="bg-background p-8 md:p-10 flex flex-col gap-5">
            <h3 className="text-white text-xl md:text-2xl font-semibold tracking-tight">
              Build it yourself
            </h3>
            <p className="text-white/55 text-sm leading-relaxed">
              {COURSE_NAME} is the self-paced course. You start with an empty folder and finish
              with a few narrow assistants that read your real numbers on a schedule and hand you
              a meeting you can act on. No coding.
            </p>
            <ul className="flex flex-col gap-2.5 text-white/50 text-sm leading-relaxed">
              <li>For the owner who wants the system in their own hands</li>
              <li>Written lessons, kept correct as the tools move</li>
              <li>One-time, lifetime access</li>
            </ul>
            <div className="mt-auto pt-4">
              <a
                href={courseUrl('home-two-paths-learn')}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-btn inline-block px-7 py-3.5 text-[11px] tracking-widest"
              >
                Get the course, {COURSE_PRICE}
              </a>
            </div>
          </motion.div>

          {/* Hire it */}
          <motion.div variants={column} className="bg-background p-8 md:p-10 flex flex-col gap-5">
            <h3 className="text-white text-xl md:text-2xl font-semibold tracking-tight">
              Have us build it
            </h3>
            <p className="text-white/55 text-sm leading-relaxed">
              We find the one bottleneck costing you the most time, design the system that removes
              it, and ship it. You get a working build and the documentation your team can
              maintain, not a folder of recommendations.
            </p>
            <ul className="flex flex-col gap-2.5 text-white/50 text-sm leading-relaxed">
              <li>For the owner who would rather buy the outcome of the work</li>
              <li>Scoped to your business, wired to your real data</li>
              <li>Starts with a free 15-minute call</li>
            </ul>
            <div className="mt-auto pt-4">
              <button
                onClick={bookDiscoveryCall}
                className="cta-btn px-7 py-3.5 text-[11px] tracking-widest"
              >
                Book a Discovery Call
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
