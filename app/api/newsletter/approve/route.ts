import { NextRequest, NextResponse } from 'next/server'
import { getSupabase, hasSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// One-click approval for a drafted newsletter issue. Linked from the owner's
// "Approve & Send" email via ?token=<approval_token>. Security is the unguessable
// token; only transitions draft → approved (idempotent). The send cron does the
// actual sending on its next run.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token || !hasSupabase()) {
    return htmlResponse('Invalid approval link.', false)
  }

  try {
    const supabase = getSupabase()

    // Look up by token.
    const { data: issue, error: findErr } = await supabase
      .from('bda_newsletter_issues')
      .select('id, status, subject')
      .eq('approval_token', token)
      .maybeSingle()
    if (findErr || !issue) {
      return htmlResponse('We couldn’t find that newsletter issue.', false)
    }

    if (issue.status === 'approved' || issue.status === 'sending' || issue.status === 'sent') {
      return htmlResponse(`“${issue.subject}” is already approved — it’ll go out on the next send run.`, true)
    }
    if (issue.status !== 'draft') {
      return htmlResponse(`This issue can’t be approved (status: ${issue.status}).`, false)
    }

    const { error: updErr } = await supabase
      .from('bda_newsletter_issues')
      .update({ status: 'approved', approved_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', issue.id)
      .eq('status', 'draft')
    if (updErr) {
      return htmlResponse('Something went wrong approving the issue. Please try again.', false)
    }

    return htmlResponse(`Approved “${issue.subject}.” It will send to all active subscribers on the next run.`, true)
  } catch {
    return htmlResponse('Something went wrong. Please try again later.', false)
  }
}

function htmlResponse(message: string, ok: boolean): NextResponse {
  const html = `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Newsletter — AI by Design</title></head>
<body style="margin:0;background:#1E1B17;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;">
  <div style="max-width:440px;padding:40px 32px;text-align:center;border:1px solid rgba(201,168,76,0.3);background:#23201b;">
    <p style="margin:0 0 16px;color:#C9A84C;font-size:11px;letter-spacing:3px;text-transform:uppercase;">AI by Design</p>
    <p style="margin:0;color:rgba(255,255,255,0.75);font-size:16px;line-height:1.6;">${message}</p>
  </div>
</body></html>`
  return new NextResponse(html, {
    status: ok ? 200 : 400,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
