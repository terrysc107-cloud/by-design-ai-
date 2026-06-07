/**
 * Newsletter generator CLI — drafts this week's issue in the AI by Design voice
 * and saves it to bda_newsletter_issues as a draft for review.
 *
 *   npx tsx --env-file=.env.local scripts/newsletter-generate.ts              # generate 1 issue
 *   npx tsx --env-file=.env.local scripts/newsletter-generate.ts --no-feature # standalone (don't feature latest post)
 *   npx tsx scripts/newsletter-generate.ts --dry-run                          # show plan, no API/DB calls
 *
 * Requires OPENAI_API_KEY + SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 */
import { generateIssue, pickIssueImages, insertIssue } from '../lib/newsletter'

async function main() {
  if (process.argv.includes('--help')) {
    console.log(
      '\n  newsletter-generate — draft this week\'s newsletter issue\n\n' +
        '    --no-feature   standalone issue (do not feature the latest blog post)\n' +
        '    --dry-run      print the plan only — no OpenAI or DB calls\n' +
        '    --help         show this\n'
    )
    return
  }

  const featureLatestPost = !process.argv.includes('--no-feature')
  const dryRun = process.argv.includes('--dry-run')
  const lane = 'general'

  console.log('\n  Newsletter generator')
  console.log('  ' + '─'.repeat(54))
  console.log(`  Feature latest blog post: ${featureLatestPost ? 'yes' : 'no'}`)

  if (dryRun) {
    console.log('\n  DRY RUN — no OpenAI call, no rows written.\n')
    return
  }

  console.log('\n  Calling the newsletter engine…')
  const gen = await generateIssue({ lane, featureLatestPost })
  const images = pickIssueImages(lane)
  const featured = gen.cta_url.includes('/blog/')
    ? { slug: gen.cta_url.split('/blog/')[1] ?? '', title: gen.cta_label, url: gen.cta_url }
    : null
  const issue = await insertIssue(gen, { lane, featured, images })

  console.log(`\n  ✓ Drafted issue [${issue.id.slice(0, 8)}]`)
  console.log(`     Subject:   ${issue.subject}`)
  console.log(`     Preheader: ${issue.preheader}`)
  console.log(`     Sections:  ${issue.body.map(s => s.heading).join(' · ')}`)
  if (featured) console.log(`     Featured:  ${featured.url}`)
  console.log(
    `\n  Preview + send yourself a test:\n` +
      `    npx tsx --env-file=.env.local scripts/newsletter-review.ts --show ${issue.id.slice(0, 8)}\n` +
      `    npx tsx --env-file=.env.local scripts/newsletter-review.ts --send-test ${issue.id.slice(0, 8)} you@email.com\n`
  )
}

main().catch(err => {
  console.error('\n  Newsletter generation failed:', err?.message ?? err)
  process.exit(1)
})
