"use client";

import { usePathname } from "next/navigation";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";
import { NotFoundView } from "./NotFoundView";

/**
 * Next.js passes no params to not-found, so the language is read from the URL
 * (the proxy guarantees every page path starts with /sw or /en). Both
 * dictionaries' 404 texts are passed in as props by the server component.
 */
export function NotFoundBoundary({
  dicts,
}: {
  dicts: Record<"sw" | "en", Dictionary["status"]["notFound"]>;
}) {
  const first = usePathname().split("/")[1];
  const lang = isLocale(first) ? first : defaultLocale;
  return <NotFoundView lang={lang} dict={dicts[lang]} />;
}
