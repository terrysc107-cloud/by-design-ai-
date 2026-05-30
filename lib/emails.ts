import { SITE_URL } from './resend'
import type { IntakeSubmission } from './ai-review'

const GOLD = '#C9A84C'
const BG = '#1E1B17'
const CALL_URL = 'https://calendly.com/terrysc107/15-min-ai-discovery-call'

// Downloadable PDF guide. Override with GUIDE_PDF_URL if hosted elsewhere.
export const GUIDE_PDF_URL = process.env.GUIDE_PDF_URL || `${SITE_URL}/guide.pdf`

type Email = { subject: string; html: string; text: string }

// Shared dark-luxury email shell. `footer` lets drip emails append an unsubscribe line.
function wrap(inner: string, footer?: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${BG};font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#23201b;border:1px solid rgba(201,168,76,0.3);">
          <tr><td style="padding:36px 32px;">
            <p style="margin:0 0 24px;color:${GOLD};font-size:11px;letter-spacing:3px;text-transform:uppercase;">By Design AI</p>
            ${inner}
          </td></tr>
        </table>
        <p style="margin:20px 0 0;color:rgba(255,255,255,0.25);font-size:11px;line-height:1.5;">By Design AI · aixdesign.dev${footer ? `<br/>${footer}` : ''}</p>
      </td></tr>
    </table>
  </body>
</html>`
}

function goldButton(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 28px;"><tr><td style="background:${GOLD};"><a href="${href}" style="display:inline-block;padding:14px 28px;color:${BG};font-size:13px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;font-weight:600;">${label}</a></td></tr></table>`
}

function h1(text: string): string {
  return `<h1 style="margin:0 0 16px;color:#ffffff;font-size:22px;line-height:1.3;font-weight:600;">${text}</h1>`
}

function p(text: string): string {
  return `<p style="margin:0 0 18px;color:rgba(255,255,255,0.65);font-size:15px;line-height:1.6;">${text}</p>`
}

function first(name: string): string {
  return name.trim().split(/\s+/)[0] || 'there'
}

function unsubFooter(unsubscribeUrl: string): string {
  return `Not useful? <a href="${unsubscribeUrl}" style="color:rgba(255,255,255,0.4);text-decoration:underline;">Unsubscribe</a> anytime.`
}

// ── Guide delivery (sent immediately on signup) ─────────────────────────────
export function guideEmail(name: string): Email {
  const guideUrl = `${SITE_URL}/guide`
  const inner =
    h1('10 Things In Your Business You Should Never Do Manually') +
    p(`Hey ${first(name)},`) +
    p("Thanks for grabbing the guide. It's the straight-to-the-point checklist of the tasks draining your time every week — and exactly what to automate first.") +
    goldButton(GUIDE_PDF_URL, 'Download the PDF →') +
    p(`Prefer to read it in your browser? <a href="${guideUrl}" style="color:${GOLD};text-decoration:underline;">Open the guide here</a>.`) +
    p(`Over the next few days I'll send you a couple of short, practical notes on putting AI to work in a business like yours. No fluff — just the moves.`) +
    p(`And whenever you want a second set of eyes on your setup, grab a free 15-minute call:`) +
    `<p style="margin:0 0 18px;"><a href="${CALL_URL}" style="color:${GOLD};font-size:14px;text-decoration:underline;">Book a free discovery call →</a></p>` +
    p('— The By Design AI team')
  return {
    subject: 'Your guide: 10 Things You Should Never Do Manually',
    html: wrap(inner),
    text: `Hey ${first(name)},

Thanks for grabbing the guide — "10 Things In Your Business You Should Never Do Manually."

Download the PDF: ${GUIDE_PDF_URL}
Read it online: ${guideUrl}

Over the next few days I'll send a couple of short, practical notes on putting AI to work in your business.

Book a free 15-minute discovery call: ${CALL_URL}

— The By Design AI team`,
  }
}

// ── Drip sequence (stages 1..4) ─────────────────────────────────────────────
type DripDef = { subject: string; heading: string; body: string[]; cta: string }

const DRIP_CONTENT: Record<number, DripDef> = {
  1: {
    subject: 'What AI actually does for a business like yours',
    heading: 'Forget the hype. Here’s what AI really does.',
    body: [
      'Most "AI for business" talk is noise. Strip it back and AI does one useful thing: it takes the repetitive decisions and tasks you make every day and handles them for you — instantly, consistently, 24/7.',
      'For a business like yours, that lands in three buckets: <strong>capture</strong> (never miss a lead), <strong>follow-up</strong> (reply in seconds, not hours), and <strong>admin</strong> (the copy-paste work eating your evenings).',
      'You don’t need to "learn AI." You need a few of these handled so you can get back to the work only you can do.',
    ],
    cta: 'See how I’d map yours →',
  },
  2: {
    subject: 'The first thing you should automate (it’s not what you think)',
    heading: 'Start here: speed-to-lead.',
    body: [
      'When someone fills out your form or messages you, the clock starts. Reply within 5 minutes and you’re up to <strong>21x</strong> more likely to win them. Wait an hour and most have moved on.',
      'Almost nobody can do that manually — but it’s the easiest thing to automate. An instant text + email the second a lead comes in, then a short reminder sequence if they go quiet.',
      'It’s the single highest-ROI automation for most businesses, and it runs whether you’re asleep, busy, or on a job.',
    ],
    cta: 'Want this built for you? →',
  },
  3: {
    subject: 'A workflow that books calls while you sleep',
    heading: 'Here’s one of mine, end to end.',
    body: [
      'A lead fills out a form at 11pm. Instantly: a text + email go out introducing you. If they don’t reply, a friendly nudge lands the next morning, then again two days later.',
      'The moment they reply "interested," they get a booking link, pick a time, and the call lands on your calendar — with reminders so they actually show up. You wake up to a booked call you did nothing for.',
      'That’s not the future. It’s a weekend to set up, and it’s exactly the kind of system I build for clients.',
    ],
    cta: 'Build one for me →',
  },
  4: {
    subject: 'Want me to build one of these for you?',
    heading: 'Let’s map your first automation.',
    body: [
      'Over the last few emails you’ve seen what AI and automation can actually do for a business like yours — capture leads, follow up instantly, and book calls on autopilot.',
      'If any of it made you think "I want that running for me," the next step is a quick, no-pressure conversation. I’ll look at your setup and show you the one or two automations that’ll move the needle fastest.',
      'It’s free, it’s 15 minutes, and you’ll leave with a clear plan whether we work together or not.',
    ],
    cta: 'Book your free call →',
  },
}

export function dripEmail(stage: number, name: string, unsubscribeUrl: string): Email {
  const def = DRIP_CONTENT[stage]
  if (!def) throw new Error(`No drip content for stage ${stage}`)
  const inner =
    h1(def.heading) +
    p(`Hey ${first(name)},`) +
    def.body.map(p).join('') +
    goldButton(CALL_URL, def.cta) +
    p('— The By Design AI team')
  const text = `Hey ${first(name)},

${def.body.map(b => b.replace(/<[^>]+>/g, '')).join('\n\n')}

${def.cta} ${CALL_URL}

— The By Design AI team

Unsubscribe: ${unsubscribeUrl}`
  return { subject: def.subject, html: wrap(inner, unsubFooter(unsubscribeUrl)), text }
}

// ── Internal: new lead notification ─────────────────────────────────────────
export function leadNotifyEmail(name: string, email: string): Email {
  const subject = `New lead: ${name} <${email}>`
  const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1E1B17;">
    <p style="margin:0 0 8px;"><strong>New guide download / lead</strong></p>
    <p style="margin:0;">Name: ${name}</p>
    <p style="margin:0;">Email: <a href="mailto:${email}">${email}</a></p>
    <p style="margin:16px 0 0;color:#666;">Captured from the By Design AI lead magnet form. They’ve entered the nurture sequence.</p>
  </div>`
  const text = `New lead\nName: ${name}\nEmail: ${email}\n\nCaptured from the By Design AI lead magnet form.`
  return { subject, html, text }
}

// ── Internal: new booking notification ──────────────────────────────────────
export function bookingNotifyEmail(opts: {
  name?: string
  email?: string
  eventType?: string
  scheduledAt?: string
}): Email {
  const { name, email, eventType, scheduledAt } = opts
  const when = scheduledAt ? new Date(scheduledAt).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' }) : 'See Calendly'
  const subject = `📅 New booking: ${name || 'Someone'}${eventType ? ` — ${eventType}` : ''}`
  const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1E1B17;">
    <p style="margin:0 0 8px;"><strong>You’ve got a booking request 🎉</strong></p>
    <p style="margin:0;">Name: ${name || '—'}</p>
    <p style="margin:0;">Email: ${email ? `<a href="mailto:${email}">${email}</a>` : '—'}</p>
    <p style="margin:0;">Event: ${eventType || '—'}</p>
    <p style="margin:0;">When: ${when}</p>
    <p style="margin:16px 0 0;color:#666;">Logged from your Calendly webhook.</p>
  </div>`
  const text = `New booking\nName: ${name || '—'}\nEmail: ${email || '—'}\nEvent: ${eventType || '—'}\nWhen: ${when}`
  return { subject, html, text }
}

// ── Intake invite (to prospect, after booking) ──────────────────────────────
export function intakeInviteEmail(name: string, intakeUrl: string): Email {
  const inner =
    h1('Before our call — 2 minutes that make it count') +
    p(`Hey ${first(name)},`) +
    p("You're booked — thank you. To make our time together count, I put together a short intake so I can review your setup beforehand and show up with a plan already half-built, instead of spending the call asking the basics.") +
    p('It takes about 2 minutes. The more you share, the more specific I can be.') +
    goldButton(intakeUrl, 'Complete the Intake →') +
    p('You can fill it out now or any time before our call — but the sooner I have it, the more prepared I’ll be.') +
    p('— Terry, By Design AI')
  const text = `Hey ${first(name)},

You're booked — thank you. To make our call count, please complete this short intake so I can review your setup and arrive with a plan already half-built.

It takes about 2 minutes: ${intakeUrl}

Fill it out any time before our call — the sooner, the better.

— Terry, By Design AI`
  return {
    subject: 'Before our call — a quick 2-minute intake',
    html: wrap(inner),
    text,
  }
}

// ── Intake reminders (to prospect, escalating) ──────────────────────────────
const INTAKE_REMINDERS: Array<{ subject: string; heading: string; body: string[] }> = [
  {
    subject: 'Quick reminder: your pre-call intake',
    heading: 'A quick nudge before our call',
    body: [
      "I noticed you haven't completed your intake yet. It only takes about 2 minutes, and it's the difference between us spending the call on basics versus diving straight into a plan built for your business.",
      'Knock it out whenever you get a sec:',
    ],
  },
  {
    subject: 'I need your intake to prep for our call',
    heading: 'I want to come prepared — help me out',
    body: [
      "Our call is coming up and I still don't have your intake. Without it, I'm walking in blind and we'll burn the first half of our time on questions a 2-minute form would answer.",
      'Please take a moment to complete it so I can do the prep work for you:',
    ],
  },
  {
    subject: 'Action needed: complete your intake or risk losing your call',
    heading: 'Last call on your intake',
    body: [
      "Your discovery call is almost here and your intake still isn't in. I hold these slots for people who are ready to do the work — if the intake isn't completed before our call, I may need to release your time to someone else.",
      "Don't lose your spot — it takes 2 minutes:",
    ],
  },
]

export function intakeReminderEmail(name: string, intakeUrl: string, stage: number): Email {
  // stage is 0-indexed reminder number (0 = first/gentlest).
  const def = INTAKE_REMINDERS[Math.min(stage, INTAKE_REMINDERS.length - 1)]
  const inner =
    h1(def.heading) +
    p(`Hey ${first(name)},`) +
    def.body.map(p).join('') +
    goldButton(intakeUrl, 'Complete the Intake →') +
    p('— Terry, By Design AI')
  const text = `Hey ${first(name)},

${def.body.join('\n\n')}

${intakeUrl}

— Terry, By Design AI`
  return { subject: def.subject, html: wrap(inner), text }
}

// ── Internal: intake submission + AI review (to owner) ──────────────────────
export function intakeReviewEmail(
  submission: IntakeSubmission,
  aiRecommendations: string | null,
  aiStatus: 'completed' | 'skipped' | 'failed'
): Email {
  const rows: Array<[string, string | undefined]> = [
    ['Company', submission.company],
    ['Website', submission.website],
    ['Industry', submission.industry],
    ['Years in business', submission.years_in_business],
    ['Team size', submission.team_size],
    ['Role', submission.role],
    ['Current tools / CRM', submission.current_tools],
    ['Already automated', submission.whats_automated],
    ['Still manual', submission.whats_manual],
    ['Tech stack', submission.tech_stack],
    ['Staff & responsibilities', submission.staff_responsibilities],
    ['Biggest time sink', submission.biggest_time_sink],
    ['Current AI usage', submission.ai_usage],
    ['AI comfort', submission.ai_comfort],
    ['AI concerns', submission.ai_concerns],
    ['Goals (90 days)', submission.goals_90d],
    ['Biggest bottleneck', submission.biggest_bottleneck],
    ['Budget range', submission.budget_range],
    ['Anything else', submission.anything_else],
  ]
  const filledRows = rows.filter(([, v]) => v && v.trim())
  const rowHtml = filledRows
    .map(
      ([label, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#888;vertical-align:top;white-space:nowrap;">${label}</td><td style="padding:4px 0;color:#1E1B17;">${escapeHtml(v as string)}</td></tr>`
    )
    .join('')

  const aiBlock =
    aiStatus === 'completed' && aiRecommendations
      ? `<div style="margin:20px 0 0;padding:16px;background:#1E1B17;color:#EDE8DF;border-radius:4px;"><p style="margin:0 0 8px;color:#C9A84C;font-size:12px;letter-spacing:2px;text-transform:uppercase;">AI Preliminary Plan</p><pre style="margin:0;white-space:pre-wrap;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.5;color:#EDE8DF;">${escapeHtml(aiRecommendations)}</pre></div>`
      : `<p style="margin:20px 0 0;color:#a15c00;">AI review ${aiStatus === 'failed' ? 'failed — check logs' : 'unavailable (no API key set)'}. Submission stored above.</p>`

  const name = submission.name || 'Someone'
  const email = submission.email || ''
  const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1E1B17;">
    <p style="margin:0 0 12px;"><strong>New discovery intake — ${escapeHtml(name)}</strong>${email ? ` &lt;<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>&gt;` : ''}</p>
    <table style="border-collapse:collapse;font-size:14px;">${rowHtml}</table>
    ${aiBlock}
  </div>`

  const aiText =
    aiStatus === 'completed' && aiRecommendations
      ? `\n\n=== AI PRELIMINARY PLAN ===\n${aiRecommendations}`
      : `\n\n(AI review ${aiStatus === 'failed' ? 'failed' : 'unavailable'}.)`
  const text =
    `New discovery intake — ${name} <${email}>\n\n` +
    filledRows.map(([label, v]) => `${label}: ${v}`).join('\n') +
    aiText

  return { subject: `🧭 Intake: ${name}${submission.company ? ` (${submission.company})` : ''}`, html, text }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
