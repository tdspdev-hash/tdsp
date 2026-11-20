import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ContactContent } from "@/components/contact/ContactContent";
import { isLocale, localizedSlug } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getDictionary(lang).contactPage.title };
}

/** Kiswahili address of the contact page. English lives at /en/contact. */
export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  if (lang !== "sw") redirect(`/${lang}/${localizedSlug("contact", lang)}`);
  return <ContactContent lang={lang} />;
}
