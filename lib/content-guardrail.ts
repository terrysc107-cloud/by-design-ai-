/**
 * Claim gate for generated social copy.
 *
 * WHY THIS EXISTS. The course platform fails its own build on income promises,
 * speed multipliers, invented student counts, urgency theatre and implied
 * Anthropic affiliation. That linter was written because V1 of the course
 * shipped three testimonials from students who did not exist and a module
 * promising income. Marketing copy that makes a claim the product itself
 * refuses to make is the same defect one repo upstream, and it is the copy that
 * gets screenshotted.
 *
 * This is the aixdesign.dev equivalent, ported from `scripts/check-content.mjs`
 * in the course repo and the `guardrail.mjs` gate in the ATS shorts pipeline.
 * It runs on MODEL OUTPUT, which is the difference that matters: lesson prose is
 * written by a person and reviewed, whereas these posts are generated on a cron
 * and, once channels are connected, published on another cron. Nobody reads
 * them in between. The gate is the review.
 *
 * WHAT IT DOES NOT DO: judge whether a post is any good. It only refuses claims
 * we cannot substantiate. A boring post passes. A brilliant post that invents a
 * statistic does not.
 */

export interface GuardrailViolation {
  /** The offending text, trimmed. */
  match: string
  /** Why it is refused, in a sentence a human can act on. */
  why: string
}

export interface GuardrailResult {
  ok: boolean
  violations: GuardrailViolation[]
}

interface Rule {
  re: RegExp
  why: string
}

const RULES: Rule[] = [
  // ── Outcome and income claims ──────────────────────────────────────────────
  {
    re: /\b\d+\s*[x×]\s*(faster|more|output|productive|leverage)/gi,
    why: "Speed multiplier. Unverifiable, and the central dishonesty of the course's first version.",
  },
  {
    re: /\b(10x|10×)\s*(developer|engineer|dev|operator|founder)\b/gi,
    why: '"10x" framing.',
  },
  {
    re: /\b(guarantees?|guaranteed)\s+(income|earnings|results?|outcomes?|success)\b|\bwe\s+guarantee\b/gi,
    why: 'Outcome guarantee. Legally exposed and unsupportable.',
  },
  {
    re: /\b(make|earn|add)\s+\$[\d,]+(\s*(\/|per\s+)?(mo|month|week|day|year))?\b|\breplaces?\s+(your|their)\s+(salary|income|job|day\s?job)\b|\bquit\s+(your|their)\s+job\b|\$[\d,]+k?\s+months?\b/gi,
    why: 'Income promise. We sell a system and the work, never a result.',
  },
  {
    re: /\bpays? for itself\b|\bROI in \d+/gi,
    why: 'Payback claim. There is no data behind it.',
  },
  {
    // Either order: "build it in a weekend" and "in a weekend you can build it".
    re: /\b(build|ship|launch|automate|set\s?up)\b[\s\S]{0,60}?\b(in|over)\s+(a|one|a single)\s+(weekend|afternoon|evening|hour|day)\b|\b(in|over)\s+(a|one|a single)\s+(weekend|afternoon|evening|hour|day)\b[\s\S]{0,60}?\b(build|ship|launch|automate)/gi,
    why: 'Timeline promise. How far someone gets depends on what they bring.',
  },

  // ── Fabricated proof ───────────────────────────────────────────────────────
  {
    re: /\b\d{1,3}(,\d{3})*\+?\s+(students|customers|clients|founders|operators|owners|people|businesses|teams)\b(?=[\s\S]{0,30}?\b(have|already|enrolled|joined|trust|use|run|built)\b)/gi,
    why: 'Headcount claim. There is no verifiable number, so there is no number.',
  },
  {
    re: /\b(join|trusted by|used by)\s+\d{2,}(,\d{3})*\+?\s+(students|customers|clients|founders|operators|owners|people|teams|businesses)/gi,
    why: 'Social proof by headcount. Unverifiable.',
  },
  {
    re: /\b(one of my clients|a client of mine|we helped .{0,40}\b(increase|save|grow|cut|double))/gi,
    why: 'Case-study claim. No client result may be published without permission and a real number.',
  },

  // ── Vendor affiliation ─────────────────────────────────────────────────────
  {
    re: /\b(endorsed|certified|approved|affiliated|partnered)\s+by\s+(anthropic|openai)|official\s+(anthropic|openai)\s+(course|class|training|partner|product|curriculum)|in\s+partnership\s+with\s+(anthropic|openai)/gi,
    why: 'Implies vendor affiliation. These are independent products.',
  },

  // ── Manufactured scarcity ──────────────────────────────────────────────────
  // Real scarcity is allowed and wanted. The Build Lab is a live session with a
  // genuine seat cap. What is banned is a number or a date nothing can back:
  // seats come from ccc_lab_sessions.capacity minus real registrations, and the
  // date comes from starts_at. A cron-generated post can reach neither, so in
  // this file both are simply refused.
  {
    re: /\b(only|just)\s+\d+\s+(seats?|spots?|places?|tickets?)\s+(left|remaining|available)/gi,
    why: 'Seat count. Real counts come from the database, and this pipeline cannot read it.',
  },
  {
    re: /\b\d+\s+(seats?|spots?)\s+(left|remaining)\b/gi,
    why: 'Seat count. Must be computed from real registrations.',
  },
  {
    re: /\b(last chance|doors close|closes (tonight|today|tomorrow)|ends (tonight|today|tomorrow)|act now|hurry|don'?t miss out|final hours?|limited time)\b/gi,
    why: "Urgency theatre. If the deadline is real it comes from starts_at; if it is not, it is manufactured.",
  },
  {
    re: /\b(starts|kicks off|begins|runs)\s+(on\s+)?(january|february|march|april|may|june|july|august|september|october|november|december|mon|tues|wednes|thurs|fri|satur|sun)\w*\b/gi,
    why: 'A date for a live session. The Build Lab has no date until BUILD_LAB.status flips to scheduled in the course repo.',
  },

  // ── Voice rules from BRAND-KIT ------------------------------------------
  {
    re: /\b(synergy|cutting-edge|revolutionary|disruptive|game-chang\w+|ninja|rockstar|guru|paradigm shift)\b/gi,
    why: 'Banned word list in docs/BRAND-KIT.md.',
  },
  {
    re: /let'?s hop on a call/gi,
    why: 'Banned phrase in docs/BRAND-KIT.md.',
  },
]

/**
 * Lines that are ABOUT a banned pattern rather than committing it.
 *
 * The board lane's whole pitch is that this is not a get-rich scheme, so a post
 * saying "this will not replace your salary" or "nobody guarantees results" is
 * doing exactly the right thing and must not be blocked by the rule that exists
 * to stop the opposite claim. Negation is the common thread.
 */
const NEGATION =
  /\b(not|never|no|isn'?t|aren'?t|won'?t|will not|cannot|can'?t|without|stop|nobody|anyone who promises|unlike|instead of|rather than|forget the|there is no|do not)\b/i

/** Cross-brand leaks. Posting one business's content on another's channel. */
const CROSS_BRAND: Rule[] = [
  {
    re: /\b(SPD Cert Prep|spdcertprep|CRCST|sterile processing|Aseptic Technical Solutions)\b/gi,
    why: "Cross-brand leak. These belong to Terry's SPD and ATS channels, never to AI by Design.",
  },
]

/**
 * Check one post. Returns every violation rather than the first, so a rewrite
 * can fix them in a single pass instead of discovering them one cron at a time.
 *
 * @param content The post body as it would be published.
 * @param opts.lane Lane id; only used to report context.
 */
export function checkPost(content: string): GuardrailResult {
  const violations: GuardrailViolation[] = []
  const lines = content.split('\n')

  for (const { re, why } of [...RULES, ...CROSS_BRAND]) {
    // matchAll needs the global flag, which every rule above carries.
    for (const m of content.matchAll(re)) {
      const lineIndex = content.slice(0, m.index).split('\n').length - 1
      const lineText = lines[lineIndex] ?? ''
      // A line disclaiming the claim is the opposite of making it.
      if (NEGATION.test(lineText)) continue
      violations.push({ match: m[0].trim(), why })
    }
  }

  return { ok: violations.length === 0, violations }
}

/** Convenience: partition a batch into what may ship and what may not. */
export function filterPosts<T extends { content: string }>(
  posts: T[]
): { passed: T[]; blocked: Array<{ post: T; violations: GuardrailViolation[] }> } {
  const passed: T[] = []
  const blocked: Array<{ post: T; violations: GuardrailViolation[] }> = []
  for (const post of posts) {
    const result = checkPost(post.content)
    if (result.ok) passed.push(post)
    else blocked.push({ post, violations: result.violations })
  }
  return { passed, blocked }
}
