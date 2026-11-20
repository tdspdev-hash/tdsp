/**
 * Supabase environment configuration.
 *
 * Nothing here is provisioned yet: the TDSP Supabase project has not been
 * created. All helpers tolerate missing configuration so the public site keeps
 * working without credentials. Values come from environment variables only and
 * are never hard-coded.
 *
 * Only the public URL and the publishable (anon) key may reach the browser.
 * The service-role key must never be used in browser code and is intentionally
 * not read anywhere in this module.
 */
export type SupabaseEnv = {
  url: string;
  publishableKey: string;
};

export function getSupabaseEnv(): SupabaseEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !publishableKey) return null;
  return { url, publishableKey };
}

export function requireSupabaseEnv(): SupabaseEnv {
  const env = getSupabaseEnv();
  if (!env) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (see .env.example).",
    );
  }
  return env;
}
