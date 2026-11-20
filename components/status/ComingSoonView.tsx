import Link from "next/link";
import { ArrowRight, Bell, House, Layers, Rocket, type LucideIcon } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";
import { Breadcrumb } from "../Breadcrumb";
import { IllustrationConstruction, Wave } from "./Illustrations";
import styles from "./Status.module.css";

const CARDS: { key: keyof Dictionary["status"]["comingSoon"]["cards"]; Icon: LucideIcon }[] = [
  { key: "services", Icon: Rocket },
  { key: "improvements", Icon: Layers },
  { key: "announce", Icon: Bell },
];

/**
 * "Coming soon" page for sections that are on the roadmap but not built.
 * Desktop: photo backdrop, wide white card (illustration | text) and three
 * feature tiles. Phones: breadcrumb strip over the photo, one column and a
 * wave at the foot of the card. Same markup, different CSS layouts.
 */
export function ComingSoonView({
  lang,
  dict,
  homeLabel,
}: {
  lang: Locale;
  dict: Dictionary["status"]["comingSoon"];
  homeLabel: string;
}) {
  return (
    <div className={`${styles.stage} ${styles.stagePhoto}`}>
      <div className={styles.photo} aria-hidden="true">
        <span className={styles.swooshL} />
        <span className={styles.swooshR} />
      </div>

      <div className={`containerWide ${styles.crumbRow}`}>
        <Breadcrumb
          label={dict.breadcrumbLabel}
          items={[{ label: homeLabel, href: `/${lang}` }, { label: dict.crumb }]}
        />
      </div>

      <section className={`${styles.card} ${styles.csCard}`} aria-labelledby="status-title">
        <div className={styles.csArt} role="img" aria-label={dict.illustrationLabel}>
          <IllustrationConstruction className={styles.csSvg} />
        </div>

        <div className={styles.csBody}>
          <p className={styles.pill}>
            <Rocket size={18} aria-hidden="true" />
            {dict.pill}
          </p>
          <h1 id="status-title" className={styles.csTitle}>
            {dict.title}
          </h1>
          <p className={styles.lead}>{dict.text}</p>
          <Link href={`/${lang}`} className={styles.cta}>
            <House size={22} aria-hidden="true" />
            {dict.button}
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
        </div>

        <ul className={styles.features}>
          {CARDS.map(({ key, Icon }) => (
            <li key={key} className={styles.feature}>
              <Icon size={40} strokeWidth={1.6} aria-hidden="true" className={styles.featureIcon} />
              <div>
                <strong className={styles.featureTitle}>{dict.cards[key].title}</strong>
                <span className={styles.featureText}>{dict.cards[key].text}</span>
              </div>
            </li>
          ))}
        </ul>

        <Wave className={styles.cardWave} />
      </section>
    </div>
  );
}
