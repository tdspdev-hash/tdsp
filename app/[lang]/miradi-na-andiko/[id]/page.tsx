import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { isLocale, localizedSlug } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getMockProject, MOCK_PROJECTS } from "@/lib/projects-mock";

type Props = { params: Promise<{ lang: string; id: string }> };

export function generateStaticParams() {
  return MOCK_PROJECTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, id } = await params;
  if (!isLocale(lang) || !getMockProject(id)) return {};
  return { title: getDictionary(lang).projectsPage.list.items[getMockProject(id)!.id].title };
}

/** Project detail at the "sw" address (the other language redirects to its own). */
export default async function Page({ params }: Props) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  if (lang !== "sw") redirect(`/${lang}/${localizedSlug("projects", lang)}/${id}`);
  const project = getMockProject(id);
  if (!project) notFound();
  return <ProjectDetail lang={lang} project={project} />;
}
