'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import TextReveal from '@/components/ui/TextReveal'
import CTAButton from '@/components/ui/CTAButton'
import GoldRule from '@/components/ui/GoldRule'
import { bookDiscoveryCall, ASSETS } from '@/lib/cta'
import { trackConversion } from '@/lib/analytics'

const OUTCOMES = [
  'Instant follow-up after every account visit or in-service',
  'Auto-scheduling + no-show reminders for demos & trainings',
  'A CRM that updates itself — no more end-of-day data entry',
  'Targeted hospital & clinic lead lists, built for you',
  'Invoice & payment reminders that chase themselves',
  'A real web presence — site + booking — done for you',
  'Steady LinkedIn content so you stay visible without the effort',
  'New-account & student onboarding that runs on its own',
]

export default function MedicalLanding() {
  const reduce = useReducedMotion()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const scrollToForm = () => {
    document.getElementById('medical-audit')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), source: 'medical' }),
      })
      if (res.ok) {
        setStatus('done')
        trackConversion('lead', { location: 'medical' })
      } else {
        throw new Error('Request failed')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again.')
    }
  }

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative min-h-screen overflow-hidden">
        {ASSETS.heroVideo && (
          <video
            autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.2, filter: 'grayscale(0.4) blur(1px) brightness(0.9)' }}
          >
            <source src={ASSETS.heroVideo} type="video/mp4" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E1B17]/95 via-[#1E1B17]/80 to-[#1E1B17]/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E1B17]/25 via-transparent to-[#1E1B17]/60" />
        <div
          className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: 700, height: 500,
            background: 'radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        <div className="relative z-10 max-w-[1100px] mx-auto px-6 min-h-screen flex flex-col justify-center pt-24 pb-20">
          <div className="flex flex-col gap-7 max-w-2xl">
            <motion.p
              className="text-gold text-[10px] tracking-[0.35em] uppercase font-medium"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              AI Automation for Medical Pros
            </motion.p>

            <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-semibold leading-[1.06] tracking-tight text-white">
              <TextReveal text="You Went Into Medicine. Not Manual Busywork." delay={0.2} />
            </h1>

            <motion.p
              className="text-white/65 text-base md:text-lg leading-relaxed max-w-xl"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
            >
              If you&apos;re a solo medical rep, consultant, instructor, or admin running everything
              by hand — follow-ups, scheduling, your CRM, reminders, invoicing — I build the systems
              that run it for you. Done-for-you. You don&apos;t learn a single tool.
            </motion.p>

            <motion.p
              className="text-white/30 text-[10px] tracking-widest uppercase"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.05 }}
            >
              For independent medical sales reps · clinical consultants · SPD &amp; surgical-tech instructors · clinic admins
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 pt-1"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
            >
              <CTAButton onClick={bookDiscoveryCall} size="large">
                Book a Discovery Call →
              </CTAButton>
              <button
                onClick={scrollToForm}
                className="px-8 py-4 text-[11px] tracking-widest uppercase border border-gold/35 text-gold/70 hover:border-gold/60 hover:text-gold transition-colors duration-200"
              >
                Get the Free Audit Guide
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <GoldRule />

      {/* ── Story ──────────────────────────────────────────────── */}
      <section className="section">
        <motion.div
          className="border-l-2 border-gold/40 pl-8 py-2"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="space-y-5 text-white/70 text-base md:text-lg leading-loose">
            <p>
              I&apos;ve spent my career in the medical world. I know what your week actually looks
              like — accounts to visit, in-services to run, schedules to juggle, and a phone full of
              follow-ups you&apos;ll get to &ldquo;tonight.&rdquo;
            </p>
            <p>
              The clinical work is the easy part. It&apos;s everything around it — the texts, the
              scheduling, the spreadsheet, the chasing — that eats your evenings and lets good leads
              go cold.
            </p>
            <p>
              So I started building systems to handle all of it in the background. Capture, follow-up,
              booking, reminders, onboarding — running on their own.
            </p>
            <p className="text-white font-medium">Now I build that for other medical solo operators.</p>
            <p>
              It starts with a free 15-minute call. You tell me what&apos;s eating your time. I tell you
              exactly what I&apos;d build, what it takes, and whether I&apos;m the right person to build it.
            </p>
          </div>
        </motion.div>
      </section>

      <GoldRule />

      {/* ── Outcomes ───────────────────────────────────────────── */}
      <section className="section-wide">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-3 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              <TextReveal text="What I Build For You" />
            </h2>
            <p className="text-white/40 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Done-for-you, end to end. You don&apos;t pick tools or learn software — you tell me the
              bottleneck, I ship the system.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gold/10">
            {OUTCOMES.map((o, i) => (
              <div
                key={i}
                className="bg-background flex items-center gap-4 px-6 py-5 hover:bg-white/[0.02] transition-colors duration-200"
              >
                <span className="text-gold/40 text-[10px] font-medium tracking-widest flex-shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-white/70 text-sm leading-snug">{o}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GoldRule />

      {/* ── Lead magnet / audit ────────────────────────────────── */}
      <section id="medical-audit" className="section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="flex flex-col gap-6">
            <p className="text-gold text-[10px] tracking-[0.35em] uppercase font-medium">Free Guide</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight leading-tight">
              <TextReveal text="The Manual-Work Audit for Medical Solos" />
            </h2>
            <p className="text-white/55 text-sm md:text-base leading-relaxed">
              The straight-to-the-point checklist of the tasks draining your week — and exactly which
              ones to hand off to a system first. No fluff. Just the moves.
            </p>
            <ul className="space-y-2">
              {[
                'The repetitive tasks costing medical solos the most time',
                'What each one quietly costs you in hours per month',
                'The fix for each — and which to automate first',
              ].map((pt, i) => (
                <li key={i} className="flex items-start gap-3 text-white/60 text-sm">
                  <span className="text-gold mt-0.5 flex-shrink-0">→</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            {status === 'done' ? (
              <div className="border border-gold/30 p-6 flex flex-col gap-2">
                <p className="text-gold text-sm font-medium tracking-wide">You&apos;re in.</p>
                <p className="text-white/55 text-sm leading-relaxed">
                  Check your inbox — the guide is on its way. Ready to talk?{' '}
                  <button
                    onClick={bookDiscoveryCall}
                    className="text-gold underline underline-offset-2 hover:text-white transition-colors"
                  >
                    Book your free call →
                  </button>
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
                  {status === 'loading' ? 'Sending…' : 'Send Me the Audit Guide →'}
                </button>
                {errorMsg && <p className="text-red-400 text-xs">{errorMsg}</p>}
                <p className="text-white/25 text-[10px] tracking-wide">No spam. Unsubscribe any time.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      <GoldRule />

      {/* ── Final CTA ──────────────────────────────────────────── */}
      <section className="section text-center">
        <div className="flex flex-col items-center gap-6 max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            <TextReveal text="One Call. We Map What to Automate First." />
          </h2>
          <p className="text-white/50 text-sm md:text-base leading-relaxed">
            Free, 15 minutes, no pressure. You&apos;ll leave with a clear plan for getting your time
            back — whether we work together or not.
          </p>
          <CTAButton onClick={bookDiscoveryCall} size="large">
            Book a Discovery Call →
          </CTAButton>
        </div>
      </section>
    </>
  )
}
