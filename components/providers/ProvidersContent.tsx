import Link from "next/link";
import { ArrowRight, Award, Binoculars, ClipboardCheck, Handshake, Info, Layers, LayoutGrid, Settings, Sprout, Tractor, Truck, UsersRound, Warehouse, type LucideIcon } from "lucide-react";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { contactPath } from "@/lib/navigation";
import { PageHero } from "../PageHero";
import { ClosingBanner } from "../membership/ClosingBanner";
// Shared card, strip, step and button styles from Masoko and Elimu & Ujuzi (reused, not copied).
import mk from "../masoko/MasokoContent.module.css";
import el from "../elimu/ElimuContent.module.css";
import styles from "./ProvidersContent.module.css";

const BENEFITS = [
  { key: "essential", Icon: Sprout },
  { key: "expertise", Icon: Award },
  { key: "partnership", Icon: UsersRound },
  { key: "chain", Icon: Layers },
] as const;

type Cat = "inputs" | "machinery" | "advice" | "transport" | "storage" | "processing";
// Service CATEGORIES only. No provider names, contacts, prices, ratings or counts exist.
const CATS: { id: Cat; Icon: LucideIcon; image: string }[] = [
  { id: "inputs", Icon: Sprout, image: "/sp-inputs.jpg" },
  { id: "machinery", Icon: Tractor, image: "/sp-machinery.jpg" },
  { id: "advice", Icon: Sprout, image: "/sp-advice.jpg" },
  { id: "transport", Icon: Truck, image: "/sp-transport.jpg" },
  { id: "storage", Icon: Warehouse, image: "/sp-storage.jpg" },
  { id: "processing", Icon: Settings, image: "/sp-processing.jpg" },
];

const STEPS = [
  { key: "need", Icon: Binoculars },
  { key: "type", Icon: Layers },
  { key: "contact", Icon: Handshake },
  { key: "follow", Icon: ClipboardCheck },
] as const;

/** Shared body of /sw/watoa-huduma and /en/service-providers. */
export function ProvidersContent({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const d = dict.providersPage;
  // No provider directory, registration or enquiry workflow exists: "categories"
  // scrolls on this page and information requests go to the Contact page.
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
        photoMobile="/sp-hero-mobile.jpg"
        photoDesktop="/sp-hero-desktop.jpg"
        fluidBelow1440
        photoFitMobile="cover"
        minHeightMobileRem={27}
        textMaxMobilePct={46}
        photoWidthMobilePct={72}
        photoPositionMobile="45% 8%"
        titleMobile="clamp(1.5rem, 6.4vw, 2.2rem)"
        titleXlRem={3.4}
        photoPositionMd="12% center"
        photoWidthMdPct={70}
        flushBottomDesktop
        compactDesktop
      >
        <div className={mk.heroActions}>
          <a href="#sp-categories" className={mk.btnGold}>
            <LayoutGrid size={22} aria-hidden="true" />
            {d.hero.categories}
          </a>
          <Link href={contact} className={mk.btnOutline}>
            <Info size={22} aria-hidden="true" />
            {d.hero.info}
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

      <section id="sp-categories" className={`containerWide ${el.section}`} aria-labelledby="sp-categories-title">
        <h2 id="sp-categories-title" className={mk.h}>{d.categories.title}</h2>
        <ul className={el.cards}>
          {CATS.map(({ id, Icon, image }) => (
            <li key={id} className={el.card}>
              <div className={el.photoWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={d.categories.items[id].alt} className={el.photo} loading="lazy" />
                <span className={el.badge} aria-hidden="true"><Icon size={22} /></span>
              </div>
              <div className={el.body}>
                <h3>{d.categories.items[id].title}</h3>
                <p>{d.categories.items[id].text}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className={styles.notice} role="note">
          <Info size={22} aria-hidden="true" />
          <span><strong>{d.noticeLabel}</strong> {d.notice}</span>
        </p>
      </section>

      <section className={`containerWide ${mk.section}`} aria-labelledby="sp-steps">
        <h2 id="sp-steps" className={mk.h}>{d.steps.title}</h2>
        <ol className={`${mk.steps} ${styles.steps}`}>
          {STEPS.map(({ key, Icon }, i) => (
            <li key={key} className={mk.step}>
              <span className={mk.stepIcon} aria-hidden="true"><Icon size={34} strokeWidth={1.8} /></span>
              <div>
                <h3>{i + 1}. {d.steps.items[key].title}</h3>
                <p>{d.steps.items[key].text}</p>
              </div>
              {i < STEPS.length - 1 && <ArrowRight className={mk.stepArrow} size={22} aria-hidden="true" />}
            </li>
          ))}
        </ol>
      </section>

      <ClosingBanner lang={lang} dict={d.banner} image="/sp-banner.jpg" Icon={Info} href={contact} variant="dark" compactTitle />
    </>
  );
}
