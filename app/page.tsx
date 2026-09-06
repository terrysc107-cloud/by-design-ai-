import type { Metadata } from 'next'
import HomePreviewExperience from './home-preview/HomePreviewExperience'
import './home-preview/home-preview.css'

export const metadata: Metadata = {
  title: 'AIxDesign — Persistent AI Agents and Business Systems',
  description:
    'AIxDesign builds persistent agents and workflows that take on real responsibilities inside your business.',
  alternates: {
    canonical: 'https://aixdesign.dev',
  },
  openGraph: {
    title: 'AIxDesign — Persistent AI Agents and Business Systems',
    description:
      'Give AI standing work, not one-off prompts. Build persistent agents and workflows around the way your business actually operates.',
    url: 'https://aixdesign.dev',
    siteName: 'AIxDesign',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIxDesign — Persistent AI Agents and Business Systems',
    description:
      'Persistent agents and workflows for businesses ready to run on AI.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Home() {
  return <HomePreviewExperience />
}
