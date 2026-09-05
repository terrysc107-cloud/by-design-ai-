'use client'

import { useId, useRef, useState, type FormEvent } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

interface FieldErrors {
  email?: string
  business_type?: string
  consent?: string
}

const SUBMIT_TIMEOUT_MS = 10_000
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function VoiceAgentWaitlistForm() {
  const emailId = useId()
  const businessId = useId()
  const consentId = useId()
  const honeypotId = useId()

  const [email, setEmail] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [statusMessage, setStatusMessage] = useState('')

  const emailRef = useRef<HTMLInputElement>(null)
  const businessRef = useRef<HTMLInputElement>(null)
  const consentRef = useRef<HTMLInputElement>(null)
  const honeypotRef = useRef<HTMLInputElement>(null)
  const submittingRef = useRef(false)

  function validate(): FieldErrors {
    const next: FieldErrors = {}
    const trimmedEmail = email.trim()
    if (!trimmedEmail || trimmedEmail.length > 254 || !EMAIL_SHAPE.test(trimmedEmail)) {
      next.email = 'Enter a valid email address.'
    }
    if (businessType.trim().length > 200) {
      next.business_type = 'Keep this to 200 characters or fewer.'
    }
    if (!consent) {
      next.consent = "Confirm you'd like updates about this offering."
    }
    return next
  }

  function focusFirstInvalid(fieldErrors: FieldErrors) {
    if (fieldErrors.email) emailRef.current?.focus()
    else if (fieldErrors.business_type) businessRef.current?.focus()
    else if (fieldErrors.consent) consentRef.current?.focus()
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (submittingRef.current) return

    const fieldErrors = validate()
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      focusFirstInvalid(fieldErrors)
      return
    }

    submittingRef.current = true
    setStatus('submitting')
    setErrors({})
    setStatusMessage('')

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS)

    try {
      const res = await fetch('/api/voice-agent-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          business_type: businessType.trim() || undefined,
          consent: true,
          company_url: honeypotRef.current?.value ?? '',
        }),
        signal: controller.signal,
      })

      let data: unknown = null
      try {
        data = await res.json()
      } catch {
        data = null
      }

      const success =
        res.ok &&
        typeof data === 'object' &&
        data !== null &&
        (data as { success?: unknown }).success === true

      if (!success) {
        const fields = (data as { fields?: FieldErrors } | null)?.fields
        if (fields && typeof fields === 'object') setErrors(fields)
        setStatus('error')
        setStatusMessage("We couldn't save your request. Please try again.")
        return
      }

      setStatus('success')
      setEmail('')
      setBusinessType('')
      setConsent(false)
    } catch {
      setStatus('error')
      setStatusMessage("We couldn't save your request. Please try again.")
    } finally {
      clearTimeout(timeout)
      submittingRef.current = false
    }
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-sm border border-gold-border bg-gold-dim px-6 py-5 text-base text-white"
      >
        You&apos;re on the list. We&apos;ll email you with updates about this offering.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex w-full max-w-[560px] flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor={emailId} className="text-sm font-medium text-white">
          Email address
        </label>
        <input
          ref={emailRef}
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${emailId}-error` : undefined}
          className="min-h-[44px] rounded-sm border border-white/20 bg-transparent px-4 py-2.5 text-base text-white outline-none focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold"
        />
        {errors.email && (
          <p id={`${emailId}-error`} className="text-sm text-red-400">
            {errors.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={businessId} className="text-sm font-medium text-white">
          Business type or use case (optional)
        </label>
        <input
          ref={businessRef}
          id={businessId}
          name="business_type"
          type="text"
          maxLength={200}
          placeholder="Restaurant orders, after-hours service calls, customer questions…"
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          aria-invalid={Boolean(errors.business_type)}
          aria-describedby={errors.business_type ? `${businessId}-error` : undefined}
          className="min-h-[44px] rounded-sm border border-white/20 bg-transparent px-4 py-2.5 text-base text-white outline-none focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold"
        />
        {errors.business_type && (
          <p id={`${businessId}-error`} className="text-sm text-red-400">
            {errors.business_type}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-3">
          <input
            ref={consentRef}
            id={consentId}
            name="consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? `${consentId}-error` : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 accent-gold"
          />
          <label htmlFor={consentId} className="text-sm text-stone-400">
            Email me about this voice-agent offering.
          </label>
        </div>
        {errors.consent && (
          <p id={`${consentId}-error`} className="text-sm text-red-400">
            {errors.consent}
          </p>
        )}
      </div>

      {/* Honeypot: invisible to sighted users and assistive tech, never keyboard-reachable. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
        <label htmlFor={honeypotId}>Leave this field blank</label>
        <input ref={honeypotRef} id={honeypotId} name="company_url" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="cta-btn min-h-[44px] px-8 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === 'submitting' ? 'Joining…' : 'Join the Waitlist'}
      </button>

      <div role="status" aria-live="polite" className="min-h-[1.25rem] text-sm">
        {status === 'submitting' && <span className="text-stone-400">Joining…</span>}
        {status === 'error' && <span className="text-red-400">{statusMessage}</span>}
      </div>
    </form>
  )
}
