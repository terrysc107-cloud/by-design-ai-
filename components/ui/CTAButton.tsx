'use client'

import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface CTAButtonProps {
  children: React.ReactNode
  onClick?: () => void | Promise<void>
  loading?: boolean
  className?: string
  size?: 'default' | 'large'
  variant?: 'primary' | 'outline'
}

export default function CTAButton({
  children,
  onClick,
  loading = false,
  className = '',
  size = 'default',
  variant = 'primary',
}: CTAButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const shouldReduce = useReducedMotion()

  const sizeClasses =
    size === 'large'
      ? 'px-10 py-4 text-sm'
      : 'px-7 py-3 text-xs'

  const variantClasses =
    variant === 'primary'
      ? 'bg-gold text-black hover:bg-[#d9b85a] active:bg-[#b8952f]'
      : 'bg-transparent border border-gold/50 text-gold hover:border-gold hover:text-white'

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      disabled={loading}
      whileTap={shouldReduce ? {} : { scale: 0.97 }}
      whileHover={shouldReduce ? {} : { y: -1 }}
      transition={{ duration: 0.15 }}
      className={`
        inline-flex items-center justify-center
        font-medium tracking-wide
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses} ${variantClasses} ${className}
      `}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="inline-block w-1 h-1 bg-current rounded-full animate-pulse" />
          <span className="inline-block w-1 h-1 bg-current rounded-full animate-pulse [animation-delay:0.15s]" />
          <span className="inline-block w-1 h-1 bg-current rounded-full animate-pulse [animation-delay:0.3s]" />
        </span>
      ) : (
        children
      )}
    </motion.button>
  )
}
