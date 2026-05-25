'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import TextReveal from '@/components/ui/TextReveal'
import CTAButton from '@/components/ui/CTAButton'
import { bookDiscoveryCall } from '@/lib/cta'

const HERO_PHOTO = ''

export default function Hero() {
  const shouldReduce = useReducedMotion()
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 600], [0, shouldReduce ? 0 : 180])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {HERO_PHOTO ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={HERO_PHOTO}
            alt=""
            fill
            priority
            className="object-cover object-top"
            style={{ opacity: 0.4 }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-950" />
      )}

      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/80 via-black/55 to-black/90 pointer-events-none" />

      <motion.div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{ y: bgY }}
      >
        <div className="absolute inset-0 bg-gold-radial opacity-50" />
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
        <motion.p
          className="text-gold text-xs tracking-[0.3em] uppercase font-medium"
          initial={shouldReduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Go High Level Management · Automation Builds · Custom AI Workflows
        </motion.p>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight text-white max-w-4xl">
          <TextReveal
            text="Your GHL Platform. Built Right. Running Right. Scaling Right."
            delay={0.2}
          />
        </h1>

        <motion.p
          className="text-base md:text-lg text-white/60 leading-relaxed max-w-xl"
          initial={shouldReduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
        >
          By Design AI is a specialist Go High Level agency. We set up, automate, and manage GHL for agencies and businesses who want it done properly — so you can focus on closing, not configuring.
        </motion.p>

        <motion.p
          className="text-xs text-white/35 tracking-widest uppercase"
          initial={shouldReduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          Free discovery call · Clear scope on day one · No commitment
        </motion.p>

        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
          className="flex flex-col items-center gap-3"
        >
          <CTAButton onClick={bookDiscoveryCall} size="large">
            Book a Discovery Call →
          </CTAButton>
        </motion.div>
      </div>
    </section>
  )
}
