import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ProvidersContent } from "@/components/providers/ProvidersContent";
import { isLocale, localizedSlug } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getDictionary(lang).providersPage.title };
}

/** Address of the Service Providers page for "en" (the other language redirects here). */
export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  if (lang !== "en") redirect(`/${lang}/${localizedSlug("providers", lang)}`);
  return <ProvidersContent lang={lang} />;
}
