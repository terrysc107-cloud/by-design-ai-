import { trackConversion } from '@/lib/analytics'

export const DISCOVERY_CALL_URL = 'https://calendly.com/terrysc107/15-min-ai-discovery-call'

export function bookDiscoveryCall() {
  trackConversion('book_call')
  window.open(DISCOVERY_CALL_URL, '_blank', 'noopener,noreferrer')
}

// Higgsfield-generated assets
// To use local files: download from Higgsfield, place in /public, and swap these paths to e.g. '/hero-bg.mp4'
export const ASSETS = {
  heroBgVideo: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DrmYRucVZ9jcLrx9L0KtAHJdQY/hf_20260526_013621_44ec4bc1-d654-4063-b572-2a8aba0b899b.mp4',
  /**
   * The real cover of the PDF people receive, rendered from the same
   * Main.dc.html the guide is built from (design/guide-pdf/render-cover.mjs).
   *
   * Was a Higgsfield CDN image generated 2026-05-26: the cover of "10 Things In
   * Your Business You Should Never Do Manually". The lead-magnet section and
   * the exit-intent modal both showed it, so both pictured a guide that no
   * longer exists beside copy for one that does. Local rather than a CDN URL,
   * so it cannot rot when a generation history gets cleaned up.
   */
  guideCover: '/guide-cover.png',
  /**
   * The same cover composited as a booklet: perspective, a page block, a spine
   * and a shadow (design/guide-pdf/render-mockup.mjs).
   *
   * The site showed the flat cover in a hairline border, which read as words on
   * a black rectangle rather than something you receive. A lead magnet has to
   * look like an object before anyone spends an email address on it.
   *
   * CSS perspective over a generated image on purpose: an image model turns the
   * cover's type to mush, and the title, the four filenames and the five step
   * names all have to stay legible. This composites the REAL cover render, so
   * the mockup and the PDF cannot drift.
   */
  guideMockup: '/guide-mockup.png',
  /**
   * The same booklet on a warm studio backdrop, and what the SITE uses.
   *
   * The cutout above is a dark object, and the site is a dark page, so on
   * transparency it sat quietly rather than reading as a product. A contained
   * warm panel behind it is a photography backdrop, not a theme flip: the page
   * stays dark and the object comes off it. It is also the version that drops
   * straight into a social post, where there is no dark page to sit on.
   *
   * JPEG, not PNG: a full-bleed photographic gradient costs 1.3 MB as a PNG and
   * 47 KB as a JPEG, and there is no transparency left to preserve.
   */
  guideMockupLight: '/guide-mockup-light.jpg',
  sectionBg: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DrmYRucVZ9jcLrx9L0KtAHJdQY/hf_20260526_013703_ebcd8b7d-97de-45cb-ab37-0c26d1dec776.png',
  // Set to '/hero-photo.jpg' once you upload your actual photo to public/hero-photo.jpg
  heroPhoto: '',
  heroVideo: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DrmYRucVZ9jcLrx9L0KtAHJdQY/hf_20260526_023607_b26a52fc-4528-49d3-885d-5eab5a157e52.mp4',
}
