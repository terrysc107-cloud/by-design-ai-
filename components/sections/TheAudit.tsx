'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import TextReveal from '@/components/ui/TextReveal'
import CTAButton from '@/components/ui/CTAButton'
import AnimatedBorderCard from '@/components/ui/AnimatedBorderCard'

const bullets = [
  'Morning Brief — 6am daily Telegram report: habits, flagged emails, next 7 days of calendar, active goals.',
  'Telegram Command Center — Reply to log a habit, capture a brain dump, check your calendar, or scan your inbox.',
  'Habit Tracking & Streak Engine — Custom cadences, streak calculations, overdue alerts, Supabase backend.',
  'Calendar Intelligence — All your Google Calendars unified. Evening prep alerts for tomorrow\'s events.',
  'Email Priority Monitoring — Gmail integration surfaces invoices, disputes, legal, and overdue items. Auto-flags to Notion.',
  'Rental Property Alerts — Rent reminders 3 and 1 day before due. Lease-end warnings at 90, 60, 30, and 14 days.',
  'Weekly Review — Sunday 7pm structured review delivered to Telegram. Habit summary, open loops, next-week prep.',
  'Notion Integration — Brain Dump, Flag Queue, Goal Tracker, and Expense Tracker all wired in from Telegram.',
  'Financial Dashboard — Net worth history, real estate portfolio, business income, cash flow, and Plaid transaction intelligence.',
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
              <TextReveal text="What's Running Inside Apex OS" />
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
