import type { Metadata } from 'next'
import HomePreviewExperience from './home-preview/HomePreviewExperience'
import './home-preview/home-preview.css'

export const metadata: Metadata = {
  title: 'AIxDesign — From AI Ideas to Operating Systems',
  description:
    'AI coaching, consulting, and custom systems for operators who want AI to create leverage, not more complexity.',
  alternates: {
    canonical: 'https://aixdesign.dev',
  },
  openGraph: {
    title: 'AIxDesign — From AI Ideas to Operating Systems',
    description:
      'Turn business bottlenecks into lean AI systems that create real operating leverage.',
    url: 'https://aixdesign.dev',
    siteName: 'AIxDesign',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIxDesign — From AI Ideas to Operating Systems',
    description:
      'Turn business bottlenecks into lean AI systems that create real operating leverage.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Home() {
  return <HomePreviewExperience />
}
