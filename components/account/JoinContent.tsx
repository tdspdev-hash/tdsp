import { Laptop, Megaphone, Sprout, UserPlus, UsersRound, type LucideIcon } from "lucide-react";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { accountPath } from "@/lib/navigation";
import { Breadcrumb } from "../Breadcrumb";
import { JoinForm } from "./JoinForm";
import lg from "./LoginContent.module.css";
import styles from "./JoinContent.module.css";

const BENEFITS: { key: "network" | "projects" | "services" | "information"; Icon: LucideIcon }[] = [
  { key: "network", Icon: UsersRound },
  { key: "projects", Icon: Sprout },
  { key: "services", Icon: Laptop },
  { key: "information", Icon: Megaphone },
];

/** Page 15, Join / Registration: hero panel with benefits on the left, registration card on the right (stacked on phones). */
export function JoinContent({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const d = dict.join;

  return (
    <>
      <div className={lg.crumbBar}>
        <div className="containerWide">
          <Breadcrumb
            label={d.breadcrumbLabel}
            items={[
              { label: dict.nav.welcome, href: `/${lang}` },
              { label: dict.accountPage.crumb, href: accountPath(lang) },
              { label: d.crumb },
            ]}
          />
        </div>
      </div>

      <div className={`containerWide ${styles.stage}`}>
        <section className={styles.hero} aria-labelledby="join-hero-title">
          <div className={styles.photo} role="img" aria-label={d.hero.imageLabel} />
          <div className={styles.heroText}>
            <h1 id="join-hero-title">
              {d.hero.title} <span className={lg.accent}>{d.hero.accent}</span>
            </h1>
            <p>{d.hero.text}</p>
          </div>
        </section>

        <section className={styles.benefitsBox} aria-labelledby="join-benefits">
          <h2 id="join-benefits" className={styles.benefitsTitle}>{d.benefitsTitle}</h2>
          <ul className={styles.benefits}>
            {BENEFITS.map(({ key, Icon }) => (
              <li key={key}>
                <Icon size={34} strokeWidth={1.6} aria-hidden="true" />
                <div>
                  <h3>{d.benefits[key].title}</h3>
                  <p>{d.benefits[key].text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.card} aria-labelledby="join-title">
          <div className={styles.cardHead}>
            <span className={lg.circle}><UserPlus size={38} strokeWidth={1.6} aria-hidden="true" /></span>
            <div>
              <h2 id="join-title">{d.title}</h2>
              <p>{d.intro}</p>
            </div>
          </div>
          <JoinForm lang={lang} dict={dict} />
        </section>
      </div>
    </>
  );
}
