import { NextRequest, NextResponse } from 'next/server'
import { getSupabase, hasSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// One-click unsubscribe. Linked from every drip email via ?token=<unsubscribe_token>.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  const list = req.nextUrl.searchParams.get('list')

  if (!token || !hasSupabase()) {
    return htmlResponse('Invalid unsubscribe link.', false)
  }

  try {
    const supabase = getSupabase()

    // Newsletter subscribers (List-Unsubscribe links carry ?list=subscribers).
    if (list === 'subscribers') {
      const { data, error } = await supabase
        .from('bda_subscribers')
        .update({ status: 'unsubscribed', updated_at: new Date().toISOString() })
        .eq('unsubscribe_token', token)
        .select('email')
      if (error || !data || data.length === 0) {
        return htmlResponse('We couldn’t find that subscription — it may already be removed.', false)
      }
      return htmlResponse('You’re unsubscribed from the newsletter. No more emails from us.', true)
    }

    // Default: drip/nurture leads.
    const { data, error } = await supabase
      .from('bda_leads')
      .update({ unsubscribed: true, drip_next_at: null, updated_at: new Date().toISOString() })
      .eq('unsubscribe_token', token)
      .select('email')

    if (error || !data || data.length === 0) {
      return htmlResponse('We couldn’t find that subscription — it may already be removed.', false)
    }
    return htmlResponse('You’re unsubscribed. You won’t receive any more emails from us.', true)
  } catch {
    return htmlResponse('Something went wrong. Please try again later.', false)
  }
}

// Many email clients POST to the List-Unsubscribe URL (one-click). Support it.
export async function POST(req: NextRequest) {
  return GET(req)
}

function htmlResponse(message: string, ok: boolean): NextResponse {
  const html = `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Unsubscribe — AI by Design</title></head>
<body style="margin:0;background:#1E1B17;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;">
  <div style="max-width:420px;padding:40px 32px;text-align:center;border:1px solid rgba(201,168,76,0.3);background:#23201b;">
    <p style="margin:0 0 16px;color:#C9A84C;font-size:11px;letter-spacing:3px;text-transform:uppercase;">AI by Design</p>
    <p style="margin:0;color:rgba(255,255,255,0.75);font-size:16px;line-height:1.6;">${message}</p>
  </div>
</body></html>`
  return new NextResponse(html, {
    status: ok ? 200 : 400,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
