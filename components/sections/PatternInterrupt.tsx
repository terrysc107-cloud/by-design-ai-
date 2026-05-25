'use client'

import { motion, useReducedMotion } from 'framer-motion'

export default function PatternInterrupt() {
  const shouldReduce = useReducedMotion()

  return (
    <section className="section">
      <motion.div
        className="border-l-2 border-gold/40 pl-8 py-2"
        initial={shouldReduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="space-y-5 text-white/70 text-base md:text-lg leading-loose">
          <p>
            Most businesses on Go High Level are running a fraction of what the platform can do. They bought the tool, got overwhelmed by the settings, and handed it off to someone who figured it out as they went.
          </p>
          <p>
            The result? Broken automations, missed follow-ups, pipelines that don&apos;t convert, and a monthly subscription that isn&apos;t earning its keep.
          </p>
          <p>
            By Design AI specializes in GHL — and only GHL. We know the platform inside out: snapshots, sub-accounts, custom workflows, AI-augmented campaigns, and integrations that actually hold together under real volume.
          </p>
          <p className="text-white font-medium">
            You bring the business. We make GHL the engine that runs it.
          </p>
          <p>
            Every engagement starts with a free discovery call. We learn your setup, identify the gaps, and give you a clear build plan — before you commit to anything.
          </p>
        </div>
      </motion.div>
    </section>
  )
}
