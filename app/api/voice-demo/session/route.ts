import { voiceDemoHandlers } from '@/lib/voice-demo-server'

// Node runtime: the shared limiter hashes keys with node:crypto.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export function POST(request: Request): Promise<Response> {
  return voiceDemoHandlers.session(request)
}
