'use client'

import { motion, useReducedMotion } from 'framer-motion'
import TextReveal from '@/components/ui/TextReveal'
import CTAButton from '@/components/ui/CTAButton'
import NeuralField from '@/components/effects/NeuralField'
import { bookDiscoveryCall, ASSETS } from '@/lib/cta'

export default function Hero() {
  const shouldReduce = useReducedMotion()

  const scrollToGuide = () => {
    document.getElementById('lead-magnet')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Layer 1 — walking video, blended dark, far back */}
      {ASSETS.heroVideo && (
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.22, filter: 'grayscale(0.35) blur(1px) brightness(0.9)' }}
        >
          <source src={ASSETS.heroVideo} type="video/mp4" />
        </video>
      )}

      {/* Layer 2 — warm gradient wash, makes copy readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1E1B17]/95 via-[#1E1B17]/78 to-[#1E1B17]/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1E1B17]/25 via-transparent to-[#1E1B17]/55" />

      {/* Layer 3 — gold glow */}
      <div
        className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[1]"
        style={{
          width: 700, height: 500,
          background: 'radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Layer 4 — neural field overlay */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <NeuralField />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1100px] mx-auto px-6 min-h-screen flex flex-col justify-center pt-24 pb-20">
        <div className="flex flex-col gap-7 max-w-2xl">
          <motion.p
            className="text-gold text-[10px] tracking-[0.35em] uppercase font-medium"
            initial={shouldReduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Done For You · Education · Coaching · Management
          </motion.p>

          <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-semibold leading-[1.06] tracking-tight text-white">
            <TextReveal
              text="I Automated My Business Life. Let Me Help You Automate Yours."
              delay={0.2}
            />
          </h1>

          <motion.p
            className="text-white/65 text-base md:text-lg leading-relaxed max-w-xl"
            initial={shouldReduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
          >
            From a single workflow that saves you 5 hours a week to a fully managed system that runs
            your operation — I build it, teach it, or manage it. We figure out which on our first call.
          </motion.p>

          <motion.p
            className="text-white/30 text-[10px] tracking-widest uppercase"
            initial={shouldReduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.05 }}
          >
            Helping solopreneurs, clinics, agencies, and creators stop running their business manually
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 pt-1"
            initial={shouldReduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
          >
            <CTAButton onClick={bookDiscoveryCall} size="large">
              Let&apos;s Talk →
            </CTAButton>
            <button
              onClick={scrollToGuide}
              className="px-8 py-4 text-[11px] tracking-widest uppercase border border-gold/35 text-gold/70 hover:border-gold/60 hover:text-gold transition-colors duration-200"
            >
              Get the Free Guide
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
