import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import NoiseBg from '@/components/effects/NoiseBg'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import NewsletterSignup from '@/components/sections/NewsletterSignup'
import { getPost, getPostSlugs, formatDate } from '@/lib/blog'

const SITE_URL = 'https://aixdesign.dev'

export const dynamicParams = false

export function generateStaticParams() {
  return getPostSlugs().map(slug => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug)
  if (!post) return {}
  const url = `${SITE_URL}/blog/${post.slug}`
  return {
    title: `${post.title} | AI by Design`,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

// Theme-matched MDX element styling (no typography plugin needed).
const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-2xl font-semibold text-white tracking-tight mt-12 mb-4" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-xl font-semibold text-white tracking-tight mt-8 mb-3" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-white/65 text-base leading-relaxed mb-5" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="text-gold underline underline-offset-2 hover:text-white transition-colors" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc pl-6 space-y-2 mb-5 text-white/65 text-base leading-relaxed" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal pl-6 space-y-2 mb-5 text-white/65 text-base leading-relaxed" {...props} />
  ),
  li: (props: React.LiHTMLAttributes<HTMLLIElement>) => <li className="pl-1" {...props} />,
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="text-white font-semibold" {...props} />
  ),
  blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-2 border-gold/50 pl-5 italic text-white/55 my-6" {...props} />
  ),
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug)
  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'AI by Design', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'AI by Design', url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    keywords: post.tags.join(', '),
  }

  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      <NoiseBg />
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="section pt-32 md:pt-40">
        <div className="max-w-2xl mx-auto">
          <Link href="/blog" className="text-white/40 text-sm hover:text-gold transition-colors">
            ← All posts
          </Link>

          <p className="text-white/35 text-xs tracking-wide uppercase mt-8">
            {formatDate(post.date)} · {post.author}
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight leading-tight mt-3">
            {post.title}
          </h1>
          <p className="text-white/55 text-lg leading-relaxed mt-4">{post.description}</p>

          <div className="mt-10 border-t border-white/10 pt-10">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>

          <div className="mt-16">
            <NewsletterSignup source="blog" />
          </div>
        </div>
      </article>

      <Footer />
    </main>
  )
}
