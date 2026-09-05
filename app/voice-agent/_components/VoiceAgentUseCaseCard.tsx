'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface VoiceAgentUseCaseCardProps {
  heading: string
  body: string
  icon: ReactNode
  /** Position in the grid — drives the reveal stagger. */
  index: number
}

/**
 * Animated use-case card: staggered scroll-reveal (fade-up, once) plus a
 * subtle hover lift/tilt/glow. Follows the same useReducedMotion convention
 * as TextReveal.tsx and CTAButton.tsx — reduced motion drops the transform,
 * leaving only the (already-1) opacity, so the card just appears.
 *
 * Hover-tilt tradeoff: a fixed uniform tilt on whileHover, not pointer-
 * tracked. Cursor-tracked tilt (see CTAButton's magnetic pull) reads right
 * for a small button people aim at; across a whole card it adds a mousemove
 * listener + spring per card for a bigger surface, for a effect users won't
 * consciously clock. The uniform tilt is the cleaner, cheaper win here.
 */
export default function VoiceAgentUseCaseCard({
  heading,
  body,
  icon,
  index,
}: VoiceAgentUseCaseCardProps) {
  const shouldReduce = useReducedMotion()

  const variants = {
    hidden: shouldReduce ? { opacity: 1 } : { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: shouldReduce ? 0 : index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      whileHover={
        shouldReduce
          ? undefined
          : {
              y: -8,
              scale: 1.02,
              rotateX: 4,
              rotateY: -4,
              transition: { type: 'spring', stiffness: 300, damping: 20 },
            }
      }
      style={{ transformPerspective: 800 }}
      className="rounded-sm border border-gold-border bg-gold-dim p-6 transition-shadow duration-300 hover:shadow-[0_0_40px_-8px_rgba(201,168,76,0.35)]"
    >
      <div className="text-gold">{icon}</div>
      <h3 className="mt-4 text-base font-semibold text-gold">{heading}</h3>
      <p className="mt-3 text-base leading-relaxed text-white/80">{body}</p>
    </motion.div>
  )
}
