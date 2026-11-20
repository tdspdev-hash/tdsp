/**
 * Habari & Fursa data.
 *
 * SOURCE OF TRUTH: none yet. TDSP has not approved any news article or
 * opportunity for publication, and news/opportunity management is Phase 2
 * roadmap material (docs/markdown-files/03, 05). Both lists are EMPTY on
 * purpose, so the page shows honest empty states, never invented headlines,
 * dates, deadlines, grants, jobs or application links.
 *
 * To publish, add only records TDSP has approved, with real dates.
 */
export const NEWS_CATEGORIES = ["news", "projects", "events"] as const;
export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

export type NewsItem = {
  id: string;
  title: { sw: string; en: string };
  summary: { sw: string; en: string };
  category: NewsCategory;
  /** ISO date (YYYY-MM-DD) of publication */
  publishedAt: string;
  /** File in public/ (photo of the real item), optional */
  image?: string;
  /** Full article address; "Read more" is shown only when present */
  href?: string;
};

export type OpportunityItem = {
  id: string;
  title: { sw: string; en: string };
  summary: { sw: string; en: string };
  /** ISO deadline; shown only when TDSP supplies a real one */
  deadline?: string;
  /** Details address; the button is shown only when present */
  href?: string;
};

export const newsItems: NewsItem[] = [];
export const opportunityItems: OpportunityItem[] = [];

export function formatNewsDate(iso: string, lang: "sw" | "en"): string {
  return new Intl.DateTimeFormat(lang === "sw" ? "sw-TZ" : "en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
}
