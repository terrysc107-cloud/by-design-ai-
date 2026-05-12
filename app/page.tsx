import NoiseBg from '@/components/effects/NoiseBg'
import GoldParticles from '@/components/effects/GoldParticles'
import GoldRule from '@/components/ui/GoldRule'
import Hero from '@/components/sections/Hero'
import PatternInterrupt from '@/components/sections/PatternInterrupt'
import PainPoints from '@/components/sections/PainPoints'
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

      {/* 1 — Hero: full viewport, split-screen */}
      <Hero />
      <GoldRule />

      {/* 2 — Pattern Interrupt: centered prose, alt bg */}
      <div className="section-alt-wrap">
        <PatternInterrupt />
      </div>
      <GoldRule />

      {/* 3 — Pain Points: problem/solution grid */}
      <PainPoints />
      <GoldRule />

      {/* 4 — The Audit: animated border offer card, gold-tinted bg */}
      <div className="section-gold-wrap">
        <TheAudit />
      </div>
      <GoldRule />

      {/* 5 — The Operator: credentials, alt bg */}
      <div className="section-alt-wrap">
        <TheOperator />
      </div>
      <GoldRule />

      {/* 6 — What Happens Next: 3-step process */}
      <WhatHappensNext />
      <GoldRule />

      {/* 7 — Offer Ladder: 3 cards, alt bg */}
      <div className="section-alt-wrap">
        <OfferLadder />
      </div>
      <GoldRule />

      {/* 8 — Final CTA: gold-tinted closing */}
      <div className="section-gold-wrap">
        <FinalCTA />
      </div>
      <GoldRule />

      <Footer />

      <StickyMobileCTA />
    </main>
  )
}
