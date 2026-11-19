import { Check, Flag, Gem, Target } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";
import { approvedValues, officialStatements } from "@/lib/about-content";
import styles from "./PurposeCards.module.css";

/**
 * Vision, mission and (when approved) values.
 * Vision and mission are TDSP's Constitution wording, shown VERBATIM (English
 * only; no approved Kiswahili translation exists). The Values card renders
 * only when TDSP has approved values (lib/about-content.ts); none exist yet.
 */
export function PurposeCards({ lang, dict }: { lang: Locale; dict: Dictionary["about"]["purpose"] }) {
  const values = approvedValues.map((v) => v[lang]);

  return (
    <section className={`containerWide ${styles.section}`} aria-labelledby="purpose-title">
      <h2 id="purpose-title" className="srOnly">
        {dict.label}
      </h2>
      <div className={`${styles.grid} ${values.length ? styles.three : styles.two}`}>
        <article className={`${styles.card} ${styles.mint}`}>
          <Target className={`${styles.icon} ${styles.iconBig}`} size={52} strokeWidth={1.75} aria-hidden="true" />
          <div className={styles.body}>
            <h3 className={styles.title}>{dict.vision}</h3>
            <p lang="en" className={styles.quote}>
              {officialStatements.vision}
            </p>
            <p className={styles.note}>{dict.officialNote}</p>
          </div>
        </article>

        <article className={`${styles.card} ${styles.cream}`}>
          <Flag className={`${styles.icon} ${styles.iconBig}`} size={52} strokeWidth={1.75} aria-hidden="true" />
          <div className={styles.body}>
            <h3 className={styles.title}>{dict.mission}</h3>
            <p lang="en" className={styles.quote}>
              {officialStatements.mission}
            </p>
            <p className={styles.note}>{dict.officialNote}</p>
          </div>
        </article>

        {values.length > 0 && (
          <article className={`${styles.card} ${styles.lavender}`}>
            <Gem className={`${styles.icon} ${styles.iconBig}`} size={52} strokeWidth={1.75} aria-hidden="true" />
            <div className={styles.body}>
              <h3 className={styles.title}>{dict.values}</h3>
              <ul className={styles.values}>
                {values.map((v) => (
                  <li key={v}>
                    <Check size={18} strokeWidth={3} aria-hidden="true" className={styles.check} />
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
