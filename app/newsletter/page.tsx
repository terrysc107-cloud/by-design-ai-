import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import NewsletterSignup from '@/components/sections/NewsletterSignup'
import './newsletter.css'

export const metadata: Metadata = {
  title: 'The AI by Design Newsletter — One Useful AI Move a Week',
  description: 'A practical weekly brief for operators: one useful AI move, the system behind it, and where to put it to work.',
  alternates: { canonical: '/newsletter' },
}

const PROMISES = [
  ['01', 'One operating move', 'A focused workflow, decision, or system you can apply—not a roundup of AI headlines.'],
  ['02', 'Why it matters', 'The bottleneck it addresses, the tradeoff involved, and the conditions that make it worth doing.'],
  ['03', 'How to use it', 'A practical starting point, the tools when relevant, and the smallest useful next action.'],
]

export default function NewsletterPage() {
  return (
    <main className="newsletter-premium">
      <Header />
      <section className="newsletter-hero">
        <div className="newsletter-signal" aria-hidden="true" />
        <div className="newsletter-wrap">
          <p className="newsletter-kicker">The AI by Design briefing</p>
          <h1>One useful AI move.<br /><em>Every week.</em></h1>
          <p className="newsletter-lede">A short operating brief for people who need AI to improve the way work gets done—not create another stream of things to keep up with.</p>
        </div>
      </section>
      <section className="newsletter-wrap newsletter-promises">
        {PROMISES.map(([n,title,body]) => <article key={n}><span>{n}</span><h2>{title}</h2><p>{body}</p></article>)}
      </section>
      <section className="newsletter-signup">
        <div className="newsletter-signup-grid">
          <div><p className="newsletter-kicker">Useful by Friday</p><h2>Get the next issue.</h2></div>
          <div><p className="newsletter-signup-copy">No daily noise. No recycled prompt lists. One practical idea with enough context to decide whether it deserves your attention.</p><NewsletterSignup theme="light" source="newsletter" heading="Join the briefing." blurb="Enter your email to receive the next issue. Free, and easy to leave whenever it stops being useful." className="mt-7 rounded-[24px] shadow-[0_22px_70px_rgba(20,42,71,.09)]"/><p className="newsletter-links">Want proof first? Browse the <a href="/blog">latest insights</a> or <a href="/guide">get the free guide</a>.</p></div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
