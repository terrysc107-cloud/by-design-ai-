'use client'

import { useId, useRef, useState, type FormEvent } from 'react'

import { trackVoiceDemoEvent } from '@/lib/analytics'
import { validateLeadRequest, type LeadResult } from '@/lib/voice-demo'
import { loadDemoSession, readAttribution, submitFitRequest } from '@/lib/voice-demo-client'
import { VOICE_DEMO_FIT } from '@/lib/voice-demo-content'


// Option values must match the enumerations in lib/voice-demo.ts; the shared validator rejects anything else.
// The budget label comes from the server component via props, so no price ever ships in this client bundle.
const selects = (budgetQuestion: string): { name: string; label: string; options: [value: string, text: string][] }[] => [
  {
    name: 'business_type',
    label: 'Type of business',
    options: [['towing', 'Towing'], ['mechanic', 'Auto repair'], ['auto_detailing', 'Auto detailing'], ['other_automotive', 'Other automotive'], ['other', 'Something else']],
  },
  {
    name: 'monthly_calls',
    label: 'Inbound calls per month, roughly',
    options: [['under_50', 'Under 50'], ['50_150', '50 to 150'], ['150_400', '150 to 400'], ['400_plus', 'More than 400']],
  },
  {
    name: 'missed_calls',
    label: 'How often do calls go unanswered?',
    options: [['rarely', 'Rarely'], ['sometimes', 'Sometimes'], ['often', 'Often'], ['after_hours', 'Mostly after hours']],
  },
  {
    name: 'timeline',
    label: 'When would you want this running?',
    options: [['now', 'As soon as possible'], ['30_days', 'Within 30 days'], ['90_days', 'Within 90 days'], ['exploring', 'Just exploring']],
  },
  {
    name: 'budget',
    label: budgetQuestion,
    options: [['fits', 'Yes'], ['discuss', 'I would need to talk it through'], ['not_now', 'Not right now']],
  },
]

const TEXT_FIELDS = [
  { name: 'name', label: 'Your name', type: 'text', autoComplete: 'name', maxLength: 120, optional: false },
  { name: 'business_name', label: 'Business name', type: 'text', autoComplete: 'organization', maxLength: 200, optional: false },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', maxLength: 254, optional: false },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel', maxLength: 40, optional: true },
] as const

const FIELD_ORDER: string[] = [...TEXT_FIELDS.map((f) => f.name), ...selects('').map((s) => s.name)]

type Values = Record<string, string>

export default function VoiceDemoQualificationForm({ budgetQuestion }: { budgetQuestion: string }) {
  const SELECTS = selects(budgetQuestion)
  const baseId = useId()
  const [values, setValues] = useState<Values>({})
  const [recap, setRecap] = useState(false)
  const [sales, setSales] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  const [result, setResult] = useState<LeadResult | null>(null)
  const startedRef = useRef(false)
  const submittingRef = useRef(false)
  const honeypotRef = useRef<HTMLInputElement>(null)
  const errorRef = useRef<HTMLParagraphElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  const id = (name: string) => `${baseId}-${name}`

  function started() {
    if (startedRef.current) return
    startedRef.current = true
    trackVoiceDemoEvent('qualification_started')
  }

  function set(name: string, value: string) {
    started()
    setValues((v) => ({ ...v, [name]: value }))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (submittingRef.current) return
    started()
    const session = loadDemoSession()
    const checked = validateLeadRequest({
      ...values,
      recap_consent: recap,
      sales_follow_up_consent: sales,
      browser_token: session?.browser_token,
      attribution: readAttribution(window.location.search),
    })
    if (!checked.ok) {
      setErrors(checked.fields)
      const first = FIELD_ORDER.find((n) => checked.fields[n])
      if (first) document.getElementById(id(first))?.focus()
      return
    }

    submittingRef.current = true
    setErrors({})
    setStatus('submitting')
    const res = await submitFitRequest({ ...checked.value, company_url: honeypotRef.current?.value ?? '' })
    submittingRef.current = false
    if (!res.ok) {
      if (res.fields) setErrors(res.fields)
      setStatus('error')
      requestAnimationFrame(() => errorRef.current?.focus())
      return
    }
    trackVoiceDemoEvent('fit_request_submitted', { profile: session?.vertical })
    setResult(res.data)
    requestAnimationFrame(() => resultRef.current?.focus())
  }

  // No scheduling here: the booking link is only in the follow-up the service sends after the email is confirmed.
  if (result) {
    return (
      <div className="vd-fit-result" ref={resultRef} tabIndex={-1} role="status" aria-live="polite">
        <p className="vd-fit-result__lead">
          {result.email_confirmation_sent ? VOICE_DEMO_FIT.confirmEmail : VOICE_DEMO_FIT.received}
        </p>
        {result.email_confirmation_sent && <p className="vd-muted">{VOICE_DEMO_FIT.confirmEmailNext}</p>}
      </div>
    )
  }

  const describedBy = (name: string) => (errors[name] ? `${id(name)}-error` : undefined)
  const fieldError = (name: string) =>
    errors[name] ? <p id={`${id(name)}-error`} className="vd-error">{errors[name]}</p> : null

  return (
    <form className="vd-fit-form" onSubmit={onSubmit} noValidate>
      <div className="vd-fit-grid">
        {TEXT_FIELDS.map((f) => (
          <div className="vd-field" key={f.name}>
            <label htmlFor={id(f.name)}>
              {f.label} {f.optional && <span className="vd-optional">(optional)</span>}
            </label>
            <input
              id={id(f.name)}
              name={f.name}
              type={f.type}
              autoComplete={f.autoComplete}
              maxLength={f.maxLength}
              required={!f.optional}
              value={values[f.name] ?? ''}
              onChange={(e) => set(f.name, e.target.value)}
              aria-invalid={Boolean(errors[f.name])}
              aria-describedby={describedBy(f.name)}
            />
            {fieldError(f.name)}
          </div>
        ))}
        {SELECTS.map((s) => (
          <div className="vd-field" key={s.name}>
            <label htmlFor={id(s.name)}>{s.label}</label>
            <select
              id={id(s.name)}
              name={s.name}
              required
              value={values[s.name] ?? ''}
              onChange={(e) => set(s.name, e.target.value)}
              aria-invalid={Boolean(errors[s.name])}
              aria-describedby={describedBy(s.name)}
            >
              <option value="" disabled>Choose one</option>
              {s.options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
            </select>
            {fieldError(s.name)}
          </div>
        ))}
      </div>

      <fieldset className="vd-consents">
        <legend>Email permissions</legend>
        <div className="vd-check">
          <input id={id('recap')} type="checkbox" checked={recap} onChange={(e) => { started(); setRecap(e.target.checked) }} />
          <label htmlFor={id('recap')}>{VOICE_DEMO_FIT.recapConsent}</label>
        </div>
        <div className="vd-check">
          <input id={id('sales')} type="checkbox" checked={sales} onChange={(e) => { started(); setSales(e.target.checked) }} />
          <label htmlFor={id('sales')}>{VOICE_DEMO_FIT.salesConsent}</label>
        </div>
        <p className="vd-muted">{VOICE_DEMO_FIT.consentNote}</p>
      </fieldset>

      {/* Honeypot: hidden from sighted users and assistive tech, never keyboard-reachable. */}
      <div aria-hidden="true" hidden>
        <input ref={honeypotRef} name="company_url" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" className="vd-btn vd-btn--primary" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Send my answers'}
      </button>

      <div role="status" aria-live="polite" className="vd-form-status">
        {status === 'error' && (
          <div className="vd-fallback">
            <p ref={errorRef} tabIndex={-1} className="vd-error">{VOICE_DEMO_FIT.error}</p>
          </div>
        )}
      </div>
    </form>
  )
}
