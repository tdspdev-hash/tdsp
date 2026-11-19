import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";
import { Breadcrumb } from "../Breadcrumb";
import styles from "./AboutHero.module.css";

/**
 * Page hero for "Kuhusu TDSP": breadcrumb, title and description over a green
 * crop-field photograph with the yellow/green curve accent.
 * The field photo is an interim crop from the design mockup; replace it with
 * approved TDSP photography.
 */
export function AboutHero({ lang, dict }: { lang: Locale; dict: Dictionary["about"] }) {
  return (
    <section className={styles.hero} aria-labelledby="about-title">
      <div className={styles.media} aria-hidden="true">
        <Image
          src="/about-field.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 900px) 60vw, 100vw"
          className={styles.photo}
        />
      </div>
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.yellow} aria-hidden="true" />
      <div className={styles.green} aria-hidden="true" />

      <div className={`containerWide ${styles.content}`}>
        <Breadcrumb
          label={dict.breadcrumb.label}
          items={[
            { label: dict.breadcrumb.home, href: `/${lang}` },
            { label: dict.breadcrumb.current },
          ]}
        />
        <h1 id="about-title" className={styles.title}>
          {dict.hero.title}
        </h1>
        <p className={styles.text}>{dict.hero.text}</p>
      </div>
      <div className={styles.curve} aria-hidden="true" />
    </section>
  );
}
