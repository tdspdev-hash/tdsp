-- TDSP 0001_identity (v2) -- PREPARED, NOT APPLIED.
-- Scope: identity foundation only. profiles, staff/admin roles, minimal audit log,
-- and the sign-up trigger. No membership, payment, fee, category, consent-wording
-- or display-ID decisions are made here (those belong to 0002+).
--
-- Model: Public = no login. Member = DERIVED from an active row in a future
-- `memberships` table (0002); there is no member role here. Staff and Admin are
-- stored in user_roles. A login never implies membership.
--
-- Run as role `postgres` (Dashboard SQL Editor). One transaction: any error rolls
-- everything back. Real member data must not be loaded until TDSP owns the project.

begin;

-- ============================================================================
-- 1. Default privileges: new objects created by `postgres` start CLOSED.
--    Existing state (verified read-only on 20 Nov 2026): tables created by
--    postgres grant anon/authenticated/service_role D,x,t,m (TRUNCATE etc.);
--    functions in public are owner-only. Functions in other schemas (e.g. private)
--    get PostgreSQL's built-in default, EXECUTE for PUBLIC. That is NOT changed
--    globally on purpose: a global `revoke execute on functions from public` would
--    also hit functions created later by `postgres` in ANY schema, including those
--    made by CREATE EXTENSION (e.g. pg_trgm, unaccent), and break their use by
--    anon/authenticated. Instead every function in this migration is revoked
--    explicitly (section 6/7), and future migrations MUST do the same; verification
--    query V5 lists any function that anon can execute.
--    service_role is intentionally untouched (server-only, bypasses RLS).
--    Does NOT cover objects created by other roles (e.g. supabase_admin).
--    Scope of the three statements below: only tables/sequences/functions that
--    `postgres` creates in schema public from now on.
-- ============================================================================
alter default privileges for role postgres in schema public revoke all on tables    from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on sequences from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on functions from public, anon, authenticated;

-- ============================================================================
-- 2. Private schema (NOT exposed through the API; must not be in "Exposed schemas")
-- ============================================================================
-- PRE-APPLICATION CHECK (cannot be enforced from SQL): Dashboard > Settings > Data API
-- (exposed schemas) must NOT list `private`; verify query P1 in
-- supabase/verification/0001_identity_verify.sql. This migration does not change API
-- settings. Even if exposed by mistake, anon has no USAGE on the schema and the
-- helpers only describe the caller's own roles; log_audit is not executable by clients.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;   -- needed so RLS policies can call helpers

create type public.app_role as enum ('staff', 'admin');

create function private.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

create function private.block_mutation()
returns trigger language plpgsql set search_path = '' as $$
begin
  raise exception 'Table % is append-only (% not allowed)', tg_table_name, tg_op
    using errcode = '42501';
end $$;

-- ============================================================================
-- 3. profiles: descriptive data only. No status, role, membership or consent text.
-- ============================================================================
create table public.profiles (
  id                  uuid primary key references auth.users (id) on delete cascade,
  full_name           text not null check (char_length(full_name) between 1 and 200),
  phone               text check (phone ~ '^\+255[0-9]{9}$'),
  gender              text check (gender in ('male', 'female', 'none')),
  region              text check (char_length(region)     <= 100),
  district            text check (char_length(district)   <= 100),
  ward                text check (char_length(ward)       <= 100),
  village             text check (char_length(village)    <= 100),
  occupation          text check (char_length(occupation) <= 200),
  participation_areas text[] not null default '{}' check (cardinality(participation_areas) <= 8),
  consent_accepted_at timestamptz,           -- UNVERIFIED: set from user-controlled sign-up metadata; the verified declaration + version is recorded in 0002
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
comment on table public.profiles is 'One row per auth account. Not membership. Restricted personal data.';

create trigger profiles_touch before update on public.profiles
  for each row execute function private.touch_updated_at();

-- ============================================================================
-- 4. user_roles: staff/admin only. No client write path at all.
--    The first admin is inserted by the TDSP project owner (see bottom of file).
-- ============================================================================
create table public.user_roles (
  user_id    uuid not null references auth.users (id) on delete cascade,
  role       public.app_role not null,
  granted_by uuid,                            -- plain uuid, no FK: history survives account removal
  granted_at timestamptz not null default now(),
  primary key (user_id, role)
);
comment on table public.user_roles is 'Staff and admin only. Member status is derived from memberships (0002).';

-- ============================================================================
-- 5. audit_log: minimal, append-only. actor_id has NO foreign key so deleting an
--    account never needs to UPDATE the log (which the append-only trigger forbids).
-- ============================================================================
create table public.audit_log (
  id          bigint generated always as identity primary key,
  actor_id    uuid,
  action      text not null check (char_length(action) between 1 and 100),
  entity_type text not null check (char_length(entity_type) between 1 and 100),
  entity_id   uuid,
  details     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);
create index audit_log_entity_idx on public.audit_log (entity_type, entity_id);
create index audit_log_created_idx on public.audit_log (created_at desc);

create trigger audit_log_no_update_delete before update or delete on public.audit_log
  for each row execute function private.block_mutation();
create trigger audit_log_no_truncate before truncate on public.audit_log
  for each statement execute function private.block_mutation();

-- ============================================================================
-- 6. Role helpers (SECURITY DEFINER, empty search_path). They take NO user argument:
--    they always answer about the CALLER (auth.uid()), so no signed-in user can probe
--    another user's role, even if the private schema were ever exposed by mistake.
--    They exist as definer functions only to read user_roles without RLS recursion.
-- ============================================================================
create function private.has_role(p_role public.app_role)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.user_roles
    where user_id = (select auth.uid()) and role = p_role
  )
$$;

create function private.is_staff_or_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.user_roles where user_id = (select auth.uid())
  )
$$;

-- Server-side audit writer for later SECURITY DEFINER functions. Not callable by clients.
create function private.log_audit(p_action text, p_entity_type text, p_entity_id uuid, p_details jsonb default '{}'::jsonb)
returns void language sql security definer set search_path = '' as $$
  insert into public.audit_log (actor_id, action, entity_type, entity_id, details)
  values (auth.uid(), p_action, p_entity_type, p_entity_id, coalesce(p_details, '{}'::jsonb))
$$;

revoke all on function private.has_role(public.app_role)       from public, anon, authenticated;
revoke all on function private.is_staff_or_admin()             from public, anon, authenticated;
revoke all on function private.log_audit(text, text, uuid, jsonb) from public, anon, authenticated;
revoke all on function private.touch_updated_at()              from public, anon, authenticated;
revoke all on function private.block_mutation()                from public, anon, authenticated;
grant execute on function private.has_role(public.app_role) to authenticated;
grant execute on function private.is_staff_or_admin()       to authenticated;
-- log_audit: deliberately no grant; later definer functions run as the owner.

-- ============================================================================
-- 7. Sign-up trigger: copy descriptive metadata into profiles.
--    raw_user_meta_data is user-controlled: it is validated, truncated, and
--    NEVER used for roles or membership. It must not be able to fail sign-up.
-- ============================================================================
create function private.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
declare
  m jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  insert into public.profiles (
    id, full_name, phone, gender, region, district, ward, village,
    occupation, participation_areas, consent_accepted_at
  ) values (
    new.id,
    left(coalesce(nullif(btrim(m ->> 'full_name'), ''), 'Member'), 200),
    case when m ->> 'phone' ~ '^\+255[0-9]{9}$' then m ->> 'phone' end,
    case when m ->> 'gender' in ('male', 'female', 'none') then m ->> 'gender' end,
    nullif(left(btrim(m ->> 'region'), 100), ''),
    nullif(left(btrim(m ->> 'district'), 100), ''),
    nullif(left(btrim(m ->> 'ward'), 100), ''),
    nullif(left(btrim(m ->> 'village'), 100), ''),
    nullif(left(btrim(m ->> 'occupation'), 200), ''),
    case when jsonb_typeof(m -> 'areas') = 'array'
         then coalesce(array(select left(x, 50) from jsonb_array_elements_text(m -> 'areas') as x limit 8), '{}')
         else '{}'::text[] end,
    case when m ->> 'consent' = 'true' then now() end
  );
  return new;
end $$;
revoke all on function private.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function private.handle_new_user();

-- ============================================================================
-- 8. Grants (explicit, minimal) and RLS
-- ============================================================================
alter table public.profiles   enable row level security;
alter table public.user_roles enable row level security;
alter table public.audit_log  enable row level security;
-- NOTE: FORCE ROW LEVEL SECURITY is deliberately NOT used. The owner-run trigger
-- (handle_new_user) and SECURITY DEFINER helpers must be able to write/read these
-- tables; with FORCE they would be blocked by the absence of insert policies.

revoke all on public.profiles, public.user_roles, public.audit_log from public, anon, authenticated;

-- profiles: read (RLS-filtered); update descriptive columns only. No insert/delete:
-- rows are created by the trigger and removed with the auth account.
grant select on public.profiles to authenticated;
grant update (full_name, phone, gender, region, district, ward, village, occupation, participation_areas)
  on public.profiles to authenticated;

grant select on public.user_roles to authenticated;   -- no write grants
grant select on public.audit_log  to authenticated;   -- admin-only via policy; no write grants

-- profiles policies
create policy profiles_select_own on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy profiles_select_staff on public.profiles
  for select to authenticated using ((select private.is_staff_or_admin()));
create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- user_roles policies (read only)
create policy user_roles_select_own on public.user_roles
  for select to authenticated using (user_id = (select auth.uid()));
create policy user_roles_select_admin on public.user_roles
  for select to authenticated using ((select private.has_role('admin')));

-- audit_log policy (admins read; nobody writes through the API)
create policy audit_log_select_admin on public.audit_log
  for select to authenticated using ((select private.has_role('admin')));

commit;

-- ============================================================================
-- After applying, as the TDSP project owner, create the FIRST admin by hand.
-- Do this once, for a named person who has signed up, with MFA enabled.
-- Do NOT commit real ids. Run in the SQL Editor, not as part of this migration:
--
--   insert into public.user_roles (user_id, role) values ('<auth user uuid>', 'admin');
--   select private.log_audit('role.bootstrap_admin', 'user_role', '<auth user uuid>', '{}'::jsonb);
--
-- (log_audit uses auth.uid(), which is NULL in the SQL Editor, so actor_id will be
--  NULL for this one entry; that is expected for the bootstrap.)
-- ============================================================================
