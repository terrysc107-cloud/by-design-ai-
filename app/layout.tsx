import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider'

export const metadata: Metadata = {
  title: 'By Design AI — AI Operations Coaching',
  description:
    'A 60-minute operational deep dive into your business. Built for operators doing $5K–$30K a month who are still the bottleneck.',
  openGraph: {
    title: 'By Design AI — AI Operations Coaching',
    description: 'Stop being the bottleneck. 5 spots. No exceptions.',
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
      </body>
    </html>
  )
}
