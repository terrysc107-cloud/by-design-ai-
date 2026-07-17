export interface IntelItem {
  source: string
  title: string
  url: string
  date?: string
}

export interface StockSnapshot {
  symbol: string
  price: number | null
  changePct: number | null
  rawDate?: string
}

export interface WeeklyIntel {
  generatedAt: string
  news: IntelItem[]
  stocks: StockSnapshot[]
  themes: string[]
}

const NEWS_SOURCES: { source: string; url: string }[] = [
  { source: 'OpenAI', url: 'https://openai.com/news/rss.xml' },
  { source: 'Anthropic', url: 'https://www.anthropic.com/news/rss.xml' },
  { source: 'Google DeepMind', url: 'https://deepmind.google/discover/blog/rss.xml' },
  { source: 'Hugging Face', url: 'https://huggingface.co/blog/feed.xml' },
  { source: 'The Decoder', url: 'https://the-decoder.com/feed/' },
  { source: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed/' },
]

const WATCHLIST = ['NVDA', 'MSFT', 'GOOGL', 'META', 'AMZN', 'AMD']

function textBetween(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))
  return decodeXml(match?.[1]?.trim() ?? '')
}

function decodeXml(input: string): string {
  return input
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseFeed(source: string, xml: string): IntelItem[] {
  const blocks = Array.from(xml.matchAll(/<item[\s\S]*?<\/item>|<entry[\s\S]*?<\/entry>/gi)).map(m => m[0])
  return blocks
    .map(block => {
      const atomLink = block.match(/<link[^>]+href=["']([^"']+)["'][^>]*>/i)?.[1]
      return {
        source,
        title: textBetween(block, 'title'),
        url: textBetween(block, 'link') || atomLink || '',
        date: textBetween(block, 'pubDate') || textBetween(block, 'updated') || textBetween(block, 'published') || undefined,
      }
    })
    .filter(item => item.title && item.url)
}

async function fetchFeed(source: string, url: string): Promise<IntelItem[]> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8_000)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'AI by Design newsletter intelligence collector' },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const xml = await res.text()
    return parseFeed(source, xml)
  } catch {
    return []
  } finally {
    clearTimeout(timeout)
  }
}

async function fetchStock(symbol: string): Promise<StockSnapshot> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=5d&interval=1d`
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8_000)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 900 },
    })
    if (!res.ok) return { symbol, price: null, changePct: null }
    const json = await res.json()
    const result = json?.chart?.result?.[0]
    const meta = result?.meta
    const price = Number(meta?.regularMarketPrice)
    const previousClose = Number(meta?.chartPreviousClose)
    const changePct = Number.isFinite(price) && Number.isFinite(previousClose) && previousClose !== 0
      ? ((price - previousClose) / previousClose) * 100
      : null
    return {
      symbol,
      price: Number.isFinite(price) ? Number(price.toFixed(2)) : null,
      changePct: changePct === null ? null : Number(changePct.toFixed(2)),
      rawDate: meta?.regularMarketTime ? new Date(Number(meta.regularMarketTime) * 1000).toISOString() : undefined,
    }
  } catch {
    return { symbol, price: null, changePct: null }
  } finally {
    clearTimeout(timeout)
  }
}

function inferThemes(items: IntelItem[]): string[] {
  const text = items.map(i => i.title.toLowerCase()).join(' ')
  const candidates: [string, RegExp][] = [
    ['AI agents moving from demos into workflows', /agent|tool use|computer use|workflow|automation/],
    ['smaller and cheaper models becoming practical', /small|mini|edge|local|efficient|distill|on-device/],
    ['multimodal tools reshaping content operations', /video|image|voice|audio|multimodal|vision/],
    ['AI infrastructure and chip demand staying hot', /nvidia|chip|gpu|inference|datacenter|compute/],
    ['trust, privacy, and governance becoming buying criteria', /safety|privacy|security|governance|policy|copyright/],
    ['operator use cases beating generic chatbot adoption', /customer|sales|support|crm|email|assistant|productivity/],
  ]
  return candidates.filter(([, rx]) => rx.test(text)).map(([theme]) => theme).slice(0, 4)
}

export async function collectWeeklyIntel(): Promise<WeeklyIntel> {
  const feedResults = await Promise.all(NEWS_SOURCES.map(s => fetchFeed(s.source, s.url)))
  const seen = new Set<string>()
  const news = feedResults
    .flat()
    .filter(item => {
      const key = `${item.source}:${item.title}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .slice(0, 18)
  const stocks = await Promise.all(WATCHLIST.map(fetchStock))
  const themes = inferThemes(news)
  return { generatedAt: new Date().toISOString(), news, stocks, themes }
}

export function formatWeeklyIntelForPrompt(intel: WeeklyIntel): string {
  const news = intel.news
    .slice(0, 12)
    .map((item, i) => `${i + 1}. ${item.source}: ${item.title}${item.date ? ` (${item.date})` : ''}`)
    .join('\n')
  const stocks = intel.stocks
    .map(s => `${s.symbol}: ${s.price === null ? 'n/a' : `$${s.price}`} ${s.changePct === null ? '' : `(${s.changePct >= 0 ? '+' : ''}${s.changePct}%)`}`.trim())
    .join(' · ')
  const themes = intel.themes.length ? intel.themes.map(t => `- ${t}`).join('\n') : '- No dominant theme detected from this scrape.'
  return `CURRENT WEEKLY INTELLIGENCE SNAPSHOT\nGenerated: ${intel.generatedAt}\n\nAI/news inputs:\n${news || 'No news items collected.'}\n\nAI-market watchlist snapshot:\n${stocks || 'No stock snapshots collected.'}\n\nDetected themes:\n${themes}`
}
