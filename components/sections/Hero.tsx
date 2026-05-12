'use client'

import { useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import CTAButton from '@/components/ui/CTAButton'
import AnimatedOpsGraph from '@/components/effects/AnimatedOpsGraph'

export default function Hero() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const shouldReduce = useReducedMotion()

  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 800], [0, shouldReduce ? 0 : 200])
  const graphY = useTransform(scrollY, [0, 800], [0, shouldReduce ? 0 : -80])

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
      {/* Background glow — parallax */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ y: bgY }}
      >
        <div
          className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px]"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(201,168,76,0.055) 0%, transparent 65%)',
            filter: 'blur(100px)',
          }}
        />
      </motion.div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-0 pt-28 pb-20 lg:py-0 lg:min-h-screen">

        {/* LEFT — Text */}
        <div className="flex flex-col gap-8 lg:w-[58%] lg:pr-20">

          <motion.p
            className="text-gold text-xs tracking-[0.28em] uppercase font-medium"
            initial={shouldReduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            AI Operations Coaching
          </motion.p>

          <motion.h1
            className="text-[2.6rem] md:text-6xl lg:text-7xl font-semibold leading-[1.08] tracking-[-0.02em] text-white"
            initial={shouldReduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            Most People Aren&apos;t Ready for&nbsp;This.
          </motion.h1>

          <motion.p
            className="text-base md:text-lg text-white/55 leading-[1.75] max-w-lg"
            initial={shouldReduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
          >
            If you&apos;re doing $5K–$30K a month and you&apos;re still the bottleneck in your own business — this was built for you. If that&apos;s not you, this isn&apos;t the right fit.
          </motion.p>

          <motion.div
            className="flex flex-col items-start gap-4 pt-2"
            initial={shouldReduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.65 }}
          >
            <CTAButton onClick={handleCheckout} loading={loading} size="large">
              Book the Audit — $2,500
            </CTAButton>
            <p className="text-white/30 text-xs tracking-wide">
              5 spots. No exceptions. No replays. No refunds.
            </p>
            {error && <p className="text-red-400 text-xs">{error}</p>}
          </motion.div>
        </div>

        {/* RIGHT — Ops graph */}
        <motion.div
          className="lg:w-[42%] w-full"
          style={{ y: graphY }}
          initial={shouldReduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.5 }}
        >
          <div
            className="relative w-full border border-white/[0.06]"
            style={{ height: 'clamp(280px, 42vw, 500px)' }}
          >
            <p className="absolute top-3 left-4 text-[9px] text-white/20 tracking-[0.22em] uppercase z-10 select-none">
              Live Operations
            </p>
            <AnimatedOpsGraph />
          </div>
        </motion.div>

      </div>
    </section>
  )
}
