import type { Metadata } from "next";
import { NotFoundBoundary } from "@/components/status/NotFoundBoundary";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export const metadata: Metadata = { title: "404" };

export default function NotFound() {
  return (
    <NotFoundBoundary
      dicts={{
        sw: getDictionary("sw").status.notFound,
        en: getDictionary("en").status.notFound,
      }}
    />
  );
}
