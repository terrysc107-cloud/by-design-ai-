/**
 * Small monochrome line icons for the /voice-agent use-case cards.
 * No icon library is installed (see docs/features/voice-agent-waitlist.md
 * scope) — these are inline, single-color, currentColor-stroked SVGs sized
 * to sit inside the existing gold/white palette. Keep additions here simple
 * (single path/shape set, one stroke width) rather than pulling in a set.
 */

interface IconProps {
  className?: string
}

const BASE_PROPS = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/** Customer service — phone handset. */
export function PhoneIcon({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className} aria-hidden="true">
      <path d="M5.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 3.5 6.2 2 2 0 0 1 5.5 4Z" />
    </svg>
  )
}

/** Voicemail replacement — message envelope. */
export function VoicemailIcon({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className} aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="m4 6.5 8 6 8-6" />
    </svg>
  )
}

/** After-hours coverage — clock and moon. */
export function ClockIcon({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  )
}

/** Restaurants / order-taking — receipt. */
export function ReceiptIcon({ className = 'h-6 w-6' }: IconProps) {
  return (
    <svg {...BASE_PROPS} className={className} aria-hidden="true">
      <path d="M6 3.5h12v17l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5-2 1.5v-17Z" />
      <path d="M8.5 8h7M8.5 11.5h7M8.5 15h4.5" />
    </svg>
  )
}
