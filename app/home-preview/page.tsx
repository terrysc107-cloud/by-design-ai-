import type { Metadata } from 'next'
import HomePreviewExperience from './HomePreviewExperience'
import './home-preview.css'

export const metadata: Metadata = {
  title: 'AIxDesign — From AI Ideas to Operating Systems',
  description:
    'AI coaching, consulting, and custom systems for operators who want AI to create leverage, not more complexity.',
  robots: { index: false, follow: false },
}

export default function HomePreviewPage() {
  return <HomePreviewExperience />
}
