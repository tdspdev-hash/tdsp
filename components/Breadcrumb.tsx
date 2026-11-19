import Link from "next/link";
import { ChevronRight, House } from "lucide-react";
import styles from "./Breadcrumb.module.css";

export type Crumb = { label: string; href?: string };

/** Accessible breadcrumb; the last item is the current page. On a dark hero. */
export function Breadcrumb({ label, items }: { label: string; items: Crumb[] }) {
  return (
    <nav aria-label={label} className={styles.nav}>
      <ol className={styles.list}>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className={styles.item}>
              {i > 0 && <ChevronRight size={16} aria-hidden="true" className={styles.sep} />}
              {last || !item.href ? (
                <span aria-current={last ? "page" : undefined} className={styles.current}>
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className={styles.link}>
                  {i === 0 && <House size={18} aria-hidden="true" />}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
