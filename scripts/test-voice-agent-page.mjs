#!/usr/bin/env node
/**
 * Browser acceptance checks for the /voice-agent live phone demo funnel.
 * Every /api/voice-demo/* request from the page is intercepted and answered
 * with deterministic fixtures: no real demo service, phone call, email, or
 * provider write can happen. Direct API probes below only exercise
 * rejections that return before any upstream call (403 / 415).
 *
 * Usage:
 *   npm run build && npx next start -p 3100
 *   VOICE_AGENT_TEST_BASE_URL=http://127.0.0.1:3100 node scripts/test-voice-agent-page.mjs
 */
import assert from 'node:assert/strict'
import { chromium } from 'playwright'

const BASE_URL = process.env.VOICE_AGENT_TEST_BASE_URL || 'http://127.0.0.1:3100'
const PAGE_URL = `${BASE_URL}/voice-agent`
const CALENDLY = 'https://calendly.com/terrysc107/15-min-ai-discovery-call'
const TOKEN = 'bt_' + 'k'.repeat(40)
const SESSION = {
  browser_token: TOKEN,
  call_code: '482913',
  phone_number: '+18885550123',
  expires_at: new Date(Date.now() + 10 * 60_000).toISOString(),
  vertical: 'towing',
}
const OWNER = {
  vertical: 'towing', need: 'Tow after a flat tire', urgency: 'urgent', service_requested: 'Tow to a shop',
  preferred_timing: 'As soon as possible', missing_information: ['Exact mile marker'],
  summary: 'ACCEPTANCE: caller on the shoulder with a flat tire.', recommended_action: 'Call back within five minutes.',
  example_notification: 'New towing lead: flat tire.',
}

const results = []
async function check(name, fn) {
  try {
    await fn()
    results.push({ name, ok: true })
    console.log(`✔ ${name}`)
  } catch (err) {
    results.push({ name, ok: false })
    console.log(`✖ ${name}\n  ${err instanceof Error ? err.message : String(err)}`)
  }
}

/** Mocks all three proxy routes. `statuses` is consumed in order; the last one repeats. */
async function mockDemoApi(page, { session = { status: 200, body: SESSION }, statuses = [{ state: 'awaiting_call' }], lead = { status: 200, body: { success: true, email_confirmation_sent: true } } } = {}) {
  const calls = { session: [], status: [], lead: [] }
  const reply = (route, status, body) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })
  await page.route('**/api/voice-demo/session', (route) => { calls.session.push(route.request()); return reply(route, session.status, session.body) })
  await page.route('**/api/voice-demo/status', (route) => {
    calls.status.push(route.request())
    return reply(route, 200, statuses[Math.min(calls.status.length - 1, statuses.length - 1)])
  })
  await page.route('**/api/voice-demo/lead', (route) => { calls.lead.push(route.request()); return reply(route, lead.status, lead.body) })
  // Never let any page request leave for a real Calendly/analytics network during tests.
  await page.route(/googletagmanager|google-analytics|facebook\.net|calendly\.com/, (route) => route.abort())
  return calls
}

/** Captures gtag/fbq calls so analytics payloads can be inspected for PII. */
async function captureAnalytics(page) {
  await page.addInitScript(() => {
    window.__events = []
    const stub = (...args) => window.__events.push(args)
    // Pin the stub so a configured GA tag cannot replace it mid-test.
    Object.defineProperty(window, 'gtag', { configurable: false, get: () => stub, set: () => {} })
  })
  return () => page.evaluate(() => window.__events)
}

async function revealNumber(page) {
  await page.getByRole('radio', { name: /Towing/ }).check()
  await page.getByLabel(/I understand this call is with an AI/).check()
  await page.getByRole('button', { name: 'Show my demo number' }).click()
}

async function newPage(browser, opts = {}) {
  const page = await browser.newPage(opts)
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED/.test(m.text())) errors.push(m.text()) })
  return { page, errors }
}

async function main() {
  const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
  const browser = await chromium.launch(executablePath ? { executablePath } : undefined)

  // ── Render, content, disclosure-before-number, metadata ────────────────
  {
    const { page, errors } = await newPage(browser)
    await mockDemoApi(page)
    const res = await page.goto(PAGE_URL, { waitUntil: 'networkidle' })
    const body = await page.innerText('body')
    const html = await page.content()

    await check('page responds 200 without runtime or hydration errors', () => {
      assert.equal(res?.status(), 200)
      assert.deepEqual(errors, [])
    })
    await check('hero headline and primary CTA', async () => {
      await page.getByRole('heading', { level: 1, name: 'Call your future AI receptionist.' }).waitFor()
      assert.ok(await page.getByRole('link', { name: 'Try the phone demo' }).count() >= 1)
    })
    await check('exactly three launch verticals', async () => {
      assert.equal(await page.getByRole('radio').count(), 3)
      for (const name of ['Towing', 'Auto repair', 'Auto detailing']) assert.equal(await page.getByRole('radio', { name: new RegExp(name) }).count(), 1)
    })
    await check('AI, transcription, and simulation disclosure shown; number hidden until requested', async () => {
      assert.match(body, /AI receptionist, not a person/)
      assert.match(body, /transcribed/)
      assert.match(body, /simulated: no real tow/i)
      assert.doesNotMatch(body, /\(888\) 555-0123/)
      assert.equal(await page.locator('a[href^="tel:"]').count(), 0)
    })
    await check('owner-view example is labeled as simulated', () => assert.match(body, /Example owner alert\. Simulated data\./))
    await check('unapproved pricing: no price, minutes, overage, or term in the page or its HTML', () => {
      assert.match(body, /Pricing depends on your call volume and setup/)
      assert.match(body, /short fit call/)
      for (const re of [/\$\s?\d/, /\b499\b/, /1,500/]) assert.doesNotMatch(body, re)
      // HTML (incl. the RSC payload, whose "$<hex>" refs rule out a bare \$\d check) gets phrase checks only.
      for (const re of [/completed receptionist minutes/, /per completed minute/, /initial term/, /setup due at kickoff/, /\$499|\$1,500/]) {
        assert.doesNotMatch(body, re)
        assert.doesNotMatch(html, re)
      }
      assert.match(body, /managed monthly service something you could budget for/)
    })
    await check('client JS bundles carry no recommended price numbers', async () => {
      const srcs = await page.$$eval('script[src]', (els) => els.map((e) => e.src).filter((s) => s.includes('/_next/')))
      for (const src of srcs) {
        const js = await (await page.request.get(src)).text()
        assert.doesNotMatch(js, /includedMinutes|overagePerMinuteUsd|initialTermDays/, src)
      }
    })
    await check('FAQ covers disclosure, uncertainty, emergencies, booking limits, management', () => {
      for (const q of [/talking to AI/, /does not know/, /emergencies/, /book appointments or dispatch/, /Who runs it/]) assert.match(body, q)
    })
    await check('no em or en dashes in visible copy', () => assert.doesNotMatch(body, /[–—]/))
    await check('no secrets, service URLs, or private-system references in the page', () => {
      for (const needle of [/VOICE_DEMO_API_SECRET/, /VOICE_DEMO_API_BASE_URL/, /service_role/, /SUPABASE_SERVICE_ROLE_KEY/, /tom-gateway/i, /private gateway/i, /lts-voice/i]) assert.doesNotMatch(html, needle)
    })
    await check('legacy waitlist form is not rendered', async () => {
      assert.doesNotMatch(body, /Join the Preview|Join the Waitlist/)
      assert.equal(await page.locator('input[name="company_url"]').count(), 1) // the fit-form honeypot only
    })
    await check('route metadata', async () => {
      assert.match(await page.title(), /AI Receptionist/)
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://aixdesign.dev/voice-agent')
      assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'), 'https://aixdesign.dev/voice-agent')
    })
    await page.close()
  }

  // ── Gating: vertical + acknowledgement required before any session request ─
  {
    const { page } = await newPage(browser)
    const calls = await mockDemoApi(page)
    await page.goto(PAGE_URL, { waitUntil: 'networkidle' })
    await check('no vertical selected blocks the request', async () => {
      await page.getByRole('button', { name: 'Show my demo number' }).click()
      await page.getByText('Choose a business to call first.').waitFor()
      assert.equal(calls.session.length, 0)
    })
    await check('missing acknowledgement blocks the request', async () => {
      await page.getByRole('radio', { name: /Auto repair/ }).check()
      await page.getByRole('button', { name: 'Show my demo number' }).click()
      await page.getByText(/Confirm you understand the disclosure/).waitFor()
      assert.equal(calls.session.length, 0)
    })
    await page.close()
  }

  // ── Happy path: number, tel CTA, code, live status, owner reveal, analytics ─
  {
    const { page, errors } = await newPage(browser, { viewport: { width: 390, height: 844 } })
    const events = await captureAnalytics(page)
    const calls = await mockDemoApi(page, {
      statuses: [{ state: 'awaiting_call' }, { state: 'in_call' }, { state: 'completed', owner_output: OWNER }],
    })
    await page.goto(`${PAGE_URL}?utm_source=linkedin&utm_campaign=voice`, { waitUntil: 'networkidle' })
    const urlBefore = page.url()
    await revealNumber(page)

    await check('number, tel link, and code appear after request', async () => {
      await page.getByText('(888) 555-0123').first().waitFor()
      assert.ok(await page.locator('a[href="tel:+18885550123"]').count() >= 2)
      await page.getByText('482913').first().waitFor()
    })
    await check('mobile sticky call bar is visible while the call is pending', async () => {
      assert.equal(await page.locator('.vd-sticky-call').isVisible(), true)
    })
    await check('session request carries only vertical and utm attribution', () => {
      const payload = JSON.parse(calls.session[0].postData() ?? '{}')
      assert.deepEqual(Object.keys(payload).sort(), ['attribution', 'vertical'])
      assert.deepEqual(payload.attribution, { utm_source: 'linkedin', utm_campaign: 'voice' })
    })
    await check('status polling sends the token in the POST body, never the URL', () => {
      const req = calls.status[0]
      assert.equal(req.method(), 'POST')
      assert.doesNotMatch(req.url(), new RegExp(TOKEN))
      assert.equal(JSON.parse(req.postData() ?? '{}').browser_token, TOKEN)
    })
    await check('owner output reveals after completion', async () => {
      await page.getByText('ACCEPTANCE: caller on the shoulder').waitFor({ timeout: 15_000 })
      await page.getByText(/No real service, booking, or dispatch was created/).waitFor()
      assert.equal(await page.locator('.vd-sticky-call').count(), 0)
    })
    await check('page URL never carries the code or token', () => {
      assert.equal(page.url(), urlBefore)
      assert.doesNotMatch(page.url(), /482913|bt_/)
    })
    await check('browser funnel events fire with no PII, token, or code', async () => {
      const captured = await events()
      const names = captured.filter((c) => c[0] === 'event').map((c) => c[1])
      for (const n of ['voice_page_viewed', 'demo_started', 'vertical_selected', 'demo_number_revealed', 'owner_output_viewed']) assert.ok(names.includes(n), `missing ${n}`)
      for (const n of ['demo_call_connected', 'demo_call_completed', 'lead_qualified']) assert.ok(!names.includes(n), `server-owned ${n} emitted by browser`)
      assert.doesNotMatch(JSON.stringify(captured), /482913|bt_k|8885550123|@|linkedin|utm_|tier/)
      const demoEvents = ['voice_page_viewed', 'demo_started', 'vertical_selected', 'demo_number_revealed', 'owner_output_viewed']
      const params = captured.filter((c) => c[0] === 'event' && demoEvents.includes(c[1])).map((c) => c[2])
      const ids = new Set(params.map((p) => p.session_id))
      assert.equal(ids.size, 1, 'one anonymous session id per tab')
      assert.match([...ids][0], /^vs_[a-f0-9]{32}$/)
      for (const p of params) {
        for (const k of Object.keys(p)) assert.ok(['session_id', 'profile', 'source'].includes(k), `unexpected param ${k}`)
        assert.equal(p.source, 'social')
      }
    })
    await check('no runtime errors through the full call flow', () => assert.deepEqual(errors, []))
    await check('no horizontal overflow in the revealed state at 390px', async () => {
      const { sw, cw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }))
      assert.ok(sw <= cw + 1, `${sw} > ${cw}`)
    })
    await page.close()
  }

  // ── Resume after switching to the dialer (sessionStorage, not URL) ──────
  {
    const { page } = await newPage(browser)
    await mockDemoApi(page)
    await page.goto(PAGE_URL, { waitUntil: 'networkidle' })
    await revealNumber(page)
    await page.getByText('482913').first().waitFor()
    await page.reload({ waitUntil: 'networkidle' })
    await check('revealed demo survives a reload', async () => {
      await page.getByText('482913').first().waitFor()
      assert.doesNotMatch(page.url(), /482913|bt_/)
    })
    await page.close()
  }

  // ── Failure states keep the choice and never bypass email verification ─
  for (const [label, session, pattern] of [
    ['not configured', { status: 503, body: { error: 'not_configured' } }, /live demo line is not open/],
    ['upstream error', { status: 502, body: { error: 'upstream_unavailable' } }, /could not reach the demo line/],
    ['rate limited', { status: 429, body: { error: 'rate_limited' } }, /Too many demo requests/],
    ['malformed success', { status: 200, body: { browser_token: 'x' } }, /could not reach the demo line/],
  ]) {
    const { page } = await newPage(browser)
    await mockDemoApi(page, { session })
    await page.goto(PAGE_URL, { waitUntil: 'networkidle' })
    await revealNumber(page)
    await check(`${label}: visible, focused message; choice preserved; no booking bypass`, async () => {
      const msg = page.getByText(pattern)
      await msg.waitFor()
      assert.equal(await msg.evaluate((el) => el === document.activeElement), true)
      assert.equal(await page.getByRole('radio', { name: /Towing/ }).isChecked(), true)
      assert.equal(await page.locator(`a[href="${CALENDLY}"]`).count(), 0)
      assert.equal(await page.locator('a[href^="tel:"]').count(), 0)
    })
    await page.close()
  }

  // ── Qualification form ──────────────────────────────────────────────────
  {
    const { page } = await newPage(browser)
    const events = await captureAnalytics(page)
    const calls = await mockDemoApi(page)
    await page.goto(PAGE_URL, { waitUntil: 'networkidle' })
    const form = page.locator('.vd-fit-form')

    await check('empty submit shows inline errors, focuses the first field, sends nothing', async () => {
      await form.getByRole('button', { name: 'Send my answers' }).click()
      await form.getByText('Enter your name.').waitFor()
      assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('name')), 'name')
      assert.equal(calls.lead.length, 0)
    })

    await form.getByLabel('Your name').fill('Dana Reyes')
    await form.getByLabel('Business name').fill('Reyes Towing')
    await form.getByLabel('Email', { exact: true }).fill('Dana@Example.com')
    await form.getByLabel(/Type of business/).selectOption('towing')
    await form.getByLabel(/Inbound calls per month/).selectOption('150_400')
    await form.getByLabel(/go unanswered/).selectOption('often')
    await form.getByLabel(/want this running/).selectOption('30_days')
    await form.getByLabel(/budget for/).selectOption('fits')
    await form.getByLabel(/Email me a recap/).check()
    await form.getByRole('button', { name: 'Send my answers' }).click()

    await check('success asks to confirm email first and shows no scheduling link', async () => {
      await page.getByText(/confirm your email address/).waitFor()
      await page.getByText(/Once you confirm.*15-minute fit call/).waitFor()
      assert.equal(await page.locator('.vd-fit-result a').count(), 0)
      assert.equal(await page.locator(`#fit a[href="${CALENDLY}"]`).count(), 0)
    })
    await check('lead payload has separate consents and only approved fields', () => {
      const payload = JSON.parse(calls.lead[0].postData() ?? '{}')
      const allowed = new Set(['name', 'business_name', 'email', 'phone', 'business_type', 'monthly_calls', 'missed_calls', 'timeline', 'budget', 'recap_consent', 'sales_follow_up_consent', 'browser_token', 'attribution', 'company_url'])
      for (const k of Object.keys(payload)) assert.ok(allowed.has(k), `unexpected ${k}`)
      assert.equal(payload.recap_consent, true)
      assert.equal(payload.sales_follow_up_consent, false)
      assert.equal(payload.email, 'dana@example.com')
    })
    await check('fit analytics carry no tier and no contact details', async () => {
      const captured = JSON.stringify(await events())
      assert.match(captured, /fit_request_submitted/)
      assert.match(captured, /qualification_started/)
      assert.doesNotMatch(captured, /dana|Reyes|@|tier|qualified/i)
    })
    await page.close()
  }

  {
    const { page } = await newPage(browser)
    await mockDemoApi(page, { lead: { status: 200, body: { success: true, email_confirmation_sent: false } } })
    await page.goto(PAGE_URL, { waitUntil: 'networkidle' })
    const form = page.locator('.vd-fit-form')
    await form.getByLabel('Your name').fill('No Mail')
    await form.getByLabel('Business name').fill('No Mail Shop')
    await form.getByLabel('Email', { exact: true }).fill('nomail@example.com')
    for (const [label, value] of [[/Type of business/, 'towing'], [/Inbound calls/, 'under_50'], [/go unanswered/, 'rarely'], [/want this running/, 'exploring'], [/budget for/, 'discuss']]) {
      await form.getByLabel(label).selectOption(value)
    }
    await form.getByRole('button', { name: 'Send my answers' }).click()
    await check('without a confirmation email the page never claims one was sent', async () => {
      await page.getByText(/We have your answers and will reply by email/).waitFor()
      assert.doesNotMatch(await page.locator('.vd-fit-result').innerText(), /confirm|inbox|book/i)
      assert.equal(await page.locator('.vd-fit-result a').count(), 0)
    })
    await page.close()
  }

  {
    const { page } = await newPage(browser)
    await mockDemoApi(page, { lead: { status: 503, body: { error: 'not_configured' } } })
    await page.goto(PAGE_URL, { waitUntil: 'networkidle' })
    const form = page.locator('.vd-fit-form')
    await form.getByLabel('Your name').fill('Keep Me')
    await form.getByLabel('Business name').fill('Keep Shop')
    await form.getByLabel('Email', { exact: true }).fill('keep@example.com')
    for (const [label, value] of [[/Type of business/, 'mechanic'], [/Inbound calls/, 'under_50'], [/go unanswered/, 'rarely'], [/want this running/, 'exploring'], [/budget for/, 'not_now']]) {
      await form.getByLabel(label).selectOption(value)
    }
    await form.getByRole('button', { name: 'Send my answers' }).click()
    await check('lead failure keeps every answer and does not bypass email confirmation', async () => {
      await page.getByText(/Your answers are still here/).waitFor()
      assert.equal(await form.getByLabel('Email', { exact: true }).inputValue(), 'keep@example.com')
      assert.equal(await form.getByLabel(/Type of business/).inputValue(), 'mechanic')
      assert.equal(await page.locator(`a[href="${CALENDLY}"]`).count(), 0)
    })
    await page.close()
  }

  // ── Responsive matrix ───────────────────────────────────────────────────
  for (const width of [320, 375, 768, 1024, 1440]) {
    const { page } = await newPage(browser, { viewport: { width, height: 900 } })
    await mockDemoApi(page)
    await page.goto(PAGE_URL, { waitUntil: 'networkidle' })
    await check(`no horizontal overflow and hero CTA in first viewport at ${width}px`, async () => {
      const { sw, cw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }))
      assert.ok(sw <= cw + 1, `${sw} > ${cw}`)
      const box = await page.locator('.vd-hero').getByRole('link', { name: 'Try the phone demo' }).boundingBox()
      assert.ok(box && box.y + box.height <= 900, `CTA bottom at ${box && box.y + box.height}`)
    })
    await page.close()
  }

  // ── Keyboard + reduced motion ───────────────────────────────────────────
  {
    const { page } = await newPage(browser, { reducedMotion: 'reduce' })
    await mockDemoApi(page)
    await page.goto(PAGE_URL, { waitUntil: 'networkidle' })
    await check('reduced motion keeps content visible', async () => {
      await page.getByRole('heading', { level: 1 }).waitFor({ state: 'visible' })
      assert.equal(await page.locator('.vd-owner').first().evaluate((el) => getComputedStyle(el).opacity), '1')
    })
    await check('skip link and radios are keyboard reachable', async () => {
      await page.keyboard.press('Tab')
      assert.match(await page.evaluate(() => document.activeElement?.textContent ?? ''), /Skip to the phone demo/)
      await page.getByRole('radio', { name: /Towing/ }).focus()
      await page.keyboard.press('ArrowRight')
      assert.equal(await page.getByRole('radio', { name: /Auto repair/ }).isChecked(), true)
    })
    await page.close()
  }

  // ── Links, privacy, preserved waitlist route, proxy rejections ──────────
  {
    const { page } = await newPage(browser)
    await check('footer links resolve', async () => {
      await mockDemoApi(page)
      await page.goto(PAGE_URL, { waitUntil: 'networkidle' })
      const hrefs = await page.locator('.vd-footer nav a').evaluateAll((els) => els.map((el) => el.getAttribute('href')))
      assert.ok(hrefs.length >= 3)
      for (const href of hrefs) assert.ok((await page.request.get(`${BASE_URL}${href}`)).status() < 400, href)
    })
    await check('privacy page documents the phone demo', async () => {
      await page.goto(`${BASE_URL}/privacy`, { waitUntil: 'domcontentloaded' })
      const body = await page.innerText('body')
      assert.match(body, /AI Receptionist Phone Demo/)
      assert.match(body, /do not store call audio/)
      assert.match(body, /Twilio/)
    })
    await check('historical waitlist endpoint still exists (415 on wrong content type, no write)', async () => {
      const res = await page.request.post(`${BASE_URL}/api/voice-agent-waitlist`, { headers: { 'content-type': 'text/plain', origin: BASE_URL }, data: 'x' })
      assert.equal(res.status(), 415)
    })
    await check('demo proxy rejects cross-origin requests before any upstream call', async () => {
      for (const path of ['session', 'status', 'lead']) {
        const res = await page.request.post(`${BASE_URL}/api/voice-demo/${path}`, { headers: { 'content-type': 'application/json', origin: 'https://evil.example' }, data: '{}' })
        assert.equal(res.status(), 403, path)
      }
    })
    await check('homepage and education remain reachable', async () => {
      for (const path of ['/', '/education']) assert.ok((await page.request.get(`${BASE_URL}${path}`)).status() < 400, path)
    })
    await page.close()
  }

  await browser.close()
  const failed = results.filter((r) => !r.ok)
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
  if (failed.length > 0) {
    for (const f of failed) console.log(`  - ${f.name}`)
    process.exitCode = 1
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
