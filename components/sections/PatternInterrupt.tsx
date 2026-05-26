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
            A few years ago I was running everything by hand. Replying to leads at midnight, chasing invoices, copy-pasting the same onboarding email, sending reminders, tracking spreadsheets, posting content when I remembered to.
          </p>
          <p>
            It was working — barely. The business was growing. My time wasn&apos;t.
          </p>
          <p>
            So I rebuilt my entire operation around AI and automation. Lead capture, follow-up, booking, onboarding, reporting, reviews, content — all running in the background. I went from chasing my business to running it.
          </p>
          <p className="text-white font-medium">
            Now I do the same thing for other operators.
          </p>
          <p>
            Every engagement starts with a free 15-minute discovery call. You tell me what&apos;s draining your time. I tell you what to build, what it&apos;ll take, and whether I&apos;m the right person to build it.
          </p>
        </div>
      </motion.div>
    </section>
  )
}
