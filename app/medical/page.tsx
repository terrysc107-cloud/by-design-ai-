import type { Metadata } from 'next'
import NoiseBg from '@/components/effects/NoiseBg'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import GoldRule from '@/components/ui/GoldRule'
import StickyMobileCTA from '@/components/layout/StickyMobileCTA'
import MedicalLanding from '@/components/sections/medical/MedicalLanding'

export const metadata: Metadata = {
  title: 'AI Automation for Medical Solos — Done For You | AI by Design',
  description:
    'For independent medical sales reps, clinical consultants, SPD & surgical-tech instructors, and clinic admins. I build the systems that handle your follow-ups, scheduling, CRM, and reminders — done for you. Free discovery call.',
  alternates: { canonical: '/medical' },
  openGraph: {
    title: 'You went into medicine. Not manual busywork.',
    description:
      'Done-for-you AI automation for solo medical operators. I build the systems that run your follow-ups, scheduling, and admin — so you get your time back.',
    url: 'https://aixdesign.dev/medical',
  },
}

export default function MedicalPage() {
  return (
    <main id="top" className="relative min-h-screen bg-background overflow-x-hidden">
      <NoiseBg />
      <Header />

      <MedicalLanding />

      <GoldRule />
      <Footer />

      <StickyMobileCTA />
    </main>
  )
}
