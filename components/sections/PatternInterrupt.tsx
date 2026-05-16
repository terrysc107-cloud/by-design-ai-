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
            Most people know AI is changing everything. But they&apos;re stuck watching tutorials, buying tools they don&apos;t use, and still doing everything manually.
          </p>
          <p>
            The gap isn&apos;t information. It&apos;s execution. You need someone who builds it — not explains it.
          </p>
          <p>
            By Design AI works with operators, creators, investors, and educators to design and install the systems that actually run their businesses.
          </p>
          <p className="text-white font-medium">
            You bring the vision. We build the machine.
          </p>
          <p>Every engagement starts with an audit. We map your operation, identify the highest-leverage builds, and get to work. The audit fee is credited toward whatever we build together.</p>
        </div>
      </motion.div>
    </section>
  )
}
