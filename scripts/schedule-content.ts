/**
 * Publisher CLI — schedules APPROVED posts to LinkedIn via Postiz.
 *
 * DRY-RUN by default: prints the slot plan and touches nothing.
 * Add --live (with POSTIZ_API_URL + POSTIZ_API_KEY set) to actually schedule.
 *
 *   npx tsx --env-file=.env.local scripts/schedule-content.ts            # dry-run
 *   npx tsx --env-file=.env.local scripts/schedule-content.ts --live     # schedule for real
 *   npx tsx --env-file=.env.local scripts/schedule-content.ts --lane medical --limit 6
 *
 * Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY; --live also needs Postiz.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { publishApproved } from '../lib/content-publish'

const ROOT = path.resolve(__dirname, '..')

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : undefined
}

async function main() {
  if (process.argv.includes('--help')) {
    console.log(
      '\n  schedule-content — schedule approved posts to LinkedIn via Postiz\n\n' +
        '    --lane <name>    audience lane (default: medical)\n' +
        '    --limit <n>      max posts this run (default: 100)\n' +
        '    --live           actually schedule (default is dry-run)\n' +
        '    --help           show this\n'
    )
    return
  }

  const lane = arg('lane') ?? 'medical'
  const limit = parseInt(arg('limit') ?? '100', 10) || 100
  const live = process.argv.includes('--live')

  const result = await publishApproved({
    lane,
    limit,
    live,
    readAsset: async rel => new Uint8Array(await readFile(path.join(ROOT, rel))),
    log: msg => console.log('  ' + msg),
  })

  console.log(`\n  Publish plan — lane: ${result.lane} — ${result.planned.length} approved post(s)`)
  console.log('  ' + '─'.repeat(60))
  if (result.planned.length === 0) {
    console.log('  Nothing approved to schedule. Approve posts with scripts/content-review.ts.\n')
    return
  }
  for (const p of result.planned) {
    console.log(`  ${p.date}  [${p.pillar.padEnd(15)}] ${p.preview}…`)
  }

  if (!live) {
    console.log(
      `\n  DRY RUN — nothing scheduled. ${result.planned.length} post(s) ready.\n` +
        '  Re-run with --live (and Postiz env set) to schedule.\n'
    )
    return
  }

  console.log(`\n  ✓ Scheduled ${result.scheduled} post(s) to LinkedIn.`)
  if (result.skipped.length) console.log(`  ⤫ Skipped ${result.skipped.length} (see errors above).`)
  console.log('')
}

main().catch(err => {
  console.error('\n  Scheduling failed:', err?.message ?? err)
  process.exit(1)
})
