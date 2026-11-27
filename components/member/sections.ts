import { Bell, ClipboardList, FileText, GraduationCap, IdCard, LayoutDashboard, Settings, Store, UserRound, type LucideIcon } from "lucide-react";
import { localizedSlug, type Locale } from "@/lib/i18n/config";
import { contactPath } from "@/lib/navigation";

/** Member navigation, in the agreed order. `ready: false` pages show a "not available yet" state. */
export const MEMBER_SECTIONS = [
  { key: "dashboard", slug: "dashboard", Icon: LayoutDashboard, ready: true },
  { key: "profile", slug: "profile", Icon: UserRound, ready: true },
  { key: "membership", slug: "membership", Icon: IdCard, ready: true },
  { key: "requests", slug: "service-requests", Icon: ClipboardList, ready: false },
  { key: "markets", slug: "markets", Icon: Store, ready: false },
  { key: "training", slug: "training", Icon: GraduationCap, ready: false },
  { key: "documents", slug: "documents", Icon: FileText, ready: false },
  { key: "notifications", slug: "notifications", Icon: Bell, ready: false },
  { key: "settings", slug: "settings", Icon: Settings, ready: true },
] as const satisfies readonly { key: string; slug: string; Icon: LucideIcon; ready: boolean }[];

export type MemberSectionKey = (typeof MEMBER_SECTIONS)[number]["key"];

export const memberPath = (lang: Locale, slug: string) => `/${lang}/member/${slug}`;

/** The public page a not-yet-built member section can honestly point to. */
export function publicPageFor(lang: Locale, key: MemberSectionKey): string | null {
  if (key === "markets" || key === "training" || key === "documents") return `/${lang}/${localizedSlug(key, lang)}`;
  if (key === "requests") return contactPath(lang);
  return null;
}
