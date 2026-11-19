import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ForgotContent } from "@/components/account/ForgotContent";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getDictionary(lang).forgot.pageTitle };
}

export default async function ForgotPasswordPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <ForgotContent lang={lang} />;
}
