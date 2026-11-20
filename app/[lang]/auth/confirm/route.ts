import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { isLocale } from "@/lib/i18n/config";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

/**
 * Email callback for sign-up confirmation and password recovery.
 * Supports both link styles Supabase can send:
 *  - ?token_hash=...&type=...  (verifyOtp)
 *  - ?code=...                 (PKCE code exchange)
 * On success it sets the session cookies and redirects to `next` (internal paths
 * under the same language only), by default the account page. A recovery link
 * goes to the reset-password page. On failure it returns to the login page.
 * Add this route to the Supabase Auth redirect URLs for every domain in use.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) return new NextResponse(null, { status: 404 });

  const { searchParams } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const requested = searchParams.get("next");
  const fallback = type === "recovery" ? `/${lang}/reset-password` : `/${lang}/akaunti`;
  // Only same-language internal paths; blocks open redirects such as //evil.example.
  const next = requested && requested.startsWith(`/${lang}/`) && !requested.startsWith("//") ? requested : fallback;

  const fail = () => {
    const url = request.nextUrl.clone();
    url.pathname = `/${lang}/login`;
    url.search = "?error=confirm";
    return NextResponse.redirect(url);
  };

  if (!getSupabaseEnv() || (!code && !(tokenHash && type))) return fail();

  const supabase = await createClient();
  const { error } = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : await supabase.auth.verifyOtp({ type: type!, token_hash: tokenHash! });
  if (error) return fail();

  const url = request.nextUrl.clone();
  url.pathname = next.split("?")[0];
  url.search = next.includes("?") ? `?${next.split("?")[1]}` : "";
  return NextResponse.redirect(url);
}
