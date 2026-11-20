import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, UserPlus } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";
import { siteConfig } from "@/lib/site-config";
import styles from "./Hero.module.css";

/**
 * Hero with the farmer photo on the right (desktop and mobile share one image
 * and one composition; only the crop changes). The photo is an interim
 * placeholder taken from the design mockup and must be replaced with
 * approved TDSP photography.
 */
export function Hero({ lang, dict }: { lang: Locale; dict: Dictionary["home"]["hero"] }) {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.media} aria-hidden="true">
        <Image
          src="/hero-farmer.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 900px) 55vw, 75vw"
          className={styles.photo}
        />
      </div>
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.shapeYellow} aria-hidden="true" />
      <div className={styles.shapeGreen} aria-hidden="true" />

      <div className={`containerWide ${styles.content}`}>
        <p className={styles.eyebrow}>
          <span className={styles.eyebrowLine} aria-hidden="true" />
          {dict.eyebrow}
        </p>
        <h1 id="hero-title" className={styles.title}>
          {dict.title}
        </h1>
        <p className={styles.text}>{dict.text}</p>
        <div className={styles.actions}>
          <Link href={`/${lang}/join`} className={styles.primary}>
            <UserPlus size={22} aria-hidden="true" />
            {dict.ctaJoin}
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
          {/* Shown only when TDSP provides a real video; no dead button. */}
          {siteConfig.videoUrl && (
            <a
              href={siteConfig.videoUrl}
              className={styles.secondary}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Play size={22} aria-hidden="true" />
              {dict.ctaVideo}
            </a>
          )}
        </div>
      </div>
      <div className={styles.curve} aria-hidden="true" />
    </section>
  );
}
