import { Laptop, Sprout, UserRound, UsersRound, type LucideIcon } from "lucide-react";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { accountPath } from "@/lib/navigation";
import { Breadcrumb } from "../Breadcrumb";
import { LoginForm } from "./LoginForm";
import styles from "./LoginContent.module.css";

const BENEFITS: { key: "services" | "information" | "network"; Icon: LucideIcon }[] = [
  { key: "services", Icon: Laptop },
  { key: "information", Icon: Sprout },
  { key: "network", Icon: UsersRound },
];

/** Page 14, Login: hero panel with three benefits on the left, login card on the right (stacked on phones). */
export function LoginContent({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const d = dict.login;
  const base = `/${lang}`;

  return (
    <>
      <div className={styles.crumbBar}>
        <div className="containerWide">
          <Breadcrumb
            label={d.breadcrumbLabel}
            items={[
              { label: dict.nav.welcome, href: base },
              { label: dict.accountPage.crumb, href: accountPath(lang) },
              { label: d.crumb },
            ]}
          />
        </div>
      </div>

      <div className={`containerWide ${styles.stage}`}>
        <section className={styles.hero} aria-labelledby="login-hero-title">
          <div className={styles.photo} role="img" aria-label={d.hero.imageLabel} />
          <div className={styles.heroText}>
            <h1 id="login-hero-title">
              {d.hero.title} <span className={styles.accent}>{d.hero.accent}</span>
            </h1>
            <p>{d.hero.text}</p>
          </div>
        </section>

        <ul className={styles.benefits}>
          {BENEFITS.map(({ key, Icon }) => (
            <li key={key}>
              <Icon size={34} strokeWidth={1.6} aria-hidden="true" />
              <div>
                <h2>{d.benefits[key].title}</h2>
                <p>{d.benefits[key].text}</p>
              </div>
            </li>
          ))}
        </ul>

        <section className={styles.card} aria-labelledby="login-title">
          <div className={styles.cardHead}>
            <span className={styles.circle}><UserRound size={38} strokeWidth={1.6} aria-hidden="true" /></span>
            <div>
              <h2 id="login-title">{d.title}</h2>
              <p>{d.subtitle}</p>
            </div>
          </div>
          <LoginForm lang={lang} dict={dict} />
        </section>
      </div>
    </>
  );
}
