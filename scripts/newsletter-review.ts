/**
 * Newsletter review CLI — the human approval gate. Nothing reaches subscribers
 * until an issue is moved to "approved" here (or via the email approval link).
 *
 *   npx tsx --env-file=.env.local scripts/newsletter-review.ts --list                 # list drafts
 *   npx tsx --env-file=.env.local scripts/newsletter-review.ts --list --status sent
 *   npx tsx --env-file=.env.local scripts/newsletter-review.ts --show <id>
 *   npx tsx --env-file=.env.local scripts/newsletter-review.ts --approve <id>
 *   npx tsx --env-file=.env.local scripts/newsletter-review.ts --cancel <id>
 *   npx tsx --env-file=.env.local scripts/newsletter-review.ts --edit-subject <id> "new subject"
 *   npx tsx --env-file=.env.local scripts/newsletter-review.ts --send-test <id> [email]
 *
 * --send-test renders the issue and sends ONE email (to LEAD_NOTIFY_EMAIL or the
 * given address). It writes NO ledger row and sends nothing to the list.
 *
 * <id> = full uuid or the short prefix from --list.
 * Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (+ RESEND_* for --send-test).
 */
import {
  listIssues,
  resolveIssueId,
  setIssueStatus,
  setIssueFields,
  type IssueStatus,
} from '../lib/newsletter'
import { newsletterIssueEmail } from '../lib/emails'
import { getResend, FROM_EMAIL, LEAD_NOTIFY_EMAIL, SITE_URL } from '../lib/resend'

const STATUSES: IssueStatus[] = ['draft', 'approved', 'sending', 'sent', 'failed', 'canceled']

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : undefined
}

function short(id: string): string {
  return id.slice(0, 8)
}

async function cmdList() {
  const status = arg('status') as IssueStatus | undefined
  if (status && !STATUSES.includes(status)) {
    console.error(`\n  Invalid --status "${status}". Use: ${STATUSES.join(', ')}\n`)
    process.exit(1)
  }
  const rows = await listIssues(status)
  console.log(`\n  Newsletter issues${status ? ` · ${status}` : ''} — ${rows.length}`)
  console.log('  ' + '─'.repeat(64))
  if (rows.length === 0) {
    console.log('  (none)\n')
    return
  }
  for (const r of rows) {
    const counts = r.status === 'sent' || r.status === 'sending' ? ` · sent ${r.sent_count}/${r.recipient_total ?? '?'}` : ''
    console.log(`  [${short(r.id)}] ${r.status.padEnd(9)} ${r.subject}${counts}`)
  }
  console.log(`\n  Show: --show <id>   Approve: --approve <id>   Test: --send-test <id> you@email\n`)
}

async function cmdShow(idArg: string) {
  const r = await resolveIssueId(idArg)
  console.log(`\n  [${short(r.id)}] ${r.status} — ${r.subject}`)
  console.log('  ' + '─'.repeat(64))
  console.log(`  Preheader: ${r.preheader}`)
  if (r.featured_post_url) console.log(`  Featured:  ${r.featured_post_title} → ${r.featured_post_url}`)
  console.log(`  CTA:       ${r.cta_label} → ${r.cta_url}`)
  console.log('')
  console.log('  ' + r.intro.split('\n').join('\n  '))
  for (const s of r.body) {
    console.log(`\n  ## ${s.heading}`)
    console.log('  ' + s.body.split('\n').join('\n  '))
  }
  console.log('')
}

async function cmdApprove(idArg: string) {
  const r = await resolveIssueId(idArg)
  if (r.status !== 'draft') {
    console.log(`\n  [${short(r.id)}] is "${r.status}" — only drafts can be approved.\n`)
    return
  }
  await setIssueStatus(r.id, 'approved')
  console.log(`\n  ✓ Approved [${short(r.id)}] — "${r.subject}". It sends on the next run.\n`)
}

async function cmdCancel(idArg: string) {
  const r = await resolveIssueId(idArg)
  await setIssueStatus(r.id, 'canceled')
  console.log(`\n  ✓ Canceled [${short(r.id)}]. It will not be sent.\n`)
}

async function cmdEditSubject(idArg: string, subject: string) {
  const r = await resolveIssueId(idArg)
  await setIssueFields(r.id, { subject })
  console.log(`\n  ✓ Updated subject for [${short(r.id)}] (still ${r.status}).\n`)
}

async function cmdSendTest(idArg: string, to?: string) {
  const r = await resolveIssueId(idArg)
  const dest = to || LEAD_NOTIFY_EMAIL
  // A throwaway unsubscribe token — this is a preview, not a list send.
  const unsubscribeUrl = `${SITE_URL}/api/unsubscribe?list=subscribers&token=preview`
  const mail = newsletterIssueEmail(r, 'there', unsubscribeUrl)
  const { error } = await getResend().emails.send({
    from: FROM_EMAIL,
    to: dest,
    subject: `[TEST] ${mail.subject}`,
    html: mail.html,
    text: mail.text,
  })
  if (error) throw error
  console.log(`\n  ✓ Sent a test of [${short(r.id)}] to ${dest}. (No ledger row; list untouched.)\n`)
}

async function main() {
  const show = arg('show')
  const approve = arg('approve')
  const cancel = arg('cancel')
  const editSubject = arg('edit-subject')
  const sendTest = arg('send-test')

  if (process.argv.includes('--list')) return cmdList()
  if (show) return cmdShow(show)
  if (approve) return cmdApprove(approve)
  if (cancel) return cmdCancel(cancel)
  if (editSubject) {
    const i = process.argv.indexOf('--edit-subject')
    const text = process.argv[i + 2]
    if (!text) {
      console.error('\n  Usage: --edit-subject <id> "new subject"\n')
      process.exit(1)
    }
    return cmdEditSubject(editSubject, text)
  }
  if (sendTest) {
    const i = process.argv.indexOf('--send-test')
    const to = process.argv[i + 2]
    return cmdSendTest(sendTest, to)
  }

  console.log(
    '\n  newsletter-review — review, approve, and test newsletter issues\n\n' +
      '    --list [--status <s>]            list issues (newest first)\n' +
      '    --show <id>                      print the full issue\n' +
      '    --approve <id>                   move draft → approved (ready to send)\n' +
      '    --cancel <id>                    move → canceled (never sent)\n' +
      '    --edit-subject <id> "text"       replace the subject line\n' +
      '    --send-test <id> [email]         send ONE test email (no list send)\n\n' +
      '  <id> = full uuid or the short prefix from --list\n'
  )
}

main().catch(err => {
  console.error('\n  Review command failed:', err?.message ?? err)
  process.exit(1)
})
