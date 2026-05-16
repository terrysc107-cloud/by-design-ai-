'use client'

import { motion, useReducedMotion } from 'framer-motion'

export default function PatternInterrupt() {
  const shouldReduce = useReducedMotion()

  return (
    <section className="section">
      <motion.div
        className="border-l-2 border-gold/40 pl-8 py-2"
        initial={shouldReduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="space-y-5 text-white/70 text-base md:text-lg leading-loose">
          <p>
            Most founders are reactive. Three inboxes. Two calendars. A Notion board they check when they remember. And still missing what matters.
          </p>
          <p>
            North Star flips that. Before you open your phone, your system has already read your email, scanned your calendar, checked your habits, and flagged what needs your attention — delivered as a single Telegram message.
          </p>
          <p>
            It&apos;s not an app. It&apos;s not a dashboard. It&apos;s an operating layer that runs underneath everything else — wired into Gmail, Google Calendar, Notion, Supabase, and Plaid.
          </p>
          <p className="text-white font-medium">
            You don&apos;t go to it. It comes to you.
          </p>
          <p>Every build starts with an audit. We map your operation first — what you have, what you need, what to build in what order. Then we build it. Personalized to your properties, your habits, your accounts.</p>
        </div>
      </motion.div>
    </section>
  )
}
