'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { ASSETS } from '@/lib/cta'
import { trackConversion } from '@/lib/analytics'

const STORAGE_KEY = 'bda_lm_modal_dismissed_v1'
const DELAY_MS = 8000

export default function LeadMagnetModal() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.localStorage.getItem(STORAGE_KEY)) return

    const t = setTimeout(() => setOpen(true), DELAY_MS)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const close = () => {
    setOpen(false)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, '1')
    }
  }

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
      if (res.ok) {
        setStatus('done')
        // Hand them to the post-conversion page. Navigating rather than
        // rendering upsells inline keeps both capture points on one surface
        // and makes the conversion a real, measurable URL.
        window.location.href = '/guide/thanks'
        trackConversion('lead', { location: 'modal' })
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(STORAGE_KEY, '1')
        }
      } else {
        throw new Error('Request failed')
      }
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again.')
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />

          <motion.div
            className="relative w-full max-w-3xl bg-[#1E1B17] border border-gold/30"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Gold corner accents */}
            <div className="absolute -top-px -left-px w-5 h-5 border-t-2 border-l-2 border-gold/70" />
            <div className="absolute -top-px -right-px w-5 h-5 border-t-2 border-r-2 border-gold/70" />
            <div className="absolute -bottom-px -left-px w-5 h-5 border-b-2 border-l-2 border-gold/70" />
            <div className="absolute -bottom-px -right-px w-5 h-5 border-b-2 border-r-2 border-gold/70" />

            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-3 right-3 text-white/40 hover:text-white text-xl leading-none w-8 h-8 flex items-center justify-center z-10"
            >
              ×
            </button>

            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 md:gap-8 p-6 md:p-10">
              {/* Cover */}
              <div className="hidden md:flex items-center justify-center">
                <div className="relative w-[200px]">
                  <div
                    className="absolute -inset-5 pointer-events-none"
                    style={{
                      background: 'radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 70%)',
                      filter: 'blur(22px)',
                    }}
                  />
                  {/* Transparent PNG with its own spine and shadow, so no frame. */}
                  <Image
                    src={ASSETS.guideMockupLight}
                    alt="The Board Method, a seven-page guide"
                    width={200}
                    height={262}
                    className="relative block w-full h-auto border border-gold/20"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-4">
                <p className="text-gold text-[10px] tracking-[0.35em] uppercase font-medium">
                  Free Guide
                </p>
                <h2 className="text-xl md:text-2xl font-semibold text-white tracking-tight leading-tight">
                  The Board Method
                </h2>
                <p className="text-white/55 text-sm leading-relaxed">
                  The processes draining your time every week — and exactly what to automate first.
                </p>

                {status === 'done' ? (
                  <div className="border border-gold/30 p-5 flex flex-col gap-2 mt-2">
                    <p className="text-gold text-sm font-medium tracking-wide">You&apos;re in.</p>
                    <p className="text-white/55 text-sm leading-relaxed">
                      Check your inbox — the guide is on its way. While you wait,{' '}
                      <a
                        href="/guide/read"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold underline underline-offset-2 hover:text-white transition-colors"
                      >
                        read it right here
                      </a>
                      .
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-2">
                    <input
                      type="text"
                      placeholder="Your first name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      className="bg-transparent border border-white/15 focus:border-gold/50 outline-none px-4 py-3 text-white text-sm placeholder:text-white/30 transition-colors"
                    />
                    <input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="bg-transparent border border-white/15 focus:border-gold/50 outline-none px-4 py-3 text-white text-sm placeholder:text-white/30 transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="cta-btn px-8 py-3 text-xs tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {status === 'loading' ? 'Sending…' : 'Send Me the Guide →'}
                    </button>
                    {errorMsg && <p className="text-red-400 text-xs">{errorMsg}</p>}
                    <button
                      type="button"
                      onClick={close}
                      className="text-white/35 hover:text-white/60 text-[11px] tracking-wide self-center mt-1 transition-colors"
                    >
                      No thanks
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
