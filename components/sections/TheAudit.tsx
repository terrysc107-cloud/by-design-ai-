'use client'

import { motion, useReducedMotion } from 'framer-motion'
import TextReveal from '@/components/ui/TextReveal'
import CTAButton from '@/components/ui/CTAButton'
import AnimatedBorderCard from '@/components/ui/AnimatedBorderCard'
import { bookDiscoveryCall } from '@/lib/cta'

const services = [
  'GHL Account Setup & Configuration — Full sub-account build from scratch: pipelines, calendars, forms, funnels, email/SMS domains, and user permissions. Done right the first time.',
  'Snapshot Development & Deployment — We build custom GHL snapshots for your agency and deploy them cleanly across every client sub-account.',
  'Automation & Workflow Builds — Follow-up sequences, appointment reminders, lead nurture flows, pipeline automations, and trigger logic that actually converts.',
  'AI-Powered Campaign Systems — Smart workflows that use AI to personalize messaging, qualify leads, and respond to contacts before your team ever needs to step in.',
  'Custom Integrations — GHL connected to your stack: Make.com, n8n, Zapier, Stripe, Slack, custom webhooks, and third-party CRMs.',
  'Ongoing GHL Management — Monthly retainer for account maintenance, new automation builds, troubleshooting, and continuous optimization as your operation scales.',
]

export default function TheAudit() {
  const shouldReduce = useReducedMotion()

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: shouldReduce ? 0 : 0.12, delayChildren: 0.2 } },
  }
  const item = {
    hidden: shouldReduce ? { opacity: 1 } : { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section className="section">
      <AnimatedBorderCard active>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              <TextReveal text="What We Build" />
            </h2>
          </div>

          <motion.ul
            className="space-y-4"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {services.map((s, i) => (
              <motion.li
                key={i}
                variants={item}
                className="flex items-start gap-3 text-white/70 text-sm md:text-base leading-relaxed"
              >
                <span className="text-gold mt-1 flex-shrink-0">→</span>
                <span>{s}</span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            className="flex flex-col items-start gap-3"
            initial={shouldReduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <CTAButton onClick={bookDiscoveryCall}>
              Book a Discovery Call →
            </CTAButton>
          </motion.div>
        </div>
      </AnimatedBorderCard>
    </section>
  )
}
