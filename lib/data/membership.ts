import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type MembershipState =
  | {
      kind: "active";
      memberNumber: string;
      approvedAt: string;
      category: "kawaida" | "hai" | "premium" | null;
      appliedAt: string | null;
    }
  | { kind: "none" }
  | { kind: "error" };

/** "Table not found" codes: migration 0002 is not applied, so nobody is a member. */
const NO_TABLE = ["PGRST205", "42P01"];

/**
 * The signed-in user's ACTIVE membership. This, not having an account, makes someone a member.
 * Always filtered by the user id from the verified session: admins may read every row under RLS.
 * "error" means the answer is unknown, and callers must not grant access on it.
 */
export const getOwnMembership = cache(async (userId: string): Promise<MembershipState> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("memberships")
    .select("member_number, approved_at, application_id")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();
  if (error) return NO_TABLE.includes(error.code) ? { kind: "none" } : { kind: "error" };
  if (!data) return { kind: "none" };

  const { data: application } = await supabase
    .from("membership_applications")
    .select("requested_category, created_at")
    .eq("id", data.application_id)
    .eq("user_id", userId)
    .maybeSingle();

  return {
    kind: "active",
    memberNumber: data.member_number,
    approvedAt: data.approved_at,
    category: application?.requested_category ?? null,
    appliedAt: application?.created_at ?? null,
  };
});
