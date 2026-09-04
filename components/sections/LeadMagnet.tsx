'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import TextReveal from '@/components/ui/TextReveal'
import { ASSETS } from '@/lib/cta'
import { trackConversion } from '@/lib/analytics'

export default function LeadMagnet() {
  const shouldReduce = useReducedMotion()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      })
      if (res.ok) {
        setStatus('done')
        // Hand them to the post-conversion page. Navigating rather than
        // rendering upsells inline keeps both capture points on one surface
        // and makes the conversion a real, measurable URL.
        window.location.href = '/guide/thanks'
        trackConversion('lead', { location: 'section' })
      } else {
        throw new Error('Request failed')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again.')
    }
  }

  return (
    <section id="lead-magnet" className="relative overflow-hidden">
      {/* Subtle section bg */}
      {ASSETS.sectionBg && (
        <div className="absolute inset-0 pointer-events-none">
          <Image src={ASSETS.sectionBg} alt="" fill className="object-cover opacity-[0.07]" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1E1B17]/95 via-[#1E1B17]/98 to-[#1E1B17]/95" />

      <div className="relative z-10 section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — Guide cover */}
          <motion.div
            className="flex justify-center lg:justify-start"
            initial={shouldReduce ? false : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative max-w-[400px] w-full mx-auto">
              <div
                className="absolute -inset-8 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse, rgba(201,168,76,0.10) 0%, transparent 70%)',
                  filter: 'blur(34px)',
                }}
              />
              {/* No border and no corner brackets: the mockup is a transparent
                  PNG that carries its own spine and shadow, so a frame around it
                  would put a rectangle back around the object we just built. */}
              <Image
                src={ASSETS.guideMockup}
                alt="The Board Method, a seven-page guide"
                width={400}
                height={524}
                className="relative block w-full h-auto"
                priority
              />
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            className="flex flex-col gap-6"
            initial={shouldReduce ? false : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <p className="text-gold text-[10px] tracking-[0.35em] uppercase font-medium">
              Free Guide
            </p>
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight leading-tight">
              <TextReveal text="The Board Method" />
            </h2>
            <p className="text-white/55 text-sm md:text-base leading-relaxed">
              Five steps that take AI from something you operate to a board that runs on a
              schedule and hands you a meeting you can act on. Seven pages, no fluff.
            </p>

            <ul className="space-y-2">
              {[
                'The charter line that decides how a seat behaves when options conflict',
                'Why floors surface problems that targets hide',
                'Four checks that tell a useful run from a plausible one',
              ].map((pt, i) => (
                <li key={i} className="flex items-start gap-3 text-white/60 text-sm">
                  <span className="text-gold mt-0.5 flex-shrink-0">→</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>

            {/* The success state is now a page, not a sentence.
                This used to swap the form for one line offering the web version
                of the thing they had just been emailed, which asked for nothing
                at the highest-intent moment in the funnel. /guide/thanks
                carries the download plus the three next steps. This branch
                stays as the brief flash before navigation. */}
            {status === 'done' ? (
              <div className="border border-gold/30 p-6 flex flex-col gap-2">
                <p className="text-gold text-sm font-medium tracking-wide">You&apos;re in.</p>
                <p className="text-white/55 text-sm leading-relaxed">
                  Taking you to your guide&hellip;
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Your first name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="bg-transparent border border-white/15 focus:border-gold/50 outline-none px-4 py-3 text-white text-sm placeholder:text-white/30 transition-colors duration-200"
                />
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="bg-transparent border border-white/15 focus:border-gold/50 outline-none px-4 py-3 text-white text-sm placeholder:text-white/30 transition-colors duration-200"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="cta-btn px-8 py-4 text-xs tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                      Sending…
                    </span>
                  ) : (
                    'Send Me the Guide →'
                  )}
                </button>
                {errorMsg && <p className="text-red-400 text-xs">{errorMsg}</p>}
                <p className="text-white/25 text-[10px] tracking-wide">
                  No spam. Unsubscribe any time.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
