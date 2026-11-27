import "server-only";
import type { Database } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

export type Profile = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "full_name" | "phone" | "gender" | "region" | "district" | "ward" | "village" | "occupation" | "participation_areas"
>;

/**
 * The signed-in user's own profile, or null if it could not be read.
 * Always filtered by id: staff may read other profiles under RLS.
 */
export async function getOwnProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, phone, gender, region, district, ward, village, occupation, participation_areas")
    .eq("id", userId)
    .maybeSingle();
  return error ? null : data;
}
