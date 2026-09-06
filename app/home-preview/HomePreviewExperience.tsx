'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { bookDiscoveryCall } from '@/lib/cta'

const Arrow = () => <span aria-hidden="true">↗</span>

function Signal({ compact = false }: { compact?: boolean }) {
  return (
    <svg className={compact ? 'hp-signal hp-signal--compact' : 'hp-signal'} viewBox="0 0 1200 130" preserveAspectRatio="none" aria-hidden="true">
      <path className="hp-signal-ghost" d="M0 66 C85 66 95 28 150 28S220 104 282 104 345 44 407 44 472 88 535 88 605 16 668 16 730 114 790 114 855 51 918 51 980 78 1040 78 1100 66 1200 66" />
      <path className="hp-signal-live" pathLength="1" d="M0 66 C85 66 95 28 150 28S220 104 282 104 345 44 407 44 472 88 535 88 605 16 668 16 730 114 790 114 855 51 918 51 980 78 1040 78 1100 66 1200 66" />
    </svg>
  )
}

export default function HomePreviewExperience() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const update = () => {
      if (!rootRef.current) return
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      rootRef.current.style.setProperty('--hp-progress', String(Math.min(1, window.scrollY / max)))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <main className="hp" ref={rootRef}>
      <header className="hp-nav">
        <a className="hp-brand" href="#top" aria-label="AIxDesign home">
          <img src="/voice-agent/aix-mark.svg" alt="" />
          <span>aixdesign</span>
        </a>
        <nav aria-label="Preview navigation">
          <a href="#work">What we build</a>
          <a href="#ecosystem">How to start</a>
          <a href="#proof">Proof</a>
          <Link href="/newsletter">Insights</Link>
          <button onClick={bookDiscoveryCall}><span className="hp-nav-cta-label">Book a discovery call</span> <Arrow /></button>
        </nav>
      </header>

      <aside className="hp-progress" aria-hidden="true"><span /></aside>

      <section id="top" className="hp-hero">
        <div className="hp-hero-copy">
          <p className="hp-kicker">Persistent agents · workflows · operating systems</p>
          <h1><span className="hp-title-desktop">Turn your<br />bottleneck into<br /><em>a system that runs.</em></span><span className="hp-title-mobile">Turn your<br />bottleneck into<br /><em>a system<br />that runs.</em></span></h1>
          <p className="hp-lede">AIxDesign builds the agents, systems, and operating models that help businesses move from experimenting with AI to actually running on it.</p>
          <div className="hp-hero-actions">
            <button className="hp-primary" onClick={bookDiscoveryCall}><span>Book a discovery call</span><Arrow /></button>
            <a className="hp-secondary" href="#work">See what we build <span>↓</span></a>
          </div>
        </div>

        <div className="hp-hero-proof" aria-label="AIxDesign systems in operation">
          <div className="hp-hero-proof__voice"><video src="/voice-agent/scene-01-mobile.mp4" poster="/voice-agent/scene-01-mobile-poster.png" muted autoPlay loop playsInline preload="metadata" /><span>Voice Agent · Task accepted</span></div>
          <div className="hp-hero-proof__app"><img src="/homeproof/spd-cert-prep-dashboard.jpg" alt="SPD Cert Prep learner dashboard" /><span>SPD Cert Prep · Live learning system</span></div>
          <div className="hp-hero-proof__result"><small>FROM FRICTION TO EXECUTION</small><b>Diagnose → Design → Build → Run</b></div>
        </div>
        <div className="hp-hero-signal"><Signal /></div>
      </section>

      <section className="hp-proofbar">
        <span>Persistent context</span><i /><span>Clear permissions</span><i /><span>Standing work</span><i /><span>Measurable outcomes</span>
      </section>

      <section id="work" className="hp-section hp-reframe">
        <p className="hp-index">01 / The operating thesis</p>
        <div className="hp-split">
          <h2><span className="hp-title-desktop">Give AI standing work,<br /><em>not one-off prompts.</em></span><span className="hp-title-mobile">Give AI<br />standing work,<br /><em className="hp-mobile-line">not one-off prompts.</em></span></h2>
          <div><p>Most businesses still use AI one conversation at a time. We build agents with enough structure to monitor, prepare, surface, and execute recurring responsibilities.</p><strong>The value is not another model. It is the operating system around it.</strong></div>
        </div>
        <div className="hp-thesis-grid">
          <article><small>ROLE</small><h3>A defined responsibility</h3><p>The agent knows what it owns, what good work looks like, and when to escalate.</p></article>
          <article><small>CONTEXT</small><h3>Memory and business knowledge</h3><p>Persistent context replaces starting from zero every time someone opens a chat.</p></article>
          <article><small>CONTROL</small><h3>Permissions and review</h3><p>Tools, approvals, schedules, and evidence keep execution useful and accountable.</p></article>
        </div>
      </section>

      <section className="hp-section hp-services">
        <p className="hp-index hp-index--light">02 / What we build</p>
        <div className="hp-services-head"><h2>Agents that work.<br /><em>Systems that hold.</em></h2><p>We start with the responsibility the business needs handled, then build only the workflow and infrastructure required to support it.</p></div>
        <div className="hp-service-list">
          <article><span>01</span><div><small>Agents</small><h3>Perform defined responsibilities</h3><p>Voice, executive, customer, and role-based agents designed to prepare, decide, delegate, and escalate—not merely chat.</p></div><Link href="/voice-agent"><Arrow /></Link></article>
          <article><span>02</span><div><small>Workflows</small><h3>Turn conversations into repeatable work</h3><p>Intake, follow-up, reporting, approvals, onboarding, and recurring operations with clear human handoffs.</p></div><button onClick={bookDiscoveryCall}><Arrow /></button></article>
          <article><span>03</span><div><small>Infrastructure</small><h3>Give agents a reliable foundation</h3><p>Business knowledge, memory, permissions, integrations, task persistence, model routing, and review systems.</p></div><button onClick={bookDiscoveryCall}><Arrow /></button></article>
        </div>
      </section>

      <section id="proof" className="hp-section hp-product">
        <p className="hp-index">03 / Selected systems</p>
        <div className="hp-product-grid">
          <div className="hp-product-copy"><span className="hp-pill">AIxDesign Voice · Preview</span><h2>Speak the task.<br /><em>Keep moving.</em></h2><p>A voice-accessible agent that can accept meaningful work, continue after the call ends, and deliver the result later.</p><Link className="hp-product-link" href="/voice-agent">Explore Voice Agent <Arrow /></Link></div>
          <Link className="hp-product-visual" href="/voice-agent" aria-label="Explore AIxDesign Voice Agent">
            <video src="/voice-agent/scene-01-mobile.mp4" poster="/voice-agent/scene-01-mobile-poster.png" muted autoPlay loop playsInline preload="metadata" />
            <div className="hp-task"><small>Task accepted</small><b>Proposal risk review</b><span>Working ···</span></div>
          </Link>
        </div>
        <div className="hp-product-grid hp-product-grid--education">
          <a className="hp-product-visual hp-product-visual--app" href="https://spdcertprep.com" target="_blank" rel="noreferrer" aria-label="Explore SPD Cert Prep">
            <img src="/homeproof/spd-cert-prep-dashboard.jpg" alt="SPD Cert Prep learner dashboard with readiness progress and AI study assistant" />
            <div className="hp-task"><small>Education system</small><b>Readiness becomes a learning path</b><span>Assess · Adapt · Practice · Advance</span></div>
          </a>
          <div className="hp-product-copy"><span className="hp-pill">SPD Cert Prep · Live product</span><h2>Domain expertise.<br /><em>Built into a system.</em></h2><p>A career-focused educational web app for sterile-processing professionals, combining readiness assessment, adaptive practice, an AI tutor, learning games, progress tracking, and career tools.</p><a className="hp-product-link" href="https://spdcertprep.com" target="_blank" rel="noreferrer">Explore SPD Cert Prep <Arrow /></a></div>
        </div>
        <p className="hp-proof-close">Different industries. Same approach: understand the constraint, design the system, and ship something people can actually use.</p>
      </section>

      <section id="ecosystem" className="hp-section hp-process">
        <p className="hp-index">04 / Four ways to move from experimenting to operating</p>
        <h2>Learn it. Build it.<br /><em>Run it. Scale it.</em></h2>
        <div className="hp-process-line">
          {[
            ['Learn', 'My AI Board teaches the operating model behind roles, memory, permissions, scheduled work, and review.'],
            ['Build', 'Build Lab applies the method to your own business and real workflows. Waitlist access is available.'],
            ['Run', 'Put voice-accessible and specialized agents into real operating environments.'],
            ['Scale', 'Expand proven responsibilities through custom systems, integrations, and ongoing optimization.'],
          ].map(([title, body], index) => <article key={title}><span>0{index + 1}</span><i /><h3>{title}</h3><p>{body}</p></article>)}
        </div>
        <Signal compact />
      </section>

      <section className="hp-section hp-operator">
        <p className="hp-index hp-index--light">05 / Built for operators</p>
        <div className="hp-split"><h2><span className="hp-title-desktop">Built around your business.<br /><em>Not a generic script.</em></span><span className="hp-title-mobile">Built around<br />your business.<br /><em className="hp-mobile-line">Not a generic script.</em></span></h2><div><p>For founders, operators, and small teams ready to move AI from occasional use into normal operations.</p><ul><li>Standing work still depends on one person</li><li>Business context lives across disconnected tools</li><li>AI experiments never earn real responsibility</li><li>Execution needs permissions, review, and measurable outcomes</li></ul></div></div>
      </section>

      <section className="hp-section hp-final">
        <div className="hp-final-signal"><Signal compact /></div>
        <p className="hp-index">Start with the responsibility</p>
        <h2><span className="hp-title-desktop">What should AI take<br /><em>off your plate permanently?</em></span><span className="hp-title-mobile">What should AI<br /><em>take off your<br /><span className="hp-mobile-line">plate permanently?</span></em></span></h2>
        <p>We will identify the standing work worth systemizing, what should remain human, and the leanest reliable way to begin.</p>
        <button className="hp-final-cta" onClick={bookDiscoveryCall}><span>Book a free discovery call</span><Arrow /></button>
      </section>

      <footer className="hp-footer">
        <a className="hp-brand" href="#top"><img src="/voice-agent/aix-mark.svg" alt="" /><span>aixdesign</span></a>
        <p>Persistent agents and workflows for businesses ready to run on AI.</p>
        <nav><Link href="/newsletter">Newsletter</Link><Link href="/blog">Insights</Link><Link href="/privacy">Privacy</Link></nav>
      </footer>
    </main>
  )
}
