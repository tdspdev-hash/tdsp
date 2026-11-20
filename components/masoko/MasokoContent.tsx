import Link from "next/link";
import {
  ArrowRight,
  Apple,
  Bean,
  Bird,
  ChartColumn,
  Handshake,
  Leaf,
  Link2,
  Package,
  ShoppingBasket,
  Store,
  ThumbsUp,
  UsersRound,
  Vegan,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedSlug, type Locale } from "@/lib/i18n/config";
import { contactPath } from "@/lib/navigation";
import { PageHero } from "../PageHero";
import { ClosingBanner } from "../membership/ClosingBanner";
import styles from "./MasokoContent.module.css";

const BENEFITS = [
  { key: "markets", Icon: ShoppingBasket },
  { key: "partnership", Icon: Link2 },
  { key: "value", Icon: ThumbsUp },
  { key: "income", Icon: ChartColumn },
] as const;

// Produce CATEGORIES only. No listings, prices or buyers (none are verified).
const PRODUCE: { id: "maize" | "coffee" | "avocado" | "tomato" | "chicken" | "veg"; Icon: LucideIcon; image: string }[] = [
  { id: "maize", Icon: Wheat, image: "/mk-maize.jpg" },
  { id: "coffee", Icon: Bean, image: "/mk-coffee.jpg" },
  { id: "avocado", Icon: Leaf, image: "/mk-avocado.jpg" },
  { id: "tomato", Icon: Apple, image: "/mk-tomato.jpg" },
  { id: "chicken", Icon: Bird, image: "/mk-chicken.jpg" },
  { id: "veg", Icon: Vegan, image: "/mk-veg.jpg" },
];

const STEPS = [
  { key: "join", Icon: UsersRound },
  { key: "needs", Icon: Package },
  { key: "connect", Icon: Handshake },
  { key: "trade", Icon: ChartColumn },
] as const;

/** Shared body of /sw/masoko and /en/markets. */
export function MasokoContent({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const d = dict.masokoPage;
  // No market listing or produce-registration workflow exists yet, so the
  // buttons use implemented destinations only (contact, membership, sign-up).
  const contact = contactPath(lang);
  const membership = `/${lang}/${localizedSlug("membership", lang)}`;
  const join = `/${lang}/join`;

  return (
    <>
      <PageHero
        lang={lang}
        homeLabel={dict.nav.welcome}
        breadcrumbLabel={d.breadcrumbLabel}
        title={d.title}
        text={d.hero.text}
        photoLabel={d.hero.photoLabel}
        photoMobile="/mk-hero-mobile.jpg"
        photoDesktop="/mk-hero-desktop.jpg"
        fluidBelow1440
        photoFitMobile="cover"
        minHeightMobileRem={27}
        textMaxMobilePct={52}
        photoWidthMobilePct={52}
        titleMobile="clamp(1.9rem, 8vw, 2.4rem)"
        photoPositionMd="60% center"
        flushBottomDesktop
      >
        <div className={styles.heroActions}>
          <Link href={contact} className={styles.btnGold}>
            <Store size={22} aria-hidden="true" />
            {d.hero.findMarket}
          </Link>
          <Link href={membership} className={styles.btnOutline}>
            <Handshake size={22} aria-hidden="true" />
            {d.hero.registerNeeds}
          </Link>
        </div>
      </PageHero>

      <div className={`containerWide ${styles.wrap}`}>
        <ul className={styles.benefits}>
          {BENEFITS.map(({ key, Icon }) => (
            <li key={key} className={styles.benefit}>
              <Icon aria-hidden="true" strokeWidth={1.7} className={styles.benefitIcon} />
              <div>
                <h3>{d.benefits[key].title}</h3>
                <p>{d.benefits[key].text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <section className={`containerWide ${styles.section}`} aria-labelledby="mk-produce">
        <h2 id="mk-produce" className={styles.h}>{d.produce.title}</h2>
        <ul className={styles.produce}>
          {PRODUCE.map(({ id, Icon, image }) => (
            <li key={id} className={styles.tile}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt={d.produce.items[id].alt} className={styles.tileImg} loading="lazy" />
              <span className={styles.tileLabel}>
                <Icon size={20} aria-hidden="true" />
                {d.produce.items[id].label}
              </span>
            </li>
          ))}
        </ul>
        <p className={styles.note} role="note">{d.produce.note}</p>
      </section>

      <section className={`containerWide ${styles.section}`} aria-labelledby="mk-steps">
        <h2 id="mk-steps" className={styles.h}>{d.steps.title}</h2>
        <ol className={styles.steps}>
          {STEPS.map(({ key, Icon }, i) => (
            <li key={key} className={styles.step}>
              <span className={styles.stepIcon} aria-hidden="true"><Icon size={34} strokeWidth={1.8} /></span>
              <div>
                <h3>{i + 1}. {d.steps.items[key].title}</h3>
                <p>{d.steps.items[key].text}</p>
              </div>
              {i < STEPS.length - 1 && <ArrowRight className={styles.stepArrow} size={22} aria-hidden="true" />}
            </li>
          ))}
        </ol>
      </section>

      <ClosingBanner lang={lang} dict={d.banner} image="/mk-banner.jpg" Icon={Handshake} href={join} variant="dark" />
    </>
  );
}
