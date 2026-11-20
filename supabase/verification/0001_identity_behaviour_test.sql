-- Behaviour tests for 0001_identity. 20 Nov 2026: first run hit a report-line bug
-- (ambiguous column "n", fixed by renaming it to "seq"); re-run needed.
-- Run ONLY after 0001 is applied, in the Supabase Dashboard SQL Editor (needs write
-- access, so NOT through the read-only MCP). Synthetic data only.
--
-- The whole test is ONE statement (a single DO block). It always finishes by raising an
-- exception whose message is the result table, which rolls back everything: no test
-- user, profile, role or audit row survives, whether tests pass or fail. Expect the
-- editor to show an ERROR starting "TDSP_TEST_RESULT"; that is the normal output.
-- Read the first line: "ALL n PASSED" or "FAILURES: ...", followed by one line per test.
--
-- Assumptions to confirm on first run (not verifiable without the live database):
--   * the editor role (postgres) may `set local role anon/authenticated`;
--   * inserting into auth.users with only these columns is accepted;
--   * auth.uid() reads request.jwt.claims (current Supabase behaviour).

do $tdsp_test$
declare
  a constant text := '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}';
  c constant text := '{"sub":"00000000-0000-0000-0000-0000000000c3","role":"authenticated"}';
  n int; ok boolean; msg text; col text; summary text; fails int;
begin
  create temp table tdsp_test_results (seq serial, test text, passed boolean, detail text) on commit drop;

  -- synthetic users; the sign-up trigger must create their profiles
  insert into auth.users (id, instance_id, aud, role, email, raw_user_meta_data) values
    ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'a@example.invalid',
     '{"full_name":"Test A","phone":"+255712345678","gender":"female","region":"R","district":"D","ward":"W","areas":["agriculture"],"consent":true,"role":"admin","is_admin":true}'),
    ('00000000-0000-0000-0000-0000000000b2', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'b@example.invalid',
     '{"full_name":"Test B","phone":"not-a-phone","areas":"not-an-array"}'),
    ('00000000-0000-0000-0000-0000000000c3', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'c@example.invalid',
     '{}');
  insert into public.user_roles (user_id, role) values ('00000000-0000-0000-0000-0000000000c3', 'staff');

  -- T1-T3 trigger behaviour
  select count(*) into n from public.profiles;
  insert into tdsp_test_results(test, passed, detail) values ('T1 one profile per sign-up (3)', n = 3, n::text);
  select count(*) into n from public.profiles
   where id = '00000000-0000-0000-0000-0000000000b2' and phone is null and participation_areas = '{}';
  insert into tdsp_test_results(test, passed, detail) values ('T2 malformed metadata sanitised, sign-up not blocked', n = 1, n::text);
  select count(*) into n from public.user_roles where user_id = '00000000-0000-0000-0000-0000000000a1';
  insert into tdsp_test_results(test, passed, detail) values ('T3 metadata "role":"admin" grants no role', n = 0, n::text);

  -- T4-T5 anonymous
  execute 'set local role anon';
  begin perform 1 from public.profiles; ok := false; msg := 'readable';
  exception when insufficient_privilege then ok := true; msg := 'denied'; end;
  execute 'reset role';
  insert into tdsp_test_results(test, passed, detail) values ('T4 anon cannot read profiles', ok, msg);
  execute 'set local role anon';
  begin perform 1 from public.audit_log; ok := false; msg := 'readable';
  exception when insufficient_privilege then ok := true; msg := 'denied'; end;
  execute 'reset role';
  insert into tdsp_test_results(test, passed, detail) values ('T5 anon cannot read audit_log', ok, msg);
  execute 'set local role anon';
  begin perform private.has_role('admin'); ok := false; msg := 'callable';
  exception when insufficient_privilege then ok := true; msg := 'denied'; end;
  execute 'reset role';
  insert into tdsp_test_results(test, passed, detail) values ('T6 anon cannot call role helpers', ok, msg);

  -- user A
  perform set_config('request.jwt.claims', a, true);
  execute 'set local role authenticated';
  select count(*) into n from public.profiles;
  execute 'reset role';
  insert into tdsp_test_results(test, passed, detail) values ('T7 user A sees exactly 1 profile (own)', n = 1, n::text);

  execute 'set local role authenticated';
  update public.profiles set occupation = 'farmer' where id = '00000000-0000-0000-0000-0000000000a1';
  get diagnostics n = row_count;
  execute 'reset role';
  insert into tdsp_test_results(test, passed, detail) values ('T8 user A updates own profile (1 row)', n = 1, n::text);

  execute 'set local role authenticated';
  update public.profiles set occupation = 'hacked' where id = '00000000-0000-0000-0000-0000000000b2';
  get diagnostics n = row_count;
  execute 'reset role';
  insert into tdsp_test_results(test, passed, detail) values ('T9 user A cannot update B (0 rows)', n = 0, n::text);

  foreach col in array array['id', 'consent_accepted_at', 'created_at', 'updated_at'] loop
    execute 'set local role authenticated';
    begin
      execute format('update public.profiles set %I = %I where id = %L', col, col, '00000000-0000-0000-0000-0000000000a1');
      ok := false;
    exception when insufficient_privilege then ok := true; end;
    execute 'reset role';
    insert into tdsp_test_results(test, passed, detail) values ('T10 cannot update protected column ' || col, ok, '');
  end loop;

  execute 'set local role authenticated';
  begin insert into public.profiles (id, full_name) values (gen_random_uuid(), 'x'); ok := false;
  exception when insufficient_privilege then ok := true; end;
  execute 'reset role';
  insert into tdsp_test_results(test, passed, detail) values ('T11 user cannot insert profiles directly', ok, '');

  -- role escalation
  execute 'set local role authenticated';
  begin insert into public.user_roles (user_id, role) values ('00000000-0000-0000-0000-0000000000a1', 'admin'); ok := false;
  exception when insufficient_privilege then ok := true; end;
  execute 'reset role';
  insert into tdsp_test_results(test, passed, detail) values ('T12 user cannot grant self a role', ok, '');

  execute 'set local role authenticated';
  select count(*) into n from public.user_roles;
  execute 'reset role';
  insert into tdsp_test_results(test, passed, detail) values ('T13 non-admin sees no role rows (0)', n = 0, n::text);

  -- helpers describe only the caller
  execute 'set local role authenticated';
  ok := private.has_role('admin') = false and private.is_staff_or_admin() = false;
  execute 'reset role';
  insert into tdsp_test_results(test, passed, detail) values ('T14 helpers report caller A as not staff/admin', ok, '');
  select count(*) into n from pg_proc p join pg_namespace s on s.oid = p.pronamespace
   where s.nspname = 'private' and p.proname in ('has_role', 'is_staff_or_admin')
     and pg_get_function_arguments(p.oid) ilike '%uuid%';
  insert into tdsp_test_results(test, passed, detail) values ('T15 no helper accepts a user uuid (cannot probe others)', n = 0, n::text);

  -- audit log
  execute 'set local role authenticated';
  select count(*) into n from public.audit_log;
  begin insert into public.audit_log (action, entity_type) values ('x', 'y'); ok := false;
  exception when insufficient_privilege then ok := true; end;
  execute 'reset role';
  insert into tdsp_test_results(test, passed, detail) values ('T16 user: audit_log unreadable (0) and unwritable', n = 0 and ok, n::text);

  execute 'set local role authenticated';
  begin perform private.log_audit('x', 'y', null, '{}'); ok := false;
  exception when insufficient_privilege then ok := true; end;
  execute 'reset role';
  insert into tdsp_test_results(test, passed, detail) values ('T17 user cannot call private.log_audit', ok, '');

  -- staff (C)
  perform set_config('request.jwt.claims', c, true);
  execute 'set local role authenticated';
  select count(*) into n from public.profiles;
  ok := private.is_staff_or_admin() = true and private.has_role('admin') = false;
  execute 'reset role';
  insert into tdsp_test_results(test, passed, detail) values ('T18 staff reads all 3 profiles; helpers: staff yes, admin no', n = 3 and ok, n::text);

  execute 'set local role authenticated';
  select count(*) into n from public.audit_log;
  begin insert into public.user_roles (user_id, role) values ('00000000-0000-0000-0000-0000000000c3', 'admin'); ok := false;
  exception when insufficient_privilege then ok := true; end;
  execute 'reset role';
  insert into tdsp_test_results(test, passed, detail) values ('T19 staff cannot read audit_log or escalate', n = 0 and ok, n::text);

  -- admin (promote C inside this transaction only)
  insert into public.user_roles (user_id, role) values ('00000000-0000-0000-0000-0000000000c3', 'admin');
  perform private.log_audit('test.event', 'test', null, '{}');
  execute 'set local role authenticated';
  select count(*) into n from public.audit_log;
  ok := private.has_role('admin') = true;
  execute 'reset role';
  insert into tdsp_test_results(test, passed, detail) values ('T20 admin reads audit_log (>=1) and helper says admin', n >= 1 and ok, n::text);

  -- append-only, even for the owner
  begin update public.audit_log set action = 'tampered'; ok := false; exception when others then ok := true; end;
  insert into tdsp_test_results(test, passed, detail) values ('T21 audit_log UPDATE blocked', ok, '');
  begin delete from public.audit_log; ok := false; exception when others then ok := true; end;
  insert into tdsp_test_results(test, passed, detail) values ('T22 audit_log DELETE blocked', ok, '');
  begin truncate public.audit_log; ok := false; exception when others then ok := true; end;
  insert into tdsp_test_results(test, passed, detail) values ('T23 audit_log TRUNCATE blocked', ok, '');

  -- account deletion with audit history
  delete from auth.users where id = '00000000-0000-0000-0000-0000000000c3';
  select count(*) into n from public.profiles where id = '00000000-0000-0000-0000-0000000000c3';
  insert into tdsp_test_results(test, passed, detail) values ('T24 account deletion cascades; audit_log untouched', n = 0, n::text);

  -- report, then raise so the whole statement (users, profiles, roles, audit rows) rolls back
  select count(*) filter (where not passed) into fails from tdsp_test_results;
  select string_agg(format('%s  %s  %s', case when passed then 'PASS' else 'FAIL' end, test, detail), E'\n' order by seq)
    into summary from tdsp_test_results;
  raise exception E'TDSP_TEST_RESULT: %\n%',
    case when fails = 0 then 'ALL ' || (select count(*) from tdsp_test_results) || ' PASSED' else 'FAILURES: ' || fails end,
    summary;
end
$tdsp_test$;
