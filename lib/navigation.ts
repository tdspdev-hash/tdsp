import { localizedSlug, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";

export type NavItem = {
  key: string;
  href: string;
  label: string;
  isActive: (pathname: string) => boolean;
};

/** Canonical address of the contact page: /sw/mawasiliano, /en/contact. */
export const contactPath = (lang: Locale) => `/${lang}/${localizedSlug("contact", lang)}`;

/** The ONE combined Habari & Fursa page; the Fursa section is its #fursa anchor. */
export const newsPath = (lang: Locale) => `/${lang}/${localizedSlug("news", lang)}`;

/** Account landing page (Akaunti): the entry to login, join and password reset. */
export const accountPath = (lang: Locale) => `/${lang}/${localizedSlug("account", lang)}`;

const is = (pathname: string, href: string) => pathname === href;
const under = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

/** Desktop header navigation (shown from 900px up). */
export function desktopNav(lang: Locale, nav: Dictionary["nav"]): NavItem[] {
  const base = `/${lang}`;
  return [
    { key: "home", href: base, label: nav.welcome, isActive: (p) => is(p, base) },
    { key: "about", href: `${base}/about`, label: nav.about, isActive: (p) => under(p, `${base}/about`) },
    { key: "services", href: `${base}/services`, label: nav.services, isActive: (p) => under(p, `${base}/services`) || under(p, `${base}/financial-linkage`) || under(p, `${base}/${localizedSlug("markets", lang)}`) || under(p, `${base}/${localizedSlug("training", lang)}`) || under(p, `${base}/${localizedSlug("providers", lang)}`) || under(p, `${base}/${localizedSlug("documents", lang)}`) },
    { key: "membership", href: `${base}/${localizedSlug("membership", lang)}`, label: nav.membership, isActive: (p) => under(p, `${base}/${localizedSlug("membership", lang)}`) },
    { key: "projects", href: `${base}/${localizedSlug("projects", lang)}`, label: nav.projects, isActive: (p) => under(p, `${base}/${localizedSlug("projects", lang)}`) },
    {
      key: "news",
      href: newsPath(lang),
      label: nav.newsOpportunities,
      isActive: (p) => under(p, newsPath(lang)),
    },
    { key: "contact", href: contactPath(lang), label: nav.contact, isActive: (p) => under(p, contactPath(lang)) },
  ];
}

/** Mobile bottom navigation: exactly five items, in this order. */
export function bottomNav(lang: Locale, nav: Dictionary["nav"]): NavItem[] {
  const base = `/${lang}`;
  return [
    {
      key: "home",
      href: base,
      label: nav.tabs.home,
      // The About page has no tab of its own and belongs to "Karibu" (home).
      isActive: (p) => is(p, base) || under(p, `${base}/about`) || under(p, `${base}/farmers-value-chain`) || under(p, `${base}/${localizedSlug("projects", lang)}`) || under(p, `${base}/financial-linkage`) || under(p, `${base}/${localizedSlug("markets", lang)}`) || under(p, `${base}/${localizedSlug("training", lang)}`) || under(p, `${base}/${localizedSlug("providers", lang)}`) || under(p, `${base}/${localizedSlug("documents", lang)}`) || under(p, contactPath(lang)),
    },
    { key: "services", href: `${base}/services`, label: nav.tabs.services, isActive: (p) => under(p, `${base}/services`) },
    // Fursa is a section of the combined page (hash link); the page highlights "Habari" only.
    { key: "opportunities", href: `${newsPath(lang)}#fursa`, label: nav.tabs.opportunities, isActive: () => false },
    { key: "news", href: newsPath(lang), label: nav.tabs.news, isActive: (p) => under(p, newsPath(lang)) },
    {
      key: "account",
      href: accountPath(lang),
      label: nav.tabs.account,
      // Account covers sign-in, registration and password reset until a
      // member account area exists.
      isActive: (p) =>
        under(p, accountPath(lang)) || under(p, `${base}/login`) || under(p, `${base}/join`) || under(p, `${base}/forgot-password`) || under(p, `${base}/member`),
    },
  ];
}
