# Supabase

Status (20 Nov 2026): the live TDSP Supabase project is connected through the Supabase MCP (keep it `read_only=true` except while a reviewed migration is being applied). Applied and verified: `0001_identity` (profiles, user_roles, audit_log, sign-up trigger; V1-V10 and a 27-test behaviour script passed) and `0004_projects` (information-only project tables with 3 labelled sample rows; structural checks and a public-key access check passed; the staff/admin behaviour script has not been run). `0002` (membership) and `0003` (receipts storage) are reserved and not drafted. Verification scripts are in `verification/`. Reviewed SQL is applied by Ecky or, when explicitly authorised, through the MCP, then verified. This folder is the place for migrations.

Conventions for Milestone 2:

- One migration per change, in `supabase/migrations/`, timestamped.
- Enable Row Level Security on every table in `public`. No table without policies.
- Separate statuses: `payment_status`, `membership_status`, `account_status`. A valid login never implies approved membership.
- Members can read only their own rows. Members can never write their own status, type or approval fields.
- Approvals, payment verification, free-membership grants and suspensions are admin-only and are checked on the server as well as by RLS.
- Approval history is append-only and not writable by members.
- Receipts go in a private storage bucket with owner/admin-only access.
- The service-role key is never used in browser code.
