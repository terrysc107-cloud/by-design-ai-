/**
 * Content generator CLI — generates on-brand LinkedIn posts for an audience
 * lane and saves them to the bda_content_queue as drafts for review.
 *
 *   npx tsx --env-file=.env.local scripts/generate-content.ts                 # 6 medical posts
 *   npx tsx --env-file=.env.local scripts/generate-content.ts --count 10
 *   npx tsx --env-file=.env.local scripts/generate-content.ts --pillar teardown --count 4
 *   npx tsx scripts/generate-content.ts --dry-run                            # show the plan, no API/DB calls
 *
 * Requires OPENAI_API_KEY + SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in the
 * environment (use --env-file=.env.local, or run in an env where they're set).
 * Voice + pillars + persona come from lib/content-engine.ts (sourced from
 * docs/BRAND-KIT.md).
 */
import { generatePosts, PILLARS, getLane, type Pillar } from '../lib/content-engine'
import { insertDrafts } from '../lib/content-queue'

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : undefined
}

async function main() {
  if (process.argv.includes('--help')) {
    console.log(
      '\n  generate-content — create draft LinkedIn posts in the content queue\n\n' +
        '    --lane <name>      audience lane (default: medical)\n' +
        '    --count <n>        how many posts (default: 6, max: 20)\n' +
        '    --pillar <name>    restrict to one pillar: ' + PILLARS.join(' | ') + '\n' +
        '    --dry-run          print the plan only — no OpenAI or DB calls\n' +
        '    --help             show this\n'
    )
    return
  }

  const lane = arg('lane') ?? 'medical'
  const count = Math.max(1, Math.min(parseInt(arg('count') ?? '6', 10) || 6, 20))
  const pillarArg = arg('pillar') as Pillar | undefined
  if (pillarArg && !PILLARS.includes(pillarArg)) {
    console.error(`\n  Invalid --pillar "${pillarArg}". Use one of: ${PILLARS.join(', ')}\n`)
    process.exit(1)
  }
  const dryRun = process.argv.includes('--dry-run')
  const laneMeta = getLane(lane)

  console.log(`\n  Content generator — lane: ${lane} (${laneMeta.label})`)
  console.log('  ' + '─'.repeat(54))
  console.log(`  Generating ${count} post(s)${pillarArg ? ` · pillar: ${pillarArg}` : ' · mixed pillars (brand ratio)'}`)
  console.log(`  CTA target: ${laneMeta.url}`)

  if (dryRun) {
    console.log('\n  DRY RUN — no OpenAI call, no rows written.\n')
    return
  }

  console.log('\n  Calling the content engine…')
  const posts = await generatePosts({ lane, count, pillar: pillarArg })
  console.log(`  Generated ${posts.length} post(s). Saving as drafts…`)

  const rows = await insertDrafts(posts, lane)
  console.log(`\n  ✓ Saved ${rows.length} draft(s) to the content queue.\n`)
  rows.forEach((r, i) => {
    const preview = r.content.split('\n')[0].slice(0, 70)
    console.log(`  ${String(i + 1).padStart(2)}. [${r.pillar.padEnd(15)}] ${preview}…`)
  })
  console.log(
    `\n  Review them next:  npx tsx --env-file=.env.local scripts/content-review.ts --list\n`
  )
}

main().catch(err => {
  console.error('\n  Content generation failed:', err?.message ?? err)
  process.exit(1)
})
