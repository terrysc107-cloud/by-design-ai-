'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { bookDiscoveryCall } from '@/lib/cta'

/**
 * Sticky site header: puts the brand on every screen and keeps a persistent
 * "Book a Discovery Call" CTA in view (the only conversion goal). Transparent
 * over the hero; gains a blurred bar + border once the user scrolls.
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'bg-[#1E1B17]/85 backdrop-blur-md border-b border-gold/15'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <a href="#top" aria-label="AI by Design — home" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/aixdesign-lockup.svg"
            alt="AI by Design"
            className="h-8 md:h-10 w-auto"
          />
        </a>

        {/* Right side */}
        <div className="flex items-center gap-5">
          <Link
            href="/blog"
            className="hidden sm:inline text-[11px] tracking-widest uppercase text-white/55 hover:text-gold transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/newsletter"
            className="hidden sm:inline text-[11px] tracking-widest uppercase text-white/55 hover:text-gold transition-colors"
          >
            Newsletter
          </Link>
          {/* SWAPPED 2026-09-03. The old note here read "Coaching outranks
              Education for the sm slot: it sells, Education refers." That was
              true when the course was a $97 page on another domain we were not
              sure of. It now has a live $57 checkout and is one of the two
              co-equal paths on the homepage, so Education takes the earlier
              breakpoint and Coaching moves back a tier. The row cannot hold
              both at sm without going to two lines, which is why this is a
              swap and not an addition. */}
          <Link
            href="/education"
            className="hidden sm:inline text-[11px] tracking-widest uppercase text-white/55 hover:text-gold transition-colors"
          >
            Education
          </Link>
          {/* md+ only: at sm the row is already at its width budget. */}
          <Link
            href="/coaching"
            className="hidden md:inline text-[11px] tracking-widest uppercase text-white/55 hover:text-gold transition-colors"
          >
            Coaching
          </Link>
          {/* Was a <button> calling
              getElementById('lead-magnet')?.scrollIntoView(). #lead-magnet only
              exists in components/sections/LeadMagnet.tsx, which renders only on
              the homepage — but this Header renders on 8 pages. So on /blog,
              /newsletter, /coaching, /education, /education/claude-code and
              /medical the optional chain swallowed the miss and the button
              silently did nothing. /guide is a real page (200); link to it. */}
          <Link
            href="/guide"
            className="hidden md:inline text-[11px] tracking-widest uppercase text-white/55 hover:text-gold transition-colors"
          >
            Free Guide
          </Link>
          <button
            onClick={bookDiscoveryCall}
            className="px-5 py-2.5 text-[11px] tracking-widest uppercase border border-gold/45 text-gold hover:bg-gold hover:text-[#1E1B17] transition-colors duration-200"
          >
            Book a Discovery Call
          </button>
        </div>
      </div>
    </motion.header>
  )
}
