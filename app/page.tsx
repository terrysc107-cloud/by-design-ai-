import NoiseBg from '@/components/effects/NoiseBg'
import GoldParticles from '@/components/effects/GoldParticles'
import GoldRule from '@/components/ui/GoldRule'
import Hero from '@/components/sections/Hero'
import PatternInterrupt from '@/components/sections/PatternInterrupt'
import TheAudit from '@/components/sections/TheAudit'
import TheOperator from '@/components/sections/TheOperator'
import WhatHappensNext from '@/components/sections/WhatHappensNext'
import OfferLadder from '@/components/sections/OfferLadder'
import FinalCTA from '@/components/sections/FinalCTA'
import Footer from '@/components/layout/Footer'
import StickyMobileCTA from '@/components/layout/StickyMobileCTA'

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background">
      <NoiseBg />
      <GoldParticles />

      <Hero />
      <GoldRule />
      <PatternInterrupt />
      <GoldRule />
      <TheAudit />
      <GoldRule />
      <TheOperator />
      <GoldRule />
      <WhatHappensNext />
      <GoldRule />
      <OfferLadder />
      <GoldRule />
      <FinalCTA />
      <GoldRule />
      <Footer />

      <StickyMobileCTA />
    </main>
  )
}
