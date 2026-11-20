"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  locales,
  swapLocale,
  type Locale,
} from "@/lib/i18n/config";
import styles from "./LanguageSwitcher.module.css";

const LABEL: Record<Locale, string> = { sw: "Kiswahili", en: "English" };

/** Remember the visitor's explicit language choice. */
function saveLanguage(code: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${code}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
}

/**
 * Kiswahili | English switcher. "strip" is the white pill used on the dark
 * desktop contact strip; "compact" is the outlined pill in the mobile app bar.
 */
export function LanguageSwitcher({
  lang,
  label,
  variant,
  className = "",
}: {
  lang: Locale;
  label: string;
  variant: "strip" | "compact";
  className?: string;
}) {
  const pathname = usePathname();
  return (
    <div
      className={`${styles.group} ${variant === "strip" ? styles.strip : styles.compact} ${className}`}
      role="group"
      aria-label={label}
    >
      {locales.map((code) => (
        <Link
          key={code}
          href={swapLocale(pathname, code)}
          hrefLang={code}
          lang={code}
          aria-current={code === lang ? "true" : undefined}
          onClick={() => saveLanguage(code)}
          className={`${styles.link} ${code === lang ? styles.active : ""}`}
        >
          {LABEL[code]}
        </Link>
      ))}
    </div>
  );
}
