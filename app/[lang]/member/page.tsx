import { notFound, redirect } from "next/navigation";
import { memberPath } from "@/components/member/sections";
import { isLocale } from "@/lib/i18n/config";

export default async function MemberIndex({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  redirect(memberPath(lang, "dashboard"));
}
