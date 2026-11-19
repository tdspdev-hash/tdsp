/**
 * Document Centre data.
 *
 * SOURCE OF TRUTH: none yet. TDSP has not approved any document for public
 * download and no Supabase project/storage bucket is connected, so this list is
 * EMPTY on purpose. The page therefore shows honest empty states, never invented
 * titles, sizes, dates or download links.
 *
 * To publish a document:
 *  1. TDSP approves it as PUBLIC (access level in docs/markdown-files/08).
 *  2. Put the file in `public/documents/` (or, later, a Supabase public bucket).
 *  3. Add a record below. The Download button appears only when the file exists
 *     on disk (see `isDownloadable`). Never add Controlled/Internal/Restricted files.
 */
export const DOCUMENT_CATEGORIES = ["policy", "training", "reports", "publications", "other"] as const;
export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number];

export type DocumentRecord = {
  id: string;
  title: { sw: string; en: string };
  description?: { sw: string; en: string };
  category: DocumentCategory;
  /** File name inside public/documents/ */
  file: string;
  format: "PDF" | "DOCX";
  sizeBytes: number;
  /** ISO date (YYYY-MM-DD) */
  publishedAt: string;
  /** At most one featured document is shown in the right-hand card. */
  featured?: boolean;
};

export const documents: DocumentRecord[] = [];

export function isCategory(value: string | undefined): value is DocumentCategory {
  return !!value && (DOCUMENT_CATEGORIES as readonly string[]).includes(value);
}

/** Case-insensitive search over title, description and category; optional category filter. */
export function filterDocuments(
  list: DocumentRecord[],
  opts: { query?: string; category?: DocumentCategory },
  lang: "sw" | "en",
): DocumentRecord[] {
  const q = (opts.query ?? "").trim().toLowerCase();
  return list.filter((d) => {
    if (opts.category && d.category !== opts.category) return false;
    if (!q) return true;
    const hay = [d.title[lang], d.title.sw, d.title.en, d.description?.[lang] ?? "", d.category].join(" ").toLowerCase();
    return hay.includes(q);
  });
}

export function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function formatDate(iso: string, lang: "sw" | "en"): string {
  return new Intl.DateTimeFormat(lang === "sw" ? "sw-TZ" : "en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
}
