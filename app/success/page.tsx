export const dynamic = 'force-dynamic'

import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "You're In — By Design AI",
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center flex flex-col gap-8 py-24">
        <p className="text-gold text-xs tracking-[0.3em] uppercase font-medium">
          Payment Confirmed
        </p>

        <h1 className="text-4xl md:text-6xl font-semibold text-white tracking-tight">
          You&apos;re In.
        </h1>

        <div className="text-white/60 text-base md:text-lg leading-loose space-y-4 text-left max-w-lg mx-auto">
          <p>Here&apos;s what happens next.</p>
          <p>
            Check your email — your intake form will arrive within the next few minutes.
          </p>
          <p>
            Complete all 5 questions before your call. This is required. No exceptions.
          </p>
          <p>Terry will confirm your call time within 24 hours.</p>
          <p className="text-white font-medium">Show up ready to work.</p>
        </div>

        <div className="pt-4">
          <hr
            className="gold-rule mb-8"
          />
          <Link
            href="/"
            className="text-gold/50 text-xs tracking-widest uppercase hover:text-gold transition-colors"
          >
            ← Return to By Design AI
          </Link>
        </div>
      </div>
    </main>
  )
}
