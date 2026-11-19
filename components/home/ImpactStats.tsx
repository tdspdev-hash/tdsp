import { Handshake, MapPin, Sprout, UsersRound, type LucideIcon } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";
import { siteConfig } from "@/lib/site-config";
import styles from "./ImpactStats.module.css";

const ITEMS: { key: keyof typeof siteConfig.stats; Icon: LucideIcon; color: string }[] = [
  { key: "farmers", Icon: UsersRound, color: "var(--color-brand)" },
  { key: "groups", Icon: Sprout, color: "var(--color-brand)" },
  { key: "partners", Icon: Handshake, color: "var(--color-gold)" },
  { key: "regions", Icon: MapPin, color: "var(--color-brand)" },
];

/**
 * Statistics strip. Figures come from siteConfig.stats and are shown only when
 * TDSP has approved them; until then each tile shows its icon and label.
 */
export function ImpactStats({ dict }: { dict: Dictionary["home"]["stats"] }) {
  return (
    <section className={`containerWide ${styles.wrap}`} aria-label={dict.label}>
      <ul className={styles.strip}>
        {ITEMS.map(({ key, Icon, color }) => {
          const value = siteConfig.stats[key];
          return (
            <li key={key} className={styles.item}>
              <Icon className={styles.icon} style={{ color }} size={40} strokeWidth={1.75} aria-hidden="true" />
              <div className={styles.text}>
                {value && <strong className={styles.value}>{value}</strong>}
                <span className={styles.labelShort}>{dict[key].short}</span>
                <span className={styles.labelLong}>{dict[key].long}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
