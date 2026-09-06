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
          <a href="#work">What we do</a>
          <a href="#proof">Proof</a>
          <Link href="/newsletter">Insights</Link>
          <button onClick={bookDiscoveryCall}>Book a discovery call <Arrow /></button>
        </nav>
      </header>

      <aside className="hp-progress" aria-hidden="true"><span /></aside>

      <section id="top" className="hp-hero">
        <div className="hp-hero-copy">
          <p className="hp-kicker">AI coaching · consulting · custom systems</p>
          <h1>Stop learning<br />about AI.<br /><em>Start running on it.</em></h1>
          <p className="hp-lede">We find the bottleneck, design the right system, and ship the leanest solution that creates real operating leverage.</p>
          <div className="hp-hero-actions">
            <button className="hp-primary" onClick={bookDiscoveryCall}><span>Book a discovery call</span><Arrow /></button>
            <a className="hp-secondary" href="#work">See how we work <span>↓</span></a>
          </div>
        </div>

        <div className="hp-system" aria-label="Ideas becoming operating systems">
          <div className="hp-orbit hp-orbit--one" />
          <div className="hp-orbit hp-orbit--two" />
          <div className="hp-core"><img src="/voice-agent/aix-mark.svg" alt="" /><b>AI × Design</b><small>Operating system</small></div>
          <span className="hp-node hp-node--one">Your bottleneck</span>
          <span className="hp-node hp-node--two">Context</span>
          <span className="hp-node hp-node--three">Workflow</span>
          <span className="hp-node hp-node--four">Execution</span>
          <span className="hp-node hp-node--five">Measured result</span>
        </div>
        <div className="hp-hero-signal"><Signal /></div>
      </section>

      <section className="hp-proofbar">
        <span>Outcome-led</span><i /><span>Tool-agnostic</span><i /><span>Built with you</span><i /><span>Designed to run</span>
      </section>

      <section id="work" className="hp-section hp-reframe">
        <p className="hp-index">01 / The problem</p>
        <div className="hp-split">
          <h2>You do not need<br />more AI tools.</h2>
          <div><p>You need fewer repeated decisions, fewer manual handoffs, and a system that keeps moving when your attention shifts.</p><strong>We start with the constraint, not the software.</strong></div>
        </div>
        <div className="hp-before-after">
          <article><small>Most AI projects</small><h3>Tool → Demo → Another tab</h3><p>Interesting technology with no operating owner and no measurable change.</p></article>
          <div className="hp-transform"><span>We redesign the system</span><Arrow /></div>
          <article className="hp-after"><small>AI by Design</small><h3>Bottleneck → System → Result</h3><p>A focused intervention built around your real workflow, people, and constraints.</p></article>
        </div>
      </section>

      <section className="hp-section hp-services">
        <p className="hp-index hp-index--light">02 / Three ways forward</p>
        <div className="hp-services-head"><h2>Clarity first.<br /><em>Then execution.</em></h2><p>Choose the level of support that matches the bottleneck. We will tell you when a smaller intervention is enough.</p></div>
        <div className="hp-service-list">
          <article><span>01</span><div><small>Learn</small><h3>Build practical AI capability</h3><p>Operator-focused education and coaching that turns concepts into repeatable working habits.</p></div><Link href="/education"><Arrow /></Link></article>
          <article><span>02</span><div><small>Decide</small><h3>Find the highest-leverage system</h3><p>Diagnostic consulting that clarifies the constraint, tradeoffs, architecture, and next move.</p></div><button onClick={bookDiscoveryCall}><Arrow /></button></article>
          <article><span>03</span><div><small>Build</small><h3>Ship the solution</h3><p>Lean automations, agent workflows, integrations, and internal products designed around how the business operates.</p></div><button onClick={bookDiscoveryCall}><Arrow /></button></article>
        </div>
      </section>

      <section id="proof" className="hp-section hp-product">
        <p className="hp-index">03 / Proof of the approach</p>
        <div className="hp-product-grid">
          <div className="hp-product-copy"><span className="hp-pill">AIxDesign Voice · Preview</span><h2>Speak the task.<br /><em>Keep moving.</em></h2><p>A voice-accessible agent that can accept meaningful work, continue after the call ends, and deliver the result later.</p><Link className="hp-product-link" href="/voice-agent">Explore Voice Agent <Arrow /></Link></div>
          <Link className="hp-product-visual" href="/voice-agent" aria-label="Explore AIxDesign Voice Agent">
            <video src="/voice-agent/scene-01-mobile.mp4" poster="/voice-agent/scene-01-mobile-poster.png" muted autoPlay loop playsInline preload="metadata" />
            <div className="hp-task"><small>Task accepted</small><b>Proposal risk review</b><span>Working ···</span></div>
          </Link>
        </div>
      </section>

      <section className="hp-section hp-process">
        <p className="hp-index">04 / How we work</p>
        <h2>From friction<br />to a system.</h2>
        <div className="hp-process-line">
          {[
            ['Diagnose', 'Find the repeated constraint that is actually costing time, attention, or revenue.'],
            ['Design', 'Choose the smallest system that changes the operating reality.'],
            ['Build', 'Connect the workflow, data, tools, approvals, and human handoffs.'],
            ['Run', 'Measure the result, refine what matters, and remove what does not.'],
          ].map(([title, body], index) => <article key={title}><span>0{index + 1}</span><i /><h3>{title}</h3><p>{body}</p></article>)}
        </div>
        <Signal compact />
      </section>

      <section className="hp-section hp-operator">
        <p className="hp-index hp-index--light">05 / Built for operators</p>
        <div className="hp-split"><h2>Less software theater.<br /><em>More operating leverage.</em></h2><div><p>For founders, operators, and small teams carrying too much of the business in their heads.</p><ul><li>Repeated work depends on one person</li><li>Tools exist, but the workflow still breaks</li><li>Follow-up disappears between systems</li><li>AI experiments never become normal operations</li></ul></div></div>
      </section>

      <section className="hp-section hp-final">
        <div className="hp-final-signal"><Signal compact /></div>
        <p className="hp-index">Start with the bottleneck</p>
        <h2>One conversation.<br /><em>A clearer next move.</em></h2>
        <p>We will identify what deserves attention, what should wait, and whether AI is actually the right intervention.</p>
        <button className="hp-final-cta" onClick={bookDiscoveryCall}><span>Book a free discovery call</span><Arrow /></button>
      </section>

      <footer className="hp-footer">
        <a className="hp-brand" href="#top"><img src="/voice-agent/aix-mark.svg" alt="" /><span>aixdesign</span></a>
        <p>Stop learning about AI. Start running on it.</p>
        <nav><Link href="/newsletter">Newsletter</Link><Link href="/blog">Insights</Link><Link href="/privacy">Privacy</Link></nav>
      </footer>
    </main>
  )
}
