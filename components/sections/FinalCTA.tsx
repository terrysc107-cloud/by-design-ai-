'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import TextReveal from '@/components/ui/TextReveal'
import CTAButton from '@/components/ui/CTAButton'

export default function FinalCTA() {
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

  return (
    <section className="section">
      <div className="flex flex-col gap-8">

        <div className="flex flex-col gap-4">
          <p className="text-gold text-xs tracking-[0.25em] uppercase font-medium">
            This Month Only
          </p>
          <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-tight leading-[1.1]">
            <TextReveal text="5 Spots. That's It." />
          </h2>
        </div>

        {/* Spots availability visual */}
        <motion.div
          className="flex flex-col gap-2"
          initial={shouldReduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <div className="flex items-center gap-1.5">
            {[true, true, true, false, false].map((filled, i) => (
              <span
                key={i}
                className={`inline-block w-5 h-1.5 rounded-sm transition-colors ${
                  filled ? 'bg-gold' : 'bg-white/15'
                }`}
              />
            ))}
            <span className="text-white/40 text-xs ml-2">3 of 5 spots filled this month</span>
          </div>
        </motion.div>

        <motion.p
          className="text-white/50 text-base md:text-lg leading-relaxed max-w-lg"
          initial={shouldReduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
        >
          When they&apos;re gone they&apos;re gone. Next availability opens the following month. No waitlist. No exceptions.
        </motion.p>

        <motion.div
          className="flex flex-col items-start gap-4"
          initial={shouldReduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        >
          <CTAButton onClick={handleCheckout} loading={loading} size="large">
            Book the Audit — $2,500
          </CTAButton>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <p className="text-white/25 text-xs tracking-wide leading-relaxed max-w-sm">
            Secure checkout · Powered by Stripe · By Design AI works with a small number of operators at a time — by design.
          </p>
        </motion.div>

      </div>
    </section>
  )
}
