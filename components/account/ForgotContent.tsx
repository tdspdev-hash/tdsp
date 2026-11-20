import { Lock, Mail, Send, type LucideIcon } from "lucide-react";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { accountPath } from "@/lib/navigation";
import { Breadcrumb } from "../Breadcrumb";
import { ForgotForm } from "./ForgotForm";
import lg from "./LoginContent.module.css";
import styles from "./ForgotContent.module.css";

const STEP_ICONS: LucideIcon[] = [Mail, Send, Lock];

/** Page 16, Forgot Password: hero panel with three recovery steps on the left, request card on the right (stacked on phones). */
export function ForgotContent({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const d = dict.forgot;

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
        <section className={styles.hero} aria-labelledby="forgot-hero-title">
          <div className={styles.photo} role="img" aria-label={d.hero.imageLabel} />
          <div className={styles.heroText}>
            <h1 id="forgot-hero-title">
              {d.hero.title} <span className={lg.accent}>{d.hero.accent}</span>
            </h1>
            <p>{d.hero.text}</p>
          </div>
        </section>

        <ol className={styles.steps} aria-label={d.stepsLabel}>
          {([d.steps.one, d.steps.two, d.steps.three] as const).map((s, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <li key={s.title}>
                <Icon size={36} strokeWidth={1.6} aria-hidden="true" />
                <h2>{s.title}</h2>
                <p>{s.text}</p>
              </li>
            );
          })}
        </ol>

        <section className={styles.card} aria-labelledby="forgot-title">
          <div className={styles.cardHead}>
            <span className={lg.circle}><Mail size={38} strokeWidth={1.6} aria-hidden="true" /></span>
            <div>
              <h2 id="forgot-title">{d.title}</h2>
              <p>{d.text}</p>
            </div>
          </div>
          <ForgotForm lang={lang} dict={dict} />
        </section>
      </div>
    </>
  );
}
