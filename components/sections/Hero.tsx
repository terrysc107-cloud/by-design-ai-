'use client'

import { useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import TextReveal from '@/components/ui/TextReveal'
import CTAButton from '@/components/ui/CTAButton'

export default function Hero() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const shouldReduce = useReducedMotion()

  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 600], [0, shouldReduce ? 0 : 180])

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax background glow */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ y: bgY }}
      >
        <div className="absolute inset-0 bg-gold-radial opacity-60" />
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </motion.div>

      <div className="relative z-10 section text-center flex flex-col items-center gap-8 pt-32 pb-24">
        {/* Eyebrow */}
        <motion.p
          className="text-gold text-xs tracking-[0.3em] uppercase font-medium"
          initial={shouldReduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Apex OS
        </motion.p>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight text-white max-w-3xl">
          <TextReveal
            text="Your AI runs your life before you open your phone."
            delay={0.2}
          />
        </h1>

        {/* Subheadline */}
        <motion.p
          className="text-base md:text-lg text-white/60 leading-relaxed max-w-xl"
          initial={shouldReduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
        >
          Every morning at 6am, your system has already scanned your inboxes, checked your calendar, reviewed your habits, and sent you a briefing — straight to Telegram. No app to open. No dashboard to check. It finds you.
        </motion.p>

        {/* Micro-copy */}
        <motion.p
          className="text-xs text-white/35 tracking-widest uppercase"
          initial={shouldReduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          Starts with an audit. Built for your operation. Runs 24/7.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
          className="flex flex-col items-center gap-3"
        >
          <CTAButton onClick={handleCheckout} loading={loading} size="large">
            Book the Audit — $2,500
          </CTAButton>
          {error && (
            <p className="text-red-400 text-xs">{error}</p>
          )}
        </motion.div>
      </div>
    </section>
  )
}
