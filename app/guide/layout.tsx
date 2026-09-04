import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Board Method: Build AI Employees That Run Without You | AI by Design',
  description:
    'Five steps that take AI from something you operate to a board that runs on a schedule and hands you a meeting you can act on. Free, seven pages.',
  alternates: { canonical: '/guide' },
  openGraph: {
    type: 'article',
    url: 'https://aixdesign.dev/guide',
    siteName: 'AI by Design',
    title: 'The Board Method',
    description:
      'Five steps that take AI from something you operate to a board that runs on a schedule and hands you a meeting you can act on.',
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
