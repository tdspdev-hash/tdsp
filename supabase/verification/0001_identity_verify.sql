-- P1 (RUN BEFORE APPLYING, read-only). The `private` schema must NOT be exposed via the API.
--   Expect the authenticator setting (if present) NOT to list 'private'. Also confirm in the
--   Dashboard: Settings > Data API > Exposed schemas = public (and graphql_public) only.
--   If this returns no db_schemas value, rely on the Dashboard check.
select rolname, rolconfig from pg_roles where rolname = 'authenticator';

-- P2 (RUN BEFORE APPLYING). Expect 0 rows: nothing named like our objects exists yet.
select 'table' k, relname from pg_class where relnamespace = 'public'::regnamespace
union all select 'schema', nspname from pg_namespace where nspname = 'private';

-- Verification for 0001_identity. READ-ONLY queries: safe to run through the
-- read-only Supabase MCP after the migration has been applied. NOT yet run
-- (the migration has not been applied). Expected result is stated per query.

-- V1. Expect 3 rows, rowsecurity = true for all.
select c.relname as table_name, c.relrowsecurity as rls_enabled
from pg_class c where c.relnamespace = 'public'::regnamespace and c.relkind = 'r'
order by 1;

-- V2. Expect EXACTLY 3 rows: audit_log, profiles, user_roles, each SELECT for authenticated.
--   No anon or PUBLIC rows. No INSERT/UPDATE/DELETE/TRUNCATE/REFERENCES/TRIGGER rows
--   (profiles UPDATE is column-level and shows in V3).
select table_name, grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public' and grantee in ('anon', 'authenticated', 'PUBLIC')
order by 1, 2, 3;

-- V3. Expect only profiles with these 9 columns for authenticated: full_name, phone, gender,
--   region, district, ward, village, occupation, participation_areas. Never id, created_at, consent_accepted_at.
select table_name, column_name, grantee, privilege_type
from information_schema.column_privileges
where table_schema = 'public' and grantee in ('anon', 'authenticated', 'PUBLIC')
  and privilege_type in ('INSERT', 'UPDATE')
order by 1, 2;

-- V4. Expect 6 policies: profiles x3, user_roles x2, audit_log x1. None for anon/public.
select tablename, policyname, cmd, roles, qual, with_check
from pg_policies where schemaname = 'public' order by tablename, policyname;

-- V5. Every function in public/private. Expect exactly 6 rows, all in schema private (none in public): has_role(app_role),
--   is_staff_or_admin(), log_audit, handle_new_user (all security_definer = true),
--   touch_updated_at, block_mutation (false). proconfig contains search_path="" for the four
--   definer functions. anon_exec = false for ALL rows (any true = FAIL: a function was
--   left with the PUBLIC default). auth_exec = true ONLY for has_role and is_staff_or_admin.
--   Neither helper may have a uuid argument (check pg_get_function_arguments).
select n.nspname as schema, p.proname, pg_get_function_arguments(p.oid) as args, p.prosecdef as security_definer, p.proconfig,
       has_function_privilege('anon', p.oid, 'EXECUTE')          as anon_exec,
       has_function_privilege('authenticated', p.oid, 'EXECUTE') as auth_exec
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname in ('public', 'private') order by 1, 2;

-- V6. Expect: on_auth_user_created on auth.users; audit_log_no_update_delete (row, update+delete),
--   audit_log_no_truncate (statement, truncate); profiles_touch.
select event_object_schema, event_object_table, trigger_name, event_manipulation, action_timing, action_orientation
from information_schema.triggers
where trigger_name in ('on_auth_user_created', 'audit_log_no_update_delete', 'audit_log_no_truncate', 'profiles_touch')
order by 1, 2, 3;

-- V7. Default ACLs. Expect public-schema entries for postgres-created tables/sequences/functions with
--   NO anon/authenticated entries. No global function entry is added by this migration
--   (a global revoke from PUBLIC was deliberately dropped; see migration section 1).
select defaclrole::regrole as role, coalesce(nullif(defaclnamespace::regnamespace::text, '-'), 'GLOBAL') as schema,
       defaclobjtype as objtype, defaclacl
from pg_default_acl order by 1, 2, 3;

-- V8. Repeat of P1 after applying: pgrst.db_schemas (if present) must NOT include 'private'.
select rolname, rolconfig from pg_roles where rolname = 'authenticator';

-- V9. No FK from audit_log (so account deletion never touches it). Expect 0 rows.
select conname from pg_constraint where conrelid = 'public.audit_log'::regclass and contype = 'f';

-- V10. Sanity: still no data. Expect profiles = 0, user_roles = 0, audit_log = 0 until the first sign-up.
select (select count(*) from public.profiles) as profiles,
       (select count(*) from public.user_roles) as user_roles,
       (select count(*) from public.audit_log) as audit_log;
