"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { SignOutButton } from "../account/SignOutButton";
import styles from "./Member.module.css";

type Props = { label: string; settingsHref: string; settingsLabel: string; signOutLabel: string };

/** Settings and sign-out. Closes on navigation, Escape and a click elsewhere. */
export function AccountMenu({ label, settingsHref, settingsLabel, signOutLabel }: Props) {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  useEffect(() => {
    const close = (e: Event) => {
      const menu = ref.current;
      if (!menu?.open) return;
      if (e instanceof KeyboardEvent) {
        if (e.key !== "Escape") return;
        menu.querySelector("summary")?.focus();
      } else if (menu.contains(e.target as Node)) return;
      menu.open = false;
    };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", close);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", close);
    };
  }, []);

  return (
    <details ref={ref} className={styles.menu}>
      <summary className={styles.iconButton} aria-label={label}>
        <ChevronDown size={20} aria-hidden="true" />
      </summary>
      <div className={styles.menuPanel}>
        <Link href={settingsHref}>{settingsLabel}</Link>
        <SignOutButton label={signOutLabel} />
      </div>
    </details>
  );
}
