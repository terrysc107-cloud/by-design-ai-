'use client'

import { useState } from 'react'
import { trackConversion } from '@/lib/analytics'

/**
 * The guide capture form, extracted so the landing page and the homepage
 * section cannot drift apart on the one interaction that matters.
 *
 * BOTH FIELDS ARE REQUIRED. `bda_leads.name` is NOT NULL, and more to the
 * point the drip opens every email with a first name, so an anonymous signup
 * produces six emails addressed to "there".
 *
 * On success it navigates to /guide/thanks rather than swapping in a success
 * message: that page carries the download plus the three next steps, and the
 * navigation makes the conversion a real URL that can be measured.
 */
export default function GuideForm({
  location,
  className = '',
}: {
  /** Where this instance lives, for the conversion event. */
  location: string
  className?: string
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('done')
      trackConversion('lead', { location })
      window.location.href = '/guide/thanks'
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again.')
    }
  }

  const field =
    'w-full bg-transparent border border-white/15 px-4 py-3.5 text-white text-sm placeholder:text-white/30 focus:border-gold/60 focus:outline-none transition-colors'

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-3 ${className}`}>
      <label className="sr-only" htmlFor={`gf-name-${location}`}>
        Your first name
      </label>
      <input
        id={`gf-name-${location}`}
        type="text"
        required
        autoComplete="given-name"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Your first name"
        className={field}
      />
      <label className="sr-only" htmlFor={`gf-email-${location}`}>
        Your email address
      </label>
      <input
        id={`gf-email-${location}`}
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Your email address"
        className={field}
      />
      <button
        type="submit"
        disabled={status === 'loading' || status === 'done'}
        className="cta-btn px-8 py-4 text-[11px] tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? 'Sending…' : status === 'done' ? 'Taking you there…' : 'Send me the guide →'}
      </button>
      {status === 'error' && (
        <p role="alert" className="text-red-400 text-xs">
          {errorMsg}
        </p>
      )}
      <p className="text-white/30 text-xs leading-relaxed">
        The guide, then a short series on the parts people get stuck on. Unsubscribe any time.
      </p>
    </form>
  )
}
