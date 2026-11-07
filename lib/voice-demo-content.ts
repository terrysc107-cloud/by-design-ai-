import type { OwnerOutput, Vertical } from './voice-demo'

/**
 * All persuasive copy for /voice-agent lives here so tests can run every
 * string through the claims guardrail and the no-em-dash rule.
 *
 * Fictional business identities belong to the voice service's profiles; the
 * page describes each vertical generically so the two cannot drift.
 */

export const VOICE_DEMO_HERO = {
  eyebrow: 'AIxDesign Call Voice Assistant',
  headline: 'Call your future AI receptionist.',
  subhead: 'Pick a towing, repair, or detailing shop. Call the demo line. See the lead your team would get.',
  primaryCta: 'Try the phone demo',
  secondaryCta: 'See the owner view',
}

export const VOICE_DEMO_PROMISE = {
  headline: 'Never let an unanswered business call become an unworked lead.',
  body: 'When you are under a car, on a tow, or with a customer, the phone still rings. The receptionist answers, asks the questions you would ask, and hands you a clean lead.',
}

export interface VerticalCard {
  vertical: Vertical
  label: string
  scenario: string
  asks: string[]
}

export const VERTICAL_CARDS: VerticalCard[] = [
  {
    vertical: 'towing',
    label: 'Towing',
    scenario: 'You are on the shoulder with a flat tire and need a tow to a shop.',
    asks: ['Are you somewhere safe?', 'Where is the vehicle, and is it blocking traffic?', 'Year, make, and model', 'Where should it go?'],
  },
  {
    vertical: 'mechanic',
    label: 'Auto repair',
    scenario: 'Your check-engine light came on and the car is running rough.',
    asks: ['Year, make, model, and mileage', 'Symptoms and warning lights', 'Does it start and drive safely?', 'When could you drop it off?'],
  },
  {
    vertical: 'auto_detailing',
    label: 'Auto detailing',
    scenario: 'Your SUV needs a full interior detail after a road trip with the dog.',
    asks: ['Vehicle type and size', 'Interior, exterior, or full detail', 'Stains, odor, or pet hair', 'Mobile service or at the shop?'],
  },
]

export const VOICE_DEMO_DISCLOSURE =
  'This is a demonstration. You will talk to an AI receptionist, not a person. The call is transcribed so the owner summary can be written; audio is not stored. Everything is simulated: no real tow, repair, appointment, estimate, or payment is created. If you are in danger, hang up and call 911.'

export const VOICE_DEMO_DISCLOSURE_ACK = 'I understand this call is with an AI, is transcribed, and is a simulation.'

export const VOICE_DEMO_EXPECTATION = 'Plan on about 90 seconds. Enter your six-digit code when the line asks for it.'

export const VOICE_DEMO_STATUS_COPY = {
  awaiting_call: 'Waiting for your call. Keep this page open; your results appear here after you hang up.',
  in_call: 'Call in progress. The receptionist is taking the details.',
  completed: 'Call complete. Here is what the owner would receive.',
  expired: 'This demo code expired. Get a new one to try again.',
  failed: 'The call ended before a summary was ready. Get a new code and try again.',
} as const

export const VOICE_DEMO_UNAVAILABLE =
  'The live demo line is not open right now. Book a 15-minute call and we will run the demo with you.'

export const SAMPLE_OWNER_OUTPUT: OwnerOutput = {
  vertical: 'towing',
  need: 'Tow after a flat tire',
  urgency: 'urgent',
  service_requested: 'Tow to a repair shop',
  preferred_timing: 'As soon as possible',
  missing_information: ['Exact mile marker', 'Wheel lock key on hand?'],
  summary:
    'Caller is on the right shoulder of a highway on-ramp with a flat front tire. 2019 Honda Civic, not blocking traffic, keys with the driver. Wants a tow to a shop near home.',
  recommended_action: 'Call back within five minutes to confirm the location and quote from your rate sheet.',
  example_notification: 'New towing lead: 2019 Civic, flat tire, on-ramp shoulder. Wants a tow now. Call back to confirm location.',
}

export const VOICE_DEMO_CUSTOMIZATION = {
  headline: 'Your version would know your shop.',
  items: [
    'Your services, and the jobs you turn down',
    'Your service area and hours',
    'Your price ranges, and when to say a person will confirm',
    'Which calls are urgent, and who hears about them first',
    'Your business name, greeting, and tone',
    'Where each lead goes, and who follows up',
  ],
}

// The managed offer and its gated pricing live in the separate offer module (server components only).

export const VOICE_DEMO_FAQ: { q: string; a: string }[] = [
  {
    q: 'Will callers know they are talking to AI?',
    a: 'Yes. The demo says so before anything else, and every receptionist we deploy discloses AI in its greeting.',
  },
  {
    q: 'What happens when it does not know something?',
    a: 'It says so, collects the details, and flags the call for a person. It does not guess at prices, diagnoses, or arrival times.',
  },
  {
    q: 'What about emergencies?',
    a: 'If a caller describes danger, the receptionist tells them to call 911 first. Urgent calls are flagged so your team sees them before anything else.',
  },
  {
    q: 'Can it book appointments or dispatch a truck?',
    a: 'Not on its own. It captures a preferred time and hands the request to your team to confirm. Calendar or dispatch connections are scoped separately.',
  },
  {
    q: 'Who runs it after launch?',
    a: 'We do. We monitor calls, tune answers, and review results with you every month.',
  },
  {
    q: 'What happens to my demo call?',
    a: 'The call is transcribed to write the owner summary; audio is not stored. Demo records without follow-up permission are deleted after 30 days. Calling does not sign you up for marketing.',
  },
]

export const VOICE_DEMO_FIT = {
  headline: 'See if it fits your shop.',
  body: 'Six quick questions. We review every request and reply by email.',
  recapConsent: 'Email me a recap of my demo call.',
  salesConsent: 'You may follow up by email about a managed receptionist for my business. I can opt out any time.',
  consentNote: 'Both boxes are optional and separate. Without them we only reply to this request.',
  confirmEmail: 'Thanks. Check your inbox and confirm your email address.',
  confirmEmailNext: 'Once you confirm, we send your follow-up. It includes the link to book a 15-minute fit call.',
  received: 'Thanks. We have your answers and will reply by email.',
  error: 'We could not send your request. Your answers are still here. Try again shortly.',
}

export const BOOK_CALL_LABEL = 'Book a 15-minute call'

export const VOICE_DEMO_COPY_STRINGS: string[] = [
  ...Object.values(VOICE_DEMO_HERO),
  ...Object.values(VOICE_DEMO_PROMISE),
  ...VERTICAL_CARDS.flatMap((c) => [c.label, c.scenario, ...c.asks]),
  VOICE_DEMO_DISCLOSURE,
  VOICE_DEMO_DISCLOSURE_ACK,
  VOICE_DEMO_EXPECTATION,
  ...Object.values(VOICE_DEMO_STATUS_COPY),
  VOICE_DEMO_UNAVAILABLE,
  SAMPLE_OWNER_OUTPUT.summary,
  SAMPLE_OWNER_OUTPUT.recommended_action,
  SAMPLE_OWNER_OUTPUT.example_notification,
  VOICE_DEMO_CUSTOMIZATION.headline,
  ...VOICE_DEMO_CUSTOMIZATION.items,
  ...VOICE_DEMO_FAQ.flatMap((f) => [f.q, f.a]),
  ...Object.values(VOICE_DEMO_FIT),
  BOOK_CALL_LABEL,
]
