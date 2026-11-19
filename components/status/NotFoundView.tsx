import Link from "next/link";
import {
  ArrowRight,
  Compass,
  House,
  LayoutGrid,
  Mail,
  Newspaper,
  Search,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { contactPath, newsPath } from "@/lib/navigation";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";
import { Illustration404, Wave } from "./Illustrations";
import styles from "./Status.module.css";

/**
 * The site's 404. Desktop: photo backdrop, white card, "you can also try"
 * four links. Phones: plain white app screen, three tip rows and a wave.
 * Every row that looks tappable is a real link; the first phone tip is advice
 * only and is shown without an arrow.
 */
export function NotFoundView({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary["status"]["notFound"];
}) {
  const base = `/${lang}`;
  const links: { href: string; label: string; Icon: LucideIcon }[] = [
    { href: `${base}/services`, label: dict.links.services, Icon: LayoutGrid },
    { href: `${newsPath(lang)}#fursa`, label: dict.links.opportunities, Icon: Sprout },
    { href: newsPath(lang), label: dict.links.news, Icon: Newspaper },
    { href: contactPath(lang), label: dict.links.contact, Icon: Mail },
  ];

  return (
    <div className={`${styles.stage} ${styles.stage404}`}>
      <div className={`${styles.photo} ${styles.photoDesktopOnly}`} aria-hidden="true">
        <span className={styles.swooshL} />
        <span className={styles.swooshR} />
      </div>

      <section className={`${styles.card} ${styles.nfCard}`} aria-labelledby="status-title">
        <div className={styles.nfArt} role="img" aria-label={dict.illustrationLabel}>
          <Illustration404 className={styles.nfSvg} />
        </div>
        <h1 id="status-title" className={styles.nfTitle}>
          {dict.title}
        </h1>
        <p className={styles.nfText}>{dict.text}</p>
        <Link href={`/${lang}`} className={styles.cta}>
          <House size={22} aria-hidden="true" />
          {dict.button}
          <ArrowRight size={20} aria-hidden="true" />
        </Link>

        {/* desktop: four ways onward */}
        <div className={styles.tryDesktop}>
          <p className={styles.tryLabel}>{dict.tryLabel}</p>
          <ul className={styles.tryRow}>
            {links.map(({ href, label, Icon }) => (
              <li key={href}>
                <Link href={href} className={styles.tryItem}>
                  <Icon size={34} strokeWidth={1.75} aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* phones: three tip rows */}
        <ul className={styles.tips}>
          <li className={styles.tip}>
            <Search size={28} strokeWidth={1.9} aria-hidden="true" />
            <span>{dict.tips.check}</span>
          </li>
          <li>
            <Link href={`${base}/services`} className={styles.tip}>
              <Compass size={28} strokeWidth={1.9} aria-hidden="true" />
              <span>{dict.tips.browse}</span>
              <ArrowRight size={20} aria-hidden="true" className={styles.tipArrow} />
            </Link>
          </li>
          <li>
            <Link href={contactPath(lang)} className={styles.tip}>
              <Mail size={28} strokeWidth={1.9} aria-hidden="true" />
              <span>{dict.tips.help}</span>
              <ArrowRight size={20} aria-hidden="true" className={styles.tipArrow} />
            </Link>
          </li>
        </ul>
      </section>

      <Wave className={styles.pageWave} />
    </div>
  );
}
