/**
 * Public-site content that must come from TDSP, not from the designer's mockups.
 *
 * Items set to null / empty are NOT shown until TDSP supplies verified values.
 * Nothing here is invented: contact details are copied from TDSP's own
 * documents (forms, Waraka No. 2 and the export guide, which lists both phone
 * numbers). TDSP should still confirm them before launch.
 */
export const siteConfig = {
  phones: [
    { display: "0689 671 666", tel: "0689671666" },
    { display: "0784 573 600", tel: "0784573600" },
  ],
  email: "tdsphq@gmail.com",

  /**
   * Impact figures for the statistics strip. The mockups show 10,000+ / 350+ /
   * 25+ / 9, but those numbers are NOT confirmed by TDSP, so they are not used.
   * While a value is null only the icon and label are shown. To publish a
   * figure, set it here after TDSP approves it, e.g. farmers: "1,200+".
   */
  stats: {
    farmers: null as string | null,
    groups: null as string | null,
    partners: null as string | null,
    regions: null as string | null,
  },

  /** "Watch video" button is shown only when a real video URL is provided. */
  videoUrl: null as string | null,

  /** Social links are shown only when TDSP provides the real page URLs. */
  social: [] as { kind: "facebook" | "youtube" | "linkedin"; href: string }[],
} as const;
