'use client'

import Image from 'next/image'
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
      {/* Higgsfield video background */}
      <video
        autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.18 }}
      >
        <source src={ASSETS.heroBgVideo} type="video/mp4" />
      </video>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/75 to-zinc-900/90" />
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <NeuralField />
      </div>
      <div
        className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[1]"
        style={{
          width: 700, height: 500,
          background: 'radial-gradient(ellipse, rgba(201,168,76,0.05) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Content grid */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center pt-24 pb-20">

        {/* Left — Copy */}
        <div className="flex flex-col gap-7">
          <motion.p
            className="text-gold text-[10px] tracking-[0.35em] uppercase font-medium"
            initial={shouldReduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Done For You · Education · Coaching · Management
          </motion.p>

          <h1 className="text-4xl md:text-5xl lg:text-[3.2rem] font-semibold leading-[1.06] tracking-tight text-white">
            <TextReveal
              text="I Automated My Business Life. Let Me Help You Automate Yours."
              delay={0.2}
            />
          </h1>

          <motion.p
            className="text-white/60 text-base md:text-lg leading-relaxed max-w-lg"
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

        {/* Right — Walking video or photo */}
        <motion.div
          className="flex items-center justify-center lg:justify-end"
          initial={shouldReduce ? false : { opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        >
          {ASSETS.heroVideo ? (
            <div className="relative">
              <div
                className="absolute -inset-8 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 70%)',
                  filter: 'blur(40px)',
                }}
              />
              <div className="relative border border-gold/25 p-[3px] overflow-hidden" style={{ maxWidth: 340 }}>
                <video
                  autoPlay muted loop playsInline
                  className="block w-full"
                  style={{ aspectRatio: '9/16', objectFit: 'cover' }}
                >
                  <source src={ASSETS.heroVideo} type="video/mp4" />
                </video>
              </div>
              <div className="absolute -top-[3px] -left-[3px] w-6 h-6 border-t-2 border-l-2 border-gold/70" />
              <div className="absolute -top-[3px] -right-[3px] w-6 h-6 border-t-2 border-r-2 border-gold/70" />
              <div className="absolute -bottom-[3px] -left-[3px] w-6 h-6 border-b-2 border-l-2 border-gold/70" />
              <div className="absolute -bottom-[3px] -right-[3px] w-6 h-6 border-b-2 border-r-2 border-gold/70" />
            </div>
          ) : ASSETS.heroPhoto ? (
            <div className="relative">
              <div
                className="absolute -inset-8 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse, rgba(201,168,76,0.10) 0%, transparent 70%)',
                  filter: 'blur(40px)',
                }}
              />
              <div className="relative border border-gold/25 p-[3px]">
                <Image
                  src={ASSETS.heroPhoto}
                  alt="By Design AI"
                  width={400}
                  height={540}
                  className="object-cover object-top block"
                  priority
                  style={{ filter: 'contrast(1.05) brightness(0.96)' }}
                />
              </div>
              <div className="absolute -top-[3px] -left-[3px] w-6 h-6 border-t-2 border-l-2 border-gold/70" />
              <div className="absolute -top-[3px] -right-[3px] w-6 h-6 border-t-2 border-r-2 border-gold/70" />
              <div className="absolute -bottom-[3px] -left-[3px] w-6 h-6 border-b-2 border-l-2 border-gold/70" />
              <div className="absolute -bottom-[3px] -right-[3px] w-6 h-6 border-b-2 border-r-2 border-gold/70" />
            </div>
          ) : (
            <div className="w-[340px] h-[500px] border border-gold/15 flex flex-col items-center justify-center gap-3">
              <div className="w-14 h-14 border border-gold/25 rounded-full" />
              <p className="text-white/20 text-[10px] tracking-widest text-center leading-relaxed">
                Add your photo at<br />public/hero-photo.jpg<br />then set ASSETS.heroPhoto
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
