/**
 * Content review CLI — the human approval gate. Nothing reaches LinkedIn until
 * a post is moved to "approved" here.
 *
 *   npx tsx --env-file=.env.local scripts/content-review.ts --list              # list drafts
 *   npx tsx --env-file=.env.local scripts/content-review.ts --list --status approved
 *   npx tsx --env-file=.env.local scripts/content-review.ts --show <id>
 *   npx tsx --env-file=.env.local scripts/content-review.ts --approve <id>
 *   npx tsx --env-file=.env.local scripts/content-review.ts --reject <id>
 *   npx tsx --env-file=.env.local scripts/content-review.ts --edit <id> "new post text"
 *
 * <id> can be the full uuid or just the short prefix shown by --list.
 * Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in the environment.
 */
import {
  listByStatus,
  resolveId,
  setStatus,
  setContent,
  type ContentStatus,
} from '../lib/content-queue'

const STATUSES: ContentStatus[] = ['draft', 'approved', 'rejected', 'scheduled', 'posted']

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : undefined
}

function short(id: string): string {
  return id.slice(0, 8)
}

async function cmdList() {
  const status = (arg('status') ?? 'draft') as ContentStatus
  if (!STATUSES.includes(status)) {
    console.error(`\n  Invalid --status "${status}". Use: ${STATUSES.join(', ')}\n`)
    process.exit(1)
  }
  const lane = arg('lane')
  const rows = await listByStatus(status, lane)
  console.log(`\n  ${status.toUpperCase()} queue${lane ? ` · lane: ${lane}` : ''} — ${rows.length} post(s)`)
  console.log('  ' + '─'.repeat(60))
  if (rows.length === 0) {
    console.log('  (empty)\n')
    return
  }
  for (const r of rows) {
    console.log(`\n  [${short(r.id)}] ${r.lane} · ${r.pillar}${r.scheduled_for ? ` · ${r.scheduled_for}` : ''}`)
    console.log('    ' + r.content.split('\n').join('\n    '))
  }
  console.log(
    `\n  Approve:  scripts/content-review.ts --approve <id>` +
      `   Reject:  --reject <id>   Edit:  --edit <id> "..."\n`
  )
}

async function cmdShow(idArg: string) {
  const row = await resolveId(idArg)
  console.log(`\n  [${short(row.id)}] ${row.lane} · ${row.pillar} · ${row.status}`)
  console.log('  ' + '─'.repeat(60))
  console.log(row.content + '\n')
}

async function cmdApprove(idArg: string) {
  const row = await resolveId(idArg)
  await setStatus(row.id, 'approved')
  console.log(`\n  ✓ Approved [${short(row.id)}] — ${row.pillar}. It will be scheduled on the next publish run.\n`)
}

async function cmdReject(idArg: string) {
  const row = await resolveId(idArg)
  await setStatus(row.id, 'rejected')
  console.log(`\n  ✓ Rejected [${short(row.id)}]. It will not be published.\n`)
}

async function cmdEdit(idArg: string, text: string) {
  const row = await resolveId(idArg)
  await setContent(row.id, text)
  console.log(`\n  ✓ Updated [${short(row.id)}] (still a ${row.status}).\n`)
}

async function main() {
  const approve = arg('approve')
  const reject = arg('reject')
  const edit = arg('edit')
  const show = arg('show')

  if (process.argv.includes('--list')) return cmdList()
  if (show) return cmdShow(show)
  if (approve) return cmdApprove(approve)
  if (reject) return cmdReject(reject)
  if (edit) {
    // text is the argument AFTER the id
    const i = process.argv.indexOf('--edit')
    const text = process.argv[i + 2]
    if (!text) {
      console.error('\n  Usage: --edit <id> "new post text"\n')
      process.exit(1)
    }
    return cmdEdit(edit, text)
  }

  console.log(
    '\n  content-review — review and approve queued posts\n\n' +
      '    --list [--status <s>] [--lane <l>]   list posts (default status: draft)\n' +
      '    --show <id>                          print one post in full\n' +
      '    --approve <id>                       move to approved (ready to schedule)\n' +
      '    --reject <id>                        move to rejected (never published)\n' +
      '    --edit <id> "text"                   replace the post text\n\n' +
      '  <id> = full uuid or the short prefix from --list\n'
  )
}

main().catch(err => {
  console.error('\n  Review command failed:', err?.message ?? err)
  process.exit(1)
})
