// One-time generator: renders the live /guide page to public/guide.pdf so the
// downloadable PDF is a pixel-perfect match of the website theme.
//
// Usage: start the app (npm run start) then `node scripts/generate-guide-pdf.mjs`
import { chromium } from 'playwright'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, '..', 'public', 'guide.pdf')
const URL = process.env.GUIDE_URL || 'http://localhost:3000/guide'

const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
const page = await browser.newPage()

await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 })

// Make sure every diagram image has actually loaded.
await page.evaluate(async () => {
  const imgs = Array.from(document.images)
  await Promise.all(
    imgs.map((img) =>
      img.complete ? Promise.resolve() : new Promise((res) => { img.onload = img.onerror = res })
    )
  )
})

// Strip the sticky top nav bar ("Back to Site") and keep page breaks clean.
await page.addStyleTag({
  content: `
    @media print {
      a[href="/"] { display: none !important; }
      .max-w-3xl > div { break-inside: avoid; }
      img { break-inside: avoid; }
    }
  `,
})
// Remove the top header bar entirely (it's the first child of the page wrapper).
await page.evaluate(() => {
  const bar = document.querySelector('a[href="/"]')?.closest('div')
  if (bar && bar.parentElement) bar.parentElement.removeChild(bar)
})

await page.pdf({
  path: OUT,
  format: 'Letter',
  printBackground: true,
  margin: { top: '0', bottom: '0', left: '0', right: '0' },
})

await browser.close()
console.log(`Wrote ${OUT}`)
