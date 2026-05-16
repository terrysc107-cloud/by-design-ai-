'use client'

import { motion, useReducedMotion } from 'framer-motion'
import TextReveal from '@/components/ui/TextReveal'

const credentials = [
  'Founders running 2+ businesses simultaneously.',
  'Real estate investors managing rental portfolios.',
  'Operators who need information centralized, proactive, and out of the way.',
  'Anyone who is still the bottleneck in their own intelligence flow.',
  'Live stack: Make.com · n8n · Notion · Supabase · Gmail · Google Calendar · Plaid · Telegram',
  'Same setup running the operator\'s own portfolio — not theory, not a template.',
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
          <TextReveal text="Built For Operators" />
        </h2>

        <motion.ul
          className="space-y-4"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {credentials.map((cred, i) => (
            <motion.li
              key={i}
              variants={item}
              className="flex items-start gap-3 text-white/70 text-sm md:text-base"
            >
              <span className="text-gold mt-0.5 flex-shrink-0 text-lg leading-none">·</span>
              <span>{cred}</span>
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
          &ldquo;Everything in Apex OS is running in my own operation right now.&rdquo;
        </motion.p>
      </div>
    </section>
  )
}
