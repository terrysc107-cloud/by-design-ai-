import NoiseBg from '@/components/effects/NoiseBg'
import GoldRule from '@/components/ui/GoldRule'
import Hero from '@/components/sections/Hero'
import PatternInterrupt from '@/components/sections/PatternInterrupt'
import TheAudit from '@/components/sections/TheAudit'
import TheBoardReel from '@/components/sections/TheBoardReel'
import TwoPaths from '@/components/sections/TwoPaths'
import TheOperator from '@/components/sections/TheOperator'
import WhatHappensNext from '@/components/sections/WhatHappensNext'
import OfferLadder from '@/components/sections/OfferLadder'
import LeadMagnet from '@/components/sections/LeadMagnet'
import FinalCTA from '@/components/sections/FinalCTA'
import Footer from '@/components/layout/Footer'
import StickyMobileCTA from '@/components/layout/StickyMobileCTA'
import LeadMagnetModal from '@/components/layout/LeadMagnetModal'
import Header from '@/components/layout/Header'

export default function Home() {
  return (
    <main id="top" className="relative min-h-screen bg-background overflow-x-hidden">
      <NoiseBg />
      <Header />

      <Hero />
      <GoldRule />
      <PatternInterrupt />
      <GoldRule />
      <TheAudit />
      <GoldRule />
      <TheBoardReel />
      <GoldRule />
      <TwoPaths />
      <GoldRule />
      <OfferLadder />
      <GoldRule />
      <WhatHappensNext />
      <GoldRule />
      <TheOperator />
      <GoldRule />
      <LeadMagnet />
      <GoldRule />
      <FinalCTA />
      <GoldRule />
      <Footer />

      <StickyMobileCTA />
      <LeadMagnetModal />
    </main>
  )
}
