-- Read-only checks to run after applying 0002_membership.

-- 1. Both tables exist with RLS on (expect 2 rows, rls = true).
select relname, relrowsecurity as rls
from pg_class
where oid in ('public.membership_applications'::regclass, 'public.memberships'::regclass);

-- 2. Policies (expect 4, all SELECT).
select tablename, policyname, cmd from pg_policies
where schemaname = 'public' and tablename in ('membership_applications', 'memberships')
order by 1, 2;

-- 3. Table privileges (expect only SELECT for authenticated, nothing for anon).
select table_name, grantee, privilege_type from information_schema.role_table_grants
where table_schema = 'public' and table_name in ('membership_applications', 'memberships')
  and grantee in ('anon', 'authenticated')
order by 1, 2, 3;

-- 4. Function access (expect anon: submit and status = true, review = false).
select p.proname,
       has_function_privilege('anon', p.oid, 'execute')          as anon,
       has_function_privilege('authenticated', p.oid, 'execute') as authenticated,
       p.prosecdef                                               as security_definer
from pg_proc p
where p.pronamespace = 'public'::regnamespace and p.proname like '%membership%'
order by 1;

-- 5. Effective table access (expect anon all false; authenticated select only).
select t, r,
       has_table_privilege(r, t, 'select') as sel,
       has_table_privilege(r, t, 'insert') as ins,
       has_table_privilege(r, t, 'update') as upd,
       has_table_privilege(r, t, 'delete') as del
from unnest(array['public.membership_applications', 'public.memberships',
                  'private.member_number_counter']) as t,
     unnest(array['anon', 'authenticated']) as r
order by 1, 2;
-- private.member_number_counter must be false for both roles in every column.

-- 6. Definer functions have an empty search_path (expect 3 rows).
select proname, proconfig from pg_proc
where pronamespace = 'public'::regnamespace and proname like '%membership%';

-- 7. Duplicate guards exist (expect both index names).
select indexname from pg_indexes
where schemaname = 'public'
  and indexname in ('membership_applications_open_phone', 'memberships_one_active_per_user');

-- 8. Counter starts at 0 (or at the agreed last paper number).
select last_value from private.member_number_counter;
