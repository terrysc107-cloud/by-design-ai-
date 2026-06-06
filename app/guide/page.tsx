import Link from 'next/link'
import Image from 'next/image'

const items = [
  {
    num: '01',
    title: 'Lead Follow-Up',
    image: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DrmYRucVZ9jcLrx9L0KtAHJdQY/hf_20260526_031725_2b70d297-ef81-4b48-a2fc-f1f5ec17ddb7.png',
    problem: 'Every lead that doesn\'t hear from you within 5 minutes is 80% less likely to convert. Yet most operators respond hours later — or not at all.',
    cost: 'Estimated cost: 3–8 leads lost per month per delayed response.',
    fix: 'Build an instant automated response that fires the moment a lead submits a form, sends a DM, or calls after hours. Follow up with a 5-touch sequence over 14 days.',
    takeaway: 'Your next step: Map every entry point where a lead can contact you. Build one automated response for each.',
  },
  {
    num: '02',
    title: 'Appointment Reminders',
    image: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DrmYRucVZ9jcLrx9L0KtAHJdQY/hf_20260526_031728_108eff20-8f44-4356-b8b0-00c0c19f0d3f.png',
    problem: 'No-shows cost service businesses thousands per month. Most happen because nobody reminded the client — or the reminder came too late.',
    cost: 'Estimated cost: 2–5 no-shows per month at your average appointment value.',
    fix: 'Set up a 3-touch reminder sequence: 24 hours before, 1 hour before, and 15 minutes before the appointment. Add a 1-tap confirm/reschedule link.',
    takeaway: 'Your next step: Count your no-shows last month. Multiply by your session rate. That\'s what automation saves you.',
  },
  {
    num: '03',
    title: 'Client Onboarding',
    image: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DrmYRucVZ9jcLrx9L0KtAHJdQY/hf_20260526_031731_73e2fed2-ed3e-4e73-bec1-111cefc5cfb5.png',
    problem: 'Sending the same welcome email, intake form, contract, and next-steps message manually for every new client is pure waste — and inconsistent.',
    cost: 'Estimated cost: 45–90 minutes per new client on tasks that don\'t require a human.',
    fix: 'Trigger a complete onboarding workflow the moment a client signs or pays. Welcome email, intake form, contract, calendar link, and expectations — all automatic.',
    takeaway: 'Your next step: Write out every step of your current onboarding. Anything that\'s the same every time gets automated.',
  },
  {
    num: '04',
    title: 'Review & Reputation Requests',
    image: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DrmYRucVZ9jcLrx9L0KtAHJdQY/hf_20260526_031733_b59b3bbe-5bc5-4d37-ad64-22469d50157d.png',
    problem: '72% of customers will leave a review if asked — but only 6% are ever asked. Manual review requests never happen consistently.',
    cost: 'Estimated cost: 10–20 lost reviews per month, directly impacting search ranking and trust.',
    fix: 'Trigger a review request 24–48 hours after service completion. Personalize it with their name and what they purchased. Make it one tap.',
    takeaway: 'Your next step: Set a trigger for every closed job or completed service. One message. Automated every time.',
  },
  {
    num: '05',
    title: 'Invoice & Payment Follow-Up',
    image: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DrmYRucVZ9jcLrx9L0KtAHJdQY/hf_20260526_031736_3d12ce63-9081-4d88-ba72-0c2bfc238c43.png',
    problem: 'Chasing unpaid invoices manually is uncomfortable, inconsistent, and time-consuming. Most operators let them sit too long.',
    cost: 'Estimated cost: 15–30 days added to payment cycles. Cash flow problems that shouldn\'t exist.',
    fix: 'Build a 3-touch payment sequence: a reminder the day before due, a follow-up 3 days after, and a final notice at 7 days. Automate it with a payment link in every message.',
    takeaway: 'Your next step: Look at your last 10 late invoices. Every one of them could have been followed up automatically.',
  },
  {
    num: '06',
    title: 'Social Media Scheduling',
    image: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DrmYRucVZ9jcLrx9L0KtAHJdQY/hf_20260526_031739_0d9e88d5-0401-44ac-b6ff-cdb6f01148da.png',
    problem: 'Posting manually means feast or famine — you post when you remember, go dark when life gets busy, and lose momentum every time.',
    cost: 'Estimated cost: Inconsistent presence = lower reach, fewer inbound leads, weaker authority.',
    fix: 'Batch-create 2 weeks of content in one session and schedule all of it. Use a tool that posts across platforms automatically so you never have to think about it again mid-week.',
    takeaway: 'Your next step: Block 90 minutes this week to batch content. Schedule it all before you leave that session.',
  },
  {
    num: '07',
    title: 'Lead Qualification',
    image: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DrmYRucVZ9jcLrx9L0KtAHJdQY/hf_20260526_031742_4d9d1e17-8869-4899-8662-03688198206c.png',
    problem: 'Answering the same 5 pre-sale questions over DM, email, or phone consumes hours every week — for leads that often aren\'t even a fit.',
    cost: 'Estimated cost: 5–10 hours per week on conversations that don\'t convert.',
    fix: 'Build a qualification form or AI chat sequence that asks your standard questions upfront. Only book calls with people who pass the criteria.',
    takeaway: 'Your next step: Write down the 5 questions you ask every potential client. Turn those into a form that runs automatically.',
  },
  {
    num: '08',
    title: 'Reporting & Analytics',
    image: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DrmYRucVZ9jcLrx9L0KtAHJdQY/hf_20260526_031745_902e7936-2b00-4cdf-b041-9bbe94af6837.png',
    problem: 'Manually pulling numbers from multiple platforms into a spreadsheet every week is a half-day task that kills momentum.',
    cost: 'Estimated cost: 3–6 hours per week on data gathering that adds zero value.',
    fix: 'Connect your platforms to a single dashboard that aggregates and updates automatically. Revenue, leads, bookings, and KPIs — all in one place, updated daily.',
    takeaway: 'Your next step: List every place you pull data from. That list is your integration map.',
  },
  {
    num: '09',
    title: 'Re-Engagement Campaigns',
    image: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DrmYRucVZ9jcLrx9L0KtAHJdQY/hf_20260526_031747_43ebdda7-43dd-44fa-86ee-16bf88ca5c10.png',
    problem: 'Your old leads and inactive clients are your warmest potential business. But manually reaching out to them almost never happens.',
    cost: 'Estimated cost: Hundreds of warm contacts sitting untouched while you chase cold traffic.',
    fix: 'Build a 90-day re-engagement sequence that runs automatically for all contacts who haven\'t interacted in 60+ days. Keep it personal — name, context, simple ask.',
    takeaway: 'Your next step: Export your contact list. Filter by last interaction date. Everyone over 60 days goes into your re-engagement flow.',
  },
  {
    num: '10',
    title: 'Calendar & Scheduling',
    image: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DrmYRucVZ9jcLrx9L0KtAHJdQY/hf_20260526_031750_05470fe2-fae1-4f99-8000-8f6c7902c5fd.png',
    problem: 'Back-and-forth scheduling emails are one of the most consistent time wasters in any service business. Every round trip is 10–15 minutes gone.',
    cost: 'Estimated cost: 1–3 hours per week on emails that a link could eliminate entirely.',
    fix: 'Replace all scheduling conversations with a single calendar link. Set your availability once. Let contacts book themselves. No more back and forth.',
    takeaway: 'Your next step: Set up your booking link today. Put it in your email signature, your bio, and everywhere you communicate.',
  },
]

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Header */}
      <div className="bg-zinc-950 text-white px-6 py-4 flex items-center justify-between">
        <span className="text-[11px] tracking-[0.3em] uppercase text-zinc-400 font-medium">
          AI by Design — Free Guide
        </span>
        <Link
          href="/"
          className="text-[11px] tracking-widest uppercase text-amber-500 hover:text-amber-400 transition-colors"
        >
          Back to Site →
        </Link>
      </div>

      {/* Cover */}
      <div className="bg-zinc-950 text-white px-6 py-20 md:py-32 text-center">
        <p className="text-amber-500 text-[10px] tracking-[0.4em] uppercase font-medium mb-6">
          AI by Design · Automation Guide
        </p>
        <h1 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight max-w-3xl mx-auto mb-6">
          10 Things In Your Business You Should Never Do Manually
        </h1>
        <p className="text-zinc-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          A straight-to-the-point breakdown of the tasks draining your time every week — and
          exactly what to automate first.
        </p>
        <div className="mt-10 inline-block border border-amber-500/30 px-6 py-3">
          <p className="text-zinc-400 text-xs tracking-widest uppercase">
            Read time: approx. 12 minutes
          </p>
        </div>
      </div>

      {/* Intro */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="border-l-4 border-amber-500/40 pl-8 space-y-4 text-zinc-600 leading-relaxed">
          <p>
            Most business owners know they should be automating more. The problem isn&apos;t
            awareness — it&apos;s knowing where to start.
          </p>
          <p>
            This guide cuts straight to the 10 processes that drain the most time from operators at
            every level — and shows you exactly what to build first.
          </p>
          <p className="text-zinc-900 font-medium">
            You don&apos;t need to automate everything. You need to automate the right things. Start here.
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="max-w-3xl mx-auto px-6 pb-20 space-y-16">
        {items.map((item) => (
          <div key={item.num} className="border-t border-zinc-200 pt-12">
            {/* Number + title */}
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-amber-500 text-sm font-medium tracking-widest">{item.num}</span>
              <h2 className="text-xl md:text-2xl font-semibold text-zinc-900">{item.title}</h2>
            </div>

            {/* Diagram image */}
            {item.image ? (
              <div className="w-full relative mb-8 rounded-sm overflow-hidden border border-zinc-200">
                <Image
                  src={item.image}
                  alt={`${item.title} automation flow diagram`}
                  width={1376}
                  height={768}
                  className="w-full h-auto block"
                />
              </div>
            ) : (
              <div className="w-full h-48 bg-zinc-100 border border-zinc-200 flex items-center justify-center mb-8 rounded-sm">
                <p className="text-zinc-400 text-xs tracking-widest text-center">
                  [ Diagram: {item.title} automation flow ]
                </p>
              </div>
            )}

            <div className="space-y-5 text-zinc-600 text-sm md:text-base leading-relaxed">
              {/* Problem */}
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 font-medium mb-2">
                  The Problem
                </p>
                <p>{item.problem}</p>
              </div>

              {/* Cost */}
              <div className="bg-amber-50 border border-amber-200/60 px-5 py-4 rounded-sm">
                <p className="text-amber-700 text-sm font-medium">{item.cost}</p>
              </div>

              {/* Fix */}
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 font-medium mb-2">
                  The Fix
                </p>
                <p>{item.fix}</p>
              </div>

              {/* Takeaway */}
              <div className="border-l-2 border-zinc-900 pl-5">
                <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 font-medium mb-2">
                  Your Next Step
                </p>
                <p className="text-zinc-900 font-medium">{item.takeaway}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Final CTA */}
      <div className="bg-zinc-950 text-white px-6 py-20 text-center">
        <p className="text-amber-500 text-[10px] tracking-[0.4em] uppercase font-medium mb-6">
          Ready to Build?
        </p>
        <h2 className="text-2xl md:text-4xl font-semibold tracking-tight mb-4 max-w-xl mx-auto">
          You Know What to Fix. Let&apos;s Build It Together.
        </h2>
        <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-md mx-auto mb-10">
          Book a free 15-minute call. Tell me which of these is costing you the most. I&apos;ll tell
          you exactly what to build and what it takes.
        </p>
        <a
          href="https://calendly.com/terrysc107/15-min-ai-discovery-call"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border border-amber-500 text-amber-500 px-10 py-4 text-xs tracking-widest uppercase hover:bg-amber-500 hover:text-black transition-colors duration-200"
        >
          Let&apos;s Talk →
        </a>
        <p className="text-zinc-600 text-[10px] tracking-widest uppercase mt-6">
          Free · No commitment · 15 minutes
        </p>
      </div>

      {/* Footer */}
      <div className="bg-zinc-950 border-t border-white/5 px-6 py-6 text-center">
        <p className="text-zinc-600 text-xs">© 2026 AI by Design. All rights reserved.</p>
      </div>
    </div>
  )
}
