import type { Metadata } from 'next'
import NoiseBg from '@/components/effects/NoiseBg'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import NewsletterSignup from '@/components/sections/NewsletterSignup'

export const metadata: Metadata = {
  title: 'The Newsletter — One Useful AI Move a Week | AI by Design',
  description:
    'A free weekly email with one practical AI or automation workflow you can put to work in a real business. Written for operators, not engineers. No hype, no filler.',
  alternates: { canonical: '/newsletter' },
  openGraph: {
    type: 'website',
    url: 'https://aixdesign.dev/newsletter',
    title: 'AI by Design — The Newsletter',
    description: 'One useful AI move a week. Practical workflows for operators. No hype.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI by Design — The Newsletter',
    description: 'One useful AI move a week. Practical workflows for operators. No hype.',
  },
}

const PROMISES = [
  {
    title: 'One real workflow',
    body: 'Each issue walks through a single automation you could actually set up — the trigger, the steps, and the tool that makes it run.',
  },
  {
    title: 'Steal-this prompts & recipes',
    body: 'Copy-paste prompts and 3-step patterns you can use the same day. Real substance, not a teaser.',
  },
  {
    title: 'What’s actually working now',
    body: 'No hype cycles. Just the moves that are saving operators real time this week — and the ones that aren’t worth it.',
  },
]

export default function NewsletterPage() {
  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      <NoiseBg />
      <Header />

      <section className="section pt-32 md:pt-40">
        <div className="max-w-3xl mx-auto">
          <p className="text-gold text-[10px] tracking-[0.35em] uppercase font-medium mb-4">
            The Newsletter
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold text-white tracking-tight leading-tight">
            One useful AI move a week.
          </h1>
          <p className="text-white/55 text-base md:text-lg leading-relaxed mt-5">
            Everyone has the same question about AI: <span className="text-white/80">“okay — but what do I actually do with it?”</span> This
            is the answer, one practical workflow at a time. Written for operators running real
            businesses, not engineers. No hype, no filler — unsubscribe any time.
          </p>

          <div className="mt-12 grid gap-px sm:grid-cols-3 bg-white/5 border border-white/10">
            {PROMISES.map(item => (
              <div key={item.title} className="bg-background p-6">
                <h2 className="text-gold text-sm font-semibold tracking-wide mb-2">{item.title}</h2>
                <p className="text-white/55 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <NewsletterSignup
              source="newsletter"
              heading="Get the next issue."
              blurb="Drop your email and you’ll get this week’s issue plus one practical AI move every week. Free, and you can leave whenever you want."
            />
          </div>

          <p className="text-white/35 text-xs leading-relaxed mt-6">
            Prefer a deeper read first? Browse the{' '}
            <a href="/blog" className="text-gold/80 underline underline-offset-2 hover:text-gold">
              blog
            </a>
            , or{' '}
            <a href="/guide" className="text-gold/80 underline underline-offset-2 hover:text-gold">
              grab the free guide
            </a>
            .
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
