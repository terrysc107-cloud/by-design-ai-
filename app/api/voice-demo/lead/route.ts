import { voiceDemoHandlers } from '@/lib/voice-demo-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export function POST(request: Request): Promise<Response> {
  return voiceDemoHandlers.lead(request)
}
