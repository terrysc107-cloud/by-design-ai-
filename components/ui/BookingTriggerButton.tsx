'use client'

import { openBookingModal } from '@/lib/cta'

interface Props {
  children: React.ReactNode
  className?: string
}

export default function BookingTriggerButton({ children, className = '' }: Props) {
  return (
    <button type="button" onClick={openBookingModal} className={className}>
      {children}
    </button>
  )
}
