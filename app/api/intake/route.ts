import { NextRequest, NextResponse } from 'next/server'
import { getResend, FROM_EMAIL, LEAD_NOTIFY_EMAIL } from '@/lib/resend'
import { intakeReviewEmail } from '@/lib/emails'
import { getSupabase, hasSupabase } from '@/lib/supabase'
import { hasOpenAI } from '@/lib/openai'
import { reviewIntake, type IntakeSubmission } from '@/lib/ai-review'

export const maxDuration = 60

// Fields we accept from the intake form (besides name/email).
const TEXT_FIELDS: Array<keyof IntakeSubmission> = [
  'company', 'website', 'industry', 'years_in_business', 'team_size', 'role',
  'current_tools', 'whats_automated', 'whats_manual', 'tech_stack',
  'staff_responsibilities', 'biggest_time_sink', 'ai_usage', 'ai_comfort',
  'ai_concerns', 'goals_90d', 'biggest_bottleneck', 'budget_range', 'anything_else',
]

const MAX_LEN = 4000

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Honeypot: real users never fill this hidden field. Bots do. Silently OK.
    if (body.company_url) {
      return NextResponse.json({ success: true })
    }

    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Collect + cap the optional text fields.
    const submission: IntakeSubmission = { name, email }
    for (const f of TEXT_FIELDS) {
      const v = body[f]
      if (typeof v === 'string' && v.trim()) {
        submission[f] = v.trim().slice(0, MAX_LEN)
      }
    }

    // 1. Store the raw submission first so AI/email failures never lose data.
    let rowId: string | null = null
    if (hasSupabase()) {
      try {
        const { data } = await getSupabase()
          .from('bda_intake')
          .insert({ ...submission, ai_status: 'pending' })
          .select('id')
          .single()
        rowId = data?.id ?? null
      } catch (dbErr) {
        console.error('Intake insert failed (non-fatal):', dbErr)
      }
    }

    // 2. Run the AI review (best-effort).
    let aiRecommendations: string | null = null
    let aiStatus: 'completed' | 'skipped' | 'failed' = 'skipped'
    if (hasOpenAI()) {
      try {
        aiRecommendations = await reviewIntake(submission)
        aiStatus = 'completed'
      } catch (aiErr) {
        console.error('AI intake review failed (non-fatal):', aiErr)
        aiStatus = 'failed'
      }
    }

    // 3. Persist AI output back onto the row.
    if (rowId && hasSupabase()) {
      try {
        await getSupabase()
          .from('bda_intake')
          .update({ ai_recommendations: aiRecommendations, ai_status: aiStatus })
          .eq('id', rowId)
      } catch (dbErr) {
        console.error('Intake AI update failed (non-fatal):', dbErr)
      }
    }

    // 4. Mark the matching booking complete so reminders stop.
    if (hasSupabase()) {
      try {
        const { data: booking } = await getSupabase()
          .from('bda_bookings')
          .select('id')
          .eq('email', email)
          .neq('status', 'canceled')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
        if (booking?.id) {
          await getSupabase()
            .from('bda_bookings')
            .update({ intake_completed: true, intake_next_reminder_at: null })
            .eq('id', booking.id)
        }
      } catch (dbErr) {
        console.error('Booking intake-complete update failed (non-fatal):', dbErr)
      }
    }

    // 5. Email the owner the submission + AI plan (best-effort).
    if (process.env.RESEND_API_KEY) {
      try {
        const mail = intakeReviewEmail(submission, aiRecommendations, aiStatus)
        await getResend().emails.send({
          from: FROM_EMAIL,
          to: LEAD_NOTIFY_EMAIL,
          replyTo: email,
          subject: mail.subject,
          html: mail.html,
          text: mail.text,
        })
      } catch (mailErr) {
        console.error('Intake owner email failed (non-fatal):', mailErr)
      }
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
