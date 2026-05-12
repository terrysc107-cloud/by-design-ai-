'use client'

import { useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import TextReveal from '@/components/ui/TextReveal'
import CTAButton from '@/components/ui/CTAButton'
import AnimatedOpsGraph from '@/components/effects/AnimatedOpsGraph'

export default function Hero() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const shouldReduce = useReducedMotion()

  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 600], [0, shouldReduce ? 0 : 160])
  const graphY = useTransform(scrollY, [0, 600], [0, shouldReduce ? 0 : -60])

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
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background radial glow — parallax */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ y: bgY }}
      >
        <div
          className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px]"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(201,168,76,0.07) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </motion.div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 py-24 lg:py-0 lg:min-h-screen flex flex-col lg:flex-row items-center gap-12 lg:gap-0">

        {/* LEFT — Text content */}
        <div className="flex flex-col gap-7 lg:w-[55%] lg:pr-16 text-center lg:text-left items-center lg:items-start">
          <motion.p
            className="text-gold text-xs tracking-[0.3em] uppercase font-medium"
            initial={shouldReduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            AI Operations Coaching
          </motion.p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-[1.05] tracking-tight text-white max-w-2xl">
            <TextReveal text="Most People Aren't Ready for This." delay={0.2} />
          </h1>

          <motion.p
            className="text-base md:text-lg text-white/60 leading-relaxed max-w-lg"
            initial={shouldReduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
          >
            If you&apos;re doing $5K–$30K a month and you&apos;re still the bottleneck in your own business — this was built for you. If that&apos;s not you, this isn&apos;t the right fit.
          </motion.p>

          <motion.p
            className="text-xs text-white/35 tracking-widest uppercase"
            initial={shouldReduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            5 spots. No exceptions. No replays. No refunds.
          </motion.p>

          <motion.div
            className="flex flex-col items-center lg:items-start gap-3"
            initial={shouldReduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
          >
            <CTAButton onClick={handleCheckout} loading={loading} size="large">
              I&apos;m Ready — Book the Audit
            </CTAButton>
            {error && <p className="text-red-400 text-xs">{error}</p>}
          </motion.div>
        </div>

        {/* RIGHT — Animated ops graph */}
        <motion.div
          className="lg:w-[45%] w-full"
          style={{ y: graphY }}
          initial={shouldReduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4 }}
        >
          {/* Outer frame with gold border */}
          <div
            className="relative w-full"
            style={{ height: 'clamp(300px, 45vw, 520px)' }}
          >
            {/* Corner accents */}
            <span className="absolute top-0 left-0 w-6 h-6 border-t border-l border-gold/40" />
            <span className="absolute top-0 right-0 w-6 h-6 border-t border-r border-gold/40" />
            <span className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-gold/40" />
            <span className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-gold/40" />

            {/* Label */}
            <p className="absolute top-3 left-1/2 -translate-x-1/2 text-[9px] text-gold/30 tracking-[0.25em] uppercase z-10">
              Live Operations
            </p>

            <AnimatedOpsGraph />
          </div>
        </motion.div>

      </div>
    </section>
  )
}
