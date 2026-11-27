import type { MembershipState } from "@/lib/data/membership";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";
import styles from "./Member.module.css";

export const formatDate = (lang: Locale, iso: string) =>
  new Intl.DateTimeFormat(lang === "sw" ? "sw-TZ" : "en-GB", { dateStyle: "long", timeZone: "Africa/Dar_es_Salaam" }).format(new Date(iso));

type Props = {
  lang: Locale;
  name: string | null;
  membership: Extract<MembershipState, { kind: "active" }>;
  dict: Dictionary["portal"];
};

/** The member's own record. A missing value says so; nothing is filled in or assumed. */
export function MembershipDetails({ lang, name, membership, dict }: Props) {
  const rows = [
    [dict.fields.name, name],
    [dict.fields.number, membership.memberNumber],
    [dict.fields.category, membership.category && dict.categories[membership.category]],
    [dict.fields.status, dict.active],
    [dict.fields.applied, membership.appliedAt && formatDate(lang, membership.appliedAt)],
    [dict.fields.approved, formatDate(lang, membership.approvedAt)],
  ];
  return (
    <dl className={styles.details}>
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value || <span className={styles.muted}>{dict.notRecorded}</span>}</dd>
        </div>
      ))}
    </dl>
  );
}
