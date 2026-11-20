import Link from "next/link";
import { ChevronRight, Sprout } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";
import styles from "./MembershipBanner.module.css";

/** Mobile-only membership promotion card (below the service grid). */
export function MembershipBanner({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary["home"]["banner"];
}) {
  return (
    <section className={`containerWide ${styles.section}`}>
      <Link href={`/${lang}/join`} className={styles.banner}>
        <span className={styles.thumb} aria-hidden="true">
          <Sprout size={44} strokeWidth={1.75} />
        </span>
        <span className={styles.body}>
          <strong className={styles.title}>{dict.title}</strong>
          <span className={styles.text}>{dict.text}</span>
        </span>
        <span className={styles.go} aria-hidden="true">
          <ChevronRight size={22} strokeWidth={2.5} />
        </span>
      </Link>
    </section>
  );
}
