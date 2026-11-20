import { NextResponse, type NextRequest } from "next/server";
import {
  defaultLocale,
  isLocale,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
} from "@/lib/i18n/config";
import { refreshSession } from "@/lib/supabase/session";

/**
 * 1. Language routing: every page lives under /sw or /en. A path without a
 *    locale is redirected to the visitor's remembered language (cookie), or to
 *    Kiswahili, the default.
 * 2. Remembers the language in a cookie when a locale page is opened as a real
 *    page load (a direct visit). It must NOT do this for background fetches:
 *    <Link> prefetches the other language's URL, which would silently flip the
 *    cookie. In-app switching is saved by the language switcher on click.
 * 3. Refreshes the Supabase session cookies when Supabase is configured.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const first = pathname.split("/")[1];

  if (!isLocale(first)) {
    const saved = request.cookies.get(LOCALE_COOKIE)?.value;
    const locale = isLocale(saved) ? saved : defaultLocale;
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    url.search = search;
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next({ request });
  if (request.headers.get("sec-fetch-dest") === "document") {
    response.cookies.set(LOCALE_COOKIE, first, {
      path: "/",
      maxAge: LOCALE_COOKIE_MAX_AGE,
      sameSite: "lax",
    });
  }
  return refreshSession(request, response);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
