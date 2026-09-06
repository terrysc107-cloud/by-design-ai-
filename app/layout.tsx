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
  title: 'AI by Design — Persistent AI Agents and Business Systems',
  description:
    'AI by Design builds persistent agents and workflows that take on real responsibilities inside your business.',
  applicationName: 'AI by Design',
  keywords: [
    'AI business coaching',
    'AI consulting',
    'business automation',
    'AI agent systems company',
    'persistent AI agents',
    'business AI agents',
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
    title: 'AI by Design — Persistent AI Agents and Business Systems',
    description:
      'Give AI standing work, not one-off prompts. Build persistent agents and workflows around the way your business actually operates.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI by Design — Persistent AI Agents and Business Systems',
    description: 'Persistent agents and workflows for businesses ready to run on AI.',
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
