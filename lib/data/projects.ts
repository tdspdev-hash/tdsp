import "server-only";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { MOCK_PROJECTS } from "@/lib/projects-mock";
import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/lib/supabase/database.types";

type Row = Database["public"]["Tables"]["projects"]["Row"];

export type ProjectStatus = Row["status"];

/** One project, already in the visitor's language. */
export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string[]; // paragraphs
  objectives: string[];
  targetGroup: string | null;
  status: ProjectStatus;
  period: string | null;
  location: string | null;
  image: string | null;
  /** True for demonstration records. The pages show a visible "sample" note when any is displayed. */
  isSample: boolean;
};

/**
 * Where the result came from:
 * - "database": Supabase answered (the list may legitimately be empty);
 * - "sample": Supabase is deliberately NOT configured (offline tests, local work); labelled sample content;
 * - "error": Supabase IS configured but the query failed. No data is shown, and in
 *   particular NEVER the sample content, so an outage cannot make samples look like real projects.
 */
export type ProjectSource = "database" | "sample" | "error";

const lines = (v: string | null) => (v ?? "").split(/\n+/).map((s) => s.trim()).filter(Boolean);
const paragraphs = (v: string) => v.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);

function periodOf(r: Row): string | null {
  if (r.period_label) return r.period_label;
  const y = (d: string | null) => (d ? d.slice(0, 4) : null);
  const a = y(r.start_date);
  const b = y(r.end_date);
  return a && b ? (a === b ? a : `${a}–${b}`) : (a ?? b);
}

function fromRow(r: Row, lang: Locale): Project {
  const sw = lang === "sw";
  return {
    slug: r.slug,
    title: sw ? r.title_sw : r.title_en,
    summary: sw ? r.summary_sw : r.summary_en,
    description: paragraphs(sw ? r.description_sw : r.description_en),
    objectives: lines(sw ? r.objectives_sw : r.objectives_en),
    targetGroup: (sw ? r.target_group_sw : r.target_group_en) || null,
    status: r.status,
    period: periodOf(r),
    location: r.location,
    image: r.cover_image_path,
    isSample: r.is_sample,
  };
}

/** Labelled sample content that ships with the code (used only when the database is unavailable). */
function samples(lang: Locale): Project[] {
  const d = getDictionary(lang).projectsPage;
  return MOCK_PROJECTS.map((p) => {
    const item = d.list.items[p.id];
    const info = d.detail.items[p.id];
    return {
      slug: p.id,
      title: item.title,
      summary: item.text,
      description: [info.p1, info.p2],
      objectives: [info.o1, info.o2, info.o3],
      targetGroup: info.target,
      status: p.status,
      period: p.period,
      location: p.location,
      image: p.image,
      isSample: true,
    };
  });
}

/**
 * Published projects, oldest project number first. Unpublished projects are never
 * returned: Row Level Security allows the public key to read published rows only,
 * and the query also filters on publication_status.
 */
export async function getProjects(lang: Locale): Promise<{ projects: Project[]; source: ProjectSource }> {
  const supabase = createPublicClient();
  if (!supabase) return { projects: samples(lang), source: "sample" };
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("publication_status", "published")
    .order("project_number", { ascending: true });
  if (error) {
    console.error("getProjects failed:", error.message);
    return { projects: [], source: "error" };
  }
  return { projects: data.map((r) => fromRow(r, lang)), source: "database" };
}

export async function getProject(lang: Locale, slug: string): Promise<{ project?: Project; source: ProjectSource }> {
  const { projects, source } = await getProjects(lang);
  return { project: projects.find((p) => p.slug === slug), source };
}
