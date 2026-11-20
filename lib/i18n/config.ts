export const locales = ["sw", "en"] as const;
export type Locale = (typeof locales)[number];

/** Kiswahili is the default language; English is secondary. */
export const defaultLocale: Locale = "sw";

/** Cookie that remembers the visitor's language choice. */
export const LOCALE_COOKIE = "tdsp-lang";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "sw" || value === "en";
}

/**
 * Pages whose URL differs by language: /sw/uanachama <-> /en/membership, /sw/miradi-na-andiko <-> /en/projects-and-proposals, /sw/masoko <-> /en/markets, /sw/elimu-na-ujuzi <-> /en/education-and-skills, /sw/watoa-huduma <-> /en/service-providers, /sw/kituo-cha-nyaraka <-> /en/document-centre, /sw/mawasiliano <-> /en/contact, /sw/habari-na-fursa <-> /en/news-and-opportunities, /sw/akaunti <-> /en/account.
 * The language switcher uses this so it lands on the equivalent page, not on
 * a redirect.
 */
export const pageSlugs = {
  membership: { sw: "uanachama", en: "membership" },
  projects: { sw: "miradi-na-andiko", en: "projects-and-proposals" },
  markets: { sw: "masoko", en: "markets" },
  training: { sw: "elimu-na-ujuzi", en: "education-and-skills" },
  providers: { sw: "watoa-huduma", en: "service-providers" },
  documents: { sw: "kituo-cha-nyaraka", en: "document-centre" },
  contact: { sw: "mawasiliano", en: "contact" },
  news: { sw: "habari-na-fursa", en: "news-and-opportunities" },
  account: { sw: "akaunti", en: "account" },
} as const;

export function localizedSlug(key: keyof typeof pageSlugs, locale: Locale): string {
  return pageSlugs[key][locale];
}

/** Replace the leading locale segment of a pathname, e.g. /sw/about -> /en/about. */
export function swapLocale(pathname: string, target: Locale): string {
  const parts = pathname.split("/");
  if (isLocale(parts[1])) {
    const from = parts[1];
    for (const slugs of Object.values(pageSlugs)) {
      if (parts[2] === slugs[from]) parts[2] = slugs[target];
    }
    parts[1] = target;
    return parts.join("/") || `/${target}`;
  }
  return `/${target}${pathname === "/" ? "" : pathname}`;
}
