import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — By Design AI',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-gold/50 text-xs tracking-widest uppercase hover:text-gold transition-colors mb-12 inline-block"
        >
          ← By Design AI
        </Link>

        <h1 className="text-3xl font-semibold text-white mb-2">Privacy Policy</h1>
        <p className="text-white/40 text-sm mb-12">Last updated: May 2026</p>

        <div className="space-y-8 text-white/65 text-sm leading-loose">
          <section>
            <h2 className="text-white font-semibold mb-3">Overview</h2>
            <p>
              By Design AI (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the website bydesignai.com and provides AI operations coaching services. This Privacy Policy explains how we collect, use, and protect your information when you visit our site or purchase our services. We do not sell your data. Ever.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
              <li>
                <strong className="text-white/80">Payment information:</strong> When you purchase a service, your payment is processed by Stripe. We do not store your credit card number, CVV, or billing information. Stripe handles all payment data in accordance with PCI-DSS standards.
              </li>
              <li>
                <strong className="text-white/80">Contact and identity information:</strong> Your name and email address, collected during checkout and via our intake form (hosted by Jotform).
              </li>
              <li>
                <strong className="text-white/80">Business information:</strong> Details about your business operations that you share during the intake form and audit call.
              </li>
              <li>
                <strong className="text-white/80">Usage data:</strong> Standard web analytics data such as pages visited, time on site, and browser type, collected via server logs.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>To process your payment and confirm your purchase</li>
              <li>To send you intake form instructions after payment</li>
              <li>To schedule and conduct your audit call</li>
              <li>To deliver your Loom walkthrough and action document</li>
              <li>To respond to inquiries or support requests</li>
              <li>To improve our services and website</li>
            </ul>
            <p className="mt-3">We do not use your information for advertising or sell it to third parties.</p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">Third-Party Services</h2>
            <p>We use the following third-party services to operate our business:</p>
            <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
              <li>
                <strong className="text-white/80">Stripe:</strong> Payment processing. Stripe may collect your payment card information, billing address, and IP address. Review Stripe&apos;s privacy policy at stripe.com/privacy.
              </li>
              <li>
                <strong className="text-white/80">Jotform:</strong> Intake form collection. Your responses to the intake form are stored by Jotform in accordance with their privacy policy at jotform.com/privacy.
              </li>
              <li>
                <strong className="text-white/80">Vercel:</strong> Website hosting. Vercel may log standard server request data. Review Vercel&apos;s privacy policy at vercel.com/legal/privacy-policy.
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
              Our website uses minimal, technically necessary cookies. We do not use tracking cookies or advertising cookies. No third-party advertising networks have access to your data through our site.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">Security</h2>
            <p>
              We use industry-standard security practices to protect your information, including HTTPS encryption on all pages and secure payment processing through Stripe. No method of transmission over the internet is 100% secure, but we take reasonable steps to protect your data.
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
                href="mailto:privacy@bydesignai.com"
                className="text-gold/70 hover:text-gold transition-colors"
              >
                privacy@bydesignai.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
