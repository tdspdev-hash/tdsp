import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JoinContent } from "@/components/account/JoinContent";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getDictionary(lang).join.pageTitle };
}

export default async function JoinPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <JoinContent lang={lang} />;
}
