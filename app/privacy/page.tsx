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
        <p className="text-white/40 text-sm mb-12">Last updated: November 2026</p>

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

          <section id="voice-demo">
            <h2 className="text-white font-semibold mb-3">AI Receptionist Phone Demo</h2>
            <p>
              Our phone demo at aixdesign.dev/voice-agent connects you to an AI receptionist, not a person. Every demo call is simulated: no real tow, repair, appointment, estimate, dispatch, or payment is created.
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
              <li>
                <strong className="text-white/80">What we process:</strong> the phone number you call from, call timing, the demo profile you chose, and a written transcript of the call produced by speech-to-text. We use the transcript to create the owner summary shown on the page. We do not store call audio.
              </li>
              <li>
                <strong className="text-white/80">Demo codes and page links:</strong> the page issues a short-lived six-digit call code and a separate random session token so the summary appears in the right browser. Neither is placed in page URLs or sent to analytics.
              </li>
              <li>
                <strong className="text-white/80">Consent is separate:</strong> calling the demo line does not sign you up for marketing. A demo recap email and sales follow-up emails each require their own permission, and we ask you to confirm your email address first. You can opt out of either at any time.
              </li>
              <li>
                <strong className="text-white/80">Fit requests:</strong> if you submit the fit form, we use your name, business, email, optional phone, and answers to review the request and reply. Your answers are summarized for our own team; they are not sold or shared for others&apos; marketing.
              </li>
              <li>
                <strong className="text-white/80">Retention:</strong> demo records without follow-up permission are deleted after 30 days. Transcripts are kept for a shorter period than the structured lead summary. Records tied to an active sales conversation follow the Data Retention section below.
              </li>
              <li>
                <strong className="text-white/80">Analytics:</strong> we measure anonymous funnel steps (for example, which demo business was chosen and whether a fit request was sent). Each event carries only a random identifier created in your browser tab (kept in session storage and cleared when the tab closes), the demo business type, and a broad traffic-source category such as search or social. These events never include your name, email, phone number, call code, session token, or how your fit request was assessed.
              </li>
            </ul>
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
                <strong className="text-white/80">OpenAI:</strong> We use OpenAI&apos;s API to help us review intake questionnaire responses and prepare for your call, and to power and transcribe the AI receptionist phone demo. Review OpenAI&apos;s privacy policy at openai.com/policies/privacy-policy.
              </li>
              <li>
                <strong className="text-white/80">Twilio:</strong> Telephone connectivity for the AI receptionist phone demo. Twilio processes call routing data such as the calling number and call timing. Review Twilio&apos;s privacy notice at twilio.com/legal/privacy.
              </li>
              <li>
                <strong className="text-white/80">Telegram:</strong> Internal notifications to our team about new demo fit requests. Review Telegram&apos;s privacy policy at telegram.org/privacy.
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
