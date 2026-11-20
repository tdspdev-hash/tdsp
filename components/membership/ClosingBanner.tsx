import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ArrowRight, UserPlus, type LucideIcon } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";
import styles from "./ClosingBanner.module.css";

/** Shared closing CTA banner. Defaults reproduce the Uanachama banner; other pages pass their own image and icon. */
export function ClosingBanner({
  lang,
  dict,
  image = "/membership-seedling.jpg",
  Icon = UserPlus,
  href,
  variant,
  compactTitle,
  outlineCta,
  action,
}: {
  lang: Locale;
  dict: Pick<Dictionary["membership"]["banner"], "title" | "button" | "imageAlt"> & { text?: string };
  image?: string;
  Icon?: LucideIcon;
  /** Destination of the button; defaults to the registration screen. */
  href?: string;
  /** "dark": dark green banner with white text and a gold button (Masoko). Default is the light banner. */
  variant?: "dark";
  /** Long titles: a smaller title size on wide screens so it fits on two lines. */
  compactTitle?: boolean;
  /** With variant "dark": a white-outlined button instead of the gold one. */
  outlineCta?: boolean;
  /** Replaces the button (e.g. a sign-up field). */
  action?: ReactNode;
}) {
  return (
    <section className={`containerWide ${styles.wrap}`}>
      <div className={`${styles.banner} ${variant === "dark" ? styles.dark : ""}`}>
        <div className={styles.image} style={{ "--banner-image": `url("${image}")` } as CSSProperties} role="img" aria-label={dict.imageAlt} />
        <div className={styles.titleBox}>
          <p className={`${styles.title} ${compactTitle ? styles.compact : ""}`}>{dict.title}</p>
          {dict.text && <p className={styles.bannerText}>{dict.text}</p>}
        </div>
        {action ? (
          <div className={styles.action}>{action}</div>
        ) : (
        <Link href={href ?? `/${lang}/join`} className={`${styles.cta} ${outlineCta ? styles.outline : ""}`}>
          <Icon size={22} aria-hidden="true" />
          {dict.button}
          <ArrowRight size={20} aria-hidden="true" />
        </Link>
        )}
        <span className={styles.curveGold} aria-hidden="true" />
        <span className={styles.curveGreen} aria-hidden="true" />
      </div>
    </section>
  );
}
