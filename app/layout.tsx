import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider'
import BookingModal from '@/components/layout/BookingModal'

export const metadata: Metadata = {
  title: 'By Design AI — AI Expert Consulting',
  description:
    'AI strategy, agentic workflows, custom OS builds, and 1-on-1 coaching for business owners, content creators, and real estate professionals.',
  openGraph: {
    title: 'By Design AI — AI Expert Consulting',
    description: 'Stop learning about AI. Start running on it.',
    siteName: 'By Design AI',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="font-sans bg-background text-white antialiased">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <BookingModal />
      </body>
    </html>
  )
}
