'use client'

import { motion, useReducedMotion } from 'framer-motion'
import TextReveal from '@/components/ui/TextReveal'

const points = [
  {
    problem: 'Everything still runs through you.',
    solution: 'We map exactly what to automate first — and what to take off your plate today.',
  },
  {
    problem: "You have the tools. Nothing talks to each other.",
    solution: 'We show you exactly which integrations to build, in what order, using what you already own.',
  },
  {
    problem: "You're hiring people to do things a system should do.",
    solution: 'We show you where AI replaces the task, not the person.',
  },
  {
    problem: "You've heard about AI. You still don't have one live automation.",
    solution: 'You leave the audit with a prioritized build list — not more theory.',
  },
  {
    problem: 'More revenue is creating more chaos, not less.',
    solution: 'We design the operating system your growth is demanding.',
  },
]

export default function PainPoints() {
  const shouldReduce = useReducedMotion()

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: shouldReduce ? 0 : 0.1, delayChildren: 0.1 } },
  }
  const card = {
    hidden: shouldReduce ? { opacity: 1 } : { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section className="section">
      <div className="flex flex-col gap-12">

        <div className="flex flex-col gap-3">
          <p className="text-gold text-xs tracking-[0.3em] uppercase font-medium">
            Sound Familiar
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            <TextReveal text="If Any of This Is You, We Should Talk." />
          </h2>
        </div>

        <motion.div
          className="flex flex-col gap-0"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {points.map((point, i) => (
            <motion.div
              key={i}
              variants={card}
              className="group border-b border-white/5 py-6 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-8 hover:border-gold/20 transition-colors duration-300"
            >
              {/* Problem */}
              <div className="flex items-start gap-3">
                <span className="text-white/20 text-xs font-medium mt-1 flex-shrink-0 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-white/80 text-sm md:text-base font-medium leading-relaxed">
                  {point.problem}
                </p>
              </div>

              {/* Solution */}
              <div className="flex items-start gap-3 md:border-l md:border-white/5 md:pl-8">
                <span className="text-gold flex-shrink-0 mt-1 text-sm">→</span>
                <p className="text-white/45 text-sm md:text-base leading-relaxed group-hover:text-white/60 transition-colors duration-300">
                  {point.solution}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
