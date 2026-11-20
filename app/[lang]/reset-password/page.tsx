import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResetContent } from "@/components/account/ResetContent";
import { getCurrentUser } from "@/lib/auth/server";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getSupabaseEnv } from "@/lib/supabase/env";

type Props = { params: Promise<{ lang: string }> };

// The result depends on the visitor's session cookie: never cache it.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getDictionary(lang).reset.pageTitle, robots: { index: false, follow: false } };
}

export default async function ResetPasswordPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  if (!getSupabaseEnv()) return <ResetContent lang={lang} state="not_configured" />;
  const user = await getCurrentUser();
  return <ResetContent lang={lang} state={user ? "ready" : "invalid"} />;
}
