import OpenAI from 'openai'

// Lazily instantiate so a missing key doesn't crash the build or unrelated routes.
let client: OpenAI | null = null

export function getOpenAI(): OpenAI {
  const key = process.env.OPENAI_API_KEY
  if (!key) {
    throw new Error('OPENAI_API_KEY is not set')
  }
  if (!client) {
    client = new OpenAI({ apiKey: key })
  }
  return client
}

export function hasOpenAI(): boolean {
  return Boolean(process.env.OPENAI_API_KEY)
}

export const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o'
