import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — AI by Design',
  description:
    'How AI by Design collects, uses, and protects your information. We do not sell your data.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-gold/50 text-xs tracking-widest uppercase hover:text-gold transition-colors mb-12 inline-block"
        >
          ← AI by Design
        </Link>

        <h1 className="text-3xl font-semibold text-white mb-2">Privacy Policy</h1>
        <p className="text-white/40 text-sm mb-12">Last updated: May 2026</p>

        <div className="space-y-8 text-white/65 text-sm leading-loose">
          <section>
            <h2 className="text-white font-semibold mb-3">Overview</h2>
            <p>
              AI by Design (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the website aixdesign.dev and provides AI automation and consulting services. This Privacy Policy explains how we collect, use, and protect your information when you visit our site, request our free guide, or book a discovery call. We do not sell your data. Ever.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
              <li>
                <strong className="text-white/80">Contact and identity information:</strong> Your name and email address, collected when you request our free guide or book a discovery call.
              </li>
              <li>
                <strong className="text-white/80">Business information:</strong> Details about your business operations that you share in our pre-call intake questionnaire and on your discovery call.
              </li>
              <li>
                <strong className="text-white/80">Usage data:</strong> Standard web analytics data such as pages visited, time on site, and browser type, collected via server logs.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>To deliver the free guide you requested</li>
              <li>To send you occasional educational follow-up emails (you can unsubscribe any time)</li>
              <li>To schedule and prepare for your discovery call</li>
              <li>To review your intake questionnaire so we arrive prepared</li>
              <li>To respond to inquiries or support requests</li>
              <li>To improve our services and website</li>
            </ul>
            <p className="mt-3">We may use aggregated, cookie-based analytics and advertising pixels to measure how the site performs and to reach similar audiences with our own ads. We never sell your information to third parties.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">Third-Party Services</h2>
            <p>We use the following third-party services to operate our business:</p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
              <li>
                <strong className="text-white/80">Resend:</strong> Email delivery. We use Resend to send the guide, follow-up emails, and notifications. Review Resend&apos;s privacy policy at resend.com/legal/privacy-policy.
              </li>
              <li>
                <strong className="text-white/80">Supabase:</strong> Secure database storage for your contact and questionnaire information. Review Supabase&apos;s privacy policy at supabase.com/privacy.
              </li>
              <li>
                <strong className="text-white/80">Calendly:</strong> Discovery-call scheduling. Calendly collects the details you provide when booking. Review Calendly&apos;s privacy policy at calendly.com/privacy.
              </li>
              <li>
                <strong className="text-white/80">OpenAI:</strong> We use OpenAI&apos;s API to help us review intake questionnaire responses and prepare for your call. Review OpenAI&apos;s privacy policy at openai.com/policies/privacy-policy.
              </li>
              <li>
                <strong className="text-white/80">Vercel:</strong> Website hosting and privacy-friendly traffic analytics. Vercel may log standard server request data. Review Vercel&apos;s privacy policy at vercel.com/legal/privacy-policy.
              </li>
              <li>
                <strong className="text-white/80">Google Analytics:</strong> Aggregated, cookie-based website analytics (pages visited, traffic sources, on-site behavior) used to improve the site. Review Google&apos;s privacy policy at policies.google.com/privacy.
              </li>
              <li>
                <strong className="text-white/80">Meta (Facebook) Pixel:</strong> Measures the performance of our ads and helps us show relevant ads on Meta platforms. Review Meta&apos;s privacy policy at facebook.com/privacy/policy.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">Data Retention</h2>
            <p>
              We retain your contact information and business information for the duration of our service engagement and for up to 3 years thereafter, for legal and business record purposes. You may request deletion of your data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
              <li>Request access to the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information (subject to legal retention requirements)</li>
              <li>Opt out of any marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">Cookies</h2>
            <p>
              Our website uses technically necessary cookies plus analytics and advertising cookies from Google Analytics and the Meta Pixel, which help us understand site performance and measure our advertising. You can block cookies in your browser settings or opt out of personalized ads via your Google and Meta ad-settings pages. Blocking these cookies will not affect your ability to request the guide or book a call.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">Security</h2>
            <p>
              We use industry-standard security practices to protect your information, including HTTPS encryption on all pages and access-controlled database storage. No method of transmission over the internet is 100% secure, but we take reasonable steps to protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">Governing Law</h2>
            <p>
              This Privacy Policy is governed by the laws of the Commonwealth of Pennsylvania, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">Contact</h2>
            <p>
              For privacy-related questions or requests, contact us at:{' '}
              <a
                href="mailto:privacy@aixdesign.dev"
                className="text-gold/70 hover:text-gold transition-colors"
              >
                privacy@aixdesign.dev
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
