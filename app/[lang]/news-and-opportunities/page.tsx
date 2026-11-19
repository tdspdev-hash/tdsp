import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { NewsContent } from "@/components/news/NewsContent";
import { isLocale, localizedSlug } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { newsItems, opportunityItems } from "@/lib/news";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getDictionary(lang).newsPage.title };
}

/** Address of the combined Habari & Fursa page for "en" (the other language redirects here). */
export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  if (lang !== "en") redirect(`/${lang}/${localizedSlug("news", lang)}`);
  return <NewsContent lang={lang} news={newsItems} opportunities={opportunityItems} />;
}
