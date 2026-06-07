import { JWT } from 'google-auth-library'

// Writes CRM rows to a Google Sheet using a service account. The account must
// be granted edit access to the target spreadsheet (share the Sheet with the
// service account's client_email).
//
// Required env:
//   GOOGLE_SA_EMAIL        — service account client_email
//   GOOGLE_SA_PRIVATE_KEY  — service account private_key (\n-escaped is fine)
//   CRM_SHEET_ID           — spreadsheet ID (from its URL)

const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets'
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

export function hasSheetsCreds(): boolean {
  return Boolean(
    process.env.GOOGLE_SA_EMAIL &&
      process.env.GOOGLE_SA_PRIVATE_KEY &&
      process.env.CRM_SHEET_ID
  )
}

let jwt: JWT | null = null

async function getToken(): Promise<string> {
  if (!jwt) {
    jwt = new JWT({
      email: process.env.GOOGLE_SA_EMAIL,
      // Vercel env stores newlines escaped; restore them.
      key: (process.env.GOOGLE_SA_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      scopes: SCOPES,
    })
  }
  const { token } = await jwt.getAccessToken()
  if (!token) throw new Error('Failed to obtain Google access token')
  return token
}

async function api(path: string, init: RequestInit, token: string) {
  const res = await fetch(`${SHEETS_API}/${process.env.CRM_SHEET_ID}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Sheets API ${res.status}: ${body.slice(0, 300)}`)
  }
  return res.json()
}

async function ensureTab(tab: string, token: string): Promise<void> {
  const meta = await api('?fields=sheets.properties.title', { method: 'GET' }, token)
  const titles: string[] = (meta.sheets ?? []).map(
    (s: { properties: { title: string } }) => s.properties.title
  )
  if (titles.includes(tab)) return
  await api(
    ':batchUpdate',
    {
      method: 'POST',
      body: JSON.stringify({ requests: [{ addSheet: { properties: { title: tab } } }] }),
    },
    token
  )
}

/**
 * Overwrite a tab with a header row + data rows. Creates the tab if missing.
 * Idempotent: safe to run on every cron tick.
 */
export async function writeTab(
  tab: string,
  header: string[],
  rows: (string | number | null)[][]
): Promise<number> {
  const token = await getToken()
  await ensureTab(tab, token)
  // Clear old contents so deleted/unsubscribed rows don't linger.
  await api(
    `/values/${encodeURIComponent(tab)}!A:Z:clear`,
    { method: 'POST', body: '{}' },
    token
  )
  const values = [header, ...rows.map(r => r.map(c => (c == null ? '' : c)))]
  await api(
    `/values/${encodeURIComponent(tab)}!A1?valueInputOption=RAW`,
    { method: 'PUT', body: JSON.stringify({ values }) },
    token
  )
  return rows.length
}
