import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { MasokoContent } from "@/components/masoko/MasokoContent";
import { isLocale, localizedSlug } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getDictionary(lang).masokoPage.title };
}

/** Address of the Markets page for "en" (the other language redirects here). */
export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  if (lang !== "en") redirect(`/${lang}/${localizedSlug("markets", lang)}`);
  return <MasokoContent lang={lang} />;
}
