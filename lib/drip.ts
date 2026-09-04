// Drip nurture sequence configuration.
//
// drip_stage on a lead = number of drip emails already sent (0..N).
// Day offsets are measured from the lead's signup (created_at). The guide
// itself is sent immediately at signup and is NOT counted as a drip stage.
//
// Stage 1 -> day 2, Stage 2 -> day 4, Stage 3 -> day 7, Stage 4 -> day 10,
// Stage 5 -> day 14, Stage 6 -> day 21.
//
// EXTENDED to six. The sequence used to end at stage 4, and every one of those
// four ended at the course. So the funnel ran guide -> course and then stopped:
// a reader who was plainly interested but had not bought got no further ask,
// and a reader who wanted the thing built for them was never told that was an
// option at all.
//
// Stage 5 is the Build Lab and stage 6 is the fork, learn it or have it built.
// They sit at day 14 and 21 rather than tighter, because the first four are the
// method and these two are the ask, and stacking the ask on top of the teaching
// is what makes a nurture sequence feel like a pitch.
export const DRIP_DAY_OFFSETS = [2, 4, 7, 10, 14, 21] as const

export const DRIP_TOTAL = DRIP_DAY_OFFSETS.length

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Given how many drip emails have been sent so far, return the Date the next
 * one is due (relative to signup), or null if the sequence is complete.
 */
export function nextDripDate(createdAt: Date, sentCount: number): Date | null {
  if (sentCount >= DRIP_TOTAL) return null
  const offsetDays = DRIP_DAY_OFFSETS[sentCount]
  return new Date(createdAt.getTime() + offsetDays * DAY_MS)
}
