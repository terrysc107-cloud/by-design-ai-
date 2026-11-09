import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import NewsletterSignup from '@/components/sections/NewsletterSignup'
import './newsletter.css'

const TITLE = 'The Operator Signal — One Useful AI Move Every Week'
const DESCRIPTION =
  'A free two-minute weekly briefing for operators: one useful AI move, the system behind it, and a practical next step.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/newsletter' },
  openGraph: {
    type: 'website',
    url: 'https://aixdesign.dev/newsletter',
    siteName: 'AI by Design',
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: '/brand/newsletter-og-1200x630.png',
        width: 1200,
        height: 630,
        alt: 'The Operator Signal by AI by Design — one useful AI move every week',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/brand/newsletter-og-1200x630.png'],
  },
}

const PROMISES = [
  {
    number: '01',
    title: 'The signal',
    body: 'The one change, pattern, or warning from the week that deserves an operator’s attention.',
  },
  {
    number: '02',
    title: 'The system',
    body: 'The workflow behind it: trigger, inputs, controls, output, and where human judgment stays.',
  },
  {
    number: '03',
    title: 'The move',
    body: 'One practical next step small enough to test before it becomes another unfinished AI project.',
  },
]

const CHECKS = [
  'Useful in about two minutes',
  'Written for operators, not AI hobbyists',
  'One idea—not a roundup of links',
  'No prompt spam, hype, or daily noise',
]

export default function NewsletterPage() {
  const newsletterJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWorkSeries',
    name: 'The Operator Signal',
    alternateName: 'The AI by Design Newsletter',
    description: DESCRIPTION,
    url: 'https://aixdesign.dev/newsletter',
    publisher: {
      '@type': 'Organization',
      name: 'AI by Design',
      url: 'https://aixdesign.dev',
    },
  }

  return (
    <main className="newsletter-page">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsletterJsonLd) }}
      />

      <section className="newsletter-hero">
        <div className="newsletter-orbit newsletter-orbit--one" aria-hidden="true" />
        <div className="newsletter-orbit newsletter-orbit--two" aria-hidden="true" />
        <div className="newsletter-hero__inner">
          <div className="newsletter-hero__copy">
            <p className="newsletter-eyebrow">The Operator Signal · Free weekly briefing</p>
            <h1>
              One useful AI move.
              <span>Every week.</span>
            </h1>
            <p className="newsletter-hero__lede">
              A short field note for people who need AI to improve how work gets done—not
              create another stream of things to keep up with.
            </p>
            <ul className="newsletter-hero__checks" aria-label="Newsletter promises">
              {CHECKS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <aside className="newsletter-hero__signup" aria-label="Subscribe to The Operator Signal">
            <div className="newsletter-signal-line" aria-hidden="true">
              <i /><i /><i /><i /><i />
            </div>
            <p className="newsletter-card__label">Next issue</p>
            <h2>Put one better move in your inbox.</h2>
            <p>
              Enter your email. The welcome note arrives immediately, then the next weekly
              issue when it is ready.
            </p>
            <NewsletterSignup
              variant="inline"
              theme="light"
              source="newsletter"
              cta="Get the next issue →"
              className="newsletter-hero__form"
            />
            <small>Free. No daily noise. Unsubscribe in one click.</small>
          </aside>
        </div>
      </section>

      <section className="newsletter-proof" aria-label="What each issue includes">
        <div className="newsletter-section-heading">
          <p className="newsletter-eyebrow">The editorial standard</p>
          <h2>Every issue has a job.</h2>
          <p>
            You should finish with a clearer decision or a useful test—not a longer reading
            list.
          </p>
        </div>
        <div className="newsletter-promises">
          {PROMISES.map((promise) => (
            <article key={promise.number}>
              <span>{promise.number}</span>
              <h3>{promise.title}</h3>
              <p>{promise.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="newsletter-sample">
        <div className="newsletter-sample__copy">
          <p className="newsletter-eyebrow">A typical issue</p>
          <h2>More than a chat window.</h2>
          <p>
            The newsletter translates AI news into operating decisions. A recent theme:
            why an AI plan needs triggers, context, controls, and review—not just a clever
            conversation.
          </p>
          <div className="newsletter-author">
            <div className="newsletter-author__mark" aria-hidden="true">TS</div>
            <div>
              <strong>Written by Terry Scott</strong>
              <span>Healthcare operator, founder, and systems builder</span>
            </div>
          </div>
        </div>

        <article className="newsletter-issue-card" aria-label="Sample newsletter issue">
          <header>
            <div>
              <Image src="/brand/aixdesign-mark.svg" alt="" width={30} height={30} />
              <strong>AI by Design</strong>
            </div>
            <span>The Operator Signal</span>
          </header>
          <p className="newsletter-issue-card__kicker">This week’s operating question</p>
          <h3>Why your AI plan needs more than a chat window</h3>
          <p>
            If the work only happens when you remember to open a tool and type a prompt,
            you do not have a system yet. You have a useful conversation.
          </p>
          <div className="newsletter-issue-card__move">
            <span>Try this</span>
            <p>
              Pick one recurring task. Write down its trigger, required inputs, expected
              output, and the decision a human must approve.
            </p>
          </div>
          <footer>About a 2-minute read · One move you can test</footer>
        </article>
      </section>

      <section className="newsletter-final">
        <div>
          <p className="newsletter-eyebrow">Useful by design</p>
          <h2>Get the next signal.</h2>
          <p>
            One sharp idea, translated into a system and a next move. Delivered weekly.
          </p>
        </div>
        <div className="newsletter-final__form">
          <NewsletterSignup
            variant="inline"
            theme="light"
            source="newsletter"
            cta="Join free →"
          />
          <p>
            Want proof first? Browse the <Link href="/blog">latest insights</Link> or{' '}
            <Link href="/guide">get The Board Method</Link>.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
