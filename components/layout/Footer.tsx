'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full px-6 py-10 border-t border-[rgba(201,168,76,0.15)]">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
        <span className="font-medium text-white/60 tracking-wide">By Design AI</span>
        <span>© 2026 By Design AI. All rights reserved.</span>
        <nav className="flex gap-6">
          <Link
            href="/privacy"
            className="hover:text-gold transition-colors duration-200"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="hover:text-gold transition-colors duration-200"
          >
            Terms of Service
          </Link>
        </nav>
      </div>
    </footer>
  )
}
