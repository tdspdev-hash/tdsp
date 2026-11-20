import Link from "next/link";
import { BookOpen, Calendar, ChartColumn, GraduationCap, Layers, Settings, ShieldCheck, Sprout, UsersRound, type LucideIcon } from "lucide-react";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { contactPath } from "@/lib/navigation";
import { PageHero } from "../PageHero";
import { ClosingBanner } from "../membership/ClosingBanner";
// Hero buttons and the benefits strip share Masoko's styles (reused, not copied).
import mk from "../masoko/MasokoContent.module.css";
import styles from "./ElimuContent.module.css";

const BENEFITS = [
  { key: "practical", Icon: BookOpen },
  { key: "groups", Icon: UsersRound },
  { key: "quality", Icon: Sprout },
  { key: "value", Icon: ChartColumn },
] as const;

// Topics only. No schedule, dates, venues, trainers, certificates or numbers exist.
const FIELDS: { id: "production" | "protection" | "storage" | "value" | "markets" | "leadership"; Icon: LucideIcon; image: string }[] = [
  { id: "production", Icon: Sprout, image: "/el-production.jpg" },
  { id: "protection", Icon: ShieldCheck, image: "/el-protection.jpg" },
  { id: "storage", Icon: Layers, image: "/el-storage.jpg" },
  { id: "value", Icon: Settings, image: "/el-value.jpg" },
  { id: "markets", Icon: ChartColumn, image: "/el-markets.jpg" },
  { id: "leadership", Icon: UsersRound, image: "/el-leadership.jpg" },
];

/** Shared body of /sw/elimu-na-ujuzi and /en/training. */
export function ElimuContent({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const d = dict.elimuPage;
  // No training list, calendar or registration exists yet: "view" scrolls to the
  // topics on this page, and requests/information go to the Contact page.
  const contact = contactPath(lang);

  return (
    <>
      <PageHero
        lang={lang}
        homeLabel={dict.nav.welcome}
        breadcrumbLabel={d.breadcrumbLabel}
        title={d.title}
        text={d.hero.text}
        photoLabel={d.hero.photoLabel}
        photoMobile="/el-hero-mobile.jpg"
        photoDesktop="/el-hero-desktop.jpg"
        fluidBelow1440
        photoFitMobile="cover"
        minHeightMobileRem={29}
        textMaxMobilePct={46}
        photoWidthMobilePct={78}
        photoPositionMobile="30% 8%"
        titleMobile="clamp(1.5rem, 6vw, 2.1rem)"
        titleXlRem={3.6}
        photoPositionMd="58% center"
        photoWidthMdPct={64}
        flushBottomDesktop
      >
        <div className={mk.heroActions}>
          <a href="#el-fields" className={mk.btnGold}>
            <GraduationCap size={22} aria-hidden="true" />
            {d.hero.viewTraining}
          </a>
          <Link href={contact} className={mk.btnOutline}>
            <UsersRound size={22} aria-hidden="true" />
            {d.hero.requestTraining}
          </Link>
        </div>
      </PageHero>

      <div className={`containerWide ${mk.wrap}`}>
        <ul className={mk.benefits}>
          {BENEFITS.map(({ key, Icon }) => (
            <li key={key} className={mk.benefit}>
              <Icon aria-hidden="true" strokeWidth={1.7} className={mk.benefitIcon} />
              <div>
                <h3>{d.benefits[key].title}</h3>
                <p>{d.benefits[key].text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <section id="el-fields" className={`containerWide ${styles.section}`} aria-labelledby="el-fields-title">
        <h2 id="el-fields-title" className={mk.h}>{d.fields.title}</h2>
        <ul className={styles.cards}>
          {FIELDS.map(({ id, Icon, image }) => (
            <li key={id} className={styles.card}>
              <div className={styles.photoWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={d.fields.items[id].alt} className={styles.photo} loading="lazy" />
                <span className={styles.badge} aria-hidden="true"><Icon size={22} /></span>
              </div>
              <div className={styles.body}>
                <h3>{d.fields.items[id].title}</h3>
                <p>{d.fields.items[id].text}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className={mk.note} role="note">{d.fields.note}</p>
      </section>

      <ClosingBanner lang={lang} dict={d.banner} image="/el-banner.jpg" Icon={Calendar} href={contact} variant="dark" />
    </>
  );
}
