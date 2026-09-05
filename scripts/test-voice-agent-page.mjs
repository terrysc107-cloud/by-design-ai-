#!/usr/bin/env node
/**
 * Browser acceptance checks for /voice-agent (Playwright + Node assertions).
 * Intercepts the waitlist POST by default - never submits to a real backend.
 *
 * Usage:
 *   VOICE_AGENT_TEST_BASE_URL=http://127.0.0.1:3100 node scripts/test-voice-agent-page.mjs
 */
import assert from 'node:assert/strict'
import { chromium } from 'playwright'

const BASE_URL = process.env.VOICE_AGENT_TEST_BASE_URL || 'http://127.0.0.1:3100'
const PAGE_URL = `${BASE_URL}/voice-agent`

const results = []

async function check(name, fn) {
  try {
    await fn()
    results.push({ name, ok: true })
    console.log(`✔ ${name}`)
  } catch (err) {
    results.push({ name, ok: false, error: err })
    console.log(`✖ ${name}`)
    console.log(`  ${err instanceof Error ? err.message : String(err)}`)
  }
}

/** Registers a mock for POST /api/voice-agent-waitlist so nothing real ever gets hit. */
async function mockWaitlistApi(page, { status = 200, body = { success: true }, delayMs = 0 } = {}) {
  const requests = []
  await page.route('**/api/voice-agent-waitlist', async (route) => {
    requests.push(route.request())
    if (delayMs > 0) await new Promise((r) => setTimeout(r, delayMs))
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(body),
    })
  })
  return requests
}

async function main() {
  const browser = await chromium.launch()

  // ── Core render + content ────────────────────────────────────────────────
  {
    const page = await browser.newPage()
    const consoleErrors = []
    const pageErrors = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })
    page.on('pageerror', (err) => pageErrors.push(err.message))
    await mockWaitlistApi(page)
    const response = await page.goto(PAGE_URL, { waitUntil: 'networkidle' })

    await check('page responds 200', async () => {
      assert.equal(response?.status(), 200)
    })

    await check('renders without hydration/runtime console errors', async () => {
      const hydrationIssues = consoleErrors.filter((m) => /hydrat/i.test(m))
      assert.equal(hydrationIssues.length, 0, `hydration errors: ${hydrationIssues.join('; ')}`)
      assert.equal(pageErrors.length, 0, `page errors: ${pageErrors.join('; ')}`)
    })

    await check('heading and coming-soon language are present', async () => {
      await assert.doesNotReject(page.getByRole('heading', { name: 'AI Voice Agent', level: 1 }).waitFor())
      const body = await page.innerText('body')
      assert.match(body ?? '', /COMING SOON/)
      assert.match(body ?? '', /Not available yet/i)
    })

    await check('four planned use cases are present', async () => {
      const body = await page.innerText('body')
      for (const heading of ['Customer service', 'Voicemail replacement', 'After-hours coverage', 'Restaurants and order-taking']) {
        assert.match(body ?? '', new RegExp(heading))
      }
    })

    await check('no pricing or checkout language', async () => {
      const body = (await page.innerText('body')) ?? ''
      assert.doesNotMatch(body, /\$\d/)
      assert.doesNotMatch(body, /checkout/i)
      assert.doesNotMatch(body, /\bpricing\b/i)
    })

    await check('no live demo language', async () => {
      const body = (await page.innerText('body')) ?? ''
      assert.doesNotMatch(body, /live demo/i)
      assert.doesNotMatch(body, /try it now/i)
    })

    await check('no customer/testimonial/results/launched-functionality claims', async () => {
      const body = (await page.innerText('body')) ?? ''
      assert.doesNotMatch(body, /testimonial/i)
      assert.doesNotMatch(body, /our customers/i)
      assert.doesNotMatch(body, /case stud/i)
    })

    await check('no Tom / private gateway references', async () => {
      const body = (await page.innerText('body')) ?? ''
      const html = await page.content()
      for (const needle of ['Tom', 'tom-gateway', 'private gateway']) {
        assert.doesNotMatch(body, new RegExp(needle))
        assert.doesNotMatch(html, new RegExp(needle))
      }
    })

    await check('only one email-capture form is present', async () => {
      const emailInputs = await page.locator('input[type="email"]').count()
      assert.equal(emailInputs, 1)
    })

    await check('footer does not contain the shared newsletter form', async () => {
      const footerText = await page.locator('footer').innerText()
      assert.doesNotMatch(footerText, /One useful AI move a week/)
    })

    await check('primary CTA is "Join the Waitlist" and reaches the form', async () => {
      const ctas = page.getByRole('link', { name: 'Join the Waitlist' }).or(page.getByRole('button', { name: 'Join the Waitlist' }))
      assert.ok((await ctas.count()) >= 1)
      await page.getByRole('link', { name: 'Join the Waitlist' }).first().click()
      await page.waitForTimeout(100)
      const emailField = page.locator('input[type="email"]')
      await assert.doesNotReject(emailField.waitFor({ state: 'visible' }))
    })

    await check('labels and consent are accessible', async () => {
      const emailInput = page.locator('input[type="email"]')
      const emailId = await emailInput.getAttribute('id')
      assert.ok(emailId)
      const label = page.locator(`label[for="${emailId}"]`)
      assert.equal(await label.count(), 1)

      const consentInput = page.locator('input[type="checkbox"]')
      const consentId = await consentInput.getAttribute('id')
      assert.ok(consentId)
      const consentLabel = page.locator(`label[for="${consentId}"]`)
      assert.equal(await consentLabel.count(), 1)
    })

    await check('honeypot field is not keyboard-focusable', async () => {
      const honeypot = page.locator('input[name="company_url"]')
      assert.equal(await honeypot.getAttribute('tabindex'), '-1')
    })

    await check('metadata is route-specific', async () => {
      assert.equal(await page.title(), 'AI Voice Agent — Coming Soon | AI by Design')
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
      assert.equal(canonical, 'https://aixdesign.dev/voice-agent')
      const description = await page.locator('meta[name="description"]').getAttribute('content')
      assert.match(description ?? '', /voice-agent offering/i)
      const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content')
      assert.equal(ogUrl, 'https://aixdesign.dev/voice-agent')
      const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content')
      assert.equal(twitterCard, 'summary_large_image')
    })

    await check('no service-role key leaks into browser assets', async () => {
      const html = await page.content()
      assert.doesNotMatch(html, /SUPABASE_SERVICE_ROLE_KEY/)
      assert.doesNotMatch(html, /service_role/)
    })

    await page.close()
  }

  // ── Consent gating + validation ─────────────────────────────────────────
  {
    const page = await browser.newPage()
    const requests = await mockWaitlistApi(page)
    await page.goto(PAGE_URL, { waitUntil: 'networkidle' })

    await check('missing consent blocks submission', async () => {
      await page.fill('input[type="email"]', 'test@example.com')
      await page.click('button[type="submit"]')
      await page.waitForTimeout(200)
      assert.equal(requests.length, 0)
      const body = await page.innerText('body')
      assert.match(body ?? '', /updates about this offering/)
    })

    await page.close()
  }

  // ── Browser request payload shape ───────────────────────────────────────
  {
    const page = await browser.newPage()
    const requests = await mockWaitlistApi(page)
    await page.goto(PAGE_URL, { waitUntil: 'networkidle' })
    await page.fill('input[type="email"]', 'test@example.com')
    await page.check('input[type="checkbox"]')
    const urlBefore = page.url()
    await page.click('button[type="submit"]')
    await page.waitForTimeout(300)

    await check('browser request contains only approved fields', async () => {
      assert.equal(requests.length, 1)
      const payload = JSON.parse(requests[0].postData() ?? '{}')
      const allowed = new Set(['email', 'business_type', 'consent', 'company_url'])
      for (const key of Object.keys(payload)) {
        assert.ok(allowed.has(key), `unexpected field: ${key}`)
      }
      assert.ok('email' in payload && 'consent' in payload && 'company_url' in payload)
      assert.equal(payload.consent, true)
    })

    await check('no email/interest value is placed in the URL', async () => {
      assert.equal(page.url(), urlBefore)
      assert.doesNotMatch(page.url(), /test@example\.com/)
    })

    await check('success follows a successful mocked API response', async () => {
      const body = await page.innerText('body')
      assert.match(body ?? '', /You.re on the list/)
    })

    await page.close()
  }

  // ── Loading state prevents duplicate submits ────────────────────────────
  {
    const page = await browser.newPage()
    const requests = await mockWaitlistApi(page, { delayMs: 400 })
    await page.goto(PAGE_URL, { waitUntil: 'networkidle' })
    await page.fill('input[type="email"]', 'dup@example.com')
    await page.check('input[type="checkbox"]')
    const button = page.locator('button[type="submit"]')
    await button.click()

    await check('loading state disables duplicate submit', async () => {
      await assert.doesNotReject(page.getByText('Joining…').first().waitFor({ timeout: 1000 }))
      assert.equal(await button.isDisabled(), true)
      await button.click({ force: true }).catch(() => {})
      await page.waitForTimeout(700)
      assert.equal(requests.length, 1)
    })

    await page.close()
  }

  // ── Failure paths preserve input ────────────────────────────────────────
  for (const [label, status, body] of [
    ['503 failure', 503, { error: 'unavailable' }],
    ['malformed response', 200, { unexpected: true }],
  ]) {
    const page = await browser.newPage()
    await mockWaitlistApi(page, { status, body })
    await page.goto(PAGE_URL, { waitUntil: 'networkidle' })
    await page.fill('input[type="email"]', 'keep-me@example.com')
    await page.check('input[type="checkbox"]')
    await page.click('button[type="submit"]')
    await page.waitForTimeout(300)

    await check(`${label} remains visible and preserves input`, async () => {
      const pageBody = await page.innerText('body')
      assert.match(pageBody ?? '', /couldn.t save your request/)
      assert.equal(await page.locator('input[type="email"]').inputValue(), 'keep-me@example.com')
    })

    await page.close()
  }

  // ── Responsive: no horizontal overflow ──────────────────────────────────
  for (const width of [320, 375, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } })
    await mockWaitlistApi(page)
    await page.goto(PAGE_URL, { waitUntil: 'networkidle' })

    await check(`no horizontal overflow at ${width}px`, async () => {
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }))
      assert.ok(scrollWidth <= clientWidth + 1, `scrollWidth ${scrollWidth} > clientWidth ${clientWidth}`)
    })

    await page.close()
  }

  // ── Keyboard navigation + reduced motion ────────────────────────────────
  {
    const page = await browser.newPage()
    await mockWaitlistApi(page)
    await page.goto(PAGE_URL, { waitUntil: 'networkidle' })

    await check('keyboard navigation reaches the email field and submit button', async () => {
      await page.locator('input[type="email"]').focus()
      assert.equal(
        await page.evaluate(() => document.activeElement?.getAttribute('type')),
        'email'
      )
      let reachedSubmit = false
      for (let i = 0; i < 8; i++) {
        await page.keyboard.press('Tab')
        const isSubmit = await page.evaluate(() => document.activeElement?.getAttribute('type') === 'submit')
        if (isSubmit) {
          reachedSubmit = true
          break
        }
      }
      assert.ok(reachedSubmit, 'Tab order never reached the submit button')
    })

    await page.close()
  }

  {
    const page = await browser.newPage({ reducedMotion: 'reduce' })
    await mockWaitlistApi(page)
    await page.goto(PAGE_URL, { waitUntil: 'networkidle' })

    await check('reduced-motion preference does not hide content', async () => {
      await assert.doesNotReject(page.getByRole('heading', { name: 'AI Voice Agent', level: 1 }).waitFor({ state: 'visible' }))
    })

    await page.close()
  }

  // ── Footer links resolve ────────────────────────────────────────────────
  {
    const page = await browser.newPage()
    await mockWaitlistApi(page)
    await page.goto(PAGE_URL, { waitUntil: 'networkidle' })

    await check('footer links resolve', async () => {
      const hrefs = await page.locator('footer nav a').evaluateAll((els) => els.map((el) => el.getAttribute('href')))
      assert.ok(hrefs.length >= 4)
      for (const href of hrefs) {
        const res = await page.request.get(`${BASE_URL}${href}`)
        assert.ok(res.status() < 400, `${href} returned ${res.status()}`)
      }
    })

    await page.close()
  }

  // ── Existing pages remain reachable (no source changes made to them) ────
  {
    const page = await browser.newPage()
    await check('existing homepage, education, and a known blog page remain reachable', async () => {
      for (const path of ['/', '/education', '/blog/five-things-a-real-ai-board-has']) {
        const res = await page.goto(`${BASE_URL}${path}`, { waitUntil: 'domcontentloaded' })
        assert.ok(res && res.status() < 400, `${path} returned ${res?.status()}`)
      }
    })
    await page.close()
  }

  await browser.close()

  const failed = results.filter((r) => !r.ok)
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
  if (failed.length > 0) {
    console.log('\nFailed checks:')
    for (const f of failed) console.log(`  - ${f.name}`)
    process.exitCode = 1
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
