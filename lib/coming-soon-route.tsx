import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComingSoonView } from "@/components/status/ComingSoonView";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/get-dictionary";

type Props = { params: Promise<{ lang: string }> };

/**
 * Builds a route for a public section that is on the roadmap but not built.
 * `title` picks the section's name from the dictionary (used for the browser
 * tab). Keeping every unbuilt section on this one factory means a section is
 * replaced by deleting its tiny page file and writing the real page.
 */
export function comingSoonRoute(title: (d: Dictionary) => string) {
  return {
    async generateMetadata({ params }: Props): Promise<Metadata> {
      const { lang } = await params;
      if (!isLocale(lang)) return {};
      return { title: title(getDictionary(lang)) };
    },
    async Page({ params }: Props) {
      const { lang } = await params;
      if (!isLocale(lang)) notFound();
      const { status, nav } = getDictionary(lang);
      return <ComingSoonView lang={lang} dict={status.comingSoon} homeLabel={nav.welcome} />;
    },
  };
}
