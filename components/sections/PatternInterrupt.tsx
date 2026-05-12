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
            This isn&apos;t a course. There&apos;s no community. No Slack group. No certificate.
          </p>
          <p>
            You get 60 minutes with someone who operates five businesses simultaneously — a health system, a certification training company, an executive advisory firm, a water quality consulting practice, and real estate.
          </p>
          <p>
            Not theory. Not a framework someone read about. Live systems. Running right now.
          </p>
          <p className="text-white font-medium">
            You&apos;ll walk away knowing exactly what to fix, in what order, and how.
          </p>
          <p>That&apos;s it.</p>
        </div>
      </motion.div>
    </section>
  )
}
