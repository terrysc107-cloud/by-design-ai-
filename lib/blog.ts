import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

export type PostMeta = {
  slug: string
  title: string
  description: string
  date: string // ISO yyyy-mm-dd
  author: string
  tags: string[]
  draft: boolean
}

export type Post = PostMeta & { content: string }

function readPostFile(slug: string): Post | null {
  const full = path.join(BLOG_DIR, `${slug}.mdx`)
  if (!fs.existsSync(full)) return null
  const raw = fs.readFileSync(full, 'utf8')
  const { data, content } = matter(raw)
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? '',
    date: data.date ? String(data.date).slice(0, 10) : '1970-01-01',
    author: data.author ?? 'AI by Design',
    tags: Array.isArray(data.tags) ? data.tags : [],
    draft: Boolean(data.draft),
    content,
  }
}

/** All published post slugs (drafts excluded in production). */
export function getPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.mdx'))
    .map(f => f.replace(/\.mdx$/, ''))
}

/** Published posts, newest first. Drafts are hidden unless NODE_ENV !== production. */
export function getAllPosts(): PostMeta[] {
  const showDrafts = process.env.NODE_ENV !== 'production'
  return getPostSlugs()
    .map(slug => readPostFile(slug))
    .filter((p): p is Post => Boolean(p))
    .filter(p => showDrafts || !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(({ content: _content, ...meta }) => meta)
}

export function getPost(slug: string): Post | null {
  const post = readPostFile(slug)
  if (!post) return null
  if (post.draft && process.env.NODE_ENV === 'production') return null
  return post
}

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}
