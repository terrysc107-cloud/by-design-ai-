'use client'

import { motion, useReducedMotion } from 'framer-motion'
import TextReveal from '@/components/ui/TextReveal'
import CTAButton from '@/components/ui/CTAButton'
import { openBookingModal } from '@/lib/cta'

export default function FinalCTA() {
  const shouldReduce = useReducedMotion()

  return (
    <section className="section text-center">
      <div className="flex flex-col items-center gap-8">
        <div
          className="absolute pointer-events-none"
          style={{
            width: '500px',
            height: '300px',
            background:
              'radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          aria-hidden="true"
        />

        <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-tight">
          <TextReveal text="One Call. We Figure Out Exactly What You Need." />
        </h2>

        <motion.p
          className="text-white/55 text-sm md:text-base leading-relaxed max-w-md"
          initial={shouldReduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
          15 minutes. Tell me what&apos;s draining your time. I&apos;ll tell you exactly what to automate first — and whether I&apos;m the right person to build it. No pitch. No pressure.
        </motion.p>

        <motion.div
          className="flex flex-col items-center gap-4"
          initial={shouldReduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        >
          <CTAButton onClick={openBookingModal} size="large">
            Let&apos;s Talk →
          </CTAButton>
        </motion.div>

        <motion.p
          className="text-white/30 text-xs tracking-wide max-w-sm leading-relaxed"
          initial={shouldReduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          Free · No commitment · 15 minutes
        </motion.p>
      </div>
    </section>
  )
}
