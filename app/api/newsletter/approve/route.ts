import { NextRequest, NextResponse } from 'next/server'
import { getSupabase, hasSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

type ApprovalIssue = {
  id: string
  status: string
  subject: string
}

async function findIssue(token: string): Promise<ApprovalIssue | null> {
  const { data, error } = await getSupabase()
    .from('bda_newsletter_issues')
    .select('id, status, subject')
    .eq('approval_token', token)
    .maybeSingle()
  if (error) throw error
  return data as ApprovalIssue | null
}

// GET is deliberately read-only. Email security scanners and link-preview bots
// routinely open links, so approval requires an explicit POST from this page.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token || !hasSupabase()) {
    return messageResponse('Invalid approval link.', false)
  }

  try {
    const issue = await findIssue(token)
    if (!issue) return messageResponse('We couldn’t find that newsletter issue.', false)

    if (issue.status === 'approved' || issue.status === 'sending' || issue.status === 'sent') {
      return messageResponse(`“${issue.subject}” is already approved.`, true)
    }
    if (issue.status !== 'draft') {
      return messageResponse(`This issue can’t be approved (status: ${issue.status}).`, false)
    }

    return confirmationResponse(issue.subject, token)
  } catch {
    return messageResponse('Something went wrong. Please try again later.', false)
  }
}

export async function POST(req: NextRequest) {
  if (!hasSupabase()) return messageResponse('Newsletter approval is not configured.', false)

  try {
    const form = await req.formData()
    const rawToken = form.get('token')
    const token = typeof rawToken === 'string' ? rawToken : ''
    if (!token) return messageResponse('Invalid approval request.', false)

    const issue = await findIssue(token)
    if (!issue) return messageResponse('We couldn’t find that newsletter issue.', false)

    if (issue.status === 'approved' || issue.status === 'sending' || issue.status === 'sent') {
      return messageResponse(`“${issue.subject}” is already approved.`, true)
    }
    if (issue.status !== 'draft') {
      return messageResponse(`This issue can’t be approved (status: ${issue.status}).`, false)
    }

    const now = new Date().toISOString()
    const { data: updated, error } = await getSupabase()
      .from('bda_newsletter_issues')
      .update({ status: 'approved', approved_at: now, updated_at: now })
      .eq('id', issue.id)
      .eq('status', 'draft')
      .select('id')
      .maybeSingle()

    if (error || !updated) {
      return messageResponse('This issue was not approved. Refresh and verify its current status.', false)
    }

    return messageResponse(
      `Approved “${issue.subject}.” It will send to all active subscribers on the next authorized send run.`,
      true,
    )
  } catch {
    return messageResponse('Something went wrong. Please try again later.', false)
  }
}

function confirmationResponse(subject: string, token: string): NextResponse {
  const safeSubject = escapeHtml(subject)
  const safeToken = escapeHtml(token)
  const content = `<p style="margin:0 0 12px;color:#2878FF;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Human approval required</p>
    <h1 style="margin:0 0 16px;color:#09111F;font-size:26px;line-height:1.2;">Confirm newsletter approval</h1>
    <p style="margin:0 0 24px;color:#526071;font-size:16px;line-height:1.6;">Approve “${safeSubject}” for delivery to all active subscribers on the next authorized send run?</p>
    <form method="post" action="/api/newsletter/approve">
      <input type="hidden" name="token" value="${safeToken}" />
      <button type="submit" style="border:0;border-radius:8px;background:#2878FF;color:#fff;cursor:pointer;font-size:14px;font-weight:700;padding:14px 20px;">Approve for next send run</button>
    </form>
    <p style="margin:18px 0 0;color:#7A8796;font-size:12px;line-height:1.5;">Nothing is sent by opening this page. Delivery remains a separate authenticated cron action.</p>`
  return pageResponse(content, 200)
}

function messageResponse(message: string, ok: boolean): NextResponse {
  const content = `<p style="margin:0 0 12px;color:${ok ? '#2878FF' : '#B42318'};font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">AI by Design</p>
    <p style="margin:0;color:#526071;font-size:16px;line-height:1.6;">${escapeHtml(message)}</p>`
  return pageResponse(content, ok ? 200 : 400)
}

function pageResponse(content: string, status: number): NextResponse {
  const html = `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="robots" content="noindex,nofollow"/><title>Newsletter approval — AI by Design</title></head>
<body style="margin:0;background:#F7F9FC;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;">
  <main style="box-sizing:border-box;max-width:520px;width:100%;padding:40px 32px;border:1px solid #E3EAF3;border-radius:18px;background:#fff;box-shadow:0 24px 70px rgba(9,17,31,.10);">${content}</main>
</body></html>`
  return new NextResponse(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'no-referrer',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[char] ?? char)
}
