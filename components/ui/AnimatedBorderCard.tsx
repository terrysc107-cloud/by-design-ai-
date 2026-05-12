'use client'

interface AnimatedBorderCardProps {
  children: React.ReactNode
  active?: boolean
  className?: string
}

export default function AnimatedBorderCard({
  children,
  active = false,
  className = '',
}: AnimatedBorderCardProps) {
  if (active) {
    return (
      <div
        className={`border-l-[3px] border-gold pl-8 md:pl-12 py-10 md:py-12 ${className}`}
        style={{ boxShadow: 'inset 8px 0 32px rgba(201,168,76,0.04)' }}
      >
        {children}
      </div>
    )
  }

  return (
    <div className={`border border-white/10 p-8 md:p-10 ${className}`}>
      {children}
    </div>
  )
}
