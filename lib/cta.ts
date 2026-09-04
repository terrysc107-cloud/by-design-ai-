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
  sectionBg: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DrmYRucVZ9jcLrx9L0KtAHJdQY/hf_20260526_013703_ebcd8b7d-97de-45cb-ab37-0c26d1dec776.png',
  // Set to '/hero-photo.jpg' once you upload your actual photo to public/hero-photo.jpg
  heroPhoto: '',
  heroVideo: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DrmYRucVZ9jcLrx9L0KtAHJdQY/hf_20260526_023607_b26a52fc-4528-49d3-885d-5eab5a157e52.mp4',
}
