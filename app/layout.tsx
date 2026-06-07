import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider'
import OrganizationJsonLd from '@/components/seo/JsonLd'
import MetaPixel from '@/components/analytics/MetaPixel'

const SITE_URL = 'https://aixdesign.dev'
const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'AI by Design — AI Business Coaching & Consulting',
  description:
    'AI by Design is an AI business coaching & consulting agency. We diagnose the bottleneck, design the system, and ship a lean, autonomous custom solution — tool-agnostic, outcome-led. Book a free discovery call.',
  applicationName: 'AI by Design',
  keywords: [
    'AI business coaching',
    'AI consulting',
    'business automation',
    'AI automation agency',
    'workflow automation',
    'custom AI solutions',
    'agentic workflows',
    'small business automation',
    'lean systems',
    'operating system for business',
    'n8n',
    'Make.com',
    'Go High Level',
  ],
  authors: [{ name: 'Terry — AI by Design', url: SITE_URL }],
  creator: 'AI by Design',
  publisher: 'AI by Design',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'AI by Design',
    title: 'AI by Design — AI Business Coaching & Consulting',
    description:
      'Stop learning about AI. Start running on it. We diagnose the bottleneck, design the system, and ship the lean, autonomous custom solution. Book a free discovery call.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI by Design — AI Business Coaching & Consulting',
    description: 'Stop learning about AI. Start running on it. Book a free discovery call.',
    creator: '@aixdesign',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  // Set GOOGLE_SITE_VERIFICATION in Vercel env to the token from Search Console
  // (Add property → HTML tag method). Omitted automatically when unset.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="font-sans bg-background text-white antialiased">
        <OrganizationJsonLd />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
        <MetaPixel />
        <Analytics />
        <SpeedInsights />
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      </body>
    </html>
  )
}
