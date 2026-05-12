'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'

export default function GoldRule() {
  const shouldReduce = useReducedMotion()
  return (
    <motion.div
      className="w-full px-6"
      initial={shouldReduce ? false : { opacity: 0, scaleX: 0.3 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <hr className="gold-rule" />
    </motion.div>
  )
}
