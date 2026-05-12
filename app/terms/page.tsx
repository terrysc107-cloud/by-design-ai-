import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service — By Design AI',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-20">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-gold/50 text-xs tracking-widest uppercase hover:text-gold transition-colors mb-12 inline-block"
        >
          ← By Design AI
        </Link>

        <h1 className="text-3xl font-semibold text-white mb-2">Terms of Service</h1>
        <p className="text-white/40 text-sm mb-12">Last updated: May 2026</p>

        <div className="space-y-8 text-white/65 text-sm leading-loose">
          <section>
            <h2 className="text-white font-semibold mb-3">Agreement to Terms</h2>
            <p>
              By purchasing a service from By Design AI, you agree to be bound by these Terms of Service. If you do not agree, do not purchase or use our services. By Design AI is a professional services company governed under the laws of the Commonwealth of Pennsylvania.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">Services</h2>
            <p>
              By Design AI provides AI operations coaching and advisory services, including the AI Ops Audit (a 60-minute operational consultation delivered with a Loom walkthrough and action document). Services are delivered on a schedule agreed upon between the client and By Design AI following payment and completion of the intake form.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">No Refund Policy</h2>
            <p>
              <strong className="text-white">All sales are final. No refunds will be issued under any circumstances.</strong>
            </p>
            <p className="mt-3">
              This includes but is not limited to: change of mind, failure to complete the intake form, failure to appear for a scheduled call, scheduling conflicts, or dissatisfaction with outcomes. By purchasing our services, you acknowledge and accept this policy unconditionally.
            </p>
            <p className="mt-3">
              If you are unable to attend a scheduled call, we will make one attempt to reschedule at our sole discretion. We are not obligated to reschedule and may consider the service delivered.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">No Guaranteed Results</h2>
            <p>
              By Design AI does not guarantee any specific business outcomes, revenue growth, operational improvements, or return on investment as a result of our services. All advice and recommendations are based on the information provided by the client and the professional judgment of our advisors. Results will vary based on individual circumstances, implementation effort, and market conditions.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">Client Responsibilities</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Complete the intake form in full prior to your scheduled call</li>
              <li>Appear for scheduled calls on time and prepared</li>
              <li>Provide accurate and complete information about your business</li>
              <li>Implement recommendations at your own discretion and risk</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">Intellectual Property</h2>
            <p>
              All content, frameworks, methodologies, workflows, and materials provided by By Design AI — including Loom recordings, written action documents, workflow maps, and priority stacks — are the proprietary intellectual property of By Design AI. You are granted a non-exclusive, non-transferable license to use these materials for your own internal business purposes only. You may not resell, redistribute, reproduce, or create derivative works from our materials without prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">Confidentiality</h2>
            <p>
              By Design AI will treat information about your business as confidential and will not disclose it to third parties except as required by law or as necessary to deliver the service (e.g., scheduling tools, document delivery). You agree to treat any proprietary frameworks, methodologies, or systems shared by By Design AI as confidential.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, By Design AI and its owners, employees, and advisors shall not be liable for any indirect, incidental, consequential, special, or punitive damages arising out of or relating to your use of our services, including but not limited to lost profits, lost revenue, lost data, or business interruption, even if we have been advised of the possibility of such damages.
            </p>
            <p className="mt-3">
              Our total liability to you for any claims arising from these Terms or our services shall not exceed the amount you paid for the specific service giving rise to the claim.
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
                href="mailto:legal@bydesignai.com"
                className="text-gold/70 hover:text-gold transition-colors"
              >
                legal@bydesignai.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
