import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ProjectsContent } from "@/components/projects/ProjectsContent";
import { isLocale, localizedSlug } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type Props = { params: Promise<{ lang: string }> };

/** Reads published projects from Supabase on every request, so a failed read is never cached as a normal page. */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getDictionary(lang).projectsPage.title };
}

/** Address of the Projects & Proposals page for "sw" (the other language redirects here). */
export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  if (lang !== "sw") redirect(`/${lang}/${localizedSlug("projects", lang)}`);
  return <ProjectsContent lang={lang} />;
}
