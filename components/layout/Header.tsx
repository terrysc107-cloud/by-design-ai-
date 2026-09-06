'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { bookDiscoveryCall } from '@/lib/cta'
import './site-shell.css'

const nav = [
  ['Agents', '/voice-agent'],
  ['Education', '/education'],
  ['Insights', '/newsletter'],
  ['Blog', '/blog'],
  ['Free guide', '/guide'],
] as const

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [open])

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="site-header__inner">
        <Link href="/" aria-label="AI by Design home" className="site-brand" onClick={() => setOpen(false)}>
          <img src="/brand/aixdesign-mark.svg" alt="" />
          <span>aixdesign</span>
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          <button type="button" onClick={bookDiscoveryCall} className="site-nav__cta">Book a discovery call ↗</button>
          <button type="button" className="site-menu-button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(value => !value)}>{open ? '×' : '≡'}</button>
        </nav>
        <nav id="mobile-navigation" className={`site-mobile-menu${open ? ' is-open' : ''}`} aria-label="Mobile navigation">
          {nav.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
          <button type="button" onClick={() => { setOpen(false); bookDiscoveryCall() }}>Book a discovery call ↗</button>
        </nav>
      </div>
    </header>
  )
}
