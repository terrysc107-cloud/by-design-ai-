'use client'

import { motion, useReducedMotion } from 'framer-motion'
import TextReveal from '@/components/ui/TextReveal'

const clients = [
  'Agencies reselling GHL to clients who need their snapshot built, their clients onboarded, and their platform actually managed.',
  'Coaches and consultants migrating to GHL from a patchwork of tools — and who need the whole thing wired together, not just the funnel.',
  'Local service businesses that want automated follow-up, appointment booking, and review management without hiring another staff member.',
  'Marketing teams who already have GHL but aren\'t seeing results — because the workflows are broken, the sequences are stale, or the setup was never finished.',
  'Businesses that want AI layered into their GHL — smart routing, personalized outreach, and automated responses that save hours every week.',
  'Live stack: Go High Level · Make.com · n8n · OpenAI · Stripe · Twilio · Google Workspace · Custom Webhooks',
]

export default function TheOperator() {
  const shouldReduce = useReducedMotion()

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: shouldReduce ? 0 : 0.07, delayChildren: 0.1 } },
  }
  const item = {
    hidden: shouldReduce ? { opacity: 1 } : { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section className="section">
      <div className="flex flex-col gap-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
          <TextReveal text="Who We Work With" />
        </h2>

        <motion.ul
          className="space-y-4"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {clients.map((c, i) => (
            <motion.li
              key={i}
              variants={item}
              className="flex items-start gap-3 text-white/70 text-sm md:text-base"
            >
              <span className="text-gold mt-0.5 flex-shrink-0 text-lg leading-none">·</span>
              <span>{c}</span>
            </motion.li>
          ))}
        </motion.ul>

        <motion.p
          className="text-center text-white/50 text-sm md:text-base italic leading-relaxed"
          initial={shouldReduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          &ldquo;We don&apos;t teach you GHL. We run it for you — until your team is ready to take over.&rdquo;
        </motion.p>
      </div>
    </section>
  )
}
