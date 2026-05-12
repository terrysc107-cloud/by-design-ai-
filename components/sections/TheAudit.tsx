'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import TextReveal from '@/components/ui/TextReveal'
import CTAButton from '@/components/ui/CTAButton'
import AnimatedBorderCard from '@/components/ui/AnimatedBorderCard'

const bullets = [
  'A 60-minute operational deep dive into your business.',
  'A custom workflow map showing exactly where you\'re losing time and leverage.',
  'A priority stack — what to build first, what to ignore.',
  'A Loom walkthrough and action doc. Delivered same day.',
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
    visible: { transition: { staggerChildren: shouldReduce ? 0 : 0.1, delayChildren: 0.15 } },
  }
  const item = {
    hidden: shouldReduce ? { opacity: 1 } : { opacity: 0, x: -16 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section className="section">
      <AnimatedBorderCard active>
        <div className="flex flex-col gap-10">

          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div className="flex flex-col gap-2">
              <p className="text-gold text-xs tracking-[0.25em] uppercase font-medium">
                The Offer
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                <TextReveal text="The AI Ops Audit" />
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-4xl md:text-5xl font-semibold text-gold leading-none">
                $2,500
              </span>
              <span className="text-[10px] border border-gold/40 text-gold/80 px-3 py-1.5 tracking-[0.2em] uppercase">
                5 Spots
              </span>
            </div>
          </div>

          {/* Bullets */}
          <motion.ul
            className="space-y-5"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {bullets.map((b, i) => (
              <motion.li
                key={i}
                variants={item}
                className="flex items-start gap-4 text-white/65 text-sm md:text-base leading-relaxed"
              >
                <span className="text-gold/60 mt-0.5 flex-shrink-0 text-xs">✦</span>
                <span>{b}</span>
              </motion.li>
            ))}
          </motion.ul>

          {/* CTA */}
          <motion.div
            className="flex flex-col items-start gap-3 pt-2"
            initial={shouldReduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <CTAButton onClick={handleCheckout} loading={loading} size="large">
              Claim Your Spot
            </CTAButton>
            {error && <p className="text-red-400 text-xs">{error}</p>}
          </motion.div>

        </div>
      </AnimatedBorderCard>
    </section>
  )
}
