'use client'

import { motion, useReducedMotion } from 'framer-motion'
import TextReveal from '@/components/ui/TextReveal'

const offers = [
  {
    title: 'AI Ops Audit',
    price: '$2,500',
    description: 'Find exactly where your operation breaks down and what to build first.',
    badge: 'Start Here',
    featured: true,
  },
  {
    title: '90-Day AI Integration',
    price: '$10,000',
    description: 'Done-with-you build. We implement the full system together.',
    badge: 'By Application',
    featured: false,
  },
  {
    title: 'Inner Circle',
    price: '$2,500 / mo',
    description: 'Ongoing access. Continued architecture. Stay ahead of the curve.',
    badge: 'Invite Only',
    featured: false,
  },
]

export default function OfferLadder() {
  const shouldReduce = useReducedMotion()

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: shouldReduce ? 0 : 0.12, delayChildren: 0.1 } },
  }
  const card = {
    hidden: shouldReduce ? { opacity: 1 } : { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section className="section-wide">
      <div className="flex flex-col gap-14">

        <div className="flex flex-col gap-3">
          <p className="text-gold text-xs tracking-[0.25em] uppercase font-medium">
            The Path
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            <TextReveal text="The Audit Is the Entry Point" />
          </h2>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {offers.map((offer, i) => (
            <motion.div
              key={i}
              variants={card}
              className={`flex flex-col gap-6 p-8 md:p-10 bg-[#0A0A0A] ${
                offer.featured
                  ? 'border-t-[2px] border-gold'
                  : 'border-t-[2px] border-transparent'
              }`}
            >
              {/* Badge */}
              <span
                className={`self-start text-[10px] px-2.5 py-1 tracking-[0.18em] uppercase ${
                  offer.featured
                    ? 'bg-gold text-black font-semibold'
                    : 'border border-white/15 text-white/35'
                }`}
              >
                {offer.badge}
              </span>

              {/* Title + price */}
              <div className="flex flex-col gap-1.5">
                <h3
                  className={`font-semibold text-base md:text-lg tracking-tight ${
                    offer.featured ? 'text-white' : 'text-white/50'
                  }`}
                >
                  {offer.title}
                </h3>
                <p
                  className={`text-3xl md:text-4xl font-semibold leading-none ${
                    offer.featured ? 'text-gold' : 'text-white/25'
                  }`}
                >
                  {offer.price}
                </p>
              </div>

              {/* Description */}
              <p
                className={`text-sm leading-relaxed ${
                  offer.featured ? 'text-white/60' : 'text-white/30'
                }`}
              >
                {offer.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
