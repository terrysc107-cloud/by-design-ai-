'use client'

import Link from 'next/link'
import NewsletterSignup from '@/components/sections/NewsletterSignup'

export default function Footer() {
  return (
    <footer className="w-full px-6 py-12 border-t border-[rgba(201,168,76,0.15)]">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-10">
        {/* Newsletter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="max-w-md">
            <p className="text-white/70 text-base font-medium tracking-wide">
              One useful AI move a week.
            </p>
            <p className="text-white/40 text-sm mt-1">
              Short, practical notes — no hype, no filler. Unsubscribe any time.
            </p>
          </div>
          <NewsletterSignup variant="inline" source="footer" className="w-full md:max-w-sm" />
        </div>

        {/* Legal row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40 border-t border-white/5 pt-8">
          <span className="font-medium text-white/60 tracking-wide">AI by Design</span>
          <span>© 2026 AI by Design. All rights reserved.</span>
          <nav className="flex gap-6">
            <Link href="/blog" className="hover:text-gold transition-colors duration-200">
              Blog
            </Link>
            <Link href="/privacy" className="hover:text-gold transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gold transition-colors duration-200">
              Terms of Service
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
