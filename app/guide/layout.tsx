import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '10 Things You Should Never Do Manually — AI by Design',
  description: 'A free automation audit guide for operators who are ready to get their time back.',
  alternates: { canonical: '/guide' },
  openGraph: {
    type: 'article',
    url: 'https://aixdesign.dev/guide',
    siteName: 'AI by Design',
    title: '10 Things In Your Business You Should Never Do Manually',
    description: 'A free automation audit guide for operators who are ready to get their time back.',
  },
}

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-zinc-900 antialiased">
        {children}
      </body>
    </html>
  )
}
