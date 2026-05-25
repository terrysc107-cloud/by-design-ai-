'use client'

import { motion, useReducedMotion } from 'framer-motion'
import TextReveal from '@/components/ui/TextReveal'
import AnimatedBorderCard from '@/components/ui/AnimatedBorderCard'

const services = [
  {
    title: 'GHL Setup & Launch',
    description:
      'Full Go High Level account configuration from scratch — pipelines, calendars, funnels, forms, email/SMS domains, reputation management, and user roles. Your platform, built to convert.',
  },
  {
    title: 'Automation Builds',
    description:
      'Lead follow-up sequences, appointment reminders, pipeline automation, re-engagement campaigns, and custom triggers. We map the process, build the workflow, and deploy it.',
  },
  {
    title: 'Custom AI Workflows',
    description:
      'AI layered on top of GHL — smart lead qualification, personalized outreach at scale, AI chat agents, and automated content pipelines. GHL plus intelligence.',
  },
  {
    title: 'Agency Snapshots',
    description:
      'Custom GHL snapshots built for agencies to deploy across client accounts. Fully documented, cleanly structured, and easy to white-label.',
  },
  {
    title: 'GHL Management Retainer',
    description:
      'Monthly management of your GHL account — new automation builds, troubleshooting, performance reviews, and platform updates. Done for you, ongoing.',
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
          <TextReveal text="Our Services" />
        </h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {services.map((s, i) => (
            <motion.div
              key={i}
              variants={card}
              whileHover={shouldReduce ? {} : { scale: 1.02, y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <AnimatedBorderCard active={false} className="h-full">
                <div className="flex flex-col gap-4 h-full">
                  <h3 className="text-white font-semibold text-base md:text-lg">
                    {s.title}
                  </h3>
                  <p className="text-white/55 text-sm leading-relaxed flex-1">
                    {s.description}
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
          Not sure which service fits your situation? The discovery call figures that out — no cost, no commitment, just a clear plan.
        </motion.p>
      </div>
    </section>
  )
}
