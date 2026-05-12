'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import TextReveal from '@/components/ui/TextReveal'

const faqs = [
  {
    q: 'Who is the AI Ops Audit for?',
    a: 'Operators running established businesses — typically $500k–$10M revenue — who are already using some AI tools but know their workflow has gaps. You don\'t need to be technical. You need to be willing to be honest about where your operation is breaking down. The audit is not for people still deciding whether AI is worth exploring.',
  },
  {
    q: 'What does the audit actually cover?',
    a: 'A 90-minute working session where we map your current operation — every handoff, every tool, every place work stalls or falls through the cracks. We identify the highest-leverage automation opportunities, sequence them by impact and effort, and give you a build-order document you can execute with your team or bring to a developer. You leave with a plan, not a pitch deck.',
  },
  {
    q: 'How quickly will I see results?',
    a: 'The audit deliverable is yours within 48 hours. Most clients implement their first automation within two weeks. How fast you see operational change depends on what we find and your team\'s capacity to build — but the audit tells you exactly what to prioritize so you\'re not guessing.',
  },
  {
    q: 'What if the audit doesn\'t surface anything actionable?',
    a: "That hasn't happened. Every operation we've audited has had at least 3–5 high-leverage gaps, usually more. If for some reason we complete the session and I genuinely believe there's nothing worth building, I'll tell you directly and we'll discuss next steps. The goal is your result, not the invoice.",
  },
  {
    q: 'What happens after the audit?',
    a: 'You have everything you need to move independently. For operators who want to build faster, we offer a 90-Day AI Integration engagement — done-with-you implementation. For those already building, ongoing access through Inner Circle keeps architecture decisions sharp as your stack grows. Neither is required. The audit stands on its own.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  const shouldReduce = useReducedMotion()

  return (
    <section className="section">
      <div className="flex flex-col gap-14">

        <div className="flex flex-col gap-3">
          <p className="text-gold text-xs tracking-[0.25em] uppercase font-medium">
            Before You Book
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            <TextReveal text="Common Questions" />
          </h2>
        </div>

        <div className="flex flex-col divide-y divide-white/8 max-w-2xl">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-start justify-between gap-6 py-6 text-left group"
                aria-expanded={open === i}
              >
                <span className={`text-sm font-medium leading-snug transition-colors duration-200 ${open === i ? 'text-white' : 'text-white/60 group-hover:text-white/80'}`}>
                  {faq.q}
                </span>
                <span
                  className={`text-gold/60 mt-0.5 flex-shrink-0 text-lg leading-none transition-transform duration-300 ${open === i ? 'rotate-45' : ''}`}
                  aria-hidden
                >
                  +
                </span>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={shouldReduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p className="text-white/45 text-sm leading-[1.85] pb-6">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
