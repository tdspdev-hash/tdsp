"use client";

import { useEffect, useState } from "react";
import { Briefcase, Newspaper } from "lucide-react";
import styles from "./NewsContent.module.css";

/**
 * Habari | Fursa switcher. Real in-page links (#habari, #fursa) that scroll to
 * the matching section; the highlighted tab follows the clicked or visible section.
 */
export function SectionTabs({ label, news, opportunities }: { label: string; news: string; opportunities: string }) {
  const [active, setActive] = useState<"habari" | "fursa">("habari");

  useEffect(() => {
    const sync = () => setActive(window.location.hash === "#fursa" ? "fursa" : "habari");
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const tab = (id: "habari" | "fursa", text: string, Icon: typeof Newspaper) => (
    <a
      href={`#${id}`}
      onClick={() => setActive(id)}
      aria-current={active === id ? "true" : undefined}
      className={`${styles.tab} ${active === id ? styles.tabActive : ""}`}
    >
      <Icon size={26} aria-hidden="true" />
      {text}
    </a>
  );

  return (
    <nav aria-label={label} className={styles.tabs}>
      {tab("habari", news, Newspaper)}
      {tab("fursa", opportunities, Briefcase)}
    </nav>
  );
}
