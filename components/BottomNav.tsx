"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, House, LayoutGrid, Sprout, UserRound, type LucideIcon } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";
import { bottomNav } from "@/lib/navigation";
import styles from "./BottomNav.module.css";

const ICONS: Record<string, LucideIcon> = {
  home: House,
  services: LayoutGrid,
  opportunities: Sprout,
  news: FileText,
  account: UserRound,
};

/**
 * Fixed five-item bottom navigation for phones and small tablets
 * (hidden from 900px, where the header navigation takes over).
 */
export function BottomNav({ lang, nav }: { lang: Locale; nav: Dictionary["nav"] }) {
  const pathname = usePathname();
  const items = bottomNav(lang, nav);

  return (
    <nav aria-label={nav.bottomNav} className={styles.nav}>
      <ul className={styles.list}>
        {items.map((item) => {
          const Icon = ICONS[item.key];
          const active = item.isActive(pathname);
          return (
            <li key={item.key} className={styles.cell}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`${styles.item} ${active ? styles.active : ""}`}
              >
                <Icon
                  size={26}
                  strokeWidth={2}
                  aria-hidden="true"
                  fill={active && item.key === "home" ? "currentColor" : "none"}
                />
                <span className={styles.label}>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
