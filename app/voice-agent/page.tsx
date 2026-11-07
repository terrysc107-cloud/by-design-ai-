import type { Metadata } from 'next'
import VoiceAgentExperience from './_components/VoiceAgentExperience'
import './voice-agent.css'

const TITLE = 'Call Your Future AI Receptionist | AIxDesign Voice'
const DESCRIPTION =
  'Call a live AI receptionist demo for towing, auto repair, or auto detailing, and see the lead summary the owner would receive. Simulated calls, managed service.'

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
