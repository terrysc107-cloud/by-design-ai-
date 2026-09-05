'use client'

import { motion, useReducedMotion } from 'framer-motion'
import TextReveal from '@/components/ui/TextReveal'
import FiveThingsVideo from '@/components/ui/FiveThingsVideo'

/**
 * The board, shown rather than described. Sits directly before TwoPaths so the
 * reader sees the artifact before being asked to choose between learning to
 * build it and hiring it built.
 *
 * NO CTA IN THIS SECTION, deliberately. TwoPaths is the fork and its own
 * docblock sets the rule that neither path may be emphasised over the other; a
 * button here would pick a winner one scroll early, and it would be the third
 * competing ask on a page that already carries the discovery call and the
 * course. This section's whole job is to make the fork below make sense.
 *
 * The reel closes on runyouraiboard.com/build-lab, so the Lab still gets its
 * ask. It just comes from inside the video rather than from the page.
 *
 * Layout family is an asymmetric split, which nothing else on the home page
 * uses: the cards above are grids, the sections around them are stacked prose.
 */
export default function TheBoardReel() {
  const shouldReduce = useReducedMotion()

  const reveal = {
    hidden: shouldReduce ? { opacity: 1 } : { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section className="section">
      <motion.div
        className="flex flex-col md:flex-row md:items-center gap-10 md:gap-14"
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        <FiveThingsVideo placement="home-board-reel" className="shrink-0" />

        <div className="flex flex-col gap-4 max-w-xl">
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            <TextReveal text="This is the thing you would be building." />
          </h2>
          <p className="text-white/55 text-sm md:text-base leading-relaxed">
            Five things separate a real board from a chat window: a charter, floors, a schedule,
            an archive, and a meeting you can act on.
          </p>
          <p className="text-white/40 text-sm leading-relaxed">
            Mine has run weekly since June, on the business you are reading about right now.
          </p>
        </div>
      </motion.div>
    </section>
  )
}
