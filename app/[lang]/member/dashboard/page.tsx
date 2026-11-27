import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "@/components/member/Member.module.css";
import { formatDate, MembershipDetails } from "@/components/member/MembershipDetails";
import { MEMBER_SECTIONS, memberPath } from "@/components/member/sections";
import { requireMember } from "@/lib/auth/member";
import { getOwnProfile } from "@/lib/data/profile";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? { title: getDictionary(lang).portal.nav.dashboard } : {};
}

export default async function DashboardPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { user, membership } = await requireMember(lang);
  if (membership.kind !== "active") return null; // the layout shows the error
  const profile = await getOwnProfile(user.id);
  const d = getDictionary(lang).portal;

  // Only real, dated records. Nothing else feeds this list yet.
  const activity = [
    { label: d.activity.approved, at: membership.approvedAt },
    ...(membership.appliedAt ? [{ label: d.activity.applied, at: membership.appliedAt }] : []),
  ];

  return (
    <>
      <h1>{d.nav.dashboard}</h1>
      {!profile && <p role="alert" className={styles.card}>{d.profileLoadError}</p>}

      <section className={`${styles.card} ${styles.hero}`} aria-labelledby="db-membership">
        <h2 id="db-membership">{d.nav.membership}</h2>
        <MembershipDetails lang={lang} name={profile?.full_name ?? null} membership={membership} dict={d} />
        <Link href={memberPath(lang, "profile")} className={styles.link}>{d.nav.profile}</Link>
      </section>

      <ul className={styles.summary} aria-label={d.summaryLabel}>
        {[
          [d.fields.status, d.active],
          [d.nav.requests, d.unavailable],
          [d.nav.training, d.unavailable],
          [d.nav.notifications, d.unavailable],
        ].map(([label, value]) => (
          <li key={label} className={styles.card}>
            <div className={styles.stat}>
              <h3>{label}</h3>
              <p>{value}</p>
            </div>
          </li>
        ))}
      </ul>

      <section className={styles.card} aria-labelledby="db-actions">
        <h2 id="db-actions">{d.quickActions}</h2>
        <ul className={styles.actions}>
          {MEMBER_SECTIONS.filter((s) => s.key !== "dashboard" && s.key !== "settings").map(({ key, slug, Icon, ready }) => (
            <li key={key}>
              <Link href={memberPath(lang, slug)}>
                <Icon size={22} aria-hidden="true" />
                {d.nav[key]}
                {!ready && <span className={styles.soon}>{d.soon}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.card} aria-labelledby="db-activity">
        <h2 id="db-activity">{d.activity.title}</h2>
        <ul className={styles.activity}>
          {activity.map(({ label, at }) => (
            <li key={label}>
              <span>{label}</span>
              <time dateTime={at}>{formatDate(lang, at)}</time>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
