"use client";

import { useEffect, useRef } from "react";

import VoiceAgentWaitlistForm from "./VoiceAgentWaitlistForm";

const Wave = ({ compact = false }: { compact?: boolean }) => (
  <svg className={compact ? "wave wave--compact" : "wave"} viewBox="0 0 1200 120" aria-hidden="true" preserveAspectRatio="none">
    <path className="wave__ghost" d="M0 60 C80 60 90 22 145 22S210 98 270 98 330 38 390 38 455 82 520 82 590 12 650 12 710 108 770 108 830 48 890 48 950 72 1015 72 1080 60 1200 60" />
    <path className="wave__signal" pathLength="1" d="M0 60 C80 60 90 22 145 22S210 98 270 98 330 38 390 38 455 82 520 82 590 12 650 12 710 108 770 108 830 48 890 48 950 72 1015 72 1080 60 1200 60" />
  </svg>
);

const Arrow = () => <span aria-hidden="true">↗</span>;

export default function VoiceAgentExperience() {
  const pageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const update = () => {
      const root = pageRef.current;
      if (!root) return;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      root.style.setProperty("--page-progress", String(Math.min(1, window.scrollY / max)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <main className="voice-page site" ref={pageRef}>
      <header className="nav-shell">
        <a className="brand" href="#top" aria-label="AIxDesign Voice home">
          <img src="/voice-agent/aix-mark.svg" alt="" />
          <span>AIxDesign <b>Voice</b></span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#how">How it works</a>
          <a href="#business">For business</a>
          <a className="nav-cta" href="#preview">Join preview <Arrow /></a>
        </nav>
      </header>

      <div id="top" className="hero-shell">
        <section className="voice-cinema" aria-label="An executive delegates work to his voice agent while moving">
          <picture><source media="(max-width: 800px)" srcSet="/voice-agent/scene-01-mobile-poster.png" /><img className="cinema-poster" src="/voice-agent/scene-01-poster.png" alt="Business executive speaking to his agent by phone" /></picture>
          <video className="cinema-film cinema-film--desktop" src="/voice-agent/scene-01.mp4" poster="/voice-agent/scene-01-poster.png" muted playsInline autoPlay loop preload="metadata" />
          <video className="cinema-film cinema-film--mobile" src="/voice-agent/scene-01-mobile.mp4" poster="/voice-agent/scene-01-mobile-poster.png" muted playsInline autoPlay loop preload="metadata" />
          <div className="cinema-shade" />
          <div className="cinema-copy"><small>Preview / Early access</small><h1>Your agent,<br />on call.</h1><p>Speak naturally. Delegate meaningful work. Keep moving while the agent carries it forward.</p><div className="cinema-tags"><span>Natural voice</span><span>Persistent tasks</span><span>Controlled access</span></div></div>
        </section>
        <div className="hero-actions">
          <a className="hero-primary" href="#preview"><span>Join the preview</span><Arrow /></a>
          <a className="hero-secondary" href="#how">See how it works <span aria-hidden="true">↓</span></a>
        </div>
        <div className="hero-command glass-panel">
          <span className="live-dot" />
          <div><small>Voice command</small><strong>“Review the proposal. Send me the risks.”</strong></div>
        </div>
      </div>

      <aside className="progress-rail" aria-hidden="true"><span /></aside>

      <section className="proof-strip" aria-label="Product principles">
        <span>Natural voice</span><i />
        <span>Persistent tasks</span><i />
        <span>Secure access</span><i />
        <span>Real execution</span>
      </section>

      <section className="statement-section section-pad">
        <p className="section-index">01 / The difference</p>
        <div className="statement-grid">
          <h2>The call ends.<br /><em>The work doesn’t.</em></h2>
          <div className="statement-copy">
            <p>This is not another answering bot. It is a voice-accessible agent that can accept meaningful work, continue after you hang up, and return the result when it is ready.</p>
            <a className="line-link" href="#how">Follow the signal <Arrow /></a>
          </div>
        </div>
        <div className="lifecycle">
          <div className="lifecycle-command"><small>You said</small><p>“Compare the options and tell me what you recommend.”</p></div>
          <Wave />
          <div className="status-sequence">
            <article className="status is-active"><span>01</span><div><small>Listening</small><b>Command received</b></div></article>
            <article className="status"><span>02</span><div><small>Task created</small><b>Recommendation analysis</b></div></article>
            <article className="status"><span>03</span><div><small>Working</small><b>Comparing risk and upside</b></div></article>
            <article className="status status--done"><span>04</span><div><small>Done</small><b>Sent to your chosen channel</b></div></article>
          </div>
        </div>
      </section>

      <section id="how" className="journey-section section-pad">
        <p className="section-index">02 / How it works</p>
        <div className="journey-heading"><h2>One signal.<br />A complete handoff.</h2><p>Your voice starts the work. It does not have to stay connected to it.</p></div>
        <div className="steps">
          {[
            ["Speak", "Call your agent and say what you need. No menus, forms, or rigid commands."],
            ["Delegate", "Quick requests get an answer. Larger requests become durable tasks."],
            ["Keep moving", "End the call and continue your day. The agent keeps working."],
            ["Receive", "The finished result arrives through the channel you selected."],
          ].map(([title, body], index) => (
            <article className="step" key={title}>
              <span>0{index + 1}</span><div className="step-pulse" /><h3>{title}</h3><p>{body}</p>
            </article>
          ))}
        </div>
        <Wave compact />
      </section>

      <section className="execution-section section-pad">
        <p className="section-index section-index--light">03 / Real execution</p>
        <div className="execution-intro"><h2>Talk less about AI.<br /><em>Get more done.</em></h2><p>The strongest moment is not the answer. It is when a spoken request becomes accountable work.</p></div>
        <div className="use-cases">
          <article><small>Decision support</small><blockquote>“Review these options, identify the tradeoffs, and send your recommendation.”</blockquote><footer><span>Analysis complete</span><b>Delivered</b></footer></article>
          <article><small>Executive briefing</small><blockquote>“Tell me what changed today and what actually needs my attention.”</blockquote><footer><span>Priority brief ready</span><b>Delivered</b></footer></article>
          <article><small>Operational follow-up</small><blockquote>“Prepare the response, but hold it until I approve it.”</blockquote><footer><span>Draft awaiting approval</span><b>Controlled</b></footer></article>
        </div>
      </section>

      <section id="business" className="business-section section-pad">
        <p className="section-index">04 / Built around the business</p>
        <div className="business-grid">
          <div><h2>Not a generic script.<br /><em>Your operating logic.</em></h2><p>A useful business agent understands what the company knows, what it may do, and when a person needs to take over.</p></div>
          <div className="orbit" aria-label="Business knowledge connected to the agent">
            <div className="orbit-core"><img src="/voice-agent/aix-mark.svg" alt="" /><span>Agent core</span></div>
            {['Services','Policies','Scheduling','Pricing','Escalation','Brand voice'].map((item, i) => <span className={`orbit-node orbit-node--${i + 1}`} key={item}>{item}</span>)}
          </div>
        </div>
        <div className="business-outcomes"><span>Answer intelligently</span><span>Qualify intent</span><span>Capture details</span><span>Escalate priority</span><span>Trigger follow-up</span></div>
      </section>

      <section className="security-section section-pad">
        <p className="section-index section-index--light">05 / Control</p>
        <div className="security-grid"><h2>Easy to reach.<br /><em>Deliberate about access.</em></h2><p>Voice makes delegation effortless. That makes identity, permissions, and confirmation more important, not less.</p></div>
        <div className="permission-flow">
          <span>Voice command</span><i>→</i><span>Identity</span><i>→</i><span>Permission</span><i>→</i><span>Confirmation</span><i>→</i><span className="approved">Execute</span>
        </div>
        <div className="security-notes"><p>Private and customer-facing agents remain separate.</p><p>Sensitive actions require explicit approval.</p><p>Accepted work survives a dropped call.</p></div>
      </section>

      <section id="preview" className="final-section section-pad">
        <div className="final-signal"><Wave compact /><span className="completion-ping" /></div>
        <p className="section-index">Preview / Early access</p>
        <h2>Speak once.<br /><em>Let the work continue.</em></h2>
        <p className="final-copy">Join the preview for a new way to work with AI, built around conversation, delegation, and execution.</p>
        <a className="final-cta" href="#waitlist"><span>Request early access</span><Arrow /></a>
        <div id="waitlist" className="waitlist-shell"><VoiceAgentWaitlistForm /></div>
        <p className="availability">Core voice-agent architecture is being tested in real workflows. Advanced channels and integrations remain in development.</p>
      </section>

      <footer className="footer"><a className="brand" href="#top"><img src="/voice-agent/aix-mark.svg" alt="" /><span>AIxDesign <b>Voice</b></span></a><p>Speak to your agent from anywhere. Delegate real work. Keep moving.</p><span>© AIxDesign</span></footer>
    </main>
  );
}
