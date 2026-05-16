'use client'

import { motion, useReducedMotion } from 'framer-motion'
import TextReveal from '@/components/ui/TextReveal'

const steps = [
  {
    num: '01',
    title: 'Book the AI Ops Audit',
    body: 'A 60-minute deep dive into your operation. We map what you have, identify what to build, and deliver a full priority plan. This is where everyone starts.',
  },
  {
    num: '02',
    title: 'We Build Your Apex OS',
    body: 'We configure your personal bot, wire up all your accounts — Gmail, Google Calendar, Notion, Supabase, Plaid — and deploy your automations. Personalized to your portfolio.',
  },
  {
    num: '03',
    title: 'Wake Up to Your Brief',
    body: 'The next morning at 6am, your first brief arrives in Telegram. From there, the system runs 24/7.',
  },
]

export default function WhatHappensNext() {
  const shouldReduce = useReducedMotion()

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: shouldReduce ? 0 : 0.2 } },
  }
  const item = {
    hidden: shouldReduce ? { opacity: 1 } : { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section className="section">
      <div className="flex flex-col gap-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
          <TextReveal text="How It Works" />
        </h2>

        <motion.div
          className="flex flex-col gap-0"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {steps.map((step, i) => (
            <motion.div key={i} variants={item} className="relative">
              <div className="flex gap-6 md:gap-8 pb-10">
                {/* Number + connector */}
                <div className="flex flex-col items-center gap-0 flex-shrink-0">
                  <div className="w-10 h-10 border border-gold/40 flex items-center justify-center flex-shrink-0">
                    <span className="text-gold text-xs font-medium tracking-widest">
                      {step.num}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <motion.div
                      className="w-px flex-1 min-h-[40px] bg-gold/20 mt-2"
                      initial={shouldReduce ? false : { scaleY: 0, originY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.4 + i * 0.2 }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="pb-2">
                  <h3 className="text-white font-semibold text-base md:text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-white/55 text-sm md:text-base leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
