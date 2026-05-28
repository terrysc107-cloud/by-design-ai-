'use client'

import { motion, useReducedMotion } from 'framer-motion'
import TextReveal from '@/components/ui/TextReveal'
import CTAButton from '@/components/ui/CTAButton'
import AnimatedBorderCard from '@/components/ui/AnimatedBorderCard'
import { openBookingModal } from '@/lib/cta'

const tracks = [
  {
    label: '01',
    title: 'Done For You',
    body: 'You tell me the problem. I build the solution. You get a fully working system — automations active, workflows running, nothing left half-finished.',
    detail: 'Best for: operators who want it handled, not explained.',
  },
  {
    label: '02',
    title: 'Education',
    body: 'Group workshops and structured training for people who want to understand automation and build it themselves. Learn the tools, the logic, and the approach.',
    detail: 'Best for: curious operators who want hands-on skill.',
  },
  {
    label: '03',
    title: 'Coaching',
    body: '1-on-1 sessions to audit your operation, map the gaps, and build a clear automation plan. I ask the right questions — you leave with a real roadmap.',
    detail: 'Best for: those who need direction before they build.',
  },
  {
    label: '04',
    title: 'Management',
    body: 'Ongoing retainer. I run and maintain your automation stack as your operation grows — new builds, updates, troubleshooting, and monthly reviews.',
    detail: 'Best for: operators who want it off their plate permanently.',
  },
]

export default function TheAudit() {
  const shouldReduce = useReducedMotion()

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: shouldReduce ? 0 : 0.12, delayChildren: 0.1 } },
  }
  const card = {
    hidden: shouldReduce ? { opacity: 1 } : { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section className="section">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            <TextReveal text="How I Help" />
          </h2>
          <p className="text-white/45 text-sm md:text-base max-w-lg leading-relaxed">
            Every engagement starts with a free call. Once I know your situation, we match you to
            the right track.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {tracks.map((t) => (
            <motion.div key={t.label} variants={card}>
              <AnimatedBorderCard active={false} className="h-full">
                <div className="flex flex-col gap-4 h-full">
                  <div className="flex items-center gap-3">
                    <span className="text-gold text-[10px] tracking-widest font-medium">{t.label}</span>
                    <h3 className="text-white font-semibold text-base md:text-lg">{t.title}</h3>
                  </div>
                  <p className="text-white/55 text-sm leading-relaxed flex-1">{t.body}</p>
                  <p className="text-gold/60 text-xs tracking-wide italic">{t.detail}</p>
                </div>
              </AnimatedBorderCard>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <CTAButton onClick={openBookingModal}>
            Let&apos;s Talk — Book a Free Call →
          </CTAButton>
        </motion.div>
      </div>
    </section>
  )
}
