'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

type Status = 'idle' | 'loading' | 'done' | 'error'

const INPUT_CLASS =
  'bg-transparent border border-white/15 focus:border-gold/50 outline-none px-4 py-3 text-white text-sm placeholder:text-white/30 transition-colors duration-200 w-full'

const LABEL_CLASS = 'text-white/50 text-xs mb-1.5 block'

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className={LABEL_CLASS}>{label}</span>
      {children}
    </label>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-gold text-[10px] tracking-[0.35em] uppercase font-medium pt-4">
      {children}
    </p>
  )
}

function IntakeForm() {
  const params = useSearchParams()
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [form, setForm] = useState<Record<string, string>>({})

  // Honeypot — must stay empty.
  const [companyUrl, setCompanyUrl] = useState('')

  useEffect(() => {
    const email = params.get('email')
    if (email) setForm((f) => ({ ...f, email }))
  }, [params])

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name?.trim() || !form.email?.trim()) {
      setErrorMsg('Please add your name and email.')
      setStatus('error')
      return
    }
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, company_url: companyUrl }),
      })
      if (res.ok) {
        setStatus('done')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Request failed')
      }
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  if (status === 'done') {
    return (
      <div className="border border-gold/30 p-8 flex flex-col gap-3 text-center">
        <p className="text-gold text-sm font-medium tracking-wide">Got it.</p>
        <p className="text-white/60 text-sm leading-relaxed">
          Thank you — this is exactly what I need. I&apos;ll review it before we talk and come to the
          call with a plan already half-built. See you then.
        </p>
        <Link
          href="/"
          className="text-gold/50 text-xs tracking-widest uppercase hover:text-gold transition-colors mt-4"
        >
          ← By Design AI
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Honeypot: hidden from real users */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={companyUrl}
        onChange={(e) => setCompanyUrl(e.target.value)}
        className="hidden"
        aria-hidden="true"
      />

      <SectionLabel>The Basics</SectionLabel>
      <Field label="Your name *">
        <input className={INPUT_CLASS} value={form.name || ''} onChange={set('name')} required />
      </Field>
      <Field label="Email *">
        <input type="email" className={INPUT_CLASS} value={form.email || ''} onChange={set('email')} required />
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Company">
          <input className={INPUT_CLASS} value={form.company || ''} onChange={set('company')} />
        </Field>
        <Field label="Website">
          <input className={INPUT_CLASS} value={form.website || ''} onChange={set('website')} placeholder="https://" />
        </Field>
        <Field label="Industry">
          <input className={INPUT_CLASS} value={form.industry || ''} onChange={set('industry')} />
        </Field>
        <Field label="Years in business">
          <input className={INPUT_CLASS} value={form.years_in_business || ''} onChange={set('years_in_business')} />
        </Field>
        <Field label="Team size">
          <input className={INPUT_CLASS} value={form.team_size || ''} onChange={set('team_size')} />
        </Field>
        <Field label="Your role">
          <input className={INPUT_CLASS} value={form.role || ''} onChange={set('role')} />
        </Field>
      </div>

      <SectionLabel>Current Setup</SectionLabel>
      <Field label="What tools / CRM do you use today?">
        <input className={INPUT_CLASS} value={form.current_tools || ''} onChange={set('current_tools')} placeholder="GHL, HubSpot, spreadsheets…" />
      </Field>
      <Field label="What's already automated?">
        <textarea className={INPUT_CLASS} rows={2} value={form.whats_automated || ''} onChange={set('whats_automated')} />
      </Field>
      <Field label="What's still done manually?">
        <textarea className={INPUT_CLASS} rows={2} value={form.whats_manual || ''} onChange={set('whats_manual')} />
      </Field>
      <Field label="Anything else in your tech stack?">
        <input className={INPUT_CLASS} value={form.tech_stack || ''} onChange={set('tech_stack')} />
      </Field>

      <SectionLabel>Team & Time</SectionLabel>
      <Field label="Who does what on your team?">
        <textarea className={INPUT_CLASS} rows={2} value={form.staff_responsibilities || ''} onChange={set('staff_responsibilities')} />
      </Field>
      <Field label="Where does the most time get wasted?">
        <textarea className={INPUT_CLASS} rows={2} value={form.biggest_time_sink || ''} onChange={set('biggest_time_sink')} />
      </Field>

      <SectionLabel>AI Readiness</SectionLabel>
      <Field label="How are you using AI today (if at all)?">
        <textarea className={INPUT_CLASS} rows={2} value={form.ai_usage || ''} onChange={set('ai_usage')} />
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Comfort level with AI / tech">
          <select className={INPUT_CLASS} value={form.ai_comfort || ''} onChange={set('ai_comfort')}>
            <option value="">Select…</option>
            <option>Beginner</option>
            <option>Some experience</option>
            <option>Comfortable</option>
            <option>Advanced</option>
          </select>
        </Field>
        <Field label="Any concerns about AI?">
          <input className={INPUT_CLASS} value={form.ai_concerns || ''} onChange={set('ai_concerns')} />
        </Field>
      </div>

      <SectionLabel>Goals</SectionLabel>
      <Field label="Top outcomes you want in the next 90 days">
        <textarea className={INPUT_CLASS} rows={2} value={form.goals_90d || ''} onChange={set('goals_90d')} />
      </Field>
      <Field label="Your single biggest bottleneck right now">
        <input className={INPUT_CLASS} value={form.biggest_bottleneck || ''} onChange={set('biggest_bottleneck')} />
      </Field>
      <Field label="Budget range (optional)">
        <input className={INPUT_CLASS} value={form.budget_range || ''} onChange={set('budget_range')} />
      </Field>
      <Field label="Anything else I should know before our call?">
        <textarea className={INPUT_CLASS} rows={3} value={form.anything_else || ''} onChange={set('anything_else')} />
      </Field>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="cta-btn px-8 py-4 text-xs tracking-widest disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      >
        {status === 'loading' ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            Sending…
          </span>
        ) : (
          'Send My Details →'
        )}
      </button>
      {errorMsg && <p className="text-red-400 text-xs">{errorMsg}</p>}
    </form>
  )
}

export default function IntakePage() {
  return (
    <main className="min-h-screen bg-background px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-gold/50 text-xs tracking-widest uppercase hover:text-gold transition-colors mb-12 inline-block"
        >
          ← By Design AI
        </Link>

        <p className="text-gold text-[10px] tracking-[0.35em] uppercase font-medium mb-4">
          Pre-Call Intake
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight leading-tight mb-4">
          Help me come prepared
        </h1>
        <p className="text-white/55 text-sm md:text-base leading-relaxed mb-10">
          The more I know before our call, the more we can get done in it. This takes about 2 minutes —
          only your name and email are required, so share as much or as little as you like. Everything
          you write helps me arrive with a plan already half-built for your business.
        </p>

        <Suspense fallback={<p className="text-white/40 text-sm">Loading…</p>}>
          <IntakeForm />
        </Suspense>
      </div>
    </main>
  )
}
