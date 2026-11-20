/**
 * Preview mode keeps a deployed copy out of search engines.
 *
 * Set SITE_PREVIEW=1 (server-side env var, NOT NEXT_PUBLIC) on the preview
 * deployment. It is read at build time, so redeploy after changing it. Remove
 * the variable at launch to allow indexing; no code change is needed.
 */
export const isPreview = process.env.SITE_PREVIEW === "1";
