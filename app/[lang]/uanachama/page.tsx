import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { MembershipContent } from "@/components/membership/MembershipContent";
import { isLocale, localizedSlug } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getDictionary(lang).membership.title };
}

/** Kiswahili address of the membership page. English lives at /en/membership. */
export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  if (lang !== "sw") redirect(`/${lang}/${localizedSlug("membership", lang)}`);
  return <MembershipContent lang={lang} />;
}
