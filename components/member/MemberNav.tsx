"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";
import { MEMBER_SECTIONS, memberPath } from "./sections";
import styles from "./Member.module.css";

/**
 * One navigation for all member pages, with nothing clipped or scrolled sideways:
 * phones get a menu button showing the current page, tablets a grid, desktop a sidebar.
 */
export function MemberNav({ lang, dict }: { lang: Locale; dict: Pick<Dictionary["portal"], "navLabel" | "nav"> }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const current = MEMBER_SECTIONS.find((s) => pathname === memberPath(lang, s.slug)) ?? MEMBER_SECTIONS[0];

  return (
    <nav
      className={styles.nav}
      aria-label={dict.navLabel}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <button type="button" className={styles.toggle} aria-expanded={open} aria-controls="member-menu" onClick={() => setOpen((v) => !v)}>
        <current.Icon size={20} aria-hidden="true" />
        <span>{dict.nav[current.key]}</span>
        <small>{dict.navLabel}</small>
        <ChevronDown size={20} aria-hidden="true" />
      </button>
      <ul id="member-menu" data-open={open}>
        {MEMBER_SECTIONS.map(({ key, slug, Icon }) => {
          const href = memberPath(lang, slug);
          return (
            <li key={key}>
              <Link href={href} aria-current={pathname === href ? "page" : undefined} onClick={() => setOpen(false)}>
                <Icon size={20} aria-hidden="true" />
                <span>{dict.nav[key]}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
