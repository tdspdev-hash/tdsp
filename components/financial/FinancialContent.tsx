import Link from "next/link";
import { ArrowRight, Coins, CreditCard, HandHeart, Handshake, Info, ShieldCheck, type LucideIcon } from "lucide-react";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { contactPath } from "@/lib/navigation";
import { PageHero } from "../PageHero";
import { ClosingBanner } from "../membership/ClosingBanner";
// Same card, strip and callout styles as Miradi & Andiko: reused, not copied.
import styles from "../projects/ProjectsContent.module.css";

type Service = keyof ReturnType<typeof getDictionary>["financialPage"]["services"];
const SERVICES: { key: Service; Icon: LucideIcon; cream?: boolean }[] = [
  { key: "loans", Icon: Coins },
  { key: "insurance", Icon: ShieldCheck, cream: true },
  { key: "investment", Icon: HandHeart },
  { key: "services", Icon: CreditCard, cream: true },
];
const TOPICS = [
  { id: "loans", image: "/fl-loans.jpg" },
  { id: "investment", image: "/fl-invest.jpg" },
  { id: "insurance", image: "/fl-insurance.jpg" },
] as const;

/**
 * Financial Linkage. TDSP connects members with financial institutions and
 * does not lend, so the "opportunity" cards are general information topics
 * (no offers, rates or statuses), and only real destinations are linked.
 */
export function FinancialContent({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const d = dict.financialPage;
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
        photoMobile="/fl-hero-mobile.jpg"
        photoDesktop="/fl-hero-desktop.jpg"
        titleMaxEm={5.4}
        fluidBelow1440
        photoFitMobile="cover"
        minHeightMobileRem={20}
        textMaxMobilePct={44}
        photoWidthMobilePct={54}
        titleMobile="min(1.6rem, 6.2vw)"
        titleXlRem={3.4}
        photoPositionMd="0% center"
      />

      <div className={`containerWide ${styles.wrap}`}>
        <section className={styles.services} aria-labelledby="fl-services">
          <h2 id="fl-services" className={styles.h}>{d.servicesTitle}</h2>
          <ul className={styles.serviceGrid}>
            {SERVICES.map(({ key, Icon, cream }) => (
              <li key={key} className={`${styles.service} ${cream ? styles.cream : ""}`}>
                <Icon aria-hidden="true" strokeWidth={1.6} className={styles.serviceIcon} />
                <div>
                  <h3>{d.services[key].title}</h3>
                  <p>{d.services[key].text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className={`containerWide ${styles.main}`}>
        <section aria-labelledby="fl-list" className={styles.list}>
          <h2 id="fl-list" className={styles.h}>{d.list.title}</h2>
          <ul className={styles.cards}>
            {TOPICS.map((t) => {
              const item = d.list.items[t.id];
              return (
                <li key={t.id} className={styles.card}>
                  <div className={styles.photoWrap}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={t.image} alt={item.alt} className={styles.photo} loading="lazy" />
                    <span className={styles.badge}>{item.badge}</span>
                  </div>
                  <div className={styles.cardBody}>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                  <dl className={styles.meta}>
                    <div><Info size={16} aria-hidden="true" /><dd>{d.list.general}</dd></div>
                  </dl>
                </li>
              );
            })}
          </ul>
          <p className={styles.note} role="note">{d.list.note}</p>
        </section>

        <aside className={styles.proposal} aria-labelledby="fl-partner">
          <Handshake aria-hidden="true" strokeWidth={1.5} className={styles.proposalIcon} />
          <div>
            <h2 id="fl-partner">{d.partner.title}</h2>
            <p>{d.partner.text}</p>
            <Link href={contact} className={styles.cta}>
              {d.partner.cta}
              <ArrowRight size={20} aria-hidden="true" />
            </Link>
          </div>
        </aside>
      </div>

      <ClosingBanner lang={lang} dict={d.banner} image="/fl-banner.jpg" Icon={Coins} href={contact} />
    </>
  );
}
