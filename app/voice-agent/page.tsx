import type { Metadata } from 'next'
import VoiceAgentExperience from './_components/VoiceAgentExperience'
import './voice-agent.css'

const TITLE = 'Your Agent, On Call | AIxDesign Voice'
const DESCRIPTION =
  'Speak to your agent from anywhere. Delegate real work, keep moving, and receive the result when it is ready.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/voice-agent' },
  openGraph: {
    type: 'website',
    url: 'https://aixdesign.dev/voice-agent',
    siteName: 'AI by Design',
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: '/voice-agent/scene-01-poster.png', width: 1920, height: 1080 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    creator: '@aixdesign',
    images: ['/voice-agent/scene-01-poster.png'],
  },
}

export default function VoiceAgentPage() {
  return <VoiceAgentExperience />
}
