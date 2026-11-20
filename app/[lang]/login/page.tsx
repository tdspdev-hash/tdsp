import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LoginContent } from "@/components/account/LoginContent";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getDictionary(lang).login.pageTitle };
}

export default async function LoginPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <LoginContent lang={lang} />;
}
