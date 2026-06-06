import { getOpenAI, OPENAI_MODEL } from './openai'

// Shape of an intake submission. All optional except the route enforces name/email.
export interface IntakeSubmission {
  name?: string
  email?: string
  company?: string
  website?: string
  industry?: string
  years_in_business?: string
  team_size?: string
  role?: string
  current_tools?: string
  whats_automated?: string
  whats_manual?: string
  tech_stack?: string
  staff_responsibilities?: string
  biggest_time_sink?: string
  ai_usage?: string
  ai_comfort?: string
  ai_concerns?: string
  goals_90d?: string
  biggest_bottleneck?: string
  budget_range?: string
  anything_else?: string
}

// Human-readable labels for each field, used to build the prompt context.
const FIELD_LABELS: Array<[keyof IntakeSubmission, string]> = [
  ['company', 'Company'],
  ['website', 'Website'],
  ['industry', 'Industry'],
  ['years_in_business', 'Years in business'],
  ['team_size', 'Team size'],
  ['role', 'Submitter role'],
  ['current_tools', 'Current tools / CRM'],
  ['whats_automated', 'Already automated'],
  ['whats_manual', 'Still done manually'],
  ['tech_stack', 'Tech stack'],
  ['staff_responsibilities', 'Staff & responsibilities'],
  ['biggest_time_sink', 'Biggest time sink'],
  ['ai_usage', 'Current AI usage'],
  ['ai_comfort', 'AI comfort level'],
  ['ai_concerns', 'AI concerns'],
  ['goals_90d', 'Top goals (90 days)'],
  ['biggest_bottleneck', 'Biggest bottleneck'],
  ['budget_range', 'Budget range'],
  ['anything_else', 'Anything else'],
]

const SYSTEM_PROMPT = `You are a senior consultant for AI by Design, an AI business coaching & consulting agency that diagnoses the real bottleneck, designs the right system, and ships a lean, autonomous custom solution. We are tool-agnostic — we use whatever fits (OpenAI/Claude, Make.com, n8n, Zapier, GHL, Supabase, custom code) and never lead with a tool name. A prospect has booked a discovery call and filled out an intake form about their business.

Your job: read their answers and produce a sharp, preliminary plan the consultant can bring to the call already half-built. Be concrete and specific to THIS business — never generic. If information is missing, note the key gaps to clarify on the call rather than guessing.

Output in this exact structure, using plain text with these section headers (no markdown bold, no asterisks):

QUICK WINS
- 3 specific automations to build first, each one line, highest ROI / lowest effort first. Tie each to something they actually said.

SUGGESTED STACK
- The tools/integrations you'd recommend (GHL, Make.com, n8n, Zapier, OpenAI, Twilio, Stripe, webhooks, etc.), matched to their current setup.

BIGGEST RISK / BOTTLENECK
- The single thing most likely to block results, and how to de-risk it.

QUESTIONS FOR THE CALL
- 3 to 5 pointed questions that close the biggest information gaps.

Keep the whole thing tight and skimmable — the consultant should be able to read it in under a minute.`

export async function reviewIntake(submission: IntakeSubmission): Promise<string> {
  const lines = FIELD_LABELS
    .map(([key, label]) => {
      const v = submission[key]
      return v && v.trim() ? `${label}: ${v.trim()}` : null
    })
    .filter(Boolean)
    .join('\n')

  const context = lines || '(The prospect left most fields blank.)'

  const completion = await getOpenAI().chat.completions.create({
    model: OPENAI_MODEL,
    temperature: 0.4,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Business: ${submission.company || submission.name || 'Unknown'}\n\nIntake answers:\n${context}`,
      },
    ],
  })

  return completion.choices[0]?.message?.content?.trim() || 'No recommendations generated.'
}
