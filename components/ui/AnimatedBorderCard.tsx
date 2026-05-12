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
      <div className={`animated-border-wrap ${className}`}>
        <div className="animated-border-inner p-8 md:p-12">{children}</div>
      </div>
    )
  }

  return (
    <div className={`static-border-wrap p-8 md:p-10 ${className}`}>
      {children}
    </div>
  )
}
