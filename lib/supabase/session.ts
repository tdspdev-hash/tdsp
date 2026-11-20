import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";
import type { Database } from "./database.types";
import { getSupabaseEnv } from "./env";

/**
 * Refreshes the Supabase auth session cookies on the response.
 * Does nothing when Supabase is not configured, so the site works without it.
 * This is NOT an authorisation check; it only keeps the session fresh.
 */
export async function refreshSession(
  request: NextRequest,
  response: NextResponse,
): Promise<NextResponse> {
  const env = getSupabaseEnv();
  if (!env) return response;

  const supabase = createServerClient<Database>(env.url, env.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Validates the token and refreshes it if needed.
  await supabase.auth.getClaims();
  return response;
}
