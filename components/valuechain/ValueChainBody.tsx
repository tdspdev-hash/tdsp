import Link from "next/link";
import { ArrowRight, Coins, HandHelping, Leaf, Sprout, TrendingUp, UsersRound, type LucideIcon } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";
import { ValueChainDiagram } from "./ValueChainDiagram";
import styles from "./ValueChainBody.module.css";

type Dict = Dictionary["valueChain"];
const BENEFITS: { key: keyof Dict["benefits"]["items"]; Icon: LucideIcon; cream?: boolean }[] = [
  { key: "value", Icon: TrendingUp },
  { key: "markets", Icon: Coins, cream: true },
  { key: "losses", Icon: HandHelping },
  { key: "partners", Icon: UsersRound, cream: true },
];

export function ValueChainBody({ lang, dict }: { lang: Locale; dict: Dict }) {
  return (
    <>
      <div className={`containerWide ${styles.wrap}`}>
        <section className={styles.panel} aria-labelledby="vc-about">
          <ValueChainDiagram dict={dict.diagram} />
          <div className={styles.about}>
            <p className={styles.eyebrow}>{dict.about.eyebrow}</p>
            <h2 id="vc-about" className={styles.aboutTitle}>{dict.about.title}</h2>
            <p className={styles.aboutText}>{dict.about.text}</p>
            {/* Leads to the Services page, which explains what TDSP offers. */}
            <Link href={`/${lang}/services`} className={styles.cta}>
              <Leaf size={22} aria-hidden="true" />
              {dict.about.cta}
              <ArrowRight size={20} aria-hidden="true" />
            </Link>
            <Sprout aria-hidden="true" className={styles.watermark} />
          </div>
        </section>
      </div>

      <section className={`containerWide ${styles.benefits}`} aria-labelledby="vc-benefits">
        <h2 id="vc-benefits" className={styles.h}>{dict.benefits.title}</h2>
        <ul className={styles.benefitGrid}>
          {BENEFITS.map(({ key, Icon, cream }) => (
            <li key={key} className={`${styles.benefit} ${cream ? styles.cream : ""}`}>
              <Icon aria-hidden="true" strokeWidth={1.6} className={styles.benefitIcon} />
              <div>
                <h3>{dict.benefits.items[key].title}</h3>
                <p>{dict.benefits.items[key].text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

    </>
  );
}
