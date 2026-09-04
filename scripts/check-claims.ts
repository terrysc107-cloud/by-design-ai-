/**
 * Test for the claim gate in lib/content-guardrail.ts.
 *
 * A truth linter with no test is how the course repo got into trouble in the
 * first place: the no-invented-dates rule was documented in two places and
 * enforced by nothing, which is the same as not existing. Three of the rules
 * below were written, looked correct, and silently matched nothing until this
 * file caught them ("replaces your salary" vs "replace your salary", "400
 * founders who already run" vs a required adjacent verb, and "build it in a
 * weekend" vs a pattern that only matched the reverse word order).
 *
 * The GOOD cases matter as much as the BAD ones. The board lane's honest pitch
 * says out loud that this will not replace your salary and that nobody
 * guarantees an outcome, so a gate that blocks the disclaimer along with the
 * claim would quietly force the copy to stop being honest.
 *
 *   npm run check:claims
 */

import { checkPost } from '../lib/content-guardrail'

const BAD: [string, string][] = [
  ['speed', 'Ship 10x faster with an AI board.'],
  ['income', 'My board helped me make $12,000 last month.'],
  ['income2', 'This replaces your salary in 90 days.'],
  ['headcount', 'Join 400 founders who already run a board.'],
  ['guarantee', 'We guarantee results or your money back.'],
  ['affiliation', 'An official Anthropic course from AI by Design.'],
  ['seats', 'Only 3 seats left for the Build Lab.'],
  ['urgency', 'Last chance. Doors close tonight.'],
  ['date', 'The Build Lab starts Monday. Grab a spot.'],
  ['banned-word', 'A revolutionary, cutting-edge approach to synergy.'],
  ['cross-brand', 'The same system I use to run SPD Cert Prep.'],
  ['weekend', 'Build the whole thing in a weekend.'],
  ['casestudy', 'One of my clients increased revenue by a third.'],
]

const GOOD: [string, string][] = [
  ['plain', 'Your AI says everything looks fine. Every week.\nThat is almost never agreeableness. You gave it targets instead of floors, so nothing can be off track.\nrunyouraiboard.com'],
  ['negated-income', 'This will not replace your salary. It is a system, and what you do with it is on you.'],
  ['negated-guarantee', 'Nobody guarantees results here. Anyone who promises you an outcome is selling something else.'],
  ['negated-affiliation', 'Independent educational product. Not affiliated with or endorsed by Anthropic.'],
  ['real-scarcity-free', 'No date is set yet. The waitlist costs nothing and holds nothing.'],
]

let fails = 0
for (const [name, text] of BAD) {
  const r = checkPost(text)
  if (r.ok) { console.log(`MISS  ${name}: should have been blocked`); fails++ }
  else console.log(`block ${name}: "${r.violations[0].match}"`)
}
console.log('')
for (const [name, text] of GOOD) {
  const r = checkPost(text)
  if (!r.ok) { console.log(`FALSE+ ${name}: "${r.violations[0].match}" ${r.violations[0].why}`); fails++ }
  else console.log(`pass  ${name}`)
}
console.log(`\n${fails === 0 ? 'ALL OK' : fails + ' FAILURES'}`)
if (fails > 0) process.exit(1)
