import "server-only";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import type { Locale } from "@/lib/i18n/config";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

/**
 * The signed-in user, verified with the Supabase Auth server (not just the cookie).
 * Returns null when nobody is signed in or Supabase is not configured.
 * A signed-in user is NOT automatically a member: membership is derived from an
 * active membership record (migration 0002, not built yet).
 */
export async function getCurrentUser(): Promise<User | null> {
  if (!getSupabaseEnv()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  return error ? null : data.user;
}

/** For pages that need a signed-in user: sends visitors to the login page otherwise. */
export async function requireUser(lang: Locale): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect(`/${lang}/login`);
  return user;
}
