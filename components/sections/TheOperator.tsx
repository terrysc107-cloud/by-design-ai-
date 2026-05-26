'use client'

import { motion, useReducedMotion } from 'framer-motion'
import TextReveal from '@/components/ui/TextReveal'

const clients = [
  'Solopreneurs and consultants who are the bottleneck in their own business — every lead, follow-up, and invoice runs through them.',
  'Clinic and studio owners drowning in admin: scheduling, reminders, intake forms, no-shows, and reviews that never get asked for.',
  'Creators and artists who post when they remember to and lose momentum the rest of the time — their best work is invisible.',
  'Service business owners burning hours every week chasing payments, sending the same emails, and answering the same five questions.',
  'Operators who already tried automating — bought the tool, half-built it, and gave up because nobody walked them through the parts that actually matter.',
  'CEOs and managers who don’t need more software — they need someone to make the systems they already own actually work.',
]

export default function TheOperator() {
  const shouldReduce = useReducedMotion()

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: shouldReduce ? 0 : 0.07, delayChildren: 0.1 } },
  }
  const item = {
    hidden: shouldReduce ? { opacity: 1 } : { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section className="section">
      <div className="flex flex-col gap-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
          <TextReveal text="Who It's For" />
        </h2>

        <motion.ul
          className="space-y-4"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {clients.map((c, i) => (
            <motion.li
              key={i}
              variants={item}
              className="flex items-start gap-3 text-white/70 text-sm md:text-base"
            >
              <span className="text-gold mt-0.5 flex-shrink-0 text-lg leading-none">·</span>
              <span>{c}</span>
            </motion.li>
          ))}
        </motion.ul>

        <motion.p
          className="text-center text-white/50 text-sm md:text-base italic leading-relaxed"
          initial={shouldReduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          &ldquo;If your business depends on you doing the same thing over and over — that&apos;s the thing we automate first.&rdquo;
        </motion.p>
      </div>
    </section>
  )
}
