import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '10 Things You Should Never Do Manually — By Design AI',
  description: 'A free automation audit guide for operators who are ready to get their time back.',
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
