'use client'

import { motion, useReducedMotion } from 'framer-motion'
import TextReveal from '@/components/ui/TextReveal'
import AnimatedBorderCard from '@/components/ui/AnimatedBorderCard'

const offers = [
  {
    title: 'AI Ops Audit',
    price: '$2,500',
    description: 'We map your operation, surface exactly where you\'re losing time and leverage, and deliver a priority build plan. This is where everyone starts.',
    badge: 'Start Here',
    active: true,
  },
  {
    title: 'North Star OS Setup',
    price: 'From $5,000',
    description: 'After the audit, we build your full personal OS. Gmail, Calendar, Notion, Supabase, Plaid, Telegram — all configured to your operation and deployed.',
    badge: 'Full Build',
    active: false,
  },
  {
    title: 'Concierge',
    price: '$1,500 / mo',
    description: 'Ongoing system tuning, new automations, monthly review call, and support as your portfolio and businesses grow.',
    badge: 'Ongoing',
    active: false,
  },
]

export default function OfferLadder() {
  const shouldReduce = useReducedMotion()

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: shouldReduce ? 0 : 0.15, delayChildren: 0.1 } },
  }
  const card = {
    hidden: shouldReduce ? { opacity: 1 } : { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section className="section-wide">
      <div className="flex flex-col gap-12">
        <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight text-center">
          <TextReveal text="Two Ways to Work Together" />
        </h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {offers.map((offer, i) => (
            <motion.div
              key={i}
              variants={card}
              whileHover={shouldReduce ? {} : { scale: 1.02, y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={offer.active ? '' : 'opacity-60'}
            >
              <AnimatedBorderCard active={offer.active} className="h-full">
                <div className="flex flex-col gap-5 h-full">
                  <div className="flex items-start justify-between">
                    <h3 className="text-white font-semibold text-base md:text-lg">
                      {offer.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 tracking-widest uppercase flex-shrink-0 ml-2 ${
                        offer.active
                          ? 'bg-gold text-black font-semibold'
                          : 'border border-gold/40 text-gold/60'
                      }`}
                    >
                      {offer.badge}
                    </span>
                  </div>
                  <p
                    className={`text-2xl md:text-3xl font-semibold ${
                      offer.active ? 'gold-shimmer' : 'text-white/60'
                    }`}
                  >
                    {offer.price}
                  </p>
                  <p className="text-white/55 text-sm leading-relaxed flex-1">
                    {offer.description}
                  </p>
                </div>
              </AnimatedBorderCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
