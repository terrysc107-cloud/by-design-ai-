import type { Metadata } from 'next'
import Link from 'next/link'
import NoiseBg from '@/components/effects/NoiseBg'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import NewsletterSignup from '@/components/sections/NewsletterSignup'
import { getAllPosts, formatDate } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog — Practical AI & Automation for Solo Operators | AI by Design',
  description:
    'Short, practical writing on putting AI and automation to work in a real business — lead follow-up, admin, and the systems that run while you sleep. No hype.',
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    url: 'https://aixdesign.dev/blog',
    title: 'AI by Design — Blog',
    description: 'Practical AI & automation writing for solo operators. No hype, just the moves.',
  },
}

export default function BlogIndex() {
  const posts = getAllPosts()

  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      <NoiseBg />
      <Header />

      <section className="section pt-32 md:pt-40">
        <div className="max-w-3xl mx-auto">
          <p className="text-gold text-[10px] tracking-[0.35em] uppercase font-medium mb-4">
            The Blog
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold text-white tracking-tight leading-tight">
            Practical AI, minus the hype.
          </h1>
          <p className="text-white/55 text-base md:text-lg leading-relaxed mt-5">
            Short notes on putting AI and automation to work in a business like yours —
            the moves that actually move the needle.
          </p>

          <div className="mt-14 flex flex-col">
            {posts.length === 0 && (
              <p className="text-white/40 text-sm">New writing is on the way. Check back soon.</p>
            )}
            {posts.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group border-t border-white/10 py-7 transition-colors hover:border-gold/40"
              >
                <p className="text-white/35 text-xs tracking-wide uppercase">
                  {formatDate(post.date)}
                  {post.draft ? ' · Draft' : ''}
                </p>
                <h2 className="text-xl md:text-2xl font-semibold text-white tracking-tight mt-2 group-hover:text-gold transition-colors">
                  {post.title}
                </h2>
                <p className="text-white/50 text-sm md:text-base leading-relaxed mt-2">
                  {post.description}
                </p>
                <span className="inline-block text-gold text-sm mt-3">Read →</span>
              </Link>
            ))}
          </div>

          <div className="mt-16">
            <NewsletterSignup source="blog" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
