"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MapPin, Phone, UserPlus } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";
import { accountPath, desktopNav } from "@/lib/navigation";
import { siteConfig } from "@/lib/site-config";
import { LanguageSwitcher } from "./LanguageSwitcher";
import ui from "./ui.module.css";
import styles from "./SiteHeader.module.css";

type Props = {
  lang: Locale;
  dict: Pick<Dictionary, "nav" | "meta">;
};

/**
 * One header, two presentations:
 *  - from 900px: dark contact strip + white header with horizontal navigation;
 *  - below 900px: compact app bar (logo, name, language switch). Navigation on
 *    small screens is the fixed bottom bar (see BottomNav), not a hamburger.
 */
export function SiteHeader({ lang, dict }: Props) {
  const pathname = usePathname();
  const { nav } = dict;
  const items = desktopNav(lang, nav);

  return (
    <>
      <div className={styles.strip}>
        <div className={`containerWide ${styles.stripInner}`}>
          <ul className={styles.contactList} aria-label={nav.contactStrip}>
            <li>
              <Phone size={16} aria-hidden="true" />
              {siteConfig.phones.map((p, i) => (
                <span key={p.tel}>
                  {i > 0 && <span className={styles.sep}>|</span>}
                  <a href={`tel:${p.tel}`}>{p.display}</a>
                </span>
              ))}
            </li>
            <li>
              <Mail size={16} aria-hidden="true" />
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </li>
            <li>
              <MapPin size={16} aria-hidden="true" />
              <span>{nav.location}</span>
            </li>
          </ul>
          <LanguageSwitcher lang={lang} label={nav.language} variant="strip" />
        </div>
      </div>

      <header className={styles.header}>
        <div className={`containerWide ${styles.bar}`}>
          <Link href={`/${lang}`} className={styles.brand}>
            <Image
              src="/tdsp-logo.png"
              alt=""
              width={56}
              height={56}
              className={styles.logo}
              priority
            />
            <span className={styles.brandText}>
              <span className={styles.brandName}>
                <span className={styles.nameMobile}>{dict.meta.siteName}</span>
                <span className={styles.nameDesktop}>{nav.orgDisplay}</span>
              </span>
              <span className={styles.tagline}>{nav.tagline}</span>
            </span>
          </Link>

          <nav aria-label={nav.mainNav} id="site-nav" className={styles.desktopNav}>
            {items.map((item) => {
              const active = item.isActive(pathname);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`${styles.navLink} ${active ? styles.navActive : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className={styles.actions}>
            <Link href={accountPath(lang)} className={styles.loginLink}>
              {nav.login}
            </Link>
            <Link href={`/${lang}/join`} className={`${ui.button} ${styles.joinButton}`}>
              <UserPlus size={20} aria-hidden="true" />
              {nav.join}
            </Link>
          </div>

          <LanguageSwitcher
            lang={lang}
            label={nav.language}
            variant="compact"
            className={styles.mobileSwitch}
          />
        </div>
      </header>
    </>
  );
}
