import type { NextRequest } from 'next/server'
import { createVoiceAgentWaitlistHandler } from '@/lib/voice-agent-waitlist-handler'
import { insertVoiceAgentWaitlist } from '@/lib/voice-agent-waitlist'
import { getSupabase, hasSupabase } from '@/lib/supabase'
import { voiceAgentWaitlistRateLimit } from '@/lib/voice-agent-waitlist-rate-limit'

// Node runtime: getSupabase() and the crypto-based rate limiter need it.
export const runtime = 'nodejs'

// getSupabase() is only ever called from inside `persist`, i.e. lazily, once a
// request actually reaches step 10. A missing SUPABASE_URL/SERVICE_ROLE_KEY
// never breaks the static /voice-agent page or the build.
const handleRequest = createVoiceAgentWaitlistHandler({
  configured: hasSupabase,
  persist: (input) => insertVoiceAgentWaitlist(getSupabase(), input),
  limit: voiceAgentWaitlistRateLimit,
  now: Date.now,
  log: (event, fields) => {
    console.log(JSON.stringify({ event, ...fields }))
  },
})

export async function POST(request: NextRequest): Promise<Response> {
  return handleRequest(request)
}
