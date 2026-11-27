import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bell, ChevronDown } from "lucide-react";
import { SignOutButton } from "@/components/account/SignOutButton";
import styles from "@/components/member/Member.module.css";
import { MemberNav } from "@/components/member/MemberNav";
import { memberPath } from "@/components/member/sections";
import { requireMember } from "@/lib/auth/member";
import { getOwnProfile } from "@/lib/data/profile";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

// Depends on the visitor's session: never prerender or cache.
export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

type Props = { children: React.ReactNode; params: Promise<{ lang: string }> };

export default async function MemberLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { user, membership } = await requireMember(lang);
  const dict = getDictionary(lang);
  const d = dict.portal;

  // Membership unknown: show only the error, no navigation and no member data.
  if (membership.kind === "error") {
    return (
      <div className={`containerWide ${styles.shell}`}>
        <div className={styles.header}>
          <p role="alert" className={styles.who}>{d.checkFailed}</p>
          <SignOutButton label={dict.accountPage.signOut} />
        </div>
      </div>
    );
  }

  const profile = await getOwnProfile(user.id);
  const name = profile?.full_name ?? user.email ?? "";
  const initials = name.split(/\s+/).slice(0, 2).map((w) => w.charAt(0)).join("").toUpperCase();

  return (
    <div className={`containerWide ${styles.shell}`}>
      <div className={styles.header}>
        <span className={styles.avatar} aria-hidden="true">{initials}</span>
        <p className={styles.who}>
          <small>{d.title}</small>
          <strong>{d.welcome}, {name}</strong>
        </p>
        <Link href={memberPath(lang, "notifications")} className={styles.iconButton} aria-label={d.nav.notifications}>
          <Bell size={20} aria-hidden="true" />
        </Link>
        <details className={styles.menu}>
          <summary className={styles.iconButton} aria-label={d.accountMenu}>
            <ChevronDown size={20} aria-hidden="true" />
          </summary>
          <div className={styles.menuPanel}>
            <Link href={memberPath(lang, "settings")}>{d.nav.settings}</Link>
            <SignOutButton label={dict.accountPage.signOut} />
          </div>
        </details>
      </div>
      <MemberNav lang={lang} dict={{ navLabel: d.navLabel, nav: d.nav }} />
      <div className={styles.body}>{children}</div>
    </div>
  );
}
