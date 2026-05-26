'use client'

import { motion } from 'framer-motion'
import { bookDiscoveryCall } from '@/lib/cta'

export default function StickyMobileCTA() {
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1 }}
    >
      <button
        onClick={bookDiscoveryCall}
        className="w-full py-4 px-6 bg-[#1E1B17]/92 backdrop-blur-md border-t border-gold/40 text-gold text-xs font-medium tracking-widest uppercase flex items-center justify-center gap-2"
      >
        Book a Discovery Call →
      </button>
    </motion.div>
  )
}
