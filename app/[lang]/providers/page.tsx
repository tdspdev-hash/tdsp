import { notFound, redirect } from "next/navigation";
import { isLocale, localizedSlug } from "@/lib/i18n/config";

type Props = { params: Promise<{ lang: string }> };

/** Old address: /sw/providers and /en/providers now lead to the Service Providers page. */
export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  redirect(`/${lang}/${localizedSlug("providers", lang)}`);
}
