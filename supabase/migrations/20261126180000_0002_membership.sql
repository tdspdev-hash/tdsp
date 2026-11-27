-- TDSP 0002_membership -- PREPARED, NOT APPLIED. Needs Ecky's review.
-- Scope: Phase 1 membership only: application, Application ID, admin decision, Member ID.
-- Depends on 0001_identity (user_roles, private.has_role, private.log_audit).
--
-- Decisions used (TDSP answers relayed 26 Nov 2026):
--   Member ID TDSP/0001/2026; applicants 18+; admins approve; applicants without email
--   apply with a phone number.
-- Deliberately absent until TDSP decides (add by later migration): date of birth, ID number,
-- passport photo, fees, payments, binding terms, signatures, card.
-- requested_category is the form's choice only (no price, not the Constitution's member types).
--
-- Write model: NO client insert/update/delete. Every write goes through the three
-- SECURITY DEFINER functions below. Two of them are callable WITHOUT login on purpose.
--
-- Run as role `postgres` (Dashboard SQL Editor). One transaction.

begin;

-- ============================================================================
-- 1. Applications (restricted personal data)
-- ============================================================================
create table public.membership_applications (
  id                   uuid primary key default gen_random_uuid(),
  reference            text not null unique,
  user_id              uuid references auth.users (id) on delete set null,  -- null: applied without an account
  full_name            text not null check (char_length(full_name) between 3 and 200),
  gender               text not null check (gender in ('male', 'female')),
  phone                text not null check (phone ~ '^\+255[0-9]{9}$'),
  email                text check (char_length(email) <= 254 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  region               text not null check (char_length(region)   between 1 and 100),
  district             text not null check (char_length(district) between 1 and 100),
  ward                 text not null check (char_length(ward)     between 1 and 100),
  village              text check (char_length(village) <= 100),
  occupation           text check (char_length(occupation) <= 200),
  applicant_type       text not null check (applicant_type in
                         ('farmer', 'livestock_keeper', 'fisher', 'entrepreneur',
                          'group', 'company_institution', 'other')),
  applicant_type_other text check (char_length(applicant_type_other) <= 100),
  requested_category   text not null check (requested_category in ('kawaida', 'hai', 'premium')),
  -- Declarations: all must be true. The wording version is stored with each application.
  is_adult             boolean not null check (is_adult),
  understands_not_lender        boolean not null check (understands_not_lender),
  understands_role              boolean not null check (understands_role),
  understands_no_entitlement    boolean not null check (understands_no_entitlement),
  data_consent         boolean not null check (data_consent),
  declaration_version  text not null check (char_length(declaration_version) between 1 and 40),
  status               text not null default 'submitted'
                         check (status in ('submitted', 'needs_correction', 'approved', 'rejected')),
  review_note          text check (char_length(review_note) <= 1000),   -- shown to the applicant
  reviewed_by          uuid,
  reviewed_at          timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  check (applicant_type <> 'other' or applicant_type_other is not null),
  check (status = 'submitted' or reviewed_at is not null)
);
comment on table public.membership_applications is 'Membership applications. Restricted personal data. Written only by definer functions.';

-- One open application per phone number (also closes the double-submit race).
create unique index membership_applications_open_phone on public.membership_applications (phone)
  where status = 'submitted';
create index membership_applications_status_idx on public.membership_applications (status, created_at desc);
create index membership_applications_user_idx on public.membership_applications (user_id);

create trigger membership_applications_touch before update on public.membership_applications
  for each row execute function private.touch_updated_at();

-- ============================================================================
-- 2. Memberships: an active row is what makes someone a Member
-- ============================================================================
create table public.memberships (
  id             uuid primary key default gen_random_uuid(),
  member_number  text not null unique check (member_number ~ '^TDSP/[0-9]{4,}/[0-9]{4}$'),
  application_id uuid not null unique references public.membership_applications (id) on delete restrict,
  user_id        uuid references auth.users (id) on delete set null,
  status         text not null default 'active' check (status in ('active', 'suspended', 'ended')),
  approved_by    uuid not null,
  approved_at    timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create unique index memberships_one_active_per_user on public.memberships (user_id)
  where status = 'active' and user_id is not null;

create trigger memberships_touch before update on public.memberships
  for each row execute function private.touch_updated_at();

-- ============================================================================
-- 3. Member number counter. One continuous sequence; the year is a label.
--    OPEN: whether numbering restarts each year, and the first number if paper
--    members already hold numbers (set last_value before the first approval).
-- ============================================================================
create table private.member_number_counter (
  only_row   boolean primary key default true check (only_row),
  last_value integer not null default 0 check (last_value >= 0)
);
insert into private.member_number_counter default values;
revoke all on private.member_number_counter from public, anon, authenticated;

-- ============================================================================
-- 4. Grants and RLS: owner reads own rows, admin reads all. Staff read nothing yet.
-- ============================================================================
alter table public.membership_applications enable row level security;
alter table public.memberships             enable row level security;
revoke all on public.membership_applications, public.memberships from public, anon, authenticated;
grant select on public.membership_applications, public.memberships to authenticated;

create policy membership_applications_select_own on public.membership_applications
  for select to authenticated using (user_id = (select auth.uid()));
create policy membership_applications_select_admin on public.membership_applications
  for select to authenticated using ((select private.has_role('admin')));
create policy memberships_select_own on public.memberships
  for select to authenticated using (user_id = (select auth.uid()));
create policy memberships_select_admin on public.memberships
  for select to authenticated using ((select private.has_role('admin')));

-- ============================================================================
-- 5. Submit (anon or signed in). Returns the Application ID.
--    Raises 'application_exists' if the phone has an open application, or the phone or
--    signed-in account has an active or suspended membership. The Application ID of the earlier one is never returned.
--    NOTE: anyone can call this. Bot protection / rate limiting must be in place
--    before launch; the database does not provide it.
-- ============================================================================
create function public.submit_membership_application(
  p_full_name text, p_gender text, p_phone text, p_region text, p_district text, p_ward text,
  p_applicant_type text, p_is_adult boolean, p_understands_not_lender boolean,
  p_understands_role boolean, p_understands_no_entitlement boolean, p_data_consent boolean,
  p_declaration_version text, p_requested_category text,
  p_email text default null, p_village text default null, p_occupation text default null,
  p_applicant_type_other text default null
) returns text
language plpgsql security definer set search_path = '' as $$
declare
  v_id        uuid;
  v_reference text;
  v_constraint text;
begin
  -- Serialise submit and approval for one phone. Both take this lock FIRST.
  perform pg_advisory_xact_lock(hashtextextended('membership:' || p_phone, 0));

  if exists (
    select 1 from public.memberships m
    join public.membership_applications a on a.id = m.application_id
    where m.status in ('active', 'suspended')
      and (a.phone = p_phone or m.user_id = auth.uid())
  ) then
    raise exception 'application_exists' using errcode = '23505';
  end if;

  v_reference := 'APP-' || to_char(now() at time zone 'Africa/Dar_es_Salaam', 'YYYY') || '-'
                 || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
  begin
    insert into public.membership_applications (
      reference, user_id, full_name, gender, phone, email, region, district, ward, village,
      occupation, applicant_type, applicant_type_other, is_adult, understands_not_lender,
      understands_role, understands_no_entitlement, data_consent, declaration_version,
      requested_category
    ) values (
      v_reference, auth.uid(), btrim(p_full_name), p_gender, p_phone,
      lower(nullif(btrim(p_email), '')), btrim(p_region), btrim(p_district), btrim(p_ward),
      nullif(btrim(p_village), ''), nullif(btrim(p_occupation), ''), p_applicant_type,
      nullif(btrim(p_applicant_type_other), ''), p_is_adult, p_understands_not_lender,
      p_understands_role, p_understands_no_entitlement, p_data_consent, p_declaration_version,
      p_requested_category
    ) returning id into v_id;
  exception when unique_violation then
    get stacked diagnostics v_constraint = constraint_name;
    if v_constraint = 'membership_applications_open_phone' then
      raise exception 'application_exists' using errcode = '23505';
    end if;
    raise;   -- e.g. a reference collision: not a duplicate applicant
  end;

  perform private.log_audit('membership.submitted', 'membership_application', v_id);
  return v_reference;
end $$;

-- ============================================================================
-- 6. Status check for applicants without an account: needs BOTH the Application ID
--    and the phone number. Returns null when they do not match.
-- ============================================================================
create function public.get_membership_application_status(p_reference text, p_phone text)
returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
           'status', a.status,
           'note', a.review_note,
           'member_number', m.member_number
         )
  from public.membership_applications a
  left join public.memberships m on m.application_id = a.id
  where a.reference = upper(btrim(p_reference)) and a.phone = p_phone
$$;

-- ============================================================================
-- 7. Decision (admin only). Only 'submitted' applications can be decided.
--    Approval creates the membership and the Member ID in the same transaction.
-- ============================================================================
create function public.review_membership_application(p_id uuid, p_decision text, p_note text default null)
returns text   -- Member ID on approval, otherwise null
language plpgsql security definer set search_path = '' as $$
declare
  v_app    public.membership_applications%rowtype;
  v_next   integer;
  v_number text;
  v_note   text := nullif(btrim(p_note), '');
  v_phone  text;
begin
  if not coalesce(private.has_role('admin'), false) then
    raise exception 'not_authorised' using errcode = '42501';
  end if;
  if p_decision is null or p_decision not in ('approved', 'needs_correction', 'rejected') then
    raise exception 'invalid_decision' using errcode = '22023';
  end if;
  if p_decision <> 'approved' and v_note is null then
    raise exception 'note_required' using errcode = '22023';
  end if;

  -- Lock order matters (no deadlock with submit): phone first, then the row.
  select phone into v_phone from public.membership_applications where id = p_id;
  perform pg_advisory_xact_lock(hashtextextended('membership:' || v_phone, 0));
  select * into v_app from public.membership_applications where id = p_id for update;
  if not found or v_app.status <> 'submitted' then
    raise exception 'not_reviewable' using errcode = '22023';
  end if;
  if v_app.user_id = auth.uid() then
    raise exception 'own_application' using errcode = '42501';
  end if;

  if p_decision = 'approved' and exists (
    select 1 from public.memberships m
    join public.membership_applications a on a.id = m.application_id
    where m.status in ('active', 'suspended')
      and (a.phone = v_app.phone or m.user_id = v_app.user_id)
  ) then
    raise exception 'already_member' using errcode = '23505';
  end if;

  update public.membership_applications
     set status = p_decision, review_note = v_note, reviewed_by = auth.uid(), reviewed_at = now()
   where id = p_id;

  if p_decision = 'approved' then
    update private.member_number_counter set last_value = last_value + 1
     where only_row returning last_value into v_next;
    v_number := 'TDSP/'
      || case when v_next < 10000 then lpad(v_next::text, 4, '0') else v_next::text end
      || '/' || to_char(now() at time zone 'Africa/Dar_es_Salaam', 'YYYY');
    insert into public.memberships (member_number, application_id, user_id, approved_by)
    values (v_number, p_id, v_app.user_id, auth.uid());
  end if;

  perform private.log_audit('membership.' || p_decision, 'membership_application', p_id,
                            jsonb_build_object('member_number', v_number));
  return v_number;
end $$;

-- ============================================================================
-- 8. Function grants: close first, then open only what is needed
-- ============================================================================
revoke all on function public.submit_membership_application(text, text, text, text, text, text, text, boolean, boolean, boolean, boolean, boolean, text, text, text, text, text, text) from public, anon, authenticated;
revoke all on function public.get_membership_application_status(text, text) from public, anon, authenticated;
revoke all on function public.review_membership_application(uuid, text, text) from public, anon, authenticated;

grant execute on function public.submit_membership_application(text, text, text, text, text, text, text, boolean, boolean, boolean, boolean, boolean, text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.get_membership_application_status(text, text) to anon, authenticated;
grant execute on function public.review_membership_application(uuid, text, text) to authenticated;

commit;
