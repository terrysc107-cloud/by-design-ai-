'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import TextReveal from '@/components/ui/TextReveal'
import CTAButton from '@/components/ui/CTAButton'
import AnimatedBorderCard from '@/components/ui/AnimatedBorderCard'

const bullets = [
  'Apex OS — Your personal AI operating system. Morning briefs, Telegram command center, habit tracking, email triage, calendar intelligence, and financial dashboard.',
  'Agentic Workflow Builds — Custom multi-step AI automations wired into your existing tools. Make.com, n8n, Zapier, or custom code.',
  'Course Infrastructure — We design and build the systems that let educators and entrepreneurs package their expertise and sell it.',
  'AI Ops Strategy — For businesses that need a clear AI roadmap. What to build, what to buy, what to ignore, and in what order.',
  '1-on-1 AI Coaching — Private coaching for professionals who want to understand and implement AI without the overwhelm.',
  'Concierge — Ongoing system tuning, new automations, and monthly check-ins as your operation grows.',
]

export default function TheAudit() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const shouldReduce = useReducedMotion()

  const handleCheckout = async () => {
    if (loading) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError('Something went wrong. Please try again.')
        setLoading(false)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: shouldReduce ? 0 : 0.12, delayChildren: 0.2 } },
  }
  const item = {
    hidden: shouldReduce ? { opacity: 1 } : { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section className="section">
      <AnimatedBorderCard active>
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              <TextReveal text="What We Build" />
            </h2>
          </div>

          {/* Bullets */}
          <motion.ul
            className="space-y-4"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {bullets.map((b, i) => (
              <motion.li
                key={i}
                variants={item}
                className="flex items-start gap-3 text-white/70 text-sm md:text-base leading-relaxed"
              >
                <span className="text-gold mt-1 flex-shrink-0">→</span>
                <span>{b}</span>
              </motion.li>
            ))}
          </motion.ul>

          {/* CTA */}
          <motion.div
            className="flex flex-col items-start gap-3"
            initial={shouldReduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <CTAButton onClick={handleCheckout} loading={loading}>
              Book the Audit — $2,500
            </CTAButton>
            {error && <p className="text-red-400 text-xs">{error}</p>}
          </motion.div>
        </div>
      </AnimatedBorderCard>
    </section>
  )
}
