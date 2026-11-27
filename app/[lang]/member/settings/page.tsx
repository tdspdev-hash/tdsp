import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SignOutButton } from "@/components/account/SignOutButton";
import styles from "@/components/member/Member.module.css";
import { requireMember } from "@/lib/auth/member";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? { title: getDictionary(lang).portal.nav.settings } : {};
}

export default async function SettingsPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { user, membership } = await requireMember(lang);
  if (membership.kind !== "active") return null;
  const dict = getDictionary(lang);
  const d = dict.portal;

  return (
    <>
      <h1>{d.nav.settings}</h1>
      <section className={styles.card}>
        <p>{dict.accountPage.signedInAs} <strong>{user.email}</strong></p>
        <p>{d.settings.language}</p>
        <p><Link href={`/${lang}/reset-password`} className={styles.link}>{d.settings.password}</Link></p>
        <SignOutButton label={dict.accountPage.signOut} />
      </section>
    </>
  );
}
