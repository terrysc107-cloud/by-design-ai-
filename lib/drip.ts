// Drip nurture sequence configuration.
//
// drip_stage on a lead = number of drip emails already sent (0..N).
// Day offsets are measured from the lead's signup (created_at). The guide
// itself is sent immediately at signup and is NOT counted as a drip stage.
//
// Stage 1 -> day 2, Stage 2 -> day 4, Stage 3 -> day 7, Stage 4 -> day 10.
export const DRIP_DAY_OFFSETS = [2, 4, 7, 10] as const

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
