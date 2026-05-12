'use client'

import { useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

interface CTAButtonProps {
  children: React.ReactNode
  onClick?: () => void | Promise<void>
  loading?: boolean
  className?: string
  size?: 'default' | 'large'
}

export default function CTAButton({
  children,
  onClick,
  loading = false,
  className = '',
  size = 'default',
}: CTAButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const shouldReduce = useReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (shouldReduce || !ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const distX = e.clientX - centerX
      const distY = e.clientY - centerY
      const maxDist = 15
      x.set(Math.max(-maxDist, Math.min(maxDist, distX * 0.3)))
      y.set(Math.max(-maxDist, Math.min(maxDist, distY * 0.3)))
    },
    [shouldReduce, x, y]
  )

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }, [x, y])

  const sizeClasses =
    size === 'large'
      ? 'px-10 py-5 text-sm tracking-widest'
      : 'px-8 py-4 text-xs tracking-widest'

  return (
    <motion.button
      ref={ref}
      style={shouldReduce ? {} : { x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={loading}
      whileTap={shouldReduce ? {} : { scale: 0.97 }}
      className={`cta-btn ${sizeClasses} ${isHovered && !shouldReduce ? 'animate-gold-pulse' : ''} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          Processing…
        </span>
      ) : (
        children
      )}
    </motion.button>
  )
}
