"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";
import { MEMBER_SECTIONS, memberPath } from "./sections";
import styles from "./Member.module.css";

/** One navigation for all member pages: a sidebar on desktop, a scrolling row on phones. */
export function MemberNav({ lang, dict }: { lang: Locale; dict: Pick<Dictionary["portal"], "navLabel" | "nav"> }) {
  const pathname = usePathname();
  return (
    <nav className={styles.nav} aria-label={dict.navLabel}>
      <ul>
        {MEMBER_SECTIONS.map(({ key, slug, Icon }) => {
          const href = memberPath(lang, slug);
          return (
            <li key={key}>
              <Link href={href} aria-current={pathname === href ? "page" : undefined}>
                <Icon size={20} aria-hidden="true" />
                {dict.nav[key]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
