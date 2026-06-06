/**
 * Brand-launch scheduler for Postiz.
 *
 * DRY-RUN by default — prints exactly what it would publish and exits without
 * touching the network. Add `--live` (with POSTIZ_API_URL + POSTIZ_API_KEY set)
 * to upload the banners and schedule the posts for real.
 *
 *   npx tsx scripts/postiz-schedule.ts            # dry-run (safe)
 *   npx tsx scripts/postiz-schedule.ts --live     # actually schedule
 *
 * Content + voice come from docs/BRAND-KIT.md (§5 bios, §9 pillars). Edit the
 * LAUNCH array below to change copy, assets, or timing.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { PostizClient, type PostizIntegration } from '../lib/postiz'

const ROOT = path.resolve(__dirname, '..')

interface LaunchPost {
  /** Postiz provider identifier to match against connected channels */
  platform: 'x' | 'linkedin' | 'instagram' | 'facebook' | 'threads'
  /** banner/asset to attach, relative to repo root */
  asset: string
  /** days from now to publish */
  dayOffset: number
  /** hour of day (local) to publish */
  hour: number
  content: string
}

const URL_LINE = 'Book a free 30-min discovery call → aixdesign.dev'

const LAUNCH: LaunchPost[] = [
  {
    platform: 'x',
    asset: 'public/brand/bda-x-header-1500x500.png',
    dayOffset: 0,
    hour: 9,
    content: [
      'New shingle: AI by Design.',
      '',
      'We diagnose the bottleneck, design the system, and ship the lean, autonomous solution — custom to your business. Tool-agnostic. Outcome-led.',
      '',
      'Stop learning about AI. Start running on it.',
      URL_LINE,
    ].join('\n'),
  },
  {
    platform: 'linkedin',
    asset: 'public/brand/bda-linkedin-company-1128x191.png',
    dayOffset: 0,
    hour: 13,
    content: [
      'Introducing AI by Design — an AI business coaching & consulting agency.',
      '',
      'We work with owners and small teams buried in tools, tabs, and tasks that don’t add up to outcomes. We find the real bottleneck, design the right system, and ship a lean, autonomous custom solution — built with whatever tool actually fits.',
      '',
      'Coaching · Consulting · Custom builds · Operating-partner retainers.',
      '',
      URL_LINE,
      '',
      '#aiforbusiness #aiconsulting #businesssystems #automation #aicoaching',
    ].join('\n'),
  },
  {
    platform: 'instagram',
    asset: 'public/brand/bda-share-square-1200x1200.png',
    dayOffset: 1,
    hour: 11,
    content: [
      'AI coaching · consulting · custom builds.',
      'Lean systems. Autonomous outcomes.',
      '',
      'We diagnose the bottleneck and build the thing that fixes it.',
      'Free 30-min discovery call — link in bio.',
      '',
      '#aiforbusiness #aiautomation #aicoaching #smallbusinessautomation #leanbusiness #aiconsulting',
    ].join('\n'),
  },
  {
    platform: 'facebook',
    asset: 'public/brand/bda-facebook-cover-1640x924.png',
    dayOffset: 1,
    hour: 15,
    content: [
      'AI by Design is open.',
      '',
      'An AI business coaching & consulting agency that diagnoses your bottleneck and ships a lean, autonomous custom solution. Tool-agnostic, outcome-led.',
      '',
      URL_LINE,
    ].join('\n'),
  },
  {
    platform: 'threads',
    asset: 'public/brand/bda-share-square-1200x1200.png',
    dayOffset: 2,
    hour: 10,
    content: [
      'Most "AI consultants" hand you a Notion doc and walk away.',
      '',
      'We diagnose the bottleneck, design the system, and ship it. Then we can run it.',
      '',
      'Stop learning about AI. Start running on it. → aixdesign.dev',
    ].join('\n'),
  },
]

function scheduledISO(dayOffset: number, hour: number): string {
  const d = new Date()
  d.setDate(d.getDate() + dayOffset)
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

function printPlan() {
  console.log('\n  AI by Design — Postiz brand-launch plan\n  ' + '─'.repeat(48))
  for (const p of LAUNCH) {
    console.log(
      `\n  ▸ ${p.platform.toUpperCase().padEnd(10)} ${scheduledISO(p.dayOffset, p.hour)}`,
    )
    console.log(`    asset: ${p.asset}`)
    console.log(
      '    ' + p.content.split('\n').join('\n    ').slice(0, 600),
    )
  }
  console.log('\n  ' + '─'.repeat(48))
}

async function main() {
  const live = process.argv.includes('--live')

  if (!live) {
    printPlan()
    console.log(
      `\n  DRY RUN — nothing scheduled. ${LAUNCH.length} posts ready.\n` +
        '  Re-run with --live (and POSTIZ_API_URL + POSTIZ_API_KEY set) to schedule.\n',
    )
    return
  }

  if (!PostizClient.isConfigured()) {
    console.error('\n  Cannot go live: set POSTIZ_API_URL and POSTIZ_API_KEY first.\n')
    process.exit(1)
  }

  const client = new PostizClient()
  console.log('\n  Fetching connected channels…')
  const channels = await client.listIntegrations()
  const byId = (i: PostizIntegration) => i.identifier?.toLowerCase()
  console.log(
    '  Connected:',
    channels.map(c => `${c.name} (${c.identifier})`).join(', ') || '(none)',
  )

  for (const p of LAUNCH) {
    const channel = channels.find(c => byId(c) === p.platform && !c.disabled)
    if (!channel) {
      console.warn(`  ⤫ skip ${p.platform} — no connected channel`)
      continue
    }
    const bytes = new Uint8Array(await readFile(path.join(ROOT, p.asset)))
    const mediaId = await client.uploadMedia(path.basename(p.asset), bytes)
    await client.schedulePost({
      integrationId: channel.id,
      content: p.content,
      mediaIds: [mediaId],
      date: scheduledISO(p.dayOffset, p.hour),
      type: 'schedule',
    })
    console.log(`  ✓ scheduled ${p.platform} for ${scheduledISO(p.dayOffset, p.hour)}`)
  }
  console.log('\n  Done.\n')
}

main().catch(err => {
  console.error('\n  Postiz scheduling failed:', err?.message ?? err)
  process.exit(1)
})
