'use client'

import { motion, useReducedMotion } from 'framer-motion'
import TextReveal from '@/components/ui/TextReveal'

const outcomes = [
  'Lead capture & automated follow-up',
  'Appointment booking & reminder systems',
  'Client onboarding flows',
  'Email & SMS marketing campaigns',
  'AI chatbots & website chat',
  'Sales funnels & landing pages',
  'Course & membership platforms',
  'Payment & invoice automation',
  'CRM setup & pipeline management',
  'Reputation & review management',
  'Social media scheduling',
  'Custom integrations between your tools',
]

export default function OfferLadder() {
  const shouldReduce = useReducedMotion()

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: shouldReduce ? 0 : 0.06, delayChildren: 0.1 } },
  }
  const item = {
    hidden: shouldReduce ? { opacity: 1 } : { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section className="section-wide">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-3 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            <TextReveal text="What I Can Build" />
          </h2>
          <p className="text-white/40 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Outcomes — not tools. The right technology for each one depends on your situation.
            That&apos;s what the call is for.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gold/10"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {outcomes.map((o, i) => (
            <motion.div
              key={i}
              variants={item}
              className="bg-background flex items-center gap-4 px-6 py-5 hover:bg-white/[0.02] transition-colors duration-200"
            >
              <span className="text-gold/40 text-[10px] font-medium tracking-widest flex-shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-white/70 text-sm leading-snug">{o}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="text-center text-white/35 text-sm leading-relaxed max-w-lg mx-auto"
          initial={shouldReduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          Not sure which applies to you? One call figures it out — no cost, no commitment.
        </motion.p>
      </div>
    </section>
  )
}
