import { voiceDemoHandlers } from '@/lib/voice-demo-server'

// POST, not GET: the browser token travels in the body so it never lands in a URL or access log.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export function POST(request: Request): Promise<Response> {
  return voiceDemoHandlers.status(request)
}
