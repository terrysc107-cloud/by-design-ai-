'use client'

import { motion, useReducedMotion } from 'framer-motion'
import TextReveal from '@/components/ui/TextReveal'

const testimonials = [
  {
    quote:
      "I had agents, a CRM, a transaction coordinator, and a showing scheduler — none of them talking to each other. The audit took 90 minutes and came back with a 6-step integration map. We cut our follow-up lag from 4 days to same-day. Closed two deals in the next 30 days I'm convinced we would have lost.",
    name: 'Maya Chen',
    role: 'Team Lead, boutique residential brokerage · Phoenix, AZ',
    initial: 'M',
  },
  {
    quote:
      "We were spending 3 weeks on credentialing packets that should have taken 3 days. The audit identified exactly where the process was stalling — manual handoffs between departments — and gave us a build sequence we could actually execute. Six months later we're at 9 days average. That's the kind of change that moves a health system.",
    name: 'Dr. Marcus Webb',
    role: 'VP of Operations, regional health network · Nashville, TN',
    initial: 'W',
  },
  {
    quote:
      "As a solo consultant I was losing 12 hours a week to deliverable formatting, email follow-up, and calendar chaos. Not strategy. Admin. The audit reframed how I think about where AI actually fits — not as a chatbot, but as infrastructure. Three automations later I got that time back and raised my day rate.",
    name: 'Priya Nair',
    role: 'Independent management consultant · Remote',
    initial: 'P',
  },
]

export default function Testimonials() {
  const shouldReduce = useReducedMotion()

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: shouldReduce ? 0 : 0.14, delayChildren: 0.05 } },
  }
  const item = {
    hidden: shouldReduce ? { opacity: 1 } : { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section className="section-wide">
      <div className="flex flex-col gap-14">

        <div className="flex flex-col gap-3">
          <p className="text-gold text-xs tracking-[0.25em] uppercase font-medium">
            Client Results
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            <TextReveal text="What Operators Say After the Audit" />
          </h2>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={item}
              className="flex flex-col gap-8 p-8 md:p-10 bg-[#0A0A0A]"
            >
              {/* Quote mark */}
              <span className="text-gold/30 text-5xl leading-none font-serif select-none">&ldquo;</span>

              {/* Body */}
              <p className="text-white/60 text-sm leading-[1.8] flex-1">
                {t.quote}
              </p>

              {/* Attribution */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/8">
                <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-gold text-xs font-semibold">{t.initial}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-white text-xs font-medium">{t.name}</span>
                  <span className="text-white/35 text-[11px] leading-snug">{t.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
