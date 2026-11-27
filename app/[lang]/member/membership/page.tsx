import type { Metadata } from "next";
import { notFound } from "next/navigation";
import styles from "@/components/member/Member.module.css";
import { MembershipDetails } from "@/components/member/MembershipDetails";
import { requireMember } from "@/lib/auth/member";
import { getOwnProfile } from "@/lib/data/profile";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? { title: getDictionary(lang).portal.nav.membership } : {};
}

export default async function MembershipPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { user, membership } = await requireMember(lang);
  if (membership.kind !== "active") return null;
  const profile = await getOwnProfile(user.id);
  const d = getDictionary(lang).portal;

  return (
    <>
      <h1>{d.nav.membership}</h1>
      <section className={styles.card}>
        <MembershipDetails lang={lang} name={profile?.full_name ?? null} membership={membership} dict={d} />
      </section>
    </>
  );
}
