'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BOOKING_MODAL_EVENT } from '@/lib/cta'

type Status = 'idle' | 'loading' | 'done' | 'error'

export default function BookingModal() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const onOpen = () => {
      setStatus('idle')
      setErrorMsg('')
      setOpen(true)
    }
    window.addEventListener(BOOKING_MODAL_EVENT, onOpen)
    return () => window.removeEventListener(BOOKING_MODAL_EVENT, onOpen)
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

  const close = () => setOpen(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          note: note.trim(),
        }),
      })
      if (res.ok) {
        setStatus('done')
      } else {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || 'Request failed')
      }
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          aria-modal="true"
          role="dialog"
          aria-labelledby="booking-modal-title"
        >
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />

          <motion.div
            className="relative w-full max-w-lg bg-[#1E1B17] border border-gold/30 max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
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

            <div className="p-6 md:p-10 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <p className="text-gold text-[10px] tracking-[0.35em] uppercase font-medium">
                  Book a Discovery Call
                </p>
                <h2
                  id="booking-modal-title"
                  className="text-xl md:text-2xl font-semibold text-white tracking-tight leading-tight"
                >
                  Send a booking request
                </h2>
                <p className="text-white/55 text-sm leading-relaxed">
                  Tell me a bit about what you&apos;re working on. I&apos;ll personally review and reply
                  within 1 business day with times that work for a 15-minute call.
                </p>
              </div>

              {status === 'done' ? (
                <div className="border border-gold/30 p-5 flex flex-col gap-2">
                  <p className="text-gold text-sm font-medium tracking-wide">Request received.</p>
                  <p className="text-white/55 text-sm leading-relaxed">
                    Check your inbox for a confirmation. I&apos;ll be in touch shortly to lock in a
                    time.
                  </p>
                  <button
                    type="button"
                    onClick={close}
                    className="text-white/40 hover:text-white text-[11px] tracking-widest uppercase self-start mt-3 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    maxLength={100}
                    autoComplete="name"
                    className="bg-transparent border border-white/15 focus:border-gold/50 outline-none px-4 py-3 text-white text-sm placeholder:text-white/30 transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    maxLength={200}
                    autoComplete="email"
                    className="bg-transparent border border-white/15 focus:border-gold/50 outline-none px-4 py-3 text-white text-sm placeholder:text-white/30 transition-colors"
                  />
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    maxLength={40}
                    autoComplete="tel"
                    className="bg-transparent border border-white/15 focus:border-gold/50 outline-none px-4 py-3 text-white text-sm placeholder:text-white/30 transition-colors"
                  />
                  <textarea
                    placeholder="What do you want to talk about? (optional)"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    maxLength={2000}
                    rows={4}
                    className="bg-transparent border border-white/15 focus:border-gold/50 outline-none px-4 py-3 text-white text-sm placeholder:text-white/30 transition-colors resize-y"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="cta-btn px-8 py-3 text-xs tracking-widest mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                        Sending…
                      </span>
                    ) : (
                      'Send Booking Request →'
                    )}
                  </button>
                  {errorMsg && <p className="text-red-400 text-xs">{errorMsg}</p>}
                  <p className="text-white/25 text-[10px] tracking-wide">
                    A confirmation will land in your inbox. I follow up personally — no calendar
                    bots.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
