import Link from "next/link";
import { ArrowRight, FileText, Laptop, LogIn, Lock, Sprout, UserPlus, UserRound, UsersRound, type LucideIcon } from "lucide-react";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { PageHero } from "../PageHero";
import { SignOutButton } from "./SignOutButton";
import mk from "../masoko/MasokoContent.module.css";
import styles from "./AccountContent.module.css";

const BENEFITS: { key: "services" | "opportunities" | "information" | "collaboration"; Icon: LucideIcon }[] = [
  { key: "services", Icon: Laptop },
  { key: "opportunities", Icon: Sprout },
  { key: "information", Icon: FileText },
  { key: "collaboration", Icon: UsersRound },
];

/**
 * Akaunti: the account landing page. It only points to the three account
 * screens (login, join, password reset); it performs no authentication itself.
 * When a visitor is signed in (decided on the server) it also shows who they are and a
 * sign-out button. Being signed in is NOT membership.
 */
export function AccountContent({ lang, signedInEmail }: { lang: Locale; signedInEmail?: string | null }) {
  const dict = getDictionary(lang);
  const d = dict.accountPage;
  const base = `/${lang}`;
  const cards = [
    { key: "login", href: `${base}/login`, Icon: UserRound, Cta: ArrowRight, tone: styles.toneGreen, btn: styles.btnGreen },
    { key: "join", href: `${base}/join`, Icon: UserPlus, Cta: ArrowRight, tone: styles.toneGold, btn: styles.btnGold },
    { key: "forgot", href: `${base}/forgot-password`, Icon: Lock, Cta: ArrowRight, tone: styles.toneGreen, btn: styles.btnOutline },
  ] as const;

  return (
    <>
      <PageHero
        lang={lang}
        homeLabel={dict.nav.welcome}
        breadcrumbLabel={d.breadcrumbLabel}
        crumb={d.crumb}
        title={<>{d.title} <span className={styles.accent}>{d.titleAccent}</span></>}
        text={d.hero.text}
        photoLabel={d.hero.imageLabel}
        photoMobile="/ac-hero-mobile.jpg"
        photoDesktop="/ac-hero-desktop.jpg"
        fluidBelow1440
        photoFitMobile="cover"
        minHeightMobileRem={30}
        textMaxMobilePct={54}
        photoWidthMobilePct={60}
        titleMaxEm={6.4}
        titleMobile="clamp(1.9rem, 8vw, 2.4rem)"
        titleMdVw={3.8}
        titleXlRem={4}
        photoWidthMdPct={56}
        photoPositionMd="100% center"
        flushBottomDesktop
        compactDesktop
      >
        <div className={mk.heroActions}>
          <Link href={`${base}/login`} className={mk.btnGold}>
            <LogIn size={22} aria-hidden="true" />
            {d.hero.login}
          </Link>
          <Link href={`${base}/join`} className={mk.btnOutline}>
            <UserPlus size={22} aria-hidden="true" />
            {d.hero.join}
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

      {signedInEmail && (
        <div className={`containerWide ${styles.session}`} role="status">
          <p>
            {d.signedInAs} <strong>{signedInEmail}</strong>
          </p>
          <SignOutButton label={d.signOut} />
        </div>
      )}

      <section className={`containerWide ${styles.choose}`} aria-labelledby="ac-choose">
        <h2 id="ac-choose" className={styles.chooseTitle}>{d.choose}</h2>
        <ul className={styles.cards}>
          {cards.map(({ key, href, Icon, Cta, tone, btn }) => (
            <li key={key} className={`${styles.card} ${tone}`}>
              <span className={styles.circle}><Icon size={34} aria-hidden="true" strokeWidth={1.6} /></span>
              <div className={styles.cardText}>
                <h3>{d.cards[key].title}</h3>
                <p>{d.cards[key].text}</p>
              </div>
              <Link href={href} className={`${styles.btn} ${btn}`}>
                {d.cards[key].button}
                <Cta size={20} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
