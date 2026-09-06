import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'

const SITE_URL = 'https://aixdesign.dev'

/**
 * DELIBERATELY ABSENT: /guide/read and /guide/thanks.
 *
 * Both carry noindex. /guide/read is the gated guide, so listing it would hand
 * crawlers the thing we ask for an email address for; /guide/thanks only makes
 * sense to someone who just converted. A sitemap that lists noindex pages is
 * telling Google two different things about the same URL.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const posts: MetadataRoute.Sitemap = getAllPosts()
    .filter(p => !p.draft)
    .map(p => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(`${p.date}T00:00:00Z`),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/medical`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/newsletter`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    // /coaching shipped in the September merge and was never added here, so it
    // has been live and undiscoverable. It sells, so it outranks /intake.
    { url: `${SITE_URL}/coaching`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/education`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    {
      url: `${SITE_URL}/education/claude-code`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    { url: `${SITE_URL}/intake`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    ...posts,
  ]
}
