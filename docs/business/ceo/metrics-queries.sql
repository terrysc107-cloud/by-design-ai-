-- AI by Design — CEO read-only metrics query pack
-- ============================================================================
-- Supabase project: acouuzccqkcpyrckrgwg (the AI by Design app DB; read from SUPABASE_URL)
-- (Other Supabase projects in this org are DIFFERENT apps — never query them.)
--
-- 🔒 READ-ONLY. These are all SELECTs. The CEO must NEVER run INSERT/UPDATE/DELETE/DDL
--    against production. Confirm columns with `list_tables` before first use.
--
-- Funnel tables:
--   • bda_leads    — lead-magnet captures + 4-stage Resend drip
--   • bda_bookings — Calendly discovery-call bookings (+ intake completion state)
--   • bda_intake   — pre-call intake form (+ AI review status, budget)
-- Closed engagements / $ are NOT in Supabase yet — Chairman-supplied until a table exists.
-- ============================================================================


-- ── 1. Weekly dashboard (one-shot snapshot) ────────────────────────────────
-- Run this each weekly board meeting; paste results into METRICS-SNAPSHOT.md.
SELECT
  (SELECT count(*) FROM bda_leads)                                                      AS total_leads,
  (SELECT count(*) FROM bda_leads WHERE created_at > now() - interval '7 days')         AS new_leads_7d,
  (SELECT count(*) FROM bda_leads WHERE created_at > now() - interval '30 days')        AS new_leads_30d,
  (SELECT count(*) FROM bda_leads WHERE unsubscribed IS TRUE)                           AS unsubscribed,
  (SELECT json_object_agg(coalesce(drip_stage::text,'null'), c)
     FROM (SELECT drip_stage, count(*) c FROM bda_leads GROUP BY drip_stage) t)         AS drip_stage_breakdown,
  (SELECT count(*) FROM bda_bookings)                                                   AS total_bookings,
  (SELECT count(*) FROM bda_bookings WHERE status = 'created')                          AS active_bookings,
  (SELECT count(*) FROM bda_bookings WHERE status = 'canceled')                         AS canceled_bookings,
  (SELECT count(*) FROM bda_bookings WHERE scheduled_at > now() - interval '7 days')    AS bookings_7d,
  (SELECT count(*) FROM bda_bookings WHERE intake_completed IS TRUE)                    AS bookings_intake_done,
  (SELECT count(*) FROM bda_intake)                                                     AS total_intakes,
  (SELECT count(*) FROM bda_intake WHERE created_at > now() - interval '30 days')       AS intakes_30d,
  (SELECT json_object_agg(coalesce(ai_status,'null'), c)
     FROM (SELECT ai_status, count(*) c FROM bda_intake GROUP BY ai_status) t)          AS intake_ai_status;


-- ── 2. Lead growth trend (last 12 weeks) ───────────────────────────────────
SELECT date_trunc('week', created_at)::date AS week, count(*) AS leads
FROM bda_leads
WHERE created_at > now() - interval '12 weeks'
GROUP BY 1 ORDER BY 1;


-- ── 3. Funnel conversion (leads → booked → intake completed) ───────────────
SELECT
  (SELECT count(*) FROM bda_leads)                                  AS leads,
  (SELECT count(*) FROM bda_bookings)                              AS bookings,
  (SELECT count(*) FROM bda_bookings WHERE intake_completed IS TRUE) AS intakes_done,
  round(100.0 * (SELECT count(*) FROM bda_bookings)
        / nullif((SELECT count(*) FROM bda_leads),0), 1)           AS lead_to_booking_pct,
  round(100.0 * (SELECT count(*) FROM bda_bookings WHERE intake_completed IS TRUE)
        / nullif((SELECT count(*) FROM bda_bookings),0), 1)        AS booking_to_intake_pct;


-- ── 4. Intake budget mix (qualifies the pipeline) ──────────────────────────
-- Aggregate only; never export individual rows/PII into the repo.
SELECT coalesce(budget_range,'(unstated)') AS budget_range, count(*) AS intakes
FROM bda_intake
GROUP BY 1 ORDER BY 2 DESC;


-- ── 5. Intake industry / use-case mix (informs programmatic SEO targets) ───
SELECT coalesce(industry,'(unstated)') AS industry, count(*) AS intakes
FROM bda_intake
GROUP BY 1 ORDER BY 2 DESC
LIMIT 25;


-- ── 6. Upcoming discovery calls without completed intake (nudge candidates) ─
-- Count only — the intake-reminder cron handles the actual nudges.
SELECT count(*) AS upcoming_calls_missing_intake
FROM bda_bookings
WHERE status = 'created'
  AND intake_completed IS NOT TRUE
  AND scheduled_at > now();


-- ── 7. Drip funnel decay (how far leads get through the 4-email sequence) ──
SELECT drip_stage, count(*) AS leads,
       count(*) FILTER (WHERE unsubscribed IS TRUE) AS unsubscribed_here
FROM bda_leads
GROUP BY drip_stage ORDER BY drip_stage;
