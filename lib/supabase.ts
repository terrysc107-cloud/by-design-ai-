import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Server-only Supabase client using the service-role key.
// NEVER import this into client components — the service-role key bypasses RLS.
let client: SupabaseClient | null = null

// Resolve the service-role key from the canonical name, tolerating a couple of
// alternate names that have been used in deployment env (e.g. `service_role`).
function serviceRoleKey(): string | undefined {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.service_role
  )
}

export function getSupabase(): SupabaseClient {
  const url = process.env.SUPABASE_URL
  const key = serviceRoleKey()
  if (!url || !key) {
    throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set')
  }
  if (!client) {
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return client
}

export function hasSupabase(): boolean {
  return Boolean(process.env.SUPABASE_URL && serviceRoleKey())
}
