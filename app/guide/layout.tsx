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

/**
 * NO <html> OR <body> HERE.
 *
 * This layout used to render its own `<html><body>` nested inside the root
 * layout's, which is invalid in the App Router: only the root layout may emit
 * them. React found markup on the client that did not match the server, so
 * EVERY page under /guide failed hydration and fell back to client rendering
 * on every visit. /education, which has no nested layout, hydrates clean.
 *
 * That was quiet until /guide became the destination for social traffic and the
 * page a paid click would land on. It is the one page where a full client
 * re-render costs the most.
 *
 * It also no longer forces a light theme on the branch. /guide is now a dark
 * landing page and only /guide/read is light, so the light background moved
 * onto that page's own root where it belongs.
 */
export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
