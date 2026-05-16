'use client'

import { motion, useReducedMotion } from 'framer-motion'
import TextReveal from '@/components/ui/TextReveal'
import AnimatedBorderCard from '@/components/ui/AnimatedBorderCard'

const specializations = [
  {
    title: 'Apex OS',
    description:
      'Your personal AI operating system. Morning briefs, email triage, habit tracking, calendar intelligence, and financial dashboard — all delivered to Telegram.',
  },
  {
    title: 'Agentic Workflow Builds',
    description:
      'Custom multi-step AI automations wired into your existing tools. We map the process, build the flow, and deploy it.',
  },
  {
    title: 'Course Infrastructure',
    description:
      'We design and build the course systems that let educators and entrepreneurs package their expertise and sell it.',
  },
  {
    title: 'AI Ops Strategy',
    description:
      'For businesses that need a clear AI roadmap — what to build, what to buy, what to ignore, and in what order.',
  },
  {
    title: '1-on-1 AI Coaching',
    description:
      'Private coaching for professionals who want to understand and implement AI without the overwhelm.',
  },
]

export default function OfferLadder() {
  const shouldReduce = useReducedMotion()

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: shouldReduce ? 0 : 0.12, delayChildren: 0.1 } },
  }
  const card = {
    hidden: shouldReduce ? { opacity: 1 } : { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section className="section-wide">
      <div className="flex flex-col gap-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight text-center">
          <TextReveal text="What We Specialize In" />
        </h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {specializations.map((spec, i) => (
            <motion.div
              key={i}
              variants={card}
              whileHover={shouldReduce ? {} : { scale: 1.02, y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <AnimatedBorderCard active={false} className="h-full">
                <div className="flex flex-col gap-4 h-full">
                  <h3 className="text-white font-semibold text-base md:text-lg">
                    {spec.title}
                  </h3>
                  <p className="text-white/55 text-sm leading-relaxed flex-1">
                    {spec.description}
                  </p>
                </div>
              </AnimatedBorderCard>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="text-center text-white/45 text-sm md:text-base leading-relaxed max-w-2xl mx-auto"
          initial={shouldReduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        >
          Not sure which applies to you? The audit figures that out. Every engagement starts there
          — and the audit fee is credited toward whatever we build.
        </motion.p>
      </div>
    </section>
  )
}
