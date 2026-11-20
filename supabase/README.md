# Supabase

No Supabase project is provisioned yet and there are no migrations. This folder is the place for them.

Conventions for Milestone 2:

- One migration per change, in `supabase/migrations/`, timestamped.
- Enable Row Level Security on every table in `public`. No table without policies.
- Separate statuses: `payment_status`, `membership_status`, `account_status`. A valid login never implies approved membership.
- Members can read only their own rows. Members can never write their own status, type or approval fields.
- Approvals, payment verification, free-membership grants and suspensions are admin-only and are checked on the server as well as by RLS.
- Approval history is append-only and not writable by members.
- Receipts go in a private storage bucket with owner/admin-only access.
- The service-role key is never used in browser code.
