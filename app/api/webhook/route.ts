import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

async function fireJotformWebhook(session: Stripe.Checkout.Session) {
  try {
    const payload = {
      name: session.customer_details?.name ?? 'Not provided',
      email:
        session.customer_email ??
        session.customer_details?.email ??
        '',
      paymentId:
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : (session.payment_intent?.id ?? ''),
      timestamp: new Date().toISOString(),
      product: 'AI Ops Audit',
    }

    const res = await fetch(process.env.JOTFORM_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      console.error('Jotform webhook returned non-OK status:', res.status, await res.text())
    } else {
      console.log('Jotform webhook fired successfully for:', payload.email)
    }
  } catch (err) {
    console.error('Jotform webhook failed (silent):', err)
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Webhook signature verification failed:', message)
    return NextResponse.json({ error: message }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    await fireJotformWebhook(session)
  }

  return NextResponse.json({ received: true })
}
