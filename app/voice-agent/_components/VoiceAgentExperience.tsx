import Link from 'next/link'

import {
  SAMPLE_OWNER_OUTPUT,
  VOICE_DEMO_CUSTOMIZATION,
  VOICE_DEMO_FAQ,
  VOICE_DEMO_FIT,
  VOICE_DEMO_HERO,
  VOICE_DEMO_PROMISE,
} from '@/lib/voice-demo-content'
import { VOICE_DEMO_OFFER, publishedOffer } from '@/lib/voice-demo-offer'
import VoiceDemoLauncher from './VoiceDemoLauncher'
import VoiceDemoOwnerView from './VoiceDemoOwnerView'
import VoiceDemoQualificationForm from './VoiceDemoQualificationForm'

// The Voice product's frequency waveform (brand kit: distinct from the master signal line).
const Wave = ({ className = '' }: { className?: string }) => (
  <svg className={`wave ${className}`} viewBox="0 0 1200 120" aria-hidden="true" preserveAspectRatio="none">
    <path className="wave__ghost" d="M0 60 C80 60 90 22 145 22S210 98 270 98 330 38 390 38 455 82 520 82 590 12 650 12 710 108 770 108 830 48 890 48 950 72 1015 72 1080 60 1200 60" />
    <path className="wave__signal" pathLength="1" d="M0 60 C80 60 90 22 145 22S210 98 270 98 330 38 390 38 455 82 520 82 590 12 650 12 710 108 770 108 830 48 890 48 950 72 1015 72 1080 60 1200 60" />
  </svg>
)

export default function VoiceAgentExperience() {
  const offer = VOICE_DEMO_OFFER
  // Server component: when unapproved, no price string is rendered or shipped to the client.
  const priced = publishedOffer(offer)
  return (
    <main className="voice-page" id="top">
      <a className="vd-skip" href="#demo">Skip to the phone demo</a>
      <header className="vd-nav">
        <a className="vd-brand" href="#top" aria-label="AIxDesign Call Voice Assistant, top of page">
          <img src="/voice-agent/aix-mark.svg" alt="" width={32} height={32} />
          <span>AIxDesign <b>Voice</b></span>
        </a>
        <nav aria-label="Page sections">
          <a href="#pricing">{priced ? 'Pricing' : 'Service'}</a>
          <a href="#faq">FAQ</a>
          <a className="vd-btn vd-btn--dark vd-btn--sm" href="#demo">{VOICE_DEMO_HERO.primaryCta}</a>
        </nav>
      </header>

      <section className="vd-hero" aria-labelledby="vd-hero-title">
        <div className="vd-hero__copy">
          <p className="vd-eyebrow">{VOICE_DEMO_HERO.eyebrow}</p>
          <h1 id="vd-hero-title">{VOICE_DEMO_HERO.headline}</h1>
          <p className="vd-hero__sub">{VOICE_DEMO_HERO.subhead}</p>
          <div className="vd-actions">
            <a className="vd-btn vd-btn--primary vd-btn--lg" href="#demo">{VOICE_DEMO_HERO.primaryCta}</a>
            <a className="vd-btn vd-btn--ghost vd-btn--lg" href="#owner-view">{VOICE_DEMO_HERO.secondaryCta}</a>
          </div>
        </div>
        <div className="vd-hero__visual" id="owner-view">
          <Wave className="vd-hero__wave" />
          <VoiceDemoOwnerView output={SAMPLE_OWNER_OUTPUT} example headingId="vd-sample-owner" />
        </div>
      </section>

      <section className="vd-promise" aria-labelledby="vd-promise-title">
        <h2 id="vd-promise-title">{VOICE_DEMO_PROMISE.headline}</h2>
        <p>{VOICE_DEMO_PROMISE.body}</p>
      </section>

      <section id="demo" className="vd-demo" aria-labelledby="vd-demo-title">
        <h2 id="vd-demo-title">Try the phone demo.</h2>
        <p className="vd-lede">Choose a business, read how the call works, then call from your phone. The owner view appears here when you hang up.</p>
        <VoiceDemoLauncher />
      </section>

      <section className="vd-custom" aria-labelledby="vd-custom-title">
        <div>
          <h2 id="vd-custom-title">{VOICE_DEMO_CUSTOMIZATION.headline}</h2>
          <p className="vd-lede">The demo runs on sample businesses. A real deployment is built around how your shop actually works.</p>
          <Wave className="vd-custom__wave" />
        </div>
        <ul className="vd-custom__list">
          {VOICE_DEMO_CUSTOMIZATION.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section id="pricing" className="vd-offer" aria-labelledby="vd-offer-title">
        <h2 id="vd-offer-title">{offer.headline}</h2>
        <p className="vd-lede">{offer.body}</p>
        <div className="vd-offer__grid">
          {priced ? (
            <div className="vd-price">
              <p className="vd-price__main"><span>{priced.main}</span> per month</p>
              <p>{priced.sub}</p>
              <dl>
                {priced.terms.map(([dt, dd]) => <div key={dt}><dt>{dt}</dt><dd>{dd}</dd></div>)}
              </dl>
            </div>
          ) : (
            <div className="vd-price">
              <p className="vd-price__main">{offer.unpublished.title}</p>
              <p>{offer.unpublished.note}</p>
              <a className="vd-btn vd-btn--primary" href="#fit">{VOICE_DEMO_FIT.headline.replace(/\.$/, '')}</a>
            </div>
          )}
          <div className="vd-scope">
            <h3>What we handle</h3>
            <ul>{offer.included.map((i) => <li key={i}>{i}</li>)}</ul>
            <h3>Scoped separately</h3>
            <ul className="vd-scope__extra">{offer.scopedSeparately.map((i) => <li key={i}>{i}</li>)}</ul>
          </div>
        </div>
      </section>

      <section id="fit" className="vd-fit" aria-labelledby="vd-fit-title">
        <div className="vd-fit__intro">
          <h2 id="vd-fit-title">{VOICE_DEMO_FIT.headline}</h2>
          <p className="vd-lede">{VOICE_DEMO_FIT.body}</p>
        </div>
        <VoiceDemoQualificationForm budgetQuestion={priced?.budgetQuestion ?? offer.unpublished.budgetQuestion} />
      </section>

      <section id="faq" className="vd-faq" aria-labelledby="vd-faq-title">
        <h2 id="vd-faq-title">Straight answers.</h2>
        <div className="vd-faq__list">
          {VOICE_DEMO_FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="vd-footer">
        <a className="vd-brand" href="#top"><img src="/voice-agent/aix-mark.svg" alt="" width={28} height={28} /><span>AIxDesign <b>Voice</b></span></a>
        <nav aria-label="Footer">
          <Link href="/">AI by Design</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </nav>
        <p>Demo calls are simulated. © AI by Design</p>
      </footer>
    </main>
  )
}
