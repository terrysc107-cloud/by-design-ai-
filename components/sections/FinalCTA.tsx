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
    <section className="section text-center">
      <div className="flex flex-col items-center gap-8">
        {/* Ambient glow behind CTA */}
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
          <TextReveal text="Your Brief. Every Morning. Starting Tomorrow." />
        </h2>

        <motion.p
          className="text-white/55 text-sm md:text-base leading-relaxed max-w-md"
          initial={shouldReduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
          One setup session. We configure everything. The next morning at 6am, North Star finds you.
        </motion.p>

        <motion.div
          className="flex flex-col items-center gap-4"
          initial={shouldReduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        >
          <CTAButton onClick={handleCheckout} loading={loading} size="large">
            Book Your Setup Call
          </CTAButton>
          {error && <p className="text-red-400 text-xs">{error}</p>}
        </motion.div>

        <motion.p
          className="text-white/30 text-xs tracking-wide max-w-sm leading-relaxed"
          initial={shouldReduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          North Star Personal OS is configured to your operation — by design.
        </motion.p>
      </div>
    </section>
  )
}
