import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { DISCOVERY_CALL_URL } from '@/lib/cta'
import './coaching.css'

export const metadata: Metadata = {
  title: 'Work With AIxDesign — Persistent AI Agent Systems',
  description: 'Diagnose the constraint, design the system, build it into the business, and keep it running.',
  alternates: { canonical: '/coaching' },
}

const phases = [
  ['01', 'Diagnose', 'Find the constraint worth solving—not the loudest tool request.'],
  ['02', 'Design', 'Define the agent’s role, context, permissions, tools, and review points.'],
  ['03', 'Build', 'Connect the workflow to the systems your team already uses.'],
  ['04', 'Run', 'Monitor real work, improve the operating loop, and expand what earns trust.'],
] as const

const engagements = [
  {
    index: 'A',
    name: 'Diagnostic & strategy',
    signal: 'You need the right system before you invest in building one.',
    result: 'A clear constraint map, system direction, and prioritized path forward.',
  },
  {
    index: 'B',
    name: 'Build sprint & custom implementation',
    signal: 'A recurring responsibility is ready to move from people and prompts into a working system.',
    result: 'A focused agent or workflow designed, integrated, tested, and handed into operations.',
  },
  {
    index: 'C',
    name: 'Operating partner',
    signal: 'You need a systems partner to run, tune, and extend what has been built.',
    result: 'Ongoing oversight, iteration, and a measured expansion of the system’s responsibilities.',
  },
] as const

export default function CoachingPage() {
  return (
    <main id="top" className="work-page">
      <Header />

      <section className="work-hero">
        <div className="work-wrap work-hero__grid">
          <div className="work-hero__copy">
            <p className="work-kicker">Work with AIxDesign</p>
            <h1>Turn the work that keeps coming back into a system that keeps running.</h1>
            <p className="work-lede">
              We diagnose operational bottlenecks and build persistent agents and workflows that take on real responsibilities inside your business.
            </p>
            <div className="work-actions">
              <a className="work-button work-button--primary" href={DISCOVERY_CALL_URL} target="_blank" rel="noreferrer">Book a discovery call <span>↗</span></a>
              <Link className="work-button work-button--quiet" href="/guide">Read the free guide <span>→</span></Link>
            </div>
            <p className="work-note">Custom engagements are scoped through discovery. No preset package is forced onto the problem.</p>
          </div>

          <div className="system-map" aria-label="A persistent agent system connects context, tools, actions, and review">
            <div className="system-map__rail" aria-hidden="true" />
            <div className="system-node system-node--input"><span>Standing work</span><strong>Recurring responsibility</strong></div>
            <div className="system-node system-node--context"><span>Context</span><strong>Memory + rules</strong></div>
            <div className="system-node system-node--agent"><span>Agent</span><strong>Reason + act</strong></div>
            <div className="system-node system-node--action"><span>Tools</span><strong>Systems + people</strong></div>
            <div className="system-node system-node--result"><span>Review loop</span><strong>Measure + improve</strong></div>
            <p className="system-map__caption">Persistent system / monitored in operation</p>
          </div>
        </div>
      </section>

      <section className="work-process" aria-labelledby="process-title">
        <div className="work-wrap">
          <div className="work-section-head">
            <p className="work-kicker">The operating method</p>
            <h2 id="process-title" className="process-title"><span>Diagnose</span><i>→</i><span>Design</span><i>→</i><span>Build</span><i>→</i><span>Run</span></h2>
            <p>A system is only useful when it survives contact with the business.</p>
          </div>
          <ol className="process-line">
            {phases.map(([number, title, body]) => (
              <li key={title}><span className="process-line__number">{number}</span><h3>{title}</h3><p>{body}</p></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="work-engagements" aria-labelledby="engagement-title">
        <div className="work-wrap">
          <div className="work-section-head work-section-head--split">
            <div><p className="work-kicker">Ways to engage</p><h2 id="engagement-title">Start where the constraint is.</h2></div>
            <p>Discovery determines scope, sequence, and whether AI is the right intervention at all.</p>
          </div>
          <div className="engagement-list">
            {engagements.map((item) => (
              <article key={item.name} className="engagement-row">
                <span className="engagement-row__index">{item.index}</span>
                <h3>{item.name}</h3>
                <div><span>Right signal</span><p>{item.signal}</p></div>
                <div><span>What it creates</span><p>{item.result}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="work-fit" aria-labelledby="fit-title">
        <div className="work-wrap work-fit__grid">
          <div><p className="work-kicker">Fit check</p><h2 id="fit-title">Built for operators who want AI to own work—not add another tab.</h2></div>
          <div className="fit-column fit-column--yes"><span>Strong fit</span><ul><li>A repeatable responsibility is consuming attention.</li><li>Your team can explain the work and review its output.</li><li>You want a system integrated with real operations.</li><li>You are prepared to improve the process, not automate chaos.</li></ul></div>
          <div className="fit-column"><span>Probably not a fit</span><ul><li>You only want a list of tools or prompts.</li><li>You need a guaranteed shortcut without process access.</li><li>There is no owner for decisions, data, or review.</li><li>The goal is replacing judgment before earning trust.</li></ul></div>
        </div>
      </section>

      <section className="work-final">
        <div className="work-wrap work-final__inner">
          <p className="work-kicker">Start with the bottleneck</p>
          <h2>Bring the work that should not depend on you.</h2>
          <p>We’ll use a short discovery call to understand the constraint, test fit, and identify the most useful next move.</p>
          <div className="work-actions"><a className="work-button work-button--light" href={DISCOVERY_CALL_URL} target="_blank" rel="noreferrer">Book a discovery call <span>↗</span></a><Link className="work-text-link" href="/guide">Not ready? Start with the free guide →</Link></div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
