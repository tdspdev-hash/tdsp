-- TDSP 0004_projects -- PREPARED, NOT APPLIED.
-- Scope: information-only project records for the Miradi & Andiko list and detail pages.
-- NO money: no funding target, no contributions, no donors, no payments (those are the
-- separate, unapproved funding migration under TDSP-CR-2026-001).
-- Status of the feature: additional scope (Category 4). Approved by Ecky on 20 Nov 2026 as
-- information-only; TDSP written approval is still pending. Do not apply until Ecky approves
-- this SQL. Depends on 0001_identity (private.touch_updated_at, private.has_role,
-- private.is_staff_or_admin). Does not touch 0002 (membership) or 0003 (receipts).
--
-- Model: `projects` holds ONLY public-safe fields, so anon can read published rows without
-- any column filtering. Staff-only data (owner, notes) lives in `project_admin`.
-- Sample rows are labelled is_sample = true and are NOT real TDSP records.
--
-- Run as role `postgres`. One transaction: any error rolls everything back.

begin;

-- ============================================================================
-- 1. projects (public-safe fields only)
-- ============================================================================
create table public.projects (
  id                 uuid primary key default gen_random_uuid(),
  project_number     bigint generated always as identity unique,   -- display format (e.g. TDSP-PRJ-2026-00001) is undecided; format at read time
  slug               text not null unique
                       check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 60),
  title_sw           text not null check (char_length(title_sw)   between 1 and 200),
  title_en           text not null check (char_length(title_en)   between 1 and 200),
  summary_sw         text not null check (char_length(summary_sw) between 1 and 300),
  summary_en         text not null check (char_length(summary_en) between 1 and 300),
  description_sw     text not null check (char_length(description_sw) <= 5000),
  description_en     text not null check (char_length(description_en) <= 5000),
  objectives_sw      text check (char_length(objectives_sw) <= 3000),   -- one objective per line
  objectives_en      text check (char_length(objectives_en) <= 3000),
  target_group_sw    text check (char_length(target_group_sw) <= 500),  -- groups in general terms only; never named beneficiaries
  target_group_en    text check (char_length(target_group_en) <= 500),
  category           text check (char_length(category) <= 100),         -- free text until TDSP approves a list
  location           text check (char_length(location) <= 200),         -- region/district level; no exact pin
  period_label       text check (char_length(period_label) <= 50),      -- display text such as "2025-2027" (used by samples)
  start_date         date,
  end_date           date,
  status             text not null default 'planned'
                       check (status in ('planned', 'ongoing', 'completed', 'cancelled')),
  publication_status text not null default 'draft'
                       check (publication_status in ('draft', 'published', 'archived')),
  is_sample          boolean not null default false,                    -- true = demo record, NOT a real TDSP project
  cover_image_path   text check (char_length(cover_image_path) <= 300), -- site asset path or, later, a Storage path
  published_at       timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  check (end_date is null or start_date is null or end_date >= start_date),
  check (publication_status <> 'published' or published_at is not null)
);
comment on table public.projects is 'Information-only project records (no money). Public-safe columns only; staff data is in project_admin. is_sample marks demo rows.';
create index projects_listing_idx on public.projects (publication_status, status);

create trigger projects_touch before update on public.projects
  for each row execute function private.touch_updated_at();

-- ============================================================================
-- 2. project_admin (staff-only: administrative owner, internal notes)
-- ============================================================================
create table public.project_admin (
  project_id    uuid primary key references public.projects (id) on delete cascade,
  owner_id      uuid,                        -- administrative owner; plain uuid, no FK, so history survives account removal
  created_by    uuid default auth.uid(),
  internal_note text check (char_length(internal_note) <= 2000),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
comment on table public.project_admin is 'Staff-only data for a project (owner, notes). Never readable by the public.';

create trigger project_admin_touch before update on public.project_admin
  for each row execute function private.touch_updated_at();

-- ============================================================================
-- 3. project_documents (metadata only; files go to Storage in a later migration)
-- ============================================================================
create table public.project_documents (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references public.projects (id) on delete cascade,
  title_sw     text not null check (char_length(title_sw) between 1 and 200),
  title_en     text not null check (char_length(title_en) between 1 and 200),
  storage_path text not null check (char_length(storage_path) <= 300),
  visibility   text not null default 'staff' check (visibility in ('public', 'staff')),
  created_by   uuid default auth.uid(),
  created_at   timestamptz not null default now()
);
comment on table public.project_documents is 'Metadata for project documents. Public only when visibility = public and the project is published.';
create index project_documents_project_idx on public.project_documents (project_id);

-- ============================================================================
-- 4. Grants (explicit, minimal) and RLS. New tables already start closed (0001 default
--    privileges); the revoke is repeated so this file is self-evidently safe.
-- ============================================================================
alter table public.projects          enable row level security;
alter table public.project_admin     enable row level security;
alter table public.project_documents enable row level security;

revoke all on public.projects, public.project_admin, public.project_documents from public, anon, authenticated;

grant select on public.projects, public.project_documents to anon;

-- Authenticated users get column-level write grants only; RLS below decides which rows.
-- Excluded on purpose: id, project_number, created_at, updated_at, created_by (set by the database).
grant select, delete on public.projects, public.project_admin, public.project_documents to authenticated;
grant insert (slug, title_sw, title_en, summary_sw, summary_en, description_sw, description_en,
              objectives_sw, objectives_en, target_group_sw, target_group_en, category, location,
              period_label, start_date, end_date, status, publication_status, is_sample,
              cover_image_path, published_at)
  on public.projects to authenticated;
grant update (slug, title_sw, title_en, summary_sw, summary_en, description_sw, description_en,
              objectives_sw, objectives_en, target_group_sw, target_group_en, category, location,
              period_label, start_date, end_date, status, publication_status, is_sample,
              cover_image_path, published_at)
  on public.projects to authenticated;
grant insert (project_id, owner_id, internal_note) on public.project_admin to authenticated;
grant update (owner_id, internal_note)             on public.project_admin to authenticated;
grant insert (project_id, title_sw, title_en, storage_path, visibility) on public.project_documents to authenticated;
grant update (title_sw, title_en, storage_path, visibility)             on public.project_documents to authenticated;

-- projects --------------------------------------------------------------------
create policy projects_select_public on public.projects
  for select to anon using (publication_status = 'published');

create policy projects_select_authenticated on public.projects
  for select to authenticated
  using (publication_status = 'published' or (select private.is_staff_or_admin()));

-- Staff may create and edit DRAFTS only. Only an admin may publish, unpublish, edit
-- published rows or delete. (Whether staff may publish is decision DB-02.)
create policy projects_insert_staff on public.projects
  for insert to authenticated
  with check (
    (select private.has_role('admin'))
    or ((select private.is_staff_or_admin()) and publication_status = 'draft')
  );

create policy projects_update_staff on public.projects
  for update to authenticated
  using (
    (select private.has_role('admin'))
    or ((select private.is_staff_or_admin()) and publication_status = 'draft')
  )
  with check (
    (select private.has_role('admin'))
    or ((select private.is_staff_or_admin()) and publication_status = 'draft')
  );

create policy projects_delete_admin on public.projects
  for delete to authenticated using ((select private.has_role('admin')));

-- project_admin (staff only) ----------------------------------------------------
create policy project_admin_select_staff on public.project_admin
  for select to authenticated using ((select private.is_staff_or_admin()));
create policy project_admin_insert_staff on public.project_admin
  for insert to authenticated with check ((select private.is_staff_or_admin()));
create policy project_admin_update_staff on public.project_admin
  for update to authenticated
  using ((select private.is_staff_or_admin()))
  with check ((select private.is_staff_or_admin()));
create policy project_admin_delete_admin on public.project_admin
  for delete to authenticated using ((select private.has_role('admin')));

-- project_documents --------------------------------------------------------------
create policy project_documents_select_public on public.project_documents
  for select to anon
  using (
    visibility = 'public'
    and exists (select 1 from public.projects p where p.id = project_id and p.publication_status = 'published')
  );

create policy project_documents_select_authenticated on public.project_documents
  for select to authenticated
  using (
    (select private.is_staff_or_admin())
    or (visibility = 'public'
        and exists (select 1 from public.projects p where p.id = project_id and p.publication_status = 'published'))
  );

create policy project_documents_insert_staff on public.project_documents
  for insert to authenticated with check ((select private.is_staff_or_admin()));
create policy project_documents_update_staff on public.project_documents
  for update to authenticated
  using ((select private.is_staff_or_admin()))
  with check ((select private.is_staff_or_admin()));
create policy project_documents_delete_admin on public.project_documents
  for delete to authenticated using ((select private.has_role('admin')));

-- ============================================================================
-- 5. SAMPLE rows (is_sample = true). These are the three mockup projects already shown
--    on the site with a visible "sample" note. They are NOT real TDSP records and carry
--    no money, funding target, beneficiary name or donor. Remove or hide them once TDSP
--    supplies real projects (decision DB-05). Texts mirror the site dictionaries.
-- ============================================================================
insert into public.projects (
  slug, title_sw, title_en, summary_sw, summary_en, description_sw, description_en,
  objectives_sw, objectives_en, target_group_sw, target_group_en,
  location, period_label, status, publication_status, is_sample, cover_image_path, published_at
) values
(
  'irrigation',
  'Mradi wa Kilimo cha Umwagiliaji', 'Irrigation Farming Project',
  'Kuimarisha uzalishaji wa mazao kwa teknolojia ya umwagiliaji.', 'Strengthening crop production with irrigation technology.',
  'Mradi huu unalenga kuwasaidia wakulima kuzalisha mazao kwa uhakika zaidi kwa kutumia teknolojia rahisi za umwagiliaji.' || E'\n\n' || 'Unahusisha kuonyesha mbinu za umwagiliaji shambani na kuwafundisha wakulima jinsi ya kuzitumia na kuzitunza.',
  'This project aims to help farmers grow crops more reliably using simple irrigation technology.' || E'\n\n' || 'It involves demonstrating irrigation methods on the farm and teaching farmers how to use and maintain them.',
  'Kuimarisha uzalishaji wa mazao katika kipindi cha ukame.' || E'\n' || 'Kuwajengea wakulima uwezo wa kutumia teknolojia ya umwagiliaji.' || E'\n' || 'Kuhimiza matumizi bora ya maji shambani.',
  'Strengthen crop production during dry periods.' || E'\n' || 'Build farmers'' ability to use irrigation technology.' || E'\n' || 'Encourage good use of water on the farm.',
  'Wakulima wadogo na vikundi vya wakulima.', 'Smallholder farmers and farmer groups.',
  'Morogoro', '2025–2027', 'ongoing', 'published', true, '/pm-irrigation.jpg', now()
),
(
  'poultry',
  'Mradi wa Ufugaji wa Kuku', 'Poultry Farming Project',
  'Kuongeza kipato cha wakulima kupitia ufugaji wa kuku wa kisasa.', 'Increasing farmers'' incomes through modern poultry keeping.',
  'Mradi huu unalenga kuongeza kipato cha wakulima kupitia ufugaji wa kuku wa kisasa na wenye mpangilio.' || E'\n\n' || 'Unahusisha mafunzo ya utunzaji wa vifaranga, lishe na kinga ya magonjwa, pamoja na kuunganisha wafugaji na masoko.',
  'This project aims to increase farmers'' incomes through modern, well-organised poultry keeping.' || E'\n\n' || 'It involves training in caring for chicks, feeding and disease prevention, and connecting poultry keepers with markets.',
  'Kuwafundisha wafugaji mbinu za kisasa za ufugaji wa kuku.' || E'\n' || 'Kuboresha utunzaji na afya ya kuku.' || E'\n' || 'Kuwaunganisha wafugaji na wadau wa masoko.',
  'Teach poultry keepers modern poultry-keeping methods.' || E'\n' || 'Improve the care and health of chickens.' || E'\n' || 'Connect poultry keepers with market stakeholders.',
  'Wafugaji wadogo, vikundi vya wanawake na vijana.', 'Small-scale poultry keepers, women''s groups and youth.',
  'Dodoma', '2025–2026', 'ongoing', 'published', true, '/pm-poultry.jpg', now()
),
(
  'training',
  'Mradi wa Mafunzo kwa Wakulima', 'Farmer Training Project',
  'Kujenga uwezo wa wakulima katika uzalishaji, thamani na masoko.', 'Building farmers'' skills in production, value addition and markets.',
  'Mradi huu ulilenga kujenga ujuzi wa wakulima katika uzalishaji, uongezaji thamani na masoko.' || E'\n\n' || 'Ulitoa mafunzo kwa vitendo kwa vikundi vya wakulima na kuhamasisha mazoea bora ya kilimo-biashara.',
  'This project aimed to build farmers'' skills in production, value addition and markets.' || E'\n\n' || 'It gave hands-on training to farmer groups and encouraged good agribusiness practice.',
  'Kuongeza ujuzi wa wakulima katika uzalishaji wenye tija.' || E'\n' || 'Kuwafundisha wakulima kuongeza thamani ya mazao yao.' || E'\n' || 'Kuwapa wakulima uelewa wa masoko.',
  'Increase farmers'' skills in productive farming.' || E'\n' || 'Teach farmers to add value to their produce.' || E'\n' || 'Give farmers an understanding of markets.',
  'Wakulima na vikundi vya wakulima, wakiwemo wanawake.', 'Farmers and farmer groups, including women.',
  'Iringa', '2023–2024', 'completed', 'published', true, '/pm-training.jpg', now()
);

commit;

-- ============================================================================
-- After applying (do NOT run before approval):
--   * verify with queries in the style of supabase/verification/0001_identity_verify.sql
--     (RLS on for the 3 tables; anon has SELECT only on projects and project_documents;
--     authenticated policies as above; no function added);
--   * run a rolled-back behaviour script with synthetic users: anon reads only published
--     projects and public documents of published projects; anon cannot read project_admin;
--     a plain signed-in user cannot insert, update or delete projects; staff can insert and
--     edit only drafts and cannot publish; admin can publish; staff cannot delete;
--     the three sample rows exist with is_sample = true and no money fields;
--   * then update lib/supabase/database.types.ts from the real schema.
-- ============================================================================
