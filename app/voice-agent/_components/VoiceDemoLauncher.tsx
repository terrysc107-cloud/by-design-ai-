'use client'

import { useEffect, useId, useRef, useState, type FormEvent } from 'react'

import { trackVoiceDemoEvent } from '@/lib/analytics'
import type { DemoSession, DemoState, OwnerOutput, Vertical } from '@/lib/voice-demo'
import { formatPhoneNumber, telHref } from '@/lib/voice-demo'
import {
  clearDemoSession,
  createDemoSession,
  fetchDemoStatus,
  loadDemoSession,
  readAttribution,
  saveDemoSession,
  type ClientFailure,
} from '@/lib/voice-demo-client'
import {
  VERTICAL_CARDS,
  VOICE_DEMO_DISCLOSURE,
  VOICE_DEMO_DISCLOSURE_ACK,
  VOICE_DEMO_EXPECTATION,
  VOICE_DEMO_STATUS_COPY,
  VOICE_DEMO_UNAVAILABLE,
} from '@/lib/voice-demo-content'
import VoiceDemoOwnerView from './VoiceDemoOwnerView'

const POLL_MS = 3000
const SLOW_POLL_MS = 10_000
const MAX_POLL_MS = 30 * 60_000
const TERMINAL: DemoState[] = ['completed', 'expired', 'failed']

type RequestState = 'idle' | 'requesting' | ClientFailure

export default function VoiceDemoLauncher() {
  const ackId = useId()
  const ownerHeadingId = useId()
  const [vertical, setVertical] = useState<Vertical | null>(null)
  const [ack, setAck] = useState(false)
  const [formError, setFormError] = useState('')
  const [request, setRequest] = useState<RequestState>('idle')
  const [session, setSession] = useState<DemoSession | null>(null)
  const [state, setState] = useState<DemoState>('awaiting_call')
  const [output, setOutput] = useState<OwnerOutput | null>(null)
  const [trouble, setTrouble] = useState(false)

  const startedRef = useRef(false)
  const revealRef = useRef<HTMLHeadingElement>(null)
  const errorRef = useRef<HTMLParagraphElement>(null)

  // Page view + resume a demo that survived a trip to the phone dialer.
  useEffect(() => {
    trackVoiceDemoEvent('voice_page_viewed')
    const resumed = loadDemoSession()
    if (resumed) {
      setSession(resumed)
      setVertical(resumed.vertical)
      setAck(true)
    }
  }, [])

  // Poll status while the page is visible; check immediately when it becomes visible again.
  useEffect(() => {
    if (!session) return
    const token = session.browser_token
    let stopped = false
    let inFlight = false
    let timer: ReturnType<typeof setTimeout> | undefined
    let failures = 0
    const startedAt = Date.now()

    const schedule = (ms: number) => {
      clearTimeout(timer)
      timer = setTimeout(tick, ms)
    }

    async function tick() {
      if (stopped || inFlight) return
      if (Date.now() - startedAt > MAX_POLL_MS) {
        setState('expired')
        return
      }
      if (document.visibilityState === 'hidden') return schedule(POLL_MS)
      inFlight = true
      const result = await fetchDemoStatus(token)
      inFlight = false
      if (stopped) return
      if (!result.ok) {
        failures += 1
        setTrouble(failures >= 3)
        return schedule(result.reason === 'rate_limited' ? SLOW_POLL_MS : POLL_MS)
      }
      failures = 0
      setTrouble(false)
      setState(result.data.state)
      if (result.data.owner_output) setOutput(result.data.owner_output)
      if (!TERMINAL.includes(result.data.state)) schedule(POLL_MS)
    }

    const onVisible = () => {
      if (document.visibilityState === 'visible') tick()
    }
    tick()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      stopped = true
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [session])

  useEffect(() => {
    if (session && state === 'awaiting_call') revealRef.current?.focus()
  }, [session, state])

  useEffect(() => {
    if (state !== 'completed' || !output || !session) return
    trackVoiceDemoEvent('owner_output_viewed', { profile: output.vertical })
    document.getElementById(ownerHeadingId)?.focus()
  }, [state, output, session, ownerHeadingId])

  useEffect(() => {
    if (request !== 'idle' && request !== 'requesting') errorRef.current?.focus()
  }, [request])

  function markStarted() {
    if (startedRef.current) return
    startedRef.current = true
    trackVoiceDemoEvent('demo_started')
  }

  function choose(next: Vertical) {
    markStarted()
    setVertical(next)
    setFormError('')
    trackVoiceDemoEvent('vertical_selected', { profile: next })
  }

  async function requestNumber(e: FormEvent) {
    e.preventDefault()
    if (request === 'requesting') return
    markStarted()
    if (!vertical) return setFormError('Choose a business to call first.')
    if (!ack) return setFormError('Confirm you understand the disclosure to see the number.')
    setFormError('')
    setRequest('requesting')
    const result = await createDemoSession(vertical, readAttribution(window.location.search))
    if (!result.ok) return setRequest(result.reason)
    saveDemoSession(result.data)
    setOutput(null)
    setState('awaiting_call')
    setSession(result.data)
    setRequest('idle')
    trackVoiceDemoEvent('demo_number_revealed', { profile: result.data.vertical })
  }

  function startOver() {
    clearDemoSession()
    setSession(null)
    setOutput(null)
    setState('awaiting_call')
    setAck(false)
    setTrouble(false)
  }

  if (session) {
    const number = formatPhoneNumber(session.phone_number)
    const label = VERTICAL_CARDS.find((c) => c.vertical === session.vertical)?.label ?? ''
    const live = !TERMINAL.includes(state)
    return (
      <div className="vd-reveal">
        <div className="vd-reveal__call">
          <h3 ref={revealRef} tabIndex={-1} className="vd-reveal__title">Your {label.toLowerCase()} demo line</h3>
          <a className="vd-number" href={telHref(session.phone_number)}>{number}</a>
          <div className="vd-code">
            <span className="vd-code__label" aria-hidden="true">Demo code</span>
            <span className="vd-sr-only">Demo code: {session.call_code.split('').join(' ')}</span>
            <span className="vd-code__digits" aria-hidden="true">{session.call_code}</span>
          </div>
          <p className="vd-muted">{VOICE_DEMO_EXPECTATION}</p>
          <a className="vd-btn vd-btn--primary vd-btn--call" href={telHref(session.phone_number)}>Call the demo line</a>
        </div>

        <div className="vd-reveal__status">
          <div role="status" aria-live="polite" className={`vd-status vd-status--${state}`}>
            {live && <span className="vd-pulse" aria-hidden="true" />}
            <p>{VOICE_DEMO_STATUS_COPY[state]}</p>
            {trouble && live && <p className="vd-muted">Having trouble reaching the demo service. Still checking.</p>}
          </div>

          {state === 'completed' && output && (
            <>
              <VoiceDemoOwnerView output={output} headingId={ownerHeadingId} />
              <a className="vd-btn vd-btn--primary" href="#fit">See if it fits your shop</a>
            </>
          )}

          {(state === 'expired' || state === 'failed') && (
            <div className="vd-actions">
              <button type="button" className="vd-btn vd-btn--ghost" onClick={startOver}>Get a new code</button>
            </div>
          )}

          {live && <button type="button" className="vd-link" onClick={startOver}>Choose a different business</button>}
        </div>

        {live && (
          <a className="vd-sticky-call" href={telHref(session.phone_number)}>
            <span>Call {number}</span>
            <span>Code {session.call_code}</span>
          </a>
        )}
      </div>
    )
  }

  const failure = request !== 'idle' && request !== 'requesting' ? request : null

  return (
    <form className="vd-launcher" onSubmit={requestNumber} noValidate>
      <fieldset className="vd-verticals">
        <legend>Choose a business to call</legend>
        {VERTICAL_CARDS.map((card) => (
          <label key={card.vertical} className={`vd-vertical${vertical === card.vertical ? ' is-selected' : ''}`}>
            <input
              type="radio"
              name="vertical"
              value={card.vertical}
              checked={vertical === card.vertical}
              onChange={() => choose(card.vertical)}
            />
            <span className="vd-vertical__label">{card.label}</span>
            <span className="vd-vertical__scenario">{card.scenario}</span>
            <span className="vd-vertical__asks-title">It will ask</span>
            <ul className="vd-vertical__asks">
              {card.asks.map((a) => <li key={a}>{a}</li>)}
            </ul>
          </label>
        ))}
      </fieldset>

      <div className="vd-disclosure">
        <h3>Before you call</h3>
        <p>{VOICE_DEMO_DISCLOSURE}</p>
        <div className="vd-check">
          <input
            id={ackId}
            type="checkbox"
            checked={ack}
            onChange={(e) => { markStarted(); setAck(e.target.checked); setFormError('') }}
          />
          <label htmlFor={ackId}>{VOICE_DEMO_DISCLOSURE_ACK}</label>
        </div>
        <button type="submit" className="vd-btn vd-btn--primary" disabled={request === 'requesting'}>
          {request === 'requesting' ? 'Getting your number…' : 'Show my demo number'}
        </button>
        <div role="status" aria-live="polite" className="vd-form-status">
          {formError && <p className="vd-error">{formError}</p>}
        </div>
        {failure && (
          <div className="vd-fallback">
            <p ref={errorRef} tabIndex={-1} className="vd-error">
              {failure === 'not_configured'
                ? VOICE_DEMO_UNAVAILABLE
                : failure === 'rate_limited'
                  ? 'Too many demo requests from this connection. Wait a few minutes and try again.'
                  : 'We could not reach the demo line. Your choice is saved; try again shortly.'}
            </p>
          </div>
        )}
      </div>
    </form>
  )
}
