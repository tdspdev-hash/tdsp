import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "@/components/member/Member.module.css";
import { MEMBER_SECTIONS, publicPageFor } from "@/components/member/sections";
import { requireMember } from "@/lib/auth/member";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type Props = { params: Promise<{ lang: string; section: string }> };

/** Sections in the menu that are not built yet. Any other address is a 404. */
const pending = (slug: string) => MEMBER_SECTIONS.find((s) => s.slug === slug && !s.ready);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, section } = await params;
  const found = pending(section);
  return isLocale(lang) && found ? { title: getDictionary(lang).portal.nav[found.key] } : {};
}

export default async function PendingSectionPage({ params }: Props) {
  const { lang, section } = await params;
  const found = pending(section);
  if (!isLocale(lang) || !found) notFound();
  const { membership } = await requireMember(lang);
  if (membership.kind !== "active") return null;
  const d = getDictionary(lang).portal;
  const publicPage = publicPageFor(lang, found.key);

  return (
    <>
      <h1>{d.nav[found.key]}</h1>
      <section className={styles.card}>
        <p><span className={styles.soon}>{d.soon}</span></p>
        <p>{d.pendingText}</p>
        {publicPage && (
          <Link href={publicPage} className={styles.link}>
            {found.key === "requests" ? d.contactTdsp : d.publicPage}
          </Link>
        )}
      </section>
    </>
  );
}
