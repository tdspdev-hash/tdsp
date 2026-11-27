import Link from "next/link";
import { redirect } from "next/navigation";
import { IdCard, UserRound } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { getOwnMembership } from "@/lib/data/membership";
import { getOwnProfile } from "@/lib/data/profile";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { contactPath } from "@/lib/navigation";
import { Alert } from "../forms/Alert";
import { ProfileForm } from "./ProfileForm";
import { SignOutButton } from "./SignOutButton";
import { memberPath } from "../member/sections";
import styles from "./MemberArea.module.css";

/**
 * What a signed-in NON-member sees on the account page: membership status and their own
 * profile. Being signed in is not membership. Active members go to the member dashboard.
 */
export async function MemberArea({ lang, user }: { lang: Locale; user: User }) {
  const dict = getDictionary(lang);
  const d = dict.accountPage;
  const m = d.member;
  const membership = await getOwnMembership(user.id);
  if (membership.kind === "active") redirect(memberPath(lang, "dashboard"));
  const profile = await getOwnProfile(user.id);

  return (
    <div className={`container ${styles.wrap}`}>
      <header className={styles.head}>
        <h1>
          {m.welcome}
          {profile ? `, ${profile.full_name}` : ""}
        </h1>
        <p role="status">
          {d.signedInAs} <strong>{user.email}</strong>
        </p>
        <SignOutButton label={d.signOut} />
      </header>

      <section className={styles.card} aria-labelledby="mb-membership">
        <h2 id="mb-membership">
          <IdCard size={26} aria-hidden="true" />
          {m.membership.title}
        </h2>
        {membership.kind === "error" ? (
          <Alert kind="error">{m.checkFailed}</Alert>
        ) : (
          <>
            <p className={styles.badge}>{m.membership.status}</p>
            <p>{m.membership.text}</p>
          </>
        )}
        <Link href={contactPath(lang)} className={styles.link}>{m.membership.contact}</Link>
      </section>

      <section className={styles.card} aria-labelledby="mb-profile">
        <h2 id="mb-profile">
          <UserRound size={26} aria-hidden="true" />
          {m.profile.title}
        </h2>
        {profile ? (
          <ProfileForm userId={user.id} profile={profile} dict={{ join: dict.join, form: dict.form, profile: m.profile }} />
        ) : (
          <Alert kind="error">{m.profile.loadError}</Alert>
        )}
      </section>
    </div>
  );
}
