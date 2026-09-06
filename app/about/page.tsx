import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { DISCOVERY_CALL_URL } from '@/lib/cta'
import './about.css'

const TITLE = 'About Terry Scott — Healthcare Operator and Systems Builder | AI by Design'
const DESCRIPTION =
  'Meet Terry Scott, founder of AI by Design: a healthcare operations leader who builds practical AI systems around real work, clear controls, evidence, escalation, and human judgment.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/about' },
  openGraph: {
    type: 'profile',
    url: 'https://aixdesign.dev/about',
    siteName: 'AI by Design',
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
}

const systems = [
  {
    status: 'Live product',
    role: 'Founder / product operator',
    access: 'Public platform',
    name: 'SPD Cert Prep',
    thesis: 'Specialized knowledge, turned into a working learning system.',
    body: 'A career-focused platform for sterile-processing professionals, with readiness assessment, adaptive practice, AI tutoring, learning games, progress tracking, and career tools.',
    href: 'https://spdcertprep.com',
    label: 'Explore the live platform',
    className: 'about-system about-system--spd',
  },
  {
    status: 'Public preview',
    role: 'Founder / system designer',
    access: 'Public product preview',
    name: 'AIxDesign Voice',
    thesis: 'A voice-accessible path from spoken intent to persistent work.',
    body: 'A preview of an agent designed to accept meaningful work by voice, continue after the conversation ends, and return with a result.',
    href: '/voice-agent',
    label: 'Explore the preview',
    className: 'about-system about-system--voice',
  },
  {
    status: 'Course available',
    role: 'Creator / instructor',
    access: 'Public course',
    name: 'My AI Board',
    thesis: 'An operating model people can learn, inspect, and own.',
    body: 'Practical education in assigning narrow roles, supplying real context, scheduling recurring work, and reviewing the output before action.',
    href: '/education',
    label: 'Explore education',
    className: 'about-system about-system--board',
  },
]

const principles = [
  ['01', 'Start with the work', 'A system begins with a real responsibility, constraint, and owner—not a model looking for a use case.'],
  ['02', 'Make control visible', 'Permissions, review points, and boundaries should be clear enough for an operator to inspect.'],
  ['03', 'Preserve evidence', 'Important output should show its inputs, state, and next action instead of asking for blind trust.'],
  ['04', 'Design the escalation', 'The system needs to know when to stop, surface uncertainty, and hand judgment back to a person.'],
]

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    url: 'https://aixdesign.dev/about',
    name: 'About Terry Scott and AI by Design',
    description: DESCRIPTION,
    mainEntity: {
      '@type': 'Person',
      name: 'Terry Scott',
      jobTitle: 'Founder and systems builder',
      url: 'https://aixdesign.dev/about',
      worksFor: { '@type': 'Organization', name: 'AI by Design', url: 'https://aixdesign.dev' },
      knowsAbout: ['Healthcare operations', 'AI agent systems', 'Workflow design', 'Operational education systems'],
    },
  }

  return (
    <main className="about-page">
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

      <section className="about-hero">
        <div className="about-hero__copy">
          <p className="about-kicker">Terry Scott · Founder / operator / systems builder</p>
          <h1>Built from the floor up.<br /><em>Not from the feed down.</em></h1>
          <p className="about-hero__lede">I lead healthcare operations and build AI systems. The work starts with the constraint: what must happen, what can go wrong, what evidence matters, and where human judgment belongs.</p>
          <dl className="about-operator-record" aria-label="Operator record">
            <div><dt>Operating lens</dt><dd>Healthcare leadership</dd></div>
            <div><dt>Builder role</dt><dd>Founder and product operator</dd></div>
            <div><dt>Public evidence</dt><dd>Live products, previews, and education</dd></div>
          </dl>
          <div className="about-hero__actions">
            <a href={DISCOVERY_CALL_URL} target="_blank" rel="noopener noreferrer" className="about-button about-button--primary">Book a discovery call <span>↗</span></a>
            <Link href="/guide" className="about-button about-button--secondary">Get the free guide <span>→</span></Link>
          </div>
        </div>
        <div className="about-hero__mosaic" aria-label="Selected AI by Design systems">
          <a href="https://spdcertprep.com" target="_blank" rel="noreferrer" className="about-mosaic__spd">
            <img src="/homeproof/spd-cert-prep-dashboard.jpg" alt="SPD Cert Prep learner dashboard" />
            <span><b>SPD Cert Prep</b> Live learning system</span>
          </a>
          <Link href="/voice-agent" className="about-mosaic__voice">
            <video src="/voice-agent/scene-01-mobile.mp4" poster="/voice-agent/scene-01-mobile-poster.png" muted autoPlay loop playsInline preload="metadata" />
            <span><b>AIxDesign Voice</b> Illustrative product film · Public preview</span>
          </Link>
          <div className="about-mosaic__method"><small>THE OPERATING METHOD</small><strong>Diagnose<br />→ Design<br />→ Build<br />→ Run</strong></div>
        </div>
      </section>

      <section className="about-origin about-section">
        <p className="about-index">01 / Why operations comes first</p>
        <div className="about-split">
          <h2>Healthcare shaped<br /><em>the standard.</em></h2>
          <div>
            <p>Healthcare operations makes vague thinking expensive. Work crosses people, tools, shifts, and handoffs. A useful system has to respect controls, preserve evidence, surface exceptions, and leave consequential judgment with a person.</p>
            <p>That operating discipline is the foundation of AI by Design. The goal is not to make AI look impressive. It is to make responsibility clearer and execution more reliable.</p>
          </div>
        </div>
        <div className="about-rails" aria-label="Operational design sequence">
          {['Controls', 'Evidence', 'Escalation', 'Human judgment'].map((item, index) => <div key={item}><span>0{index + 1}</span><i /><strong>{item}</strong></div>)}
        </div>
      </section>

      <section className="about-section about-proof">
        <p className="about-index">02 / Selected systems</p>
        <div className="about-proof__intro"><h2>Systems you can<br /><em>inspect yourself.</em></h2><p>One live product, one public preview, and one available course—each labeled by maturity, role, and access rather than presented as equivalent proof.</p></div>
        <div className="about-systems">
          {systems.map((system, index) => (
            <article className={system.className} key={system.name}>
              <div className="about-system__number">0{index + 1}</div>
              <div className="about-system__copy"><span>{system.status}</span><h3>{system.name}</h3><strong>{system.thesis}</strong><p>{system.body}</p><dl className="about-system__evidence"><div><dt>Role</dt><dd>{system.role}</dd></div><div><dt>Access</dt><dd>{system.access}</dd></div><div><dt>Verified</dt><dd>September 2026</dd></div></dl><a href={system.href} target={system.href.startsWith('http') ? '_blank' : undefined} rel={system.href.startsWith('http') ? 'noreferrer' : undefined}>{system.label} ↗</a></div>
              {index === 0 && <img src="/homeproof/spd-cert-prep-dashboard.jpg" alt="SPD Cert Prep dashboard showing readiness and study tools" />}
              {index === 1 && <video src="/voice-agent/scene-01-mobile.mp4" poster="/voice-agent/scene-01-mobile-poster.png" muted loop playsInline preload="metadata" />}
              {index === 2 && <div className="about-board-visual" aria-label="My AI Board operating loop: defined roles use business context on a schedule to prepare a reviewable decision brief"><div className="about-board-visual__agents"><span>OPERATIONS</span><span>FINANCE</span><span>GROWTH</span></div><i aria-hidden="true" /><strong>Scheduled<br />decision brief</strong><small>Context in · Reviewable work out</small><div className="about-board-visual__flow"><b>ROLE</b><b>CONTEXT</b><b>SCHEDULE</b><b>REVIEW</b></div></div>}
            </article>
          ))}
        </div>
      </section>

      <section className="about-principles about-section">
        <p className="about-index about-index--light">03 / Principles for trustworthy systems</p>
        <div className="about-principles__head"><h2>Responsibility before<br /><em>autonomy.</em></h2><p>Trust is designed into the workflow. It does not arrive because a model sounds confident.</p></div>
        <div className="about-principles__list">{principles.map(([number, title, body]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
      </section>

      <section className="about-method about-section">
        <p className="about-index">04 / Diagnose → Design → Build → Run</p>
        <h2>Start with the constraint.<br /><em>End with a system.</em></h2>
        <p>We diagnose the bottleneck, design the operating model, build the leanest useful version, then run and refine it against the work.</p>
        <div className="about-method__actions"><a href={DISCOVERY_CALL_URL} target="_blank" rel="noopener noreferrer" className="about-button about-button--primary">Book a discovery call <span>↗</span></a><Link href="/guide">Or start with the free guide →</Link></div>
      </section>
      <Footer />
    </main>
  )
}
