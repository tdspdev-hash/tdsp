import Link from "next/link";
import { ArrowRight, Bell, Briefcase, CalendarDays, Newspaper, Sprout, UsersRound, type LucideIcon } from "lucide-react";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { formatNewsDate, type NewsItem, type OpportunityItem } from "@/lib/news";
import { PageHero } from "../PageHero";
import { ClosingBanner } from "../membership/ClosingBanner";
import mk from "../masoko/MasokoContent.module.css";
import { NewsletterForm } from "./NewsletterForm";
import { SectionTabs } from "./SectionTabs";
import styles from "./NewsContent.module.css";

const BENEFITS: { key: "trusted" | "growth" | "farmers" | "stayInformed"; Icon: LucideIcon }[] = [
  { key: "trusted", Icon: Newspaper },
  { key: "growth", Icon: Sprout },
  { key: "farmers", Icon: UsersRound },
  { key: "stayInformed", Icon: Bell },
];

/** Shared body of /sw/habari-na-fursa and /en/news-and-opportunities (ONE combined page). */
export function NewsContent({ lang, news, opportunities }: { lang: Locale; news: NewsItem[]; opportunities: OpportunityItem[] }) {
  const dict = getDictionary(lang);
  const d = dict.newsPage;

  return (
    <>
      <PageHero
        lang={lang}
        homeLabel={dict.nav.welcome}
        breadcrumbLabel={d.breadcrumbLabel}
        title={d.title}
        text={d.hero.text}
        photoLabel={d.hero.imageLabel}
        photoMobile="/mw-hero.jpg"
        photoDesktop="/mw-hero.jpg"
        fluidBelow1440
        photoFitMobile="cover"
        minHeightMobileRem={22}
        textMaxMobilePct={66}
        photoWidthMobilePct={100}
        photoPositionMobile="62% 40%"
        titleMobile="clamp(1.9rem, 8.6vw, 2.6rem)"
        titleXlRem={4}
        photoWidthMdPct={100}
        photoPositionMd="50% 60%"
        flushBottomDesktop
        compactDesktop
        accentCurve
      >
        <div className={mk.heroActions}>
          <a href="#habari" className={mk.btnGold}>
            <Bell size={22} aria-hidden="true" />
            {d.hero.news}
          </a>
          <a href="#fursa" className={mk.btnOutline}>
            <Briefcase size={22} aria-hidden="true" />
            {d.hero.opportunities}
          </a>
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

      <div className="containerWide">
        <SectionTabs label={d.tabs.label} news={d.tabs.news} opportunities={d.tabs.opportunities} />
      </div>

      <div className={`containerWide ${styles.columns}`}>
        <section id="habari" aria-labelledby="habari-title" className={styles.panel}>
          <div className={styles.head}>
            <h2 id="habari-title"><Newspaper size={26} aria-hidden="true" />{d.news.title}</h2>
          </div>
          {news.length > 0 ? (
            <ul className={styles.newsList}>
              {news.map((n) => (
                <li key={n.id} className={styles.card}>
                  {n.image && <div className={styles.cardImg} style={{ backgroundImage: `url("${n.image}")` }} role="img" aria-label={n.title[lang]} />}
                  <span className={styles.badge}>{d.news.categories[n.category]}</span>
                  <h3>{n.title[lang]}</h3>
                  <p>{n.summary[lang]}</p>
                  <p className={styles.date}><CalendarDays size={16} aria-hidden="true" /> {formatNewsDate(n.publishedAt, lang)}</p>
                  {n.href && (
                    <Link href={n.href} className={styles.more}>
                      {d.news.readMore}
                      <ArrowRight size={18} aria-hidden="true" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty} role="status"><Newspaper size={32} aria-hidden="true" />{d.news.none}</p>
          )}
        </section>

        <section id="fursa" aria-labelledby="fursa-title" className={styles.panel}>
          <div className={styles.head}>
            <h2 id="fursa-title"><Briefcase size={26} aria-hidden="true" />{d.opportunities.title}</h2>
          </div>
          {opportunities.length > 0 ? (
            <ul className={styles.oppList}>
              {opportunities.map((o) => (
                <li key={o.id} className={styles.opp}>
                  <span className={styles.oppIcon}><Briefcase size={30} aria-hidden="true" /></span>
                  <div>
                    <h3>{o.title[lang]}</h3>
                    <p>{o.summary[lang]}</p>
                    {o.deadline && <p className={styles.date}><CalendarDays size={16} aria-hidden="true" /> {d.opportunities.deadline}: {formatNewsDate(o.deadline, lang)}</p>}
                  </div>
                  {o.href && (
                    <Link href={o.href} className={styles.detail}>
                      {d.opportunities.details}
                      <ArrowRight size={18} aria-hidden="true" />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty} role="status"><Briefcase size={32} aria-hidden="true" />{d.opportunities.none}</p>
          )}
        </section>
      </div>

      <ClosingBanner lang={lang} dict={d.banner} image="/mw-banner.jpg" variant="dark" compactTitle action={<NewsletterForm dict={d.banner} />} />
    </>
  );
}
