# AI by Design Coaching Flow Notes

Status: planning notes only. Do not push/deploy until Terry explicitly asks.

## Current intent

Terry wants coaching represented on the AI by Design site, but the real launch needs a small qualification, Stripe, and calendar flow before it is pushed live.

AI by Design should stay positioned as an AI business coaching and consulting agency, not a generic course or tool reseller.

## Coaching offer concept

AI by Design coaching is for owners/operators who need help turning AI into business leverage:

- clarify bottlenecks
- decide what deserves automation
- design practical workflows
- choose the right tools
- build an operating rhythm
- avoid buying or building unnecessary software

Potential ladder:

- AI Strategy Call — $149
- 30-Day AI Operating System Sprint — $499
- Operating Partner / Retainer — $1,500+/month

These are placeholders until Terry finalizes pricing and packaging.

## Required flow before launch

The real flow should be:

1. Visitor clicks coaching/discovery CTA.
2. Visitor completes a short qualification form.
3. Form captures:
   - name
   - email
   - business type
   - team size
   - current bottleneck
   - tools currently used
   - what they want AI to help with
   - urgency/timeline
   - budget range or willingness to invest
   - preferred offer: strategy call, sprint, retainer
4. Based on qualification, route to:
   - paid Stripe checkout for a strategy call or sprint, or
   - discovery call booking for larger consulting/retainer opportunities.
5. After payment or qualification, send them to the calendar.
6. Send confirmation email and internal lead notification.
7. Save lead/intake data to the appropriate source of truth.

## Build considerations

- Keep the primary CTA consistent with the brand: Book a Discovery Call.
- Do not overemphasize tools like GHL, Make, n8n, etc.; tools are implementation details.
- Qualification matters because not every visitor should go straight to paid coaching.
- Stripe Payment Links may be enough for first version.
- Calendly can remain the calendar unless Terry chooses GHL calendar.
- Lead data likely needs to flow into Supabase and/or GHL.

## Open decisions

- Calendar tool: Calendly vs GHL calendar.
- Payment model: pay-before-booking vs qualify-before-payment.
- Whether the discovery call stays free while strategy call is paid.
- Whether the 30-day sprint is sold directly or only after a call.
- Where lead/intake data should be stored.

## Recommended next implementation

Build a small coaching funnel:

- `/coaching` public page
- `/coaching/apply` intake form
- `/coaching/thanks` confirmation page
- owner notification email
- optional Stripe Payment Link handoff
- calendar booking handoff

Do not push live until Terry reviews the offer language, prices, qualification questions, and routing logic.
