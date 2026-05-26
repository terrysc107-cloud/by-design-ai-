import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json()

    if (!name || !email || typeof name !== 'string' || typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // TODO: connect to GHL webhook, Zapier, or email provider
    // Example: await fetch(process.env.GHL_WEBHOOK_URL, { method: 'POST', body: JSON.stringify({ name, email }) })

    console.log(`Lead captured: ${name} <${email}>`)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
