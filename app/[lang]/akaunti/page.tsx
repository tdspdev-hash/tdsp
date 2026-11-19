import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AccountContent } from "@/components/account/AccountContent";
import { isLocale, localizedSlug } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getDictionary(lang).accountPage.pageTitle };
}

/** Address of the account landing page for "sw" (the other language redirects here). */
export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  if (lang !== "sw") redirect(`/${lang}/${localizedSlug("account", lang)}`);
  return <AccountContent lang={lang} />;
}
