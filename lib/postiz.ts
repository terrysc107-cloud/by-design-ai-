/**
 * Minimal Postiz public-API client for scheduling brand content.
 *
 * Postiz (self-hosted or cloud) exposes a Public API. Set:
 *   POSTIZ_API_URL  — base URL of your instance, e.g. https://postiz.example.com
 *   POSTIZ_API_KEY  — from Postiz → Settings → Public API
 *
 * The API key is sent in the `Authorization` header (no "Bearer " prefix),
 * which is how Postiz's public API authenticates.
 *
 * NOTE: Postiz's post payload shape has evolved across versions. The
 * schedulePost() body below follows the current documented `/public/v1/posts`
 * contract. Run `listIntegrations()` first against your instance to confirm
 * channel IDs and adjust the `settings` block per provider if needed.
 */

export interface PostizIntegration {
  id: string
  name: string
  /** provider identifier, e.g. "x", "linkedin", "instagram", "youtube", "facebook" */
  identifier: string
  picture?: string
  disabled?: boolean
}

export interface ScheduleInput {
  /** Postiz integration (channel) id to publish to */
  integrationId: string
  /** post body text */
  content: string
  /** uploaded media ids (from uploadMedia) to attach */
  mediaIds?: string[]
  /** ISO datetime to publish; omit for `now` */
  date?: string
  /** draft = save only, schedule = queue for `date`, now = publish immediately */
  type?: 'draft' | 'schedule' | 'now'
}

export class PostizError extends Error {
  constructor(message: string, readonly status?: number, readonly body?: string) {
    super(message)
    this.name = 'PostizError'
  }
}

export class PostizClient {
  private readonly base: string
  private readonly key: string

  constructor(opts?: { url?: string; key?: string }) {
    const url = opts?.url ?? process.env.POSTIZ_API_URL ?? ''
    const key = opts?.key ?? process.env.POSTIZ_API_KEY ?? ''
    if (!url || !key) {
      throw new PostizError(
        'Missing Postiz credentials — set POSTIZ_API_URL and POSTIZ_API_KEY.',
      )
    }
    this.base = url.replace(/\/$/, '')
    this.key = key
  }

  /** True only when both env vars are present (use to gate live calls). */
  static isConfigured(): boolean {
    return Boolean(process.env.POSTIZ_API_URL && process.env.POSTIZ_API_KEY)
  }

  private async req<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.base}${path}`, {
      ...init,
      headers: {
        Authorization: this.key,
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
    })
    const text = await res.text()
    if (!res.ok) {
      throw new PostizError(`Postiz ${path} failed (${res.status})`, res.status, text)
    }
    return (text ? JSON.parse(text) : {}) as T
  }

  /** List connected channels (X, LinkedIn, IG, etc.) with their ids. */
  listIntegrations(): Promise<PostizIntegration[]> {
    return this.req<PostizIntegration[]>('/public/v1/integrations')
  }

  /**
   * Upload a media file (banner/avatar) and return its id for attaching to a post.
   * Sends multipart/form-data, so we bypass the JSON helper here.
   */
  async uploadMedia(fileName: string, bytes: Uint8Array, mime = 'image/png'): Promise<string> {
    const form = new FormData()
    form.append('file', new Blob([bytes as BlobPart], { type: mime }), fileName)
    const res = await fetch(`${this.base}/public/v1/upload`, {
      method: 'POST',
      headers: { Authorization: this.key },
      body: form,
    })
    const text = await res.text()
    if (!res.ok) throw new PostizError(`Postiz upload failed (${res.status})`, res.status, text)
    const json = JSON.parse(text) as { id: string }
    return json.id
  }

  /** Create/schedule a single-channel post. */
  schedulePost(input: ScheduleInput): Promise<unknown> {
    const body = {
      type: input.type ?? (input.date ? 'schedule' : 'now'),
      date: input.date ?? new Date().toISOString(),
      shortLink: false,
      tags: [] as string[],
      posts: [
        {
          integration: { id: input.integrationId },
          value: [
            {
              content: input.content,
              image: (input.mediaIds ?? []).map(id => ({ id })),
            },
          ],
          settings: {},
        },
      ],
    }
    return this.req('/public/v1/posts', { method: 'POST', body: JSON.stringify(body) })
  }
}
