import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pre-Call Intake — By Design AI',
  description: 'Tell us about your business so we arrive at your discovery call with a plan already half-built.',
}

export default function IntakeLayout({ children }: { children: React.ReactNode }) {
  return children
}
