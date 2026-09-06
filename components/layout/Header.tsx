'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { bookDiscoveryCall } from '@/lib/cta'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed z-50 left-1/2 -translate-x-1/2 top-3 md:top-[18px] w-[calc(100%_-_24px)] md:w-[calc(100%_-_32px)] max-w-[1200px] h-[60px] md:h-16 rounded-[20px] border backdrop-blur-xl transition-all ${scrolled ? 'bg-white/90 border-white shadow-[0_16px_55px_rgba(20,42,71,.12)]' : 'bg-white/80 border-white/80 shadow-[0_12px_40px_rgba(20,42,71,.08)]'}`}>
      <div className="h-full px-3 md:px-[18px] flex items-center justify-between">
        <Link href="/" aria-label="AI by Design home" className="flex items-center gap-2.5 text-[#09111F] font-bold tracking-[-.04em]">
          <img src="/voice-agent/aix-mark.svg" alt="" className="w-8 h-8 rounded-[10px]" />
          <span>aixdesign</span>
        </Link>
        <nav className="flex items-center gap-5 text-[11px] font-semibold text-[#526071]">
          <Link href="/voice-agent" className="hidden lg:inline hover:text-[#2878FF]">Agents</Link>
          <Link href="/education" className="hidden sm:inline hover:text-[#2878FF]">Education</Link>
          <Link href="/newsletter" className="hidden md:inline hover:text-[#2878FF]">Insights</Link>
          <Link href="/blog" className="hidden lg:inline hover:text-[#2878FF]">Blog</Link>
          <button onClick={bookDiscoveryCall} className="px-4 py-3 rounded-xl bg-[#09111F] text-white hover:bg-[#2878FF] transition-colors">Book a call <span aria-hidden="true">↗</span></button>
        </nav>
      </div>
    </header>
  )
}
