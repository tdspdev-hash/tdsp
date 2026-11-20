import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { DocumentCentreContent } from "@/components/documents/DocumentCentreContent";
import { publishedDocuments } from "@/lib/documents-server";
import { isLocale, localizedSlug } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<{ q?: string | string[]; cat?: string | string[] }> };

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getDictionary(lang).documentsPage.title };
}

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** Address of the Document Centre for "sw" (the other language redirects here). */
export default async function Page({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const sp = await searchParams;
  if (lang !== "sw") redirect(`/${lang}/${localizedSlug("documents", lang)}`);
  return <DocumentCentreContent lang={lang} published={publishedDocuments()} query={(one(sp.q) ?? "").slice(0, 100)} category={one(sp.cat)} />;
}
