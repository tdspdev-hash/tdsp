import { notFound } from "next/navigation";

/**
 * Catch-all: any path under /sw or /en that matches no page lands here and
 * raises a real 404, so the custom not-found page (and an HTTP 404 status) is
 * used for every unknown URL.
 */
export default function UnknownPage() {
  notFound();
}
