'use client'

import { useState } from 'react'
import { trackConversion } from '@/lib/analytics'

type Props = {
  /** Where this instance lives — stored on the subscriber row. */
  source?: 'newsletter' | 'footer' | 'blog'
  /** 'card' = bordered block with heading (blog). 'inline' = compact (footer). */
  variant?: 'card' | 'inline'
  heading?: string
  blurb?: string
  className?: string
}

export default function NewsletterSignup({
  source = 'newsletter',
  variant = 'card',
  heading = 'One useful AI move a week.',
  blurb = 'Short, practical notes on putting AI and automation to work in a business like yours. No hype, no filler. Unsubscribe any time.',
  className = '',
}: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source }),
      })
      if (res.ok) {
        setStatus('done')
        trackConversion('subscribe', { location: source })
      } else {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || 'Request failed')
      }
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  const form =
    status === 'done' ? (
      <p className="text-gold text-sm font-medium tracking-wide">
        You&apos;re on the list — check your inbox. ✓
      </p>
    ) : (
      <form
        onSubmit={handleSubmit}
        className={variant === 'inline' ? 'flex flex-col sm:flex-row gap-3' : 'flex flex-col gap-3'}
      >
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          aria-label="Email address"
          className="flex-1 bg-transparent border border-white/15 focus:border-gold/50 outline-none px-4 py-3 text-white text-sm placeholder:text-white/30 transition-colors duration-200"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="cta-btn px-6 py-3 text-xs tracking-widest disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {status === 'loading' ? 'Subscribing…' : 'Subscribe →'}
        </button>
      </form>
    )

  if (variant === 'inline') {
    return (
      <div className={className}>
        {form}
        {errorMsg && <p className="text-red-400 text-xs mt-2">{errorMsg}</p>}
      </div>
    )
  }

  return (
    <div className={`border border-gold/20 bg-[#23201b]/40 p-8 ${className}`}>
      <p className="text-gold text-[10px] tracking-[0.35em] uppercase font-medium mb-3">Newsletter</p>
      <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight leading-tight mb-3">
        {heading}
      </h3>
      <p className="text-white/55 text-sm leading-relaxed mb-5">{blurb}</p>
      {form}
      {errorMsg && <p className="text-red-400 text-xs mt-2">{errorMsg}</p>}
    </div>
  )
}
