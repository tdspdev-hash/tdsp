import { Clock, FileText, Handshake, Mail, MapPin, MessageCircle, Phone, UsersRound } from "lucide-react";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { siteConfig } from "@/lib/site-config";
import type { Locale } from "@/lib/i18n/config";
import { PageHero } from "../PageHero";
import { ClosingBanner } from "../membership/ClosingBanner";
import mk from "../masoko/MasokoContent.module.css";
import { MapCard } from "./MapCard";
import { MessageForm } from "./MessageForm";
import styles from "./ContactContent.module.css";

const BENEFITS = [
  { key: "questions", Icon: MessageCircle },
  { key: "partnership", Icon: Handshake },
  { key: "feedback", Icon: FileText },
  { key: "support", Icon: UsersRound },
] as const;

/** Shared body of /sw/mawasiliano and /en/contact. */
export function ContactContent({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const d = dict.contactPage;
  // Only TDSP's documented details: phones and email from siteConfig (copied from TDSP's own
  // forms and guides; TDSP to confirm), and the address "Mbagala Kilungule, Dar es Salaam".
  const call = siteConfig.phones[0];

  return (
    <>
      <PageHero
        lang={lang}
        homeLabel={dict.nav.welcome}
        breadcrumbLabel={d.breadcrumbLabel}
        title={d.title}
        text={d.hero.text}
        photoLabel={d.banner.imageAlt}
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
          <a href="#mw-form" className={mk.btnGold}>
            <Mail size={22} aria-hidden="true" />
            {d.hero.sendMessage}
          </a>
          <a href={`tel:${call.tel}`} className={mk.btnOutline}>
            <Phone size={22} aria-hidden="true" />
            {d.hero.call}
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

      <div className={`containerWide ${styles.layout}`}>
        <section aria-labelledby="mw-info" className={styles.info}>
          <h2 id="mw-info" className={mk.h}>{d.info.title}</h2>
          <p className={styles.intro}>{d.info.intro}</p>
          <div className={styles.infoGrid}>
            <ul className={styles.rows}>
              <li className={styles.infoRow}>
                <span className={styles.circle}><MapPin size={24} aria-hidden="true" /></span>
                <div><h3>{d.info.address}</h3><p>{d.info.addressValue}</p></div>
              </li>
              <li className={styles.infoRow}>
                <span className={styles.circle}><Mail size={24} aria-hidden="true" /></span>
                <div><h3>{d.info.email}</h3><p><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></p></div>
              </li>
              <li className={styles.infoRow}>
                <span className={styles.circle}><Phone size={24} aria-hidden="true" /></span>
                <div>
                  <h3>{d.info.phone}</h3>
                  {siteConfig.phones.map((p) => (
                    <p key={p.tel}><a href={`tel:${p.tel}`}>{p.display}</a></p>
                  ))}
                </div>
              </li>
              <li className={styles.infoRow}>
                <span className={styles.circle}><Clock size={24} aria-hidden="true" /></span>
                <div><h3>{d.info.hours}</h3><p className={styles.muted}>{d.info.hoursValue}</p></div>
              </li>
            </ul>
            <MapCard dict={d.map} />
          </div>
        </section>

        <section id="mw-form" aria-labelledby="mw-form-title" className={styles.card}>
          <h2 id="mw-form-title" className={styles.cardHead}>
            <Mail size={26} aria-hidden="true" />
            {d.form.title}
          </h2>
          <MessageForm dict={d.form} subjectLabelFor={d.form.subjects} />
        </section>
      </div>

      <ClosingBanner lang={lang} dict={d.banner} image="/mw-banner.jpg" Icon={Handshake} href="#mw-form" variant="dark" outlineCta />
    </>
  );
}
