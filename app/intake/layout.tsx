import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pre-Call Intake — AI by Design',
  description: 'Tell us about your business so we arrive at your discovery call with a plan already half-built.',
  alternates: { canonical: '/intake' },
  robots: { index: false, follow: true },
}

export default function IntakeLayout({ children }: { children: React.ReactNode }) {
  return children
}
