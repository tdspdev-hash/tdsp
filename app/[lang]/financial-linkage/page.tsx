import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FinancialContent } from "@/components/financial/FinancialContent";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getDictionary(lang).financialPage.title };
}

/** Same address in both languages: /sw/financial-linkage and /en/financial-linkage. */
export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <FinancialContent lang={lang} />;
}
