'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function StickyMobileCTA() {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setLoading(false)
      }
    } catch {
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1.5 }}
    >
      {/* Fade-up gradient above bar */}
      <div className="h-8 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full py-4 px-6 bg-gold text-black text-xs font-semibold tracking-wide flex items-center justify-center gap-2 disabled:opacity-60 active:bg-[#b8952f] transition-colors"
      >
        {loading ? (
          <>
            <span className="w-1 h-1 bg-black rounded-full animate-pulse" />
            <span className="w-1 h-1 bg-black rounded-full animate-pulse [animation-delay:0.15s]" />
            <span className="w-1 h-1 bg-black rounded-full animate-pulse [animation-delay:0.3s]" />
          </>
        ) : (
          '5 Spots Left — Book the Audit · $2,500'
        )}
      </button>
    </motion.div>
  )
}
