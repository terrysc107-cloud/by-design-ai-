/**
 * Pricing gate and post-submission (confirm-email-first) regression tests
 * for /voice-agent.
 *
 *   npx --yes tsx --test tests/voice-demo-offer.test.ts
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { VOICE_DEMO_COPY_STRINGS as PAGE_COPY, VOICE_DEMO_FIT } from '../lib/voice-demo-content'
import { VOICE_DEMO_OFFER, VOICE_DEMO_OFFER_COPY_STRINGS, publishedOffer } from '../lib/voice-demo-offer'

const ALL_COPY = [...PAGE_COPY, ...VOICE_DEMO_OFFER_COPY_STRINGS]
const CONCRETE_TERMS = /\$\s?\d|\d+\s*(completed\s+)?(receptionist\s+)?minutes|per (completed )?minute|\d+-day|initial term|setup (fee|due)|\bper month\b/i
const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('pricing stays unpublished until explicitly approved', () => {
  assert.equal(VOICE_DEMO_OFFER.approved, false)
  assert.equal(publishedOffer(), null)
})

test('unapproved offer: no price, minutes, overage, or term anywhere in page copy', () => {
  for (const text of ALL_COPY) assert.doesNotMatch(text, CONCRETE_TERMS, text)
  assert.match(VOICE_DEMO_OFFER.unpublished.note, /fit call/i)
  assert.ok(ALL_COPY.includes(VOICE_DEMO_OFFER.unpublished.budgetQuestion))
})

test('approving the offer is a deliberate one-flag change that publishes the configured terms', () => {
  const view = publishedOffer({ ...VOICE_DEMO_OFFER, approved: true })
  assert.ok(view)
  const text = [view.main, view.sub, view.budgetQuestion, ...view.terms.flat()].join(' ')
  for (const re of [/\$499/, /\$1,500/, /250 completed receptionist minutes/, /\$0\.45 per completed minute/, /90-day initial term/]) {
    assert.match(text, re)
  }
})

test('the page reads prices only through publishedOffer, and no client or lib file imports the offer module', () => {
  const exp = read('app/voice-agent/_components/VoiceAgentExperience.tsx')
  assert.doesNotMatch(exp, /^'use client'/m)
  assert.match(exp, /publishedOffer\(/)
  assert.doesNotMatch(exp, /\.pricing\b|Usd\b|includedMinutes|initialTermDays/)
  // lib modules may be pulled into client bundles, so only server components may import the offer.
  for (const dir of ['app/voice-agent', 'app/voice-agent/_components', 'lib']) {
    for (const name of readdirSync(new URL(`../${dir}`, import.meta.url))) {
      if (!/\.tsx?$/.test(name) || name === 'voice-demo-offer.ts') continue
      const src = read(`${dir}/${name}`)
      if (dir === 'lib' || /^\s*['"]use client['"]/.test(src)) assert.doesNotMatch(src, /voice-demo-offer/, `${dir}/${name}`)
    }
  }
})

test('lead success copy asks for email confirmation; booking link only in the verified follow-up', () => {
  assert.match(VOICE_DEMO_FIT.confirmEmail, /confirm your email/i)
  assert.match(VOICE_DEMO_FIT.confirmEmailNext, /15-minute/)
  assert.match(VOICE_DEMO_FIT.confirmEmailNext, /confirm/i)
  assert.doesNotMatch(VOICE_DEMO_FIT.received, /confirm|book/i)
})

test('the fit form success state renders no scheduling link and branches only on the confirmation flag', () => {
  const src = read('app/voice-agent/_components/VoiceDemoQualificationForm.tsx')
  const start = src.indexOf('if (result)')
  assert.ok(start > 0)
  const success = src.slice(start, src.indexOf('const describedBy'))
  assert.doesNotMatch(success, /BookCallLink|DISCOVERY_CALL_URL|calendly|tier/i)
  assert.match(success, /email_confirmation_sent/)
})
