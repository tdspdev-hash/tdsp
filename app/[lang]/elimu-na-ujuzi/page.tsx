import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ElimuContent } from "@/components/elimu/ElimuContent";
import { isLocale, localizedSlug } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getDictionary(lang).elimuPage.title };
}

/** Address of the Education & Skills page for "sw" (the other language redirects here). */
export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  if (lang !== "sw") redirect(`/${lang}/${localizedSlug("training", lang)}`);
  return <ElimuContent lang={lang} />;
}
