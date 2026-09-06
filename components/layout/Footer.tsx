'use client'

import Link from 'next/link'
import NewsletterSignup from '@/components/sections/NewsletterSignup'

export default function Footer() {
  return (
    <footer className="w-full px-6 py-14 border-t border-[#19273a] bg-[#09111F] text-white">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-11">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-7">
          <div className="max-w-md">
            <div className="flex items-center gap-2.5 mb-4"><img src="/voice-agent/aix-mark.svg" alt="" className="w-9 h-9 rounded-xl"/><strong className="tracking-[-.04em]">aixdesign</strong></div>
            <p className="text-white text-lg font-medium">One useful AI move a week.</p>
            <p className="text-[#AAB6C6] text-sm mt-1">A practical operating idea, why it matters, and where to use it.</p>
          </div>
          <NewsletterSignup variant="inline" source="footer" className="w-full md:max-w-sm" />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#8996A7] border-t border-white/10 pt-8">
          <span>© 2026 AI by Design. All rights reserved.</span>
          <nav className="flex flex-wrap justify-center gap-6"><Link href="/voice-agent" className="hover:text-[#73D7F3]">Voice Agent</Link><Link href="/education" className="hover:text-[#73D7F3]">Education</Link><Link href="/blog" className="hover:text-[#73D7F3]">Insights</Link><Link href="/privacy" className="hover:text-[#73D7F3]">Privacy</Link><Link href="/terms" className="hover:text-[#73D7F3]">Terms</Link></nav>
        </div>
      </div>
    </footer>
  )
}
