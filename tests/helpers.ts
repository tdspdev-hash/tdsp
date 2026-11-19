import { expect, type Page } from "@playwright/test";

/** Desktop navigation takes over from the bottom bar at this width. */
export const DESKTOP_MIN = 900;

export const width = (page: Page) => page.viewportSize()!.width;
export const isDesktop = (page: Page) => width(page) >= DESKTOP_MIN;

export const PAGES = [
  "",
  "/about",
  "/services",
  "/contact",
  "/join",
  "/login",
  "/forgot-password",
  "/opportunities",
  "/news",
  "/habari-na-fursa",
  "/akaunti",
  "/account",
  "/news-and-opportunities",
  "/farmers-value-chain",
  "/miradi-na-andiko",
  "/projects-and-proposals",
  "/financial-linkage",
  "/markets",
  "/masoko",
  "/training",
  "/elimu-na-ujuzi",
  "/providers",
  "/watoa-huduma",
  "/service-providers",
  "/documents",
  "/kituo-cha-nyaraka",
  "/document-centre",
  "/uanachama",
  "/membership",
  "/communications",
  "/mawasiliano",
  "/does-not-exist",
];

const NAMES = {
  sw: { about: "Kuhusu TDSP", services: "Huduma", contact: "Mawasiliano" },
  en: { about: "About TDSP", services: "Services", contact: "Contact" },
} as const;

/**
 * Navigate to a main page the way a user would at the current width:
 *  - desktop: the header navigation;
 *  - phone: the bottom bar for Services; the footer links for About/Contact
 *    (the bottom bar has exactly five fixed items).
 */
export async function clickNav(
  page: Page,
  lang: "sw" | "en",
  key: "about" | "services",
) {
  const name = NAMES[lang][key];
  if (isDesktop(page)) {
    await page.locator("#site-nav").getByRole("link", { name, exact: true }).click();
  } else if (key === "services") {
    await page
      .getByRole("navigation", { name: lang === "sw" ? "Menyu ya chini" : "Bottom menu" })
      .getByRole("link", { name, exact: true })
      .click();
  } else {
    await page.getByRole("contentinfo").getByRole("link", { name, exact: true }).click();
  }
}

/** Fails the test if the page ever talks to Supabase (UI tests must stay offline). */
export function forbidSupabaseRequests(page: Page) {
  const hits: string[] = [];
  page.on("request", (r) => {
    if (/supabase\.(co|in)/.test(r.url())) hits.push(r.url());
  });
  return () => expect(hits, "unexpected Supabase requests").toEqual([]);
}
