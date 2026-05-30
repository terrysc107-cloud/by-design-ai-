import { SITE_URL } from './resend'

const GOLD = '#C9A84C'
const BG = '#1E1B17'

// Email sent to the lead delivering the free guide.
export function guideEmail(name: string): { subject: string; html: string; text: string } {
  const guideUrl = `${SITE_URL}/guide`
  const callUrl = 'https://calendly.com/terrysc107/15-min-ai-discovery-call'
  const firstName = name.split(' ')[0] || 'there'

  const subject = 'Your guide: 10 Things You Should Never Do Manually'

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${BG};font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#23201b;border:1px solid rgba(201,168,76,0.3);">
            <tr>
              <td style="padding:36px 32px;">
                <p style="margin:0 0 24px;color:${GOLD};font-size:11px;letter-spacing:3px;text-transform:uppercase;">By Design AI · Free Guide</p>
                <h1 style="margin:0 0 16px;color:#ffffff;font-size:22px;line-height:1.3;font-weight:600;">10 Things In Your Business You Should Never Do Manually</h1>
                <p style="margin:0 0 12px;color:rgba(255,255,255,0.65);font-size:15px;line-height:1.6;">Hey ${firstName},</p>
                <p style="margin:0 0 24px;color:rgba(255,255,255,0.65);font-size:15px;line-height:1.6;">Thanks for grabbing the guide. It's the straight-to-the-point checklist of the tasks draining your time every week — and exactly what to automate first.</p>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                  <tr>
                    <td style="background:${GOLD};">
                      <a href="${guideUrl}" style="display:inline-block;padding:14px 28px;color:${BG};font-size:13px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;font-weight:600;">Read the Guide →</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 0 24px;color:rgba(255,255,255,0.65);font-size:15px;line-height:1.6;">Once you've spotted what's costing you the most time, the fastest way to fix it is a quick conversation. If you want a second set of eyes on your setup, book a free 15-minute discovery call:</p>
                <p style="margin:0 0 28px;"><a href="${callUrl}" style="color:${GOLD};font-size:14px;text-decoration:underline;">Book a free discovery call →</a></p>
                <p style="margin:0;color:rgba(255,255,255,0.4);font-size:13px;line-height:1.6;">— The By Design AI team</p>
              </td>
            </tr>
          </table>
          <p style="margin:20px 0 0;color:rgba(255,255,255,0.25);font-size:11px;">You received this because you requested the guide at By Design AI.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`

  const text = `Hey ${firstName},

Thanks for grabbing the guide — "10 Things In Your Business You Should Never Do Manually."

Read it here: ${guideUrl}

When you're ready to fix what's costing you the most time, book a free 15-minute discovery call: ${callUrl}

— The By Design AI team`

  return { subject, html, text }
}

// Internal notification sent to the site owner when a new lead comes in.
export function leadNotifyEmail(name: string, email: string): { subject: string; html: string; text: string } {
  const subject = `New lead: ${name} <${email}>`
  const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1E1B17;">
    <p style="margin:0 0 8px;"><strong>New guide download / lead</strong></p>
    <p style="margin:0;">Name: ${name}</p>
    <p style="margin:0;">Email: <a href="mailto:${email}">${email}</a></p>
    <p style="margin:16px 0 0;color:#666;">Captured from the By Design AI lead magnet form.</p>
  </div>`
  const text = `New lead\nName: ${name}\nEmail: ${email}\n\nCaptured from the By Design AI lead magnet form.`
  return { subject, html, text }
}
