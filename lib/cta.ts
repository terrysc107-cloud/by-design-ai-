// Replace this URL with your Calendly / Cal.com / GHL calendar link
export const DISCOVERY_CALL_URL = 'https://api.leadconnectorhq.com/widget/booking/YOUR_CALENDAR_LINK'

export function bookDiscoveryCall() {
  window.open(DISCOVERY_CALL_URL, '_blank', 'noopener,noreferrer')
}
