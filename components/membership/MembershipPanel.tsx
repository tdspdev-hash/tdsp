import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Check,
  FileText,
  Handshake,
  HandCoins,
  Layers,
  LockKeyhole,
  Sprout,
  User,
  UserPlus,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";
import {
  MEMBERSHIP_CATEGORIES,
  MEMBERSHIP_REQUIREMENTS,
  membershipContentApproved,
} from "@/lib/membership-content";
import styles from "./MembershipPanel.module.css";

type Dict = Dictionary["membership"];

const BENEFITS: { key: keyof Dict["benefits"]["items"]; Icon: LucideIcon }[] = [
  { key: "markets", Icon: Sprout },
  { key: "training", Icon: Layers },
  { key: "finance", Icon: HandCoins },
  { key: "network", Icon: UsersRound },
  { key: "partners", Icon: Handshake },
  { key: "documents", Icon: FileText },
];

const CATEGORY_ICONS: Record<(typeof MEMBERSHIP_CATEGORIES)[number], LucideIcon> = {
  individual: User,
  groups: UsersRound,
  institutions: Building2,
};

function LeafArt() {
  return (
    <svg className={styles.leaf} viewBox="0 0 120 200" aria-hidden="true" focusable="false">
      <path d="M62 200V70" stroke="#2f8a4a" strokeWidth="4" fill="none" strokeLinecap="round" opacity=".55" />
      <path d="M62 120C20 120 4 84 8 40c40 4 62 40 54 80z" fill="#2f8a4a" opacity=".45" />
      <path d="M62 90C100 84 118 50 112 8 74 14 54 46 62 90z" fill="#3a9a55" opacity=".5" />
      <path d="M62 160c34-4 52-30 50-62-32 6-52 30-50 62z" fill="#2f8a4a" opacity=".35" />
    </svg>
  );
}

/**
 * The white sheet: benefits + join card, then categories + requirements.
 * Desktop: two columns, overlapping the hero. Phones: one column, same order.
 * Both CTAs are real links: registration screen and sign-in screen.
 */
export function MembershipPanel({ lang, dict }: { lang: Locale; dict: Dict }) {
  return (
    <div className={`containerWide ${styles.wrap}`}>
      <div className={styles.panel}>
        <div className={styles.top}>
          <section aria-labelledby="benefits-title" className={styles.benefits}>
            <h2 id="benefits-title" className={styles.h}>
              {dict.benefits.title}
            </h2>
            <ul className={styles.benefitGrid}>
              {BENEFITS.map(({ key, Icon }) => (
                <li key={key} className={styles.benefit}>
                  <Icon size={38} strokeWidth={1.7} aria-hidden="true" className={styles.benefitIcon} />
                  <span>{dict.benefits.items[key]}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="join-title" className={styles.join}>
            <LeafArt />
            <h2 id="join-title" className={styles.joinTitle}>
              {dict.join.title}
            </h2>
            <p className={styles.joinText}>{dict.join.text}</p>
            <div className={styles.joinButtons}>
              <Link href={`/${lang}/join`} className={styles.btnGold}>
                <UserPlus size={22} aria-hidden="true" />
                {dict.join.register}
                <ArrowRight size={20} aria-hidden="true" />
              </Link>
              <Link href={`/${lang}/login`} className={styles.btnOutline}>
                <LockKeyhole size={20} aria-hidden="true" />
                {dict.join.login}
                <ArrowRight size={20} aria-hidden="true" />
              </Link>
            </div>
            <p className={styles.joinNote}>{dict.join.note}</p>
          </section>
        </div>

        <div className={styles.bottom}>
          <section aria-labelledby="categories-title" className={styles.categories}>
            <h2 id="categories-title" className={styles.h}>
              {dict.categories.title}
            </h2>
            <ul className={styles.categoryList}>
              {MEMBERSHIP_CATEGORIES.map((key) => {
                const Icon = CATEGORY_ICONS[key];
                return (
                  <li key={key} className={`${styles.category} ${key === "groups" ? styles.cream : ""}`}>
                    <Icon size={42} strokeWidth={1.7} aria-hidden="true" className={styles.categoryIcon} />
                    <div className={styles.categoryText}>
                      <h3>{dict.categories.items[key].title}</h3>
                      <p>{dict.categories.items[key].text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          <section aria-labelledby="requirements-title" className={styles.requirements}>
            <h2 id="requirements-title" className={styles.h}>
              {dict.requirements.title}
            </h2>
            <ul className={styles.checks}>
              {MEMBERSHIP_REQUIREMENTS.map((key) => (
                <li key={key}>
                  <span className={styles.tick} aria-hidden="true">
                    <Check size={15} strokeWidth={3.5} />
                  </span>
                  {dict.requirements.items[key]}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {!membershipContentApproved && (
          <p className={styles.draft} role="note">
            {dict.draftNote}
          </p>
        )}
      </div>
    </div>
  );
}
