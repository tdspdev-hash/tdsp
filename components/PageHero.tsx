import type { CSSProperties, ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import { Breadcrumb, type Crumb } from "./Breadcrumb";
import styles from "./PageHero.module.css";

/**
 * Shared page hero: breadcrumb, large title, description on the left, a photo
 * on the right fading into the green. Photos are crops from the design
 * mockups (AI-generated people) and are placeholders for approved photography.
 */
export function PageHero({
  lang,
  homeLabel,
  breadcrumbLabel,
  title,
  crumb,
  parentCrumbs,
  text,
  photoLabel,
  photoMobile,
  photoDesktop,
  titleMaxEm,
  fluidBelow1440,
  photoFitMobile,
  minHeightMobileRem,
  photoPositionMd,
  textMaxMobilePct,
  photoWidthMobilePct,
  titleXlRem,
  titleMdVw,
  titleMobile,
  flushBottomDesktop,
  photoWidthMdPct,
  photoPositionMobile,
  compactDesktop,
  accentCurve,
  children,
}: {
  lang: Locale;
  homeLabel: string;
  breadcrumbLabel: string;
  /** A string, or markup when part of the title is highlighted (e.g. a gold word). */
  title: ReactNode;
  /** Breadcrumb label for the current page; required when `title` is markup (defaults to the title). */
  crumb?: string;
  /** Breadcrumb items between Home and the current page (e.g. a section page above a detail page). */
  parentCrumbs?: Crumb[];
  text: string;
  photoLabel: string;
  photoMobile: string;
  photoDesktop: string;
  /** Limits the title width (in em) so it wraps the way the design does. */
  titleMaxEm?: number;
  /** For long titles: scale title and description with the viewport below 1440px so they never reach the photo. */
  fluidBelow1440?: boolean;
  /** Phones: how the photo fills its box (default sizes it by height). "cover" avoids a hard edge for wide crops. */
  photoFitMobile?: "cover";
  /** Phones: taller hero so a larger subject fits. */
  minHeightMobileRem?: number;
  /** 900-1439px: horizontal focal point of the photo, e.g. "25% center". */
  photoPositionMd?: string;
  /** Phones: description width as % of the content column (keeps text off the subject). */
  textMaxMobilePct?: number;
  /** Phones: photo width as % of the hero. */
  photoWidthMobilePct?: number;
  /** 1440px and wider: use this title size (rem, smaller than the default 4.4) so long titles keep clear of the photo. */
  titleXlRem?: number;
  /** With fluidBelow1440: title size in vw between 900 and 1439px (default 4.4) for long titles. */
  titleMdVw?: number;
  /** Phones: CSS title size (e.g. "min(1.6rem, 6.2vw)") for long single words. */
  titleMobile?: string;
  /** Desktop: the page's next block does not overlap the hero, so the photo runs to the hero's bottom edge. */
  flushBottomDesktop?: boolean;
  /** 900px+: photo width as % of the hero (default 52), for wide group photos. */
  photoWidthMdPct?: number;
  /** Phones: CSS background-position of the photo (default shows its right side). */
  photoPositionMobile?: string;
  /** 900px+: a shorter hero with a smaller description, so wide group photos are scaled down and show everyone. */
  compactDesktop?: boolean;
  /** Draws the yellow/green curve along the lower right (for photos that do not already contain it). */
  accentCurve?: boolean;
  /** Optional content under the description (e.g. call-to-action buttons). */
  children?: ReactNode;
}) {
  const vars = {
    "--hero-photo-m": `url("${photoMobile}")`,
    "--hero-photo-d": `url("${photoDesktop}")`,
    ...(fluidBelow1440 ? { "--hero-title-md": "4.4vw", "--hero-text-md": "44vw", "--hero-mask-md": "10%" } : {}),
    ...(photoFitMobile ? { "--hero-size-m": "cover", "--hero-pos-m": "right 12%" } : {}),
    ...(minHeightMobileRem ? { "--hero-min-m": `${minHeightMobileRem}rem` } : {}),
    ...(textMaxMobilePct ? { "--hero-text-m": `${textMaxMobilePct}%` } : {}),
    ...(photoWidthMobilePct ? { "--hero-photo-w-m": `${photoWidthMobilePct}%` } : {}),
    ...(fluidBelow1440 && titleMdVw ? { "--hero-title-md": `${titleMdVw}vw` } : {}),
    ...(titleXlRem ? { "--hero-title-xl": `${titleXlRem}rem` } : {}),
    ...(titleMobile ? { "--hero-title-m": titleMobile } : {}),
    ...(photoWidthMdPct ? { "--hero-photo-w-md": `${photoWidthMdPct}%` } : {}),
    ...(photoPositionMobile ? { "--hero-pos-m": photoPositionMobile } : {}),
    ...(compactDesktop ? { "--hero-min-md": "18rem", "--hero-text-size-md": "1.2rem" } : {}),
    ...(flushBottomDesktop ? { "--hero-pad-b-md": "2rem", "--hero-photo-b-md": "0px" } : {}),
    ...(photoPositionMd ? { "--hero-pos-md": photoPositionMd } : {}),
    ...(titleMaxEm ? { "--hero-title-max": `${titleMaxEm}em` } : {}),
  } as CSSProperties;
  return (
    <section className={styles.hero} style={vars} aria-labelledby="page-hero-title">
      <div className={styles.photo} role="img" aria-label={photoLabel} />
      {accentCurve && (
        <>
          <span className={styles.curveGold} aria-hidden="true" />
          <span className={styles.curveGreen} aria-hidden="true" />
        </>
      )}
      <div className={`containerWide ${styles.content}`}>
        <Breadcrumb label={breadcrumbLabel} items={[{ label: homeLabel, href: `/${lang}` }, ...(parentCrumbs ?? []), { label: crumb ?? (typeof title === "string" ? title : "") }]} />
        <h1 id="page-hero-title" className={styles.title}>{title}</h1>
        <p className={styles.text}>{text}</p>
        {children}
      </div>
    </section>
  );
}
