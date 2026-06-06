import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service — AI by Design',
  description:
    'The terms that govern use of the AI by Design website, free guide, and discovery call.',
  alternates: { canonical: '/terms' },
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-gold/50 text-xs tracking-widest uppercase hover:text-gold transition-colors mb-12 inline-block"
        >
          ← AI by Design
        </Link>

        <h1 className="text-3xl font-semibold text-white mb-2">Terms of Service</h1>
        <p className="text-white/40 text-sm mb-12">Last updated: May 2026</p>

        <div className="space-y-8 text-white/65 text-sm leading-loose">
          <section>
            <h2 className="text-white font-semibold mb-3">Agreement to Terms</h2>
            <p>
              By using the AI by Design website, requesting our free guide, or booking a discovery call, you agree to be bound by these Terms of Service. If you do not agree, do not use our services. AI by Design is a professional services company governed under the laws of the Commonwealth of Pennsylvania.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">Services</h2>
            <p>
              AI by Design provides AI automation and consulting services. Our entry point is a free discovery call booked through our website. Any paid engagement that follows is governed by a separate agreement made directly between you and AI by Design. The free guide and discovery call are provided at no cost and with no obligation.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">Free Consultation</h2>
            <p>
              The discovery call is free and carries no purchase obligation. If you are unable to attend a scheduled call, you may reschedule via the link in your booking confirmation. Repeated no-shows may result in us declining to reschedule.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">No Guaranteed Results</h2>
            <p>
              AI by Design does not guarantee any specific business outcomes, revenue growth, operational improvements, or return on investment as a result of our services. All advice and recommendations are based on the information provided by the client and the professional judgment of our advisors. Results will vary based on individual circumstances, implementation effort, and market conditions.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">Client Responsibilities</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Complete the pre-call intake questionnaire in full prior to your scheduled call</li>
              <li>Appear for scheduled calls on time and prepared</li>
              <li>Provide accurate and complete information about your business</li>
              <li>Implement recommendations at your own discretion and risk</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">Intellectual Property</h2>
            <p>
              All content, frameworks, methodologies, workflows, and materials provided by AI by Design — including Loom recordings, written action documents, workflow maps, and priority stacks — are the proprietary intellectual property of AI by Design. You are granted a non-exclusive, non-transferable license to use these materials for your own internal business purposes only. You may not resell, redistribute, reproduce, or create derivative works from our materials without prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">Confidentiality</h2>
            <p>
              AI by Design will treat information about your business as confidential and will not disclose it to third parties except as required by law or as necessary to deliver the service (e.g., scheduling tools, document delivery). You agree to treat any proprietary frameworks, methodologies, or systems shared by AI by Design as confidential.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, AI by Design and its owners, employees, and advisors shall not be liable for any indirect, incidental, consequential, special, or punitive damages arising out of or relating to your use of our services, including but not limited to lost profits, lost revenue, lost data, or business interruption, even if we have been advised of the possibility of such damages.
            </p>
            <p className="mt-3">
              Our total liability to you for any claims arising from these Terms or our free services shall not exceed one hundred US dollars ($100).
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">Governing Law and Dispute Resolution</h2>
            <p>
              These Terms of Service are governed by the laws of the Commonwealth of Pennsylvania, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be resolved through binding arbitration in Pennsylvania, except that either party may seek injunctive or equitable relief in a court of competent jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated date. Continued use of our services after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">Contact</h2>
            <p>
              For legal inquiries, contact us at:{' '}
              <a
                href="mailto:legal@aixdesign.dev"
                className="text-gold/70 hover:text-gold transition-colors"
              >
                legal@aixdesign.dev
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
