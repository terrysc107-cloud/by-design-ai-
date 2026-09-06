'use client'

import Link from 'next/link'
import NewsletterSignup from '@/components/sections/NewsletterSignup'
import './site-shell.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__top">
          <div>
            <Link href="/" className="site-brand"><img src="/brand/aixdesign-mark.svg" alt="" /><span style={{color:'#fff'}}>aixdesign</span></Link>
            <p className="site-footer__statement">Persistent agents and workflows for businesses ready to <em>run on AI.</em></p>
          </div>
          <div className="site-footer__signup"><p>One useful AI move a week.</p><NewsletterSignup variant="inline" source="footer" /></div>
        </div>
        <div className="site-footer__bottom">
          <span>© 2026 AI by Design. All rights reserved.</span>
          <nav className="site-footer__links" aria-label="Footer navigation">
            <Link href="/about">About</Link><Link href="/voice-agent">Agents</Link><Link href="/education">Education</Link><Link href="/newsletter">Newsletter</Link><Link href="/blog">Blog</Link><Link href="/guide">Free guide</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
