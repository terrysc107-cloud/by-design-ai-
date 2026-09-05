import Link from 'next/link'

// Route-local footer for /voice-agent. Deliberately does not import
// components/layout/Footer.tsx - that component embeds a newsletter signup
// form, which would give this route a second email-capture surface and
// violate the waitlist-only CTA exception documented in
// docs/features/voice-agent-waitlist.md.
export default function VoiceAgentFooter() {
  return (
    <footer className="w-full border-t border-gold-border px-6 py-12">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 text-sm text-stone-400 md:flex-row">
        <span className="font-medium tracking-wide text-white/80">AI by Design</span>
        <span>© 2026 AI by Design. All rights reserved.</span>
        <nav className="flex gap-6">
          <Link href="/blog" className="transition-colors duration-200 hover:text-gold">
            Blog
          </Link>
          <Link href="/education" className="transition-colors duration-200 hover:text-gold">
            Education
          </Link>
          <Link href="/privacy" className="transition-colors duration-200 hover:text-gold">
            Privacy Policy
          </Link>
          <Link href="/terms" className="transition-colors duration-200 hover:text-gold">
            Terms of Service
          </Link>
        </nav>
      </div>
    </footer>
  )
}
