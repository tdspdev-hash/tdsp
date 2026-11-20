import { notFound, redirect } from "next/navigation";
import { isLocale, localizedSlug } from "@/lib/i18n/config";

type Props = { params: Promise<{ lang: string }> };

/** Old address: /sw/documents and /en/documents now lead to the Document Centre. */
export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  redirect(`/${lang}/${localizedSlug("documents", lang)}`);
}
