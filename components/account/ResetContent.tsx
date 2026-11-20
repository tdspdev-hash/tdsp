import Link from "next/link";
import { Lock } from "lucide-react";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { accountPath } from "@/lib/navigation";
import { Alert } from "../forms/Alert";
import { Breadcrumb } from "../Breadcrumb";
import { ResetForm } from "./ResetForm";
import lg from "./LoginContent.module.css";
import styles from "./ForgotContent.module.css";

/**
 * Set-a-new-password page. `state` is decided on the server:
 *  - "ready": there is a verified session (recovery link or sign-in): show the form;
 *  - "invalid": no verified session (expired or reused link): ask for a new link;
 *  - "not_configured": Supabase is not set up (offline/dev): say so, no form.
 */
export function ResetContent({ lang, state }: { lang: Locale; state: "ready" | "invalid" | "not_configured" }) {
  const dict = getDictionary(lang);
  const d = dict.reset;

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
        <section className={styles.card} aria-labelledby="reset-title">
          <div className={styles.cardHead}>
            <span className={lg.circle}><Lock size={38} strokeWidth={1.6} aria-hidden="true" /></span>
            <div>
              <h1 id="reset-title">{d.title}</h1>
              <p>{d.text}</p>
            </div>
          </div>
          {state === "ready" && <ResetForm lang={lang} dict={dict} />}
          {state === "invalid" && (
            <div className={lg.form}>
              <Alert kind="error">{d.linkInvalid}</Alert>
              <Link href={`/${lang}/forgot-password`} className={lg.submit}>{d.requestNew}</Link>
            </div>
          )}
          {state === "not_configured" && (
            <div className={lg.form}>
              <Alert kind="error">{dict.form.notConfigured}</Alert>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
