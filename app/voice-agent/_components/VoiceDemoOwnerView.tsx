import type { OwnerOutput } from '@/lib/voice-demo'
import { VERTICAL_CARDS } from '@/lib/voice-demo-content'

const URGENCY_LABEL: Record<string, string> = {
  emergency: 'Emergency',
  urgent: 'Urgent',
  standard: 'Standard',
  flexible: 'Flexible',
}

const orDash = (value: string) => value || 'Not captured'

/**
 * The owner-side result of a demo call. Rendered from the sanitized
 * OwnerOutput only; React escapes every string, so caller-supplied text can
 * never become markup.
 */
export default function VoiceDemoOwnerView({
  output,
  example = false,
  headingId,
}: {
  output: OwnerOutput
  example?: boolean
  headingId?: string
}) {
  const label = VERTICAL_CARDS.find((c) => c.vertical === output.vertical)?.label ?? 'Demo'
  return (
    <article className="vd-owner" aria-labelledby={headingId}>
      <header className="vd-owner__head">
        <h3 id={headingId} tabIndex={-1}>
          New {label.toLowerCase()} lead
        </h3>
        {output.urgency && <span className={`vd-urgency vd-urgency--${output.urgency}`}>{URGENCY_LABEL[output.urgency]}</span>}
      </header>

      <p className="vd-owner__summary">{output.summary}</p>

      <dl className="vd-owner__facts">
        <div><dt>Need</dt><dd>{orDash(output.need)}</dd></div>
        <div><dt>Service requested</dt><dd>{orDash(output.service_requested)}</dd></div>
        <div><dt>Preferred timing</dt><dd>{orDash(output.preferred_timing)}</dd></div>
      </dl>

      {output.missing_information.length > 0 && (
        <div className="vd-owner__missing">
          <h4>Still needed</h4>
          <ul>
            {output.missing_information.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      )}

      {output.recommended_action && (
        <div className="vd-owner__action">
          <h4>Recommended next step</h4>
          <p>{output.recommended_action}</p>
        </div>
      )}

      {output.example_notification && (
        <figure className="vd-owner__notice">
          <figcaption>Example notification</figcaption>
          <p>{output.example_notification}</p>
        </figure>
      )}

      <p className="vd-owner__foot">
        {example ? 'Example owner alert. Simulated data.' : 'Simulated demo. No real service, booking, or dispatch was created.'}
      </p>
    </article>
  )
}
