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
        alert('Something went wrong. Please try again.')
        setLoading(false)
      }
    } catch {
      alert('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 1 }}
    >
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full py-4 px-6 bg-black/90 backdrop-blur-md border-t border-gold/40 text-gold text-xs font-medium tracking-widest uppercase flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            Processing…
          </>
        ) : (
          '5 Spots Left — Book the Audit $2,500'
        )}
      </button>
    </motion.div>
  )
}
