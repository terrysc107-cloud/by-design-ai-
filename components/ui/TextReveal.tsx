'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface TextRevealProps {
  text: string
  className?: string
  delay?: number
}

export default function TextReveal({
  text,
  className = '',
  delay = 0,
}: TextRevealProps) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.span
      className={`block ${className}`}
      initial={shouldReduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {text}
    </motion.span>
  )
}
