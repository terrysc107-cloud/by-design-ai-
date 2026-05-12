import NoiseBg from '@/components/effects/NoiseBg'
import GoldRule from '@/components/ui/GoldRule'
import Hero from '@/components/sections/Hero'
import PatternInterrupt from '@/components/sections/PatternInterrupt'
import PainPoints from '@/components/sections/PainPoints'
import VideoSection from '@/components/sections/VideoSection'
import TheAudit from '@/components/sections/TheAudit'
import TheOperator from '@/components/sections/TheOperator'
import Testimonials from '@/components/sections/Testimonials'
import WhatHappensNext from '@/components/sections/WhatHappensNext'
import OfferLadder from '@/components/sections/OfferLadder'
import FAQ from '@/components/sections/FAQ'
import FinalCTA from '@/components/sections/FinalCTA'
import Footer from '@/components/layout/Footer'
import StickyMobileCTA from '@/components/layout/StickyMobileCTA'

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background">
      <NoiseBg />

      <Hero />

      <GoldRule />
      <PatternInterrupt />

      <GoldRule />
      <PainPoints />

      <GoldRule />
      <VideoSection />

      <GoldRule />
      <TheAudit />

      <GoldRule />
      <TheOperator />

      <GoldRule />
      <Testimonials />

      <GoldRule />
      <WhatHappensNext />

      <GoldRule />
      <OfferLadder />

      <GoldRule />
      <FAQ />

      <GoldRule />
      <FinalCTA />

      <GoldRule />
      <Footer />

      <StickyMobileCTA />
    </main>
  )
}
