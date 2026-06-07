import { getOpenAI, OPENAI_MODEL } from './openai'

/**
 * Content engine — generates on-brand LinkedIn posts for a given audience
 * "lane" (e.g. medical), in the AI by Design voice, across the four content
 * pillars from docs/BRAND-KIT.md §9.
 *
 * The business is general (AI automation for any industry); each lane is just
 * a marketing message aimed at one persona. Add a new lane by adding an entry
 * to LANES below — no other change required.
 *
 * Used by both scripts/generate-content.ts (CLI) and the
 * /api/cron/content-generate route (weekly top-up).
 */

export type Pillar = 'teardown' | 'build_in_public' | 'primitive' | 'proof'

export const PILLARS: Pillar[] = ['teardown', 'build_in_public', 'primitive', 'proof']

export interface GeneratedPost {
  pillar: Pillar
  content: string
}

export interface GenerateOptions {
  /** audience lane, e.g. 'medical'. Defaults to 'medical'. */
  lane?: string
  /** restrict the whole batch to a single pillar; omit to mix per the brand ratio */
  pillar?: Pillar
  /** how many posts to generate. Defaults to 6 (one brand week). */
  count?: number
}

// BRAND-KIT §9 weekly ratio: 2 teardown · 1 build-in-public · 2 primitive · 1 proof.
const PILLAR_RATIO: Pillar[] = [
  'teardown',
  'primitive',
  'teardown',
  'build_in_public',
  'primitive',
  'proof',
]

const PILLAR_BRIEFS: Record<Pillar, string> = {
  teardown:
    'BOTTLENECK TEARDOWN — name a specific manual workflow this persona runs by hand, show what it quietly costs them (hours/week, missed follow-ups, dropped balls), then describe the lean automated system that fixes it. Concrete, not generic.',
  build_in_public:
    'BUILD IN PUBLIC — narrate building/shipping one small automation as if showing the work: the trigger, the steps, the tool you reached for and WHY. Make the reader feel they could picture it running.',
  primitive:
    'PRIMITIVE — a steal-this reusable pattern, prompt, or 3-step recipe the reader can apply today. Give real, usable substance, not a teaser.',
  proof:
    'PROOF & PRINCIPLES — the operating-system thinking behind lean, autonomous work: a principle, a before/after, a mindset shift. No fabricated client results or numbers we cannot show.',
}

interface Lane {
  label: string
  persona: string
  /** bare landing URL the CTA should point to (publisher adds UTM params) */
  url: string
}

const LANES: Record<string, Lane> = {
  medical: {
    label: 'medical-industry solo operators',
    url: 'aixdesign.dev/medical',
    persona: `The reader is a SOLO operator in or around the medical/healthcare industry — an independent surgical-instrument or device sales rep, a clinical consultant, a sterile-processing or surgical-tech instructor, or a hospital/clinic admin running their own hustle on the side. Profile:
- Runs nearly everything by hand: follow-up texts/emails after every account visit, CRM updates, scheduling, invoicing, lead lists, prepping training materials, chasing no-shows.
- Has little to no web presence — maybe a LinkedIn profile and a phone, no real website or systems.
- Is great at the medical work, not at tech. Time-poor, skeptical of hype, allergic to jargon.
- Does NOT think of themselves as someone who "needs AI." They think "I'm drowning in busywork."
Speak to that specific person and their specific medical-world tasks. Reference real medical-solo scenarios (post-op accounts, OR schedules, in-service training, device demos, hospital procurement contacts) — never generic "business owner" filler.`,
  },
}

function resolveLane(lane?: string): Lane {
  return LANES[lane ?? 'medical'] ?? LANES.medical
}

/** Pick the pillar mix for a batch of `count` posts. */
function pillarPlan(count: number, fixed?: Pillar): Pillar[] {
  if (fixed) return Array.from({ length: count }, () => fixed)
  return Array.from({ length: count }, (_, i) => PILLAR_RATIO[i % PILLAR_RATIO.length])
}

function buildSystemPrompt(lane: Lane): string {
  return `You are the content engine for AI by Design (aixdesign.dev), an AI business coaching & consulting agency. You write LinkedIn posts that make ONE specific person stop scrolling and recognize themselves.

THE OFFER (what every post is ultimately selling): Done-For-You. We diagnose the bottleneck, design the system, and BUILD it for them — they don't have to learn anything or touch a tool. The goal of every post is a booked free discovery call.

WHO YOU ARE WRITING TO:
${lane.persona}

VOICE (non-negotiable):
- Direct, not corporate. Short sentences. No fluff.
- Builder, not guru. Show the work, not motivation.
- Calm authority. You've seen the broken setup before; you're not impressed by complexity, you're impressed by what runs without them.
- Generous. The post itself should be useful even if they never hire us.

HARD RULES:
- NEVER use these words: synergy, cutting-edge, revolutionary, disruptive, leverage, "AI-powered", ninja, rockstar, guru, "let's hop on a call".
- NEVER claim a specific client result, percentage, or testimonial we cannot prove. Speak from the operator's own lived experience instead ("I used to...").
- No emoji spam. At most one tasteful emoji, usually none.
- LinkedIn format: a strong one-line hook, short punchy paragraphs / line breaks, easy to skim on a phone.
- End EVERY post with a call to action — either soft ("Free guide → ${lane.url}") or hard ("Book a free discovery call → ${lane.url}"). When you include a link, use the bare URL exactly "${lane.url}" with NO http:// and NO query string (tracking is added later).
- Add 3–5 relevant hashtags on the final line (e.g. #aiforbusiness #aiautomation #healthcare #medicaldevicesales #solopreneur). Tailor a couple to the medical world.
- Each post: roughly 90–200 words. Self-contained.

Return ONLY valid JSON, no prose around it.`
}

function buildUserPrompt(lane: Lane, plan: Pillar[]): string {
  const lines = plan
    .map((pillar, i) => `${i + 1}. [${pillar}] ${PILLAR_BRIEFS[pillar]}`)
    .join('\n')
  return `Write ${plan.length} distinct LinkedIn posts for the "${lane.label}" lane. Each post below is assigned a pillar — follow its brief. Vary the hooks and angles so the batch doesn't feel repetitive.

${lines}

Return JSON in exactly this shape:
{
  "posts": [
    { "pillar": "<one of: teardown | build_in_public | primitive | proof>", "content": "<the full post text, with line breaks as \\n>" }
  ]
}
The "posts" array must have exactly ${plan.length} items, in the same order and with the same pillar as listed above.`
}

/**
 * Generate a batch of posts. Calls OpenAI and returns parsed, validated posts.
 * Throws if OPENAI_API_KEY is missing or the model returns unusable output.
 */
export async function generatePosts(opts: GenerateOptions = {}): Promise<GeneratedPost[]> {
  const lane = resolveLane(opts.lane)
  const count = Math.max(1, Math.min(opts.count ?? 6, 20))
  const plan = pillarPlan(count, opts.pillar)

  const completion = await getOpenAI().chat.completions.create({
    model: OPENAI_MODEL,
    temperature: 0.8,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: buildSystemPrompt(lane) },
      { role: 'user', content: buildUserPrompt(lane, plan) },
    ],
  })

  const raw = completion.choices[0]?.message?.content?.trim()
  if (!raw) throw new Error('Content engine returned an empty response.')

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error('Content engine returned invalid JSON.')
  }

  const postsRaw = (parsed as { posts?: unknown }).posts
  if (!Array.isArray(postsRaw)) {
    throw new Error('Content engine response missing a "posts" array.')
  }

  const posts: GeneratedPost[] = []
  postsRaw.forEach((p, i) => {
    const content = typeof (p as GeneratedPost)?.content === 'string' ? (p as GeneratedPost).content.trim() : ''
    const pillarVal = (p as GeneratedPost)?.pillar
    const pillar: Pillar = PILLARS.includes(pillarVal) ? pillarVal : plan[i] ?? 'teardown'
    if (content) posts.push({ pillar, content })
  })

  if (posts.length === 0) throw new Error('Content engine produced no usable posts.')
  return posts
}

/** Expose lane metadata (used by the publisher for cadence / labels). */
export function getLane(lane?: string): Lane {
  return resolveLane(lane)
}

const NEWSLETTER_URL = 'aixdesign.dev/newsletter'

/**
 * Write a short social post that promotes a specific newsletter issue and drives
 * sign-ups. Used when a new issue is generated — drafted into the content queue
 * so it flows through the same human-approval + Postiz publish path.
 *
 * Returns the post text (bare ${NEWSLETTER_URL}, no http/UTM — added at publish).
 */
export async function generateNewsletterPromo(
  issue: { subject: string; topic: string },
  platform: 'linkedin' | 'instagram' = 'linkedin'
): Promise<string> {
  const lane = resolveLane('medical')
  const isIG = platform === 'instagram'
  const system =
    buildSystemPrompt(lane) +
    `\n\nFor THIS task you are NOT writing a teaching post — you are writing a short ${isIG ? 'Instagram caption' : 'LinkedIn post'} that promotes this week's free newsletter and gets people to subscribe. Tease the value of the issue, make them feel they'd miss something useful, and point them to the newsletter. Keep it ${isIG ? '60–120' : '70–150'} words.`
  const user = `This week's newsletter issue:
SUBJECT: ${issue.subject}
WHAT IT COVERS: ${issue.topic}

Write one ${isIG ? 'Instagram caption' : 'LinkedIn post'} that gets the reader to subscribe to the free weekly newsletter. End with a clear CTA to subscribe using the bare URL exactly "${NEWSLETTER_URL}" (no http://, no query string). Add 3–5 relevant hashtags on the final line.

Return JSON: { "content": "<the full post text, \\n for line breaks>" }`

  const completion = await getOpenAI().chat.completions.create({
    model: OPENAI_MODEL,
    temperature: 0.8,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  })
  const raw = completion.choices[0]?.message?.content?.trim()
  if (!raw) throw new Error('Promo generator returned an empty response.')
  let parsed: { content?: unknown }
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error('Promo generator returned invalid JSON.')
  }
  const content = typeof parsed.content === 'string' ? parsed.content.trim() : ''
  if (!content) throw new Error('Promo generator produced no usable content.')
  return content
}
