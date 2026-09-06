'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { trackConversion } from '@/lib/analytics'
import './intake.css'

type Status = 'idle' | 'loading' | 'done' | 'error'
type FieldType = 'text' | 'email' | 'url' | 'textarea' | 'select'
type FieldSpec = { key: string; label: string; type?: FieldType; placeholder?: string; options?: string[]; optional?: boolean; rows?: number }
type StepSpec = { eyebrow: string; title: string; intro: string; fields: FieldSpec[] }

const STEPS: StepSpec[] = [
  { eyebrow: 'Step 1 · Business', title: 'Set the operating context.', intro: 'Start with the business, your role, and the team the system needs to support.', fields: [
    { key: 'name', label: 'Your name' }, { key: 'email', label: 'Email', type: 'email' },
    { key: 'company', label: 'Company' }, { key: 'website', label: 'Website', type: 'url', placeholder: 'https:// — or “No website”' },
    { key: 'industry', label: 'Industry' }, { key: 'years_in_business', label: 'Years in business' },
    { key: 'team_size', label: 'Team size' }, { key: 'role', label: 'Your role' },
  ]},
  { eyebrow: 'Step 2 · Systems', title: 'Map what runs today.', intro: 'The tools matter less than how work currently moves between them.', fields: [
    { key: 'current_tools', label: 'What tools / CRM do you use today?', placeholder: 'GHL, HubSpot, spreadsheets…' },
    { key: 'whats_automated', label: 'What’s already automated?', type: 'textarea', rows: 3 },
    { key: 'whats_manual', label: 'What’s still done manually?', type: 'textarea', rows: 3 },
    { key: 'tech_stack', label: 'Anything else in your tech stack?', optional: true },
  ]},
  { eyebrow: 'Step 3 · Work', title: 'Find where attention leaks.', intro: 'Show us where responsibility sits and which recurring work keeps pulling people back in.', fields: [
    { key: 'staff_responsibilities', label: 'Who does what on your team?', type: 'textarea', rows: 4 },
    { key: 'biggest_time_sink', label: 'Where does the most time get wasted?', type: 'textarea', rows: 4 },
  ]},
  { eyebrow: 'Step 4 · Readiness', title: 'Define the trust boundary.', intro: 'Persistent systems need clear comfort levels, concerns, and review expectations.', fields: [
    { key: 'ai_usage', label: 'How are you using AI today (if at all)?', type: 'textarea', rows: 3 },
    { key: 'ai_comfort', label: 'Comfort level with AI / tech', type: 'select', options: ['Beginner', 'Some experience', 'Comfortable', 'Advanced'] },
    { key: 'ai_concerns', label: 'Any concerns about AI?' },
  ]},
  { eyebrow: 'Step 5 · Outcome', title: 'Name the work worth changing.', intro: 'Give us a clear target for the call and the next 90 days.', fields: [
    { key: 'goals_90d', label: 'Top outcomes you want in the next 90 days', type: 'textarea', rows: 3 },
    { key: 'biggest_bottleneck', label: 'Your single biggest bottleneck right now' },
    { key: 'budget_range', label: 'Budget range', type: 'select', optional: true, options: ['Under $1k/mo', '$1k–$3k/mo', '$3k–$5k/mo', '$5k–$10k/mo', '$10k+/mo', 'One-time project'] },
    { key: 'anything_else', label: 'Anything else I should know before our call?', type: 'textarea', rows: 3, optional: true },
  ]},
]

const REQUIRED_FIELDS = STEPS.flatMap(step => step.fields.filter(field => !field.optional).map(field => field.key))

function IntakeForm() {
  const params = useSearchParams()
  const [step, setStep] = useState(0)
  const [reviewing, setReviewing] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [form, setForm] = useState<Record<string, string>>({})
  const [companyUrl, setCompanyUrl] = useState('')
  const current = STEPS[step]
  const completed = reviewing ? STEPS.length : step

  useEffect(() => {
    const email = params.get('email')
    if (!email) return

    setForm(value => ({ ...value, email }))

    // Preserve the Calendly prefill while keeping personal data out of
    // browser history, copied URLs, referrers, and subsequent analytics.
    const cleanUrl = new URL(window.location.href)
    cleanUrl.searchParams.delete('email')
    window.history.replaceState(
      window.history.state,
      '',
      `${cleanUrl.pathname}${cleanUrl.search}${cleanUrl.hash}`,
    )
  }, [params])

  const groupedReview = useMemo(() => STEPS.map(section => ({ ...section, fields: section.fields.filter(field => form[field.key]?.trim()) })), [form])
  const set = (key: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(value => ({ ...value, [key]: event.target.value }))

  const validateFields = (fields: FieldSpec[]) => {
    const missing = fields.find(field => !field.optional && !form[field.key]?.trim())
    if (missing) {
      setErrorMsg(`Please complete “${missing.label}” before continuing.`)
      requestAnimationFrame(() => document.getElementById(`field-${missing.key}`)?.focus())
      return false
    }
    const email = fields.find(field => field.type === 'email')
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form[email.key] || '')) {
      setErrorMsg('Enter a valid email address before continuing.')
      requestAnimationFrame(() => document.getElementById(`field-${email.key}`)?.focus())
      return false
    }
    setErrorMsg('')
    setStatus('idle')
    return true
  }

  const next = () => {
    if (!validateFields(current.fields)) return
    if (step === STEPS.length - 1) setReviewing(true)
    else setStep(value => value + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const back = () => {
    setErrorMsg('')
    setStatus('idle')
    if (reviewing) setReviewing(false)
    else setStep(value => Math.max(0, value - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const submit = async () => {
    const missing = REQUIRED_FIELDS.find(key => !form[key]?.trim())
    if (missing) {
      const target = STEPS.findIndex(section => section.fields.some(field => field.key === missing))
      setReviewing(false); setStep(target); setStatus('error'); setErrorMsg('A required response is missing. Please complete it before submitting.')
      return
    }
    setStatus('loading'); setErrorMsg('')
    try {
      const response = await fetch('/api/intake', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, company_url: companyUrl }) })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Request failed')
      }
      setStatus('done'); trackConversion('intake'); window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      setStatus('error'); setErrorMsg(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    }
  }

  if (status === 'done') return (
    <section className="intake-complete" aria-live="polite">
      <span className="intake-complete__mark">✓</span><p className="intake-kicker">Intake received</p>
      <h1>We have the context. Now we can use the call well.</h1>
      <p>Your responses are in. They’ll be reviewed before we talk so the conversation can start at the constraint—not at introductions.</p>
      <Link href="/">Return to AIxDesign →</Link>
    </section>
  )

  return (
    <>
      <p className="intake-progress-label">Step {reviewing ? 6 : step + 1} of 6</p>
      <nav className="intake-progress" aria-label="Intake progress" role="list">
        {STEPS.map((item, index) => <div role="listitem" aria-current={index === step && !reviewing ? 'step' : undefined} key={item.title} className={index < completed ? 'is-complete' : index === step && !reviewing ? 'is-current' : ''}><span>{index < completed ? '✓' : index + 1}</span><small>{item.eyebrow.split(' · ')[1]}</small></div>)}
        <div role="listitem" aria-current={reviewing ? 'step' : undefined} className={reviewing ? 'is-current' : ''}><span>6</span><small>Review</small></div>
      </nav>

      {!reviewing ? (
        <form className="intake-form" onSubmit={event => { event.preventDefault(); next() }} noValidate>
          <input type="text" tabIndex={-1} autoComplete="off" value={companyUrl} onChange={event => setCompanyUrl(event.target.value)} className="intake-honeypot" aria-hidden="true" />
          <header className="intake-step-head"><p className="intake-kicker">{current.eyebrow}</p><h2>{current.title}</h2><p>{current.intro}</p></header>
          <div className="intake-fields">
            {current.fields.map(field => (
              <label key={field.key} className={field.type === 'textarea' ? 'is-wide' : ''} htmlFor={`field-${field.key}`}>
                <span>{field.label} {field.optional ? <em>Optional</em> : <b>Required</b>}</span>
                {field.type === 'textarea' ? <textarea id={`field-${field.key}`} rows={field.rows} value={form[field.key] || ''} onChange={set(field.key)} aria-required={!field.optional} /> : field.type === 'select' ? <select id={`field-${field.key}`} value={form[field.key] || ''} onChange={set(field.key)} aria-required={!field.optional}><option value="">{field.optional ? 'Prefer not to say' : 'Select…'}</option>{field.options?.map(option => <option key={option}>{option}</option>)}</select> : <input id={`field-${field.key}`} type={field.type || 'text'} placeholder={field.placeholder} value={form[field.key] || ''} onChange={set(field.key)} aria-required={!field.optional} />}
              </label>
            ))}
          </div>
          {errorMsg && <p className="intake-error" role="alert">{errorMsg}</p>}
          <div className="intake-controls">{step > 0 ? <button type="button" className="intake-back" onClick={back}>← Back</button> : <span />}<button type="submit" className="intake-next">{step === STEPS.length - 1 ? 'Review responses' : 'Continue'} <span>→</span></button></div>
        </form>
      ) : (
        <section className="intake-review">
          <header className="intake-step-head"><p className="intake-kicker">Final review</p><h2>Check the operating picture.</h2><p>You can go back to edit anything before this is sent.</p></header>
          {groupedReview.map((section, index) => <div className="review-section" key={section.title}><div><span>0{index + 1}</span><h3>{section.eyebrow.split(' · ')[1]}</h3><button type="button" onClick={() => { setStep(index); setReviewing(false) }}>Edit</button></div><dl>{section.fields.map(field => <div key={field.key}><dt>{field.label}</dt><dd>{form[field.key]}</dd></div>)}</dl></div>)}
          {errorMsg && <p className="intake-error" role="alert">{errorMsg}</p>}
          <div className="intake-controls"><button type="button" className="intake-back" onClick={back}>← Back</button><button type="button" className="intake-next" onClick={submit} disabled={status === 'loading'}>{status === 'loading' ? 'Sending…' : 'Send my details'} <span>{status === 'loading' ? '' : '→'}</span></button></div>
        </section>
      )}
    </>
  )
}

export default function IntakePage() {
  return (
    <main className="intake-page">
      <header className="intake-utility"><Link href="/" aria-label="AI by Design home"><img src="/brand/aixdesign-mark.svg" alt="" /><span>aixdesign</span></Link><div><span>Pre-call intake</span><small>About 8–10 minutes</small></div></header>
      <div className="intake-shell">
        <aside className="intake-intro"><p className="intake-kicker">Prepared conversations / better systems</p><h1>Help us see the business before the call.</h1><p>This guided intake maps your context, current systems, recurring work, AI readiness, and desired outcome. Complete answers let us begin with sharper questions.</p><div className="intake-signal" aria-hidden="true"><span>Context</span><i /><span>Constraint</span><i /><span>System</span></div><small>Your information is used to prepare for the conversation. Read our <Link href="/privacy">privacy policy</Link>.</small></aside>
        <div className="intake-panel"><Suspense fallback={<p className="intake-loading" aria-live="polite">Loading your intake…</p>}><IntakeForm /></Suspense></div>
      </div>
    </main>
  )
}
