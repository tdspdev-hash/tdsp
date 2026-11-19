import Link from "next/link";
import {
  ArrowRight,
  Coins,
  GraduationCap,
  Layers,
  Leaf,
  ShoppingCart,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { localizedSlug, pageSlugs, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";
import styles from "./ServiceCards.module.css";

type CardKey = keyof Dictionary["home"]["services"]["cards"];

// anchor = the section's route (all six are 'coming soon' pages for now).
const CARDS: { key: CardKey; anchor: string; Icon: LucideIcon; tone: "mint" | "cream" | "lavender" }[] = [
  { key: "valueChain", anchor: "farmers-value-chain", Icon: Leaf, tone: "mint" },
  { key: "projects", anchor: "projects", Icon: Layers, tone: "cream" },
  { key: "financial", anchor: "financial-linkage", Icon: Coins, tone: "mint" },
  { key: "markets", anchor: "markets", Icon: ShoppingCart, tone: "lavender" },
  { key: "training", anchor: "training", Icon: GraduationCap, tone: "cream" },
  { key: "providers", anchor: "providers", Icon: UsersRound, tone: "mint" },
];

export function ServiceCards({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary["home"]["services"];
}) {
  return (
    <section className={`containerWide ${styles.section}`} aria-labelledby="services-title">
      <header className={styles.header}>
        <p className={styles.eyebrow}>
          <span className={styles.line} aria-hidden="true" />
          {dict.eyebrow}
          <span className={styles.line} aria-hidden="true" />
        </p>
        <h2 id="services-title" className={styles.title}>
          {dict.title}
        </h2>
        <p className={styles.lead}>{dict.text}</p>
      </header>

      <ul className={styles.grid}>
        {CARDS.map(({ key, anchor, Icon, tone }) => (
          <li key={key} className={styles.cell}>
            <Link
              href={`/${lang}/${anchor in pageSlugs ? localizedSlug(anchor as keyof typeof pageSlugs, lang) : anchor}`}
              className={`${styles.card} ${styles[tone]}`}
            >
              <Icon className={styles.icon} size={40} strokeWidth={1.75} aria-hidden="true" />
              <span className={styles.name}>{dict.cards[key].title}</span>
              <span className={styles.desc}>{dict.cards[key].text}</span>
              <span className={styles.arrow} aria-hidden="true">
                <ArrowRight size={18} strokeWidth={2.25} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className={styles.docsLink}>
        <Link href={`/${lang}/${localizedSlug("documents", lang)}`}>
          {dict.documentsLink}
          <ArrowRight size={18} strokeWidth={2.25} aria-hidden="true" />
        </Link>
      </p>
    </section>
  );
}
