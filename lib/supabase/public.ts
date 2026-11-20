import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { getSupabaseEnv } from "./env";

/**
 * Supabase client for PUBLIC, read-only server reads (published content).
 * Uses the publishable key and no session or cookies, so pages that use it can
 * still be statically rendered and revalidated. Row Level Security decides what
 * an anonymous visitor can see. Returns null when Supabase is not configured.
 * The service-role key is never used here.
 */
export function createPublicClient() {
  const env = getSupabaseEnv();
  if (!env) return null;
  return createSupabaseClient<Database>(env.url, env.publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
