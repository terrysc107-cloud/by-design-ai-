-- =============================================================================
-- REVIEW REQUIRED -- DO NOT AUTO-APPLY
--
-- This file is a reviewable migration, not an executed one. Nothing in this
-- repository runs it automatically (no build step, no deploy hook, no app
-- startup code references it). Terry applies it manually - via the Supabase
-- SQL editor or `supabase db push` against the correct project - only after
-- reviewing it.
--
-- Scope: creates ONE new table, `public.bda_voice_agent_waitlist`, for the
-- /voice-agent pre-launch waitlist (docs/features/voice-agent-waitlist.md).
-- Touches no existing table, policy, function, role, or grant. Contains no
-- project connection string, key, or other secret.
-- =============================================================================

begin;

-- No `if not exists`: if a table with this name already exists with an
-- incompatible shape, this statement must fail loudly rather than silently
-- leaving the old schema in place.
create table public.bda_voice_agent_waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  business_type text,
  created_at timestamptz not null default now(),
  source text not null default '/voice-agent',
  consent_version text not null,

  constraint bda_voice_agent_waitlist_email_unique
    unique (email),
  constraint bda_voice_agent_waitlist_email_normalized
    check (email = lower(btrim(email))),
  constraint bda_voice_agent_waitlist_email_length
    check (char_length(email) between 3 and 254),
  constraint bda_voice_agent_waitlist_email_shape
    check (email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  constraint bda_voice_agent_waitlist_business_type_shape
    check (
      business_type is null
      or (business_type = btrim(business_type) and char_length(business_type) between 1 and 200)
    ),
  constraint bda_voice_agent_waitlist_source_fixed
    check (source = '/voice-agent'),
  constraint bda_voice_agent_waitlist_consent_version_fixed
    check (consent_version = 'voice-agent-waitlist-v1')
);

comment on table public.bda_voice_agent_waitlist is
  'Pre-launch waitlist for the /voice-agent route. Isolated from bda_subscribers/bda_leads: no newsletter, drip, or CRM process reads or writes this table.';

-- Row Level Security is enabled, but no policy is created for anon or
-- authenticated. The browser never talks to Supabase directly for this
-- table - only the server-side service-role client (lib/supabase.ts ->
-- getSupabase(), called from app/api/voice-agent-waitlist/route.ts) inserts,
-- and the service role bypasses RLS by design.
alter table public.bda_voice_agent_waitlist enable row level security;

-- Lock the table down explicitly rather than relying on RLS alone.
revoke all on public.bda_voice_agent_waitlist from public;
revoke all on public.bda_voice_agent_waitlist from anon;
revoke all on public.bda_voice_agent_waitlist from authenticated;

-- service_role bypasses RLS already; granting explicit table privileges makes
-- the intent legible and keeps access working even if RLS is ever the only
-- thing standing between anon/authenticated and this table.
grant select, insert on public.bda_voice_agent_waitlist to service_role;

commit;

-- =============================================================================
-- Verification queries -- run manually AFTER applying. Not part of the
-- migration; nothing below this line executes as part of the transaction.
-- =============================================================================

-- Columns:
-- select column_name, data_type, is_nullable, column_default
-- from information_schema.columns
-- where table_schema = 'public' and table_name = 'bda_voice_agent_waitlist'
-- order by ordinal_position;

-- Constraints:
-- select conname, pg_get_constraintdef(oid)
-- from pg_constraint
-- where conrelid = 'public.bda_voice_agent_waitlist'::regclass;

-- RLS is enabled (expect true):
-- select relrowsecurity
-- from pg_class
-- where oid = 'public.bda_voice_agent_waitlist'::regclass;

-- Grants (expect only service_role: select, insert):
-- select grantee, privilege_type
-- from information_schema.role_table_grants
-- where table_schema = 'public' and table_name = 'bda_voice_agent_waitlist';

-- No anon/authenticated policy exists (expect 0 rows):
-- select *
-- from pg_policies
-- where schemaname = 'public' and tablename = 'bda_voice_agent_waitlist';

-- =============================================================================
-- Rollback -- DESTRUCTIVE, drops all collected waitlist data.
-- Do not run this if the table holds real signups without Terry's explicit
-- approval to discard them. Export first if in doubt:
--   copy (select * from public.bda_voice_agent_waitlist) to stdout with csv header;
--
-- begin;
-- drop table if exists public.bda_voice_agent_waitlist;
-- commit;
-- =============================================================================
