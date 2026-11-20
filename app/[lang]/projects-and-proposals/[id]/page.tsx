import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { ProjectUnavailable } from "@/components/projects/ProjectUnavailable";
import { getProject } from "@/lib/data/projects";
import { isLocale, localizedSlug } from "@/lib/i18n/config";

type Props = { params: Promise<{ lang: string; id: string }> };

/** Reads the project from Supabase on every request, so a failed read is never cached as a normal page. */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  if (!isLocale(lang)) return {};
  const { project } = await getProject(lang, id);
  return project ? { title: project.title } : {};
}

/** Project detail at the "en" address (the other language redirects to its own). */
export default async function Page({ params }: Props) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  if (lang !== "en") redirect(`/${lang}/${localizedSlug("projects", lang)}/${id}`);
  const { project, source } = await getProject(lang, id);
  if (source === "error") {
    return <ProjectUnavailable lang={lang} />;
  }
  if (!project) notFound();
  return <ProjectDetail lang={lang} project={project} />;
}
