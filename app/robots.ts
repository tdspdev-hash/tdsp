import type { MetadataRoute } from "next";
import { isPreview } from "@/lib/preview";

/** Blocks all crawlers on a preview deployment (SITE_PREVIEW=1); allows all otherwise. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: isPreview
      ? { userAgent: "*", disallow: "/" }
      : { userAgent: "*", allow: "/" },
  };
}
