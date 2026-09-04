import { SITE_URL } from './resend'
import type { IntakeSubmission } from './ai-review'
import { DRIP_TOTAL } from './drip'

const GOLD = '#C9A84C'
const BG = '#1E1B17'
const CALL_URL = 'https://calendly.com/terrysc107/15-min-ai-discovery-call'

/**
 * The course. Primary destination for the guide funnel, tagged so the course
 * side can attribute signups back to this list rather than guessing.
 */
const COURSE_URL =
  'https://runyouraiboard.com/?utm_source=aixdesign.dev&utm_medium=email&utm_campaign=board-method-drip'

/**
 * The Build Lab, and the discovery call. The two rungs the drip used to have no
 * path to.
 *
 * Stages 1 to 4 all ended at COURSE_URL, so the funnel ran guide -> course and
 * then simply stopped. Someone who read five emails, bought nothing, and was
 * plainly interested got no further ask, and someone who wanted it built for
 * them was never told that was an option.
 *
 * NO DATE IS WRITTEN INTO THE EMAIL. `/build-lab` renders the real date from
 * `ccc_lab_sessions`, so the link stays correct after this run sells out or
 * moves. An email that hardcodes "November 18" is wrong forever the moment the
 * cohort changes, and it would be a date this repo cannot verify.
 */
const BUILD_LAB_URL =
  'https://runyouraiboard.com/build-lab?utm_source=aixdesign.dev&utm_medium=email&utm_campaign=board-method-drip'

const DISCOVERY_CALL_URL =
  'https://calendly.com/terrysc107/15-min-ai-discovery-call'

// Downloadable PDF guide. Override with GUIDE_PDF_URL if hosted elsewhere.
export const GUIDE_PDF_URL = process.env.GUIDE_PDF_URL || `${SITE_URL}/guide.pdf`

type Email = { subject: string; html: string; text: string }

/**
 * ── The email design system ─────────────────────────────────────────────────
 *
 * TYPEFACE. The old stack was `-apple-system, Segoe UI, Roboto, Helvetica,
 * Arial, sans-serif`, which is the default-looking stack every automated email
 * on earth uses, and it reads as one.
 *
 * The fix is NOT a webfont. Gmail strips @font-face and Outlook on Windows
 * renders through Word, so a loaded font reaches a minority of opens and
 * everyone else lands on the fallback anyway. The fix is a distinctive stack
 * that is ALREADY INSTALLED.
 *
 * So: a warm transitional serif for everything that is read. Iowan Old Style
 * and Charter ship on Apple devices, Georgia is on essentially every Windows
 * machine, and all three are the same kind of face, so it degrades WITHIN a
 * look instead of falling off a cliff into Arial. Sans is kept for the eyebrow,
 * the buttons and the captions, where letterspaced uppercase reads as interface
 * rather than prose.
 *
 * SCALE. One size for everything is the other half of why the old emails looked
 * generated. Five deliberate steps below, and headlines carry negative tracking
 * the way the site's display type does.
 */
const SERIF = `'Iowan Old Style', Charter, Georgia, 'Times New Roman', serif`
const SANS = `Geist, 'Helvetica Neue', 'Segoe UI', system-ui, sans-serif`

const TYPE = {
  eyebrow: `font-family:${SANS};font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:600;`,
  h1: `font-family:${SERIF};font-size:30px;line-height:1.22;letter-spacing:-0.4px;font-weight:600;`,
  lede: `font-family:${SERIF};font-size:19px;line-height:1.5;`,
  body: `font-family:${SERIF};font-size:16px;line-height:1.65;`,
  small: `font-family:${SANS};font-size:13px;line-height:1.5;`,
} as const

/**
 * The masthead is TEXT, not an image, and deliberately so: most clients block
 * remote images until the reader allows them, and a brand whose first
 * impression is a grey broken-image box has spent its one impression. The
 * lockup is the one from BRAND-KIT: lowercase `aixdesign` with the x in gold.
 */
function masthead(): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid rgba(201,168,76,0.22);">
    <tr><td style="padding:0 0 20px;">
      <span style="font-family:${SANS};font-size:17px;font-weight:600;color:#ffffff;letter-spacing:-0.2px;">ai<span style="color:${GOLD};">x</span>design</span>
    </td></tr>
  </table>`
}

// Shared dark-luxury email shell. `footer` lets drip emails append an unsubscribe
// line; `preheader` sets the hidden inbox preview text.
function wrap(inner: string, footer?: string, preheader?: string): string {
  const preheaderHtml = preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;height:0;width:0;">${preheader}</div>`
    : ''
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${BG};font-family:${SERIF};">
    ${preheaderHtml}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;background:#23201b;border:1px solid rgba(201,168,76,0.3);">
          <tr><td style="padding:32px 34px 38px;">
            ${masthead()}
            <div style="height:26px;line-height:26px;">&nbsp;</div>
            ${inner}
          </td></tr>
        </table>
        <p style="margin:20px 0 0;color:rgba(255,255,255,0.25);${TYPE.small}">AI by Design · aixdesign.dev${footer ? `<br/>${footer}` : ''}</p>
      </td></tr>
    </table>
  </body>
</html>`
}

function goldButton(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 28px;"><tr><td style="background:${GOLD};"><a href="${href}" style="display:inline-block;padding:14px 28px;color:${BG};font-family:${SANS};font-size:13px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;font-weight:600;">${label}</a></td></tr></table>`
}

function eyebrow(text: string): string {
  return `<p style="margin:0 0 12px;color:${GOLD};${TYPE.eyebrow}">${text}</p>`
}

function h1(text: string): string {
  return `<h1 style="margin:0 0 18px;color:#ffffff;${TYPE.h1}">${text}</h1>`
}

function lede(text: string): string {
  return `<p style="margin:0 0 22px;color:rgba(255,255,255,0.78);${TYPE.lede}">${text}</p>`
}

function p(text: string): string {
  return `<p style="margin:0 0 18px;color:rgba(255,255,255,0.66);${TYPE.body}">${text}</p>`
}

/**
 * An image with a caption.
 *
 * `alt` is load-bearing rather than an accessibility afterthought: with images
 * blocked, which is the default in a lot of clients, the alt text IS what the
 * reader gets, so it says what the picture shows instead of naming the file.
 * Nothing in any of these emails depends on an image rendering.
 */
function figure(src: string, alt: string, caption?: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
    <tr><td>
      <img src="${src}" alt="${alt}" width="472" style="display:block;width:100%;max-width:472px;border:1px solid rgba(201,168,76,0.18);" />
    </td></tr>
    ${caption ? `<tr><td style="padding-top:8px;"><p style="margin:0;color:rgba(255,255,255,0.38);${TYPE.small}">${caption}</p></td></tr>` : ''}
  </table>`
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
    eyebrow('Your free guide') +
    h1('The Board Method') +
    lede(`Hey ${first(name)}, it's all yours. Seven pages, five steps.`) +
    // The actual cover of the PDF below the button, so the thing they are about
    // to download is the thing they can see.
    figure(
      `${SITE_URL}/guide-cover.png`,
      'The Board Method: the cover of the seven-page guide',
    ) +
    p("Five steps to a small board of AI employees that read your real numbers on a schedule and hand you a decision: Charter, Floor, Run, Review, Promote.") +
    goldButton(GUIDE_PDF_URL, 'Download the PDF →') +
    p(`Prefer to read it in your browser? <a href="${guideUrl}" style="color:${GOLD};text-decoration:underline;">Open the guide here</a>.`) +
    p(`Over the next few weeks I'll send ${DRIP_TOTAL} short notes, each ending on the most common way that idea fails. No fluff.`) +
    p(`And whenever you want a second set of eyes on your setup, grab a free 15-minute call:`) +
    `<p style="margin:0 0 18px;"><a href="${CALL_URL}" style="color:${GOLD};font-size:14px;text-decoration:underline;">Book a free discovery call →</a></p>` +
    p('— The AI by Design team')
  return {
    subject: 'Your guide: The Board Method',
    html: wrap(inner),
    text: `Hey ${first(name)},

Thanks for grabbing The Board Method: five steps to AI employees that start work without you.

Download the PDF: ${GUIDE_PDF_URL}
Read it online: ${guideUrl}

Over the next few days I'll send a couple of short, practical notes on putting AI to work in your business.

Book a free 15-minute discovery call: ${CALL_URL}

— The AI by Design team`,
  }
}

// ── Newsletter welcome (sent immediately on subscribe) ──────────────────────
export function newsletterWelcomeEmail(name: string | undefined, unsubscribeUrl: string): Email {
  const greeting = name && name.trim() ? `Hey ${first(name)},` : 'Hey there,'
  const inner =
    h1('You’re on the list.') +
    p(greeting) +
    p("Thanks for subscribing. Roughly once a week I'll send one short, practical note on putting AI and automation to work in a business like yours — real moves, no hype, no filler.") +
    p('Want a head start? Grab the free guide — the 10 things in your business you should never do manually:') +
    goldButton(`${SITE_URL}/guide`, 'Read the Guide →') +
    p('And whenever you want a second set of eyes on your setup, book a free 15-minute call:') +
    `<p style="margin:0 0 18px;"><a href="${CALL_URL}" style="color:${GOLD};font-size:14px;text-decoration:underline;">Book a free discovery call →</a></p>` +
    p('— The AI by Design team')
  const text = `${greeting}

Thanks for subscribing. About once a week I'll send one short, practical note on putting AI and automation to work in a business like yours — real moves, no hype.

Read the free guide: ${SITE_URL}/guide
Book a free 15-minute call: ${CALL_URL}

— The AI by Design team

Unsubscribe: ${unsubscribeUrl}`
  return {
    subject: 'You’re on the list — AI by Design',
    html: wrap(inner, unsubFooter(unsubscribeUrl)),
    text,
  }
}

// ── Internal: new subscriber notification ───────────────────────────────────
/**
 * Build Lab waitlist confirmation.
 *
 * Sent instead of the generic newsletter welcome when someone joins from
 * runyouraiboard.com/build-lab. They asked about one specific thing; opening
 * with "thanks for subscribing" would read as a bait-and-switch even though
 * they are, in fact, now subscribed. So it confirms the Lab first and mentions
 * the weekly note second — which is the honest ordering of what just happened.
 *
 * NO DATE, NO SEAT COUNT, NO COUNTDOWN. There is no scheduled run yet, and an
 * email is exactly where invented urgency would be easiest to slip in and
 * hardest to take back.
 */
export function buildLabWaitlistEmail(name: string | undefined, unsubscribeUrl: string): Email {
  const greeting = name && name.trim() ? `Hey ${first(name)},` : 'Hey there,'
  const inner =
    h1('You’re on the Build Lab list.') +
    p(greeting) +
    p(
      'The Build Lab is a live, small-group session where we build one real feature end to end — and you watch every decision, including the ones that go wrong.'
    ) +
    p(
      'There’s no date yet. That’s the honest answer: when there is one, you’ll hear before it goes anywhere else. Nothing has been charged and nothing is reserved — it’s a list, not a ticket.'
    ) +
    p(
      'In the meantime, the self-paced course covers the same workflow and is complete on its own. You don’t need the Lab to finish it:'
    ) +
    goldButton('https://runyouraiboard.com', 'See My AI Board →') +
    p(
      'You’ll also get the weekly AI by Design note — one short, practical read on putting AI to work in a business. Unsubscribe any time; it won’t affect your spot on the list.'
    ) +
    p('— The AI by Design team')
  const text = `${greeting}

You're on the Build Lab list.

The Build Lab is a live, small-group session where we build one real feature end to end — and you watch every decision, including the ones that go wrong.

There's no date yet. When there is one, you'll hear before it goes anywhere else. Nothing has been charged and nothing is reserved — it's a list, not a ticket.

In the meantime, the self-paced course covers the same workflow and is complete on its own: https://runyouraiboard.com

You'll also get the weekly AI by Design note. Unsubscribe any time; it won't affect your spot on the list.

— The AI by Design team

Unsubscribe: ${unsubscribeUrl}`
  return {
    subject: 'You’re on the Build Lab list — AI by Design',
    html: wrap(inner, unsubFooter(unsubscribeUrl), 'No date yet — you’ll hear first when there is one.'),
    text,
  }
}

export function subscriberNotifyEmail(email: string, source: string): Email {
  const subject = `New newsletter subscriber: ${email}`
  const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1E1B17;">
    <p style="margin:0 0 8px;"><strong>New newsletter subscriber</strong></p>
    <p style="margin:0;">Email: <a href="mailto:${email}">${email}</a></p>
    <p style="margin:0;">Source: ${source}</p>
  </div>`
  const text = `New newsletter subscriber\nEmail: ${email}\nSource: ${source}`
  return { subject, html, text }
}

// ── Weekly newsletter issue (sent to all active subscribers) ────────────────
function emailImage(url: string): string {
  return `<img src="${url}" width="456" alt="" style="display:block;width:100%;max-width:456px;height:auto;margin:0 0 24px;border:0;outline:none;" />`
}

export function newsletterIssueEmail(
  issue: {
    subject: string
    preheader?: string | null
    intro: string
    body: { heading: string; body: string }[]
    cta_label?: string | null
    cta_url?: string | null
    featured_post_title?: string | null
    featured_post_url?: string | null
    hero_image_url?: string | null
    inline_image_url?: string | null
  },
  name: string | undefined,
  unsubscribeUrl: string
): Email {
  const greeting = name && name.trim() ? `Hey ${first(name)},` : 'Hey there,'
  const sections = issue.body
    .map(s => h1(s.heading) + s.body.split('\n').filter(Boolean).map(p).join(''))
    .join('')
  const featured =
    issue.featured_post_url && issue.featured_post_title
      ? p(`📄 New on the blog: <a href="${issue.featured_post_url}" style="color:${GOLD};text-decoration:underline;">${issue.featured_post_title}</a>`)
      : ''
  const cta = issue.cta_url ? goldButton(issue.cta_url, issue.cta_label || 'Read more →') : ''

  const inner =
    (issue.hero_image_url ? emailImage(issue.hero_image_url) : '') +
    h1(issue.subject) +
    p(greeting) +
    issue.intro.split('\n').filter(Boolean).map(p).join('') +
    (issue.inline_image_url ? emailImage(issue.inline_image_url) : '') +
    sections +
    featured +
    cta +
    p('See you next week,<br/>— Terry, AI by Design')

  const textSections = issue.body.map(s => `${s.heading}\n${s.body}`).join('\n\n')
  const text = `${greeting}

${issue.intro}

${textSections}
${issue.featured_post_url ? `\nNew on the blog: ${issue.featured_post_title} — ${issue.featured_post_url}` : ''}
${issue.cta_url ? `\n${issue.cta_label || 'Read more'}: ${issue.cta_url}` : ''}

See you next week,
— Terry, AI by Design

Unsubscribe: ${unsubscribeUrl}`

  return {
    subject: issue.subject,
    html: wrap(inner, unsubFooter(unsubscribeUrl), issue.preheader || undefined),
    text,
  }
}

// ── Internal: newsletter issue ready to approve & send ──────────────────────
export function newsletterApprovalEmail(issue: { id: string; subject: string; approval_token: string }): Email {
  const approveUrl = `${SITE_URL}/api/newsletter/approve?token=${issue.approval_token}`
  const reviewCmd = `npx tsx --env-file=.env.local scripts/newsletter-review.ts --show ${issue.id.slice(0, 8)}`
  const subject = `📬 Newsletter ready to send: "${issue.subject}"`
  const inner =
    h1('This week’s newsletter is ready') +
    p(`The newsletter engine drafted this week’s issue:`) +
    p(`<strong>${issue.subject}</strong>`) +
    p('Preview the full issue and send a test to yourself before approving:') +
    `<pre style="margin:0 0 18px;padding:14px;background:#1E1B17;color:#C9A84C;font-size:13px;white-space:pre-wrap;border:1px solid rgba(201,168,76,0.3);">${reviewCmd}</pre>` +
    p('When it looks good, approve it and it sends to all active subscribers on the next run:') +
    goldButton(approveUrl, 'Approve & Send →') +
    p('Nothing goes out until you approve.')
  const text = `This week's newsletter is ready: "${issue.subject}"

Preview + send yourself a test:
${reviewCmd}

Approve & send to all subscribers:
${approveUrl}

Nothing goes out until you approve.

— AI by Design newsletter engine`
  return { subject, html: wrap(inner), text }
}

// ── Drip sequence (stages 1..4) ─────────────────────────────────────────────
/**
 * The illustration each stage carries.
 *
 * Stages 1 to 4 are the four ideas the guide illustrates, so each shows the
 * real board file it is about: the same rendered artifact the web guide and the
 * PDF use, because the guide's whole claim is that this is plain markdown you
 * can read. Stages 5 and 6 are the asks rather than the teaching and have no
 * honest picture, so they carry none rather than a decorative one.
 */
const DRIP_FIGURE: Record<number, { src: string; alt: string }> = {
  // NO CAPTION FIELD. These renders already have their caption baked into the
  // image, so adding one below printed it twice. The same mistake shipped in
  // the PDF and was caught on a visual pass; it is invisible in the source.
  1: { src: '/guide/01-charter.png', alt: 'A CHARTER.md file with the disposition line highlighted. Disposition is the line that decides close calls.' },
  2: { src: '/guide/02-floor.png', alt: 'A GOALS.md file showing a floor rather than a target. A floor is a number the month can fall below.' },
  3: { src: '/guide/03-run.png', alt: 'A scheduled run, and the check that notices when it stops. A run that nobody verifies is a run that can stop.' },
  4: { src: '/guide/04-review.png', alt: 'A board meeting with each claim traced to its source.' },
}

type DripDef = { subject: string; heading: string; body: string[]; cta: string; ctaUrl?: string }

/**
 * THE DRIP — four emails at days 2, 4, 7, 10 after the guide.
 *
 * REWRITTEN. The previous sequence sold speed-to-lead automation and pointed
 * every CTA at a discovery call. Two problems: it taught a different product to
 * the one we now sell, and it leaned on borrowed statistics ("21x more likely")
 * that we cannot source.
 *
 * These four teach one idea each, drawn from the guide, and each ends on the
 * single most common way that idea fails. The call stays available as the
 * secondary path for anyone who would rather talk, but the primary CTA is now
 * the course, because that is what the guide is the front of.
 *
 * `ctaUrl` is per-stage so a sequence can point somewhere other than the call.
 */
const DRIP_CONTENT: Record<number, DripDef> = {
  1: {
    subject: 'The line that decides whether your AI is useful',
    heading: 'Write the disposition line first.',
    body: [
      'You read the guide, so you know a charter is who a seat <em>is</em> rather than what you asked it this time. Five sections. The one that does almost all the work is disposition.',
      'Responsibilities tell a seat what to work on. Disposition tells it how to decide when two reasonable options conflict, which is most of the job. Weak disposition is a list of adjectives: thoughtful, strategic, detail-oriented. Those describe nobody and change nothing.',
      'Here is a real one: <strong>"Kills formats and campaigns that do not perform, including her own favourites."</strong> That last clause is the whole thing. It tells the seat that consistency with its own past recommendations is worth less than evidence, and that is a genuinely hard instruction that changes what it does.',
      'Test yours: does it name something the seat will refuse, even when it would rather not? If not, write it again.',
    ],
    cta: 'See the full method →',
  },
  2: {
    subject: 'Why your AI says everything looks fine',
    heading: 'It has nothing to measure against.',
    body: [
      'If your assistant has never flagged a problem, the usual explanation is not that it is agreeable or that the model is weak. It is that you gave it targets instead of floors.',
      'A target is a thing to reach, so it functions as a ceiling: the number where attention stops. A floor is the minimum you would accept, the number below which the month went badly. Clearing a floor is silence. Being under it is the headline.',
      'Without floors, no number can be off track, because there is no line to be under. Everything is fine because nothing is capable of being not fine.',
      'This is a ten-minute fix and it changes every report you get afterwards. Pick your one number, and write down the lowest value you would honestly accept.',
    ],
    cta: 'See the full method →',
  },
  3: {
    subject: 'The failure nobody warns you about',
    heading: 'Scheduled work dies silently.',
    body: [
      'Getting a run onto a schedule is the moment this stops being a chat window and starts being a system. It is also where the quiet failure lives.',
      'A scheduled job that stops does not error. It simply produces nothing, and nothing is indistinguishable from a quiet week. I have watched a daily run die and go unnoticed for forty days, in a system that was otherwise working perfectly.',
      'So the schedule is only half of it. The other half is a liveness check: something that notices the absence. The cheapest version is a line in your weekly review that reads "when did the last run actually happen?"',
      'Set up one run this week. Then diary a reminder to confirm it fired. The second part is the part people skip.',
    ],
    cta: 'See the full method →',
  },
  4: {
    subject: 'Four checks, under a minute',
    heading: 'How to tell a useful run from a plausible one.',
    body: [
      'Your board will produce something articulate every time. Articulate is free. The failure mode is not gibberish, it is a confident paragraph that could be about any business and quietly is not about yours.',
      'Four checks. Does every claim trace to a number in your files? Did it name what it did not have, instead of filling the gap? Is it consistent with what you already decided? Could you act on it today?',
      'The one that usually fails is the second. Left alone, an assistant asked to analyse a business with a hole in the data will produce something reasonable-sounding to fill it. It is not lying, it is completing a pattern, and a plausible number looks exactly like a real one on the page.',
      'The fix is one line in your brief: <strong>if a number you need is missing, say it is missing, do not estimate it.</strong> Three of those four failures are fixed by a sentence.',
    ],
    cta: 'Build the whole thing →',
  },
  5: {
    subject: 'The part that is hard to do alone',
    heading: 'Everyone gets stuck in the same week.',
    body: [
      'You have the five steps now. Most people who build a board get the first run working and then lose it somewhere in the second or third week, and it is almost always the same failure: the run stopped and nothing said so.',
      'That is why the live version exists. It is a four-week cohort, in a small group, and we deliberately leave a two-week gap in the middle where your board runs without you. Then we open the next session with what died. You cannot teach that in an afternoon, because the lesson takes two weeks of real time to happen to you.',
      'You work on your own business the whole way through, not a worked example. Eight seats, so there is room to stop and ask about your situation specifically.',
      'If you would rather do it yourself from the written lessons, that is a completely legitimate answer and the course is enough on its own. This is for the people who want it built with them.',
    ],
    cta: 'See how the Lab runs →',
    ctaUrl: BUILD_LAB_URL,
  },
  6: {
    subject: 'Learn it, or have it built',
    heading: 'Both are fine. They are the same system.',
    body: [
      'This is the last of these, so here is the honest summary.',
      'If you have the time and want the skill, build it yourself. The method is the whole point and you keep it. Everything in these emails is in the course, and the course is complete on its own.',
      'If what you actually need is the system running by next quarter, that is the other half of what we do. We find the one bottleneck costing you the most time, design the system that removes it, and build it with you. You get a working board wired to your real data and documentation your team can maintain.',
      'Deciding the build is not the best use of your time is not a failed attempt at learning it. It is a reasonable read of what your weeks look like. The call is free either way and there is nothing to prepare.',
    ],
    cta: 'Book a discovery call →',
    ctaUrl: DISCOVERY_CALL_URL,
  },
}

export function dripEmail(stage: number, name: string, unsubscribeUrl: string): Email {
  const def = DRIP_CONTENT[stage]
  if (!def) throw new Error(`No drip content for stage ${stage}`)
  const fig = DRIP_FIGURE[stage]
  const inner =
    eyebrow(`The Board Method · ${stage} of ${DRIP_TOTAL}`) +
    h1(def.heading) +
    lede(`Hey ${first(name)},`) +
    def.body.slice(0, 1).map(p).join('') +
    (fig ? figure(`${SITE_URL}${fig.src}`, fig.alt) : '') +
    def.body.slice(1).map(p).join('') +
    goldButton(def.ctaUrl ?? COURSE_URL, def.cta) +
    p('— The AI by Design team')
  const text = `Hey ${first(name)},

${def.body.map(b => b.replace(/<[^>]+>/g, '')).join('\n\n')}

${def.cta} ${def.ctaUrl ?? COURSE_URL}

— The AI by Design team

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
    <p style="margin:16px 0 0;color:#666;">Captured from the AI by Design lead magnet form. They’ve entered the nurture sequence.</p>
  </div>`
  const text = `New lead\nName: ${name}\nEmail: ${email}\n\nCaptured from the AI by Design lead magnet form.`
  return { subject, html, text }
}

// ── Internal: content drafts ready to review ────────────────────────────────
export function contentDraftsReadyEmail(count: number, lane: string): Email {
  const subject = `✍️ ${count} new ${lane} post draft${count === 1 ? '' : 's'} ready to review`
  const cmd = `npx tsx --env-file=.env.local scripts/content-review.ts --list`
  const inner =
    h1(`${count} new draft${count === 1 ? '' : 's'} in the queue`) +
    p(`The content engine topped up the <strong>${lane}</strong> lane with ${count} fresh LinkedIn draft${count === 1 ? '' : 's'}.`) +
    p('Review, edit, and approve them — nothing publishes until you approve:') +
    `<pre style="margin:0 0 18px;padding:14px;background:#1E1B17;color:#C9A84C;font-size:13px;white-space:pre-wrap;border:1px solid rgba(201,168,76,0.3);">${cmd}</pre>` +
    p('Approved posts get scheduled to LinkedIn automatically on the next publish run.')
  const text = `${count} new ${lane} post draft(s) are ready to review.

Review and approve (nothing publishes until you approve):
${cmd}

Approved posts schedule to LinkedIn automatically.

— AI by Design content engine`
  return { subject, html: wrap(inner), text }
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
    p('— Terry, AI by Design')
  const text = `Hey ${first(name)},

You're booked — thank you. To make our call count, please complete this short intake so I can review your setup and arrive with a plan already half-built.

It takes about 2 minutes: ${intakeUrl}

Fill it out any time before our call — the sooner, the better.

— Terry, AI by Design`
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
    p('— Terry, AI by Design')
  const text = `Hey ${first(name)},

${def.body.join('\n\n')}

${intakeUrl}

— Terry, AI by Design`
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
