import {
  Accessibility,
  ChartColumn,
  ClipboardCheck,
  Coins,
  GraduationCap,
  Handshake,
  Megaphone,
  ShoppingCart,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";
import styles from "./Objectives.module.css";

type Key = keyof Dictionary["about"]["objectives"]["items"];

// Icons are decorative; the wording is TDSP's, verbatim, from Waraka No. 2
// section 2 "Malengo mahususi" (the objectives of the TDSP Farmers Value Chain
// platform). TDSP has not supplied an official list of organisational
// objectives; replace these when it does.
const ITEMS: { key: Key; Icon: LucideIcon }[] = [
  { key: "grants", Icon: Coins },
  { key: "youth", Icon: GraduationCap },
  { key: "women", Icon: UsersRound },
  { key: "disability", Icon: Accessibility },
  { key: "farmers", Icon: ShoppingCart },
  { key: "board", Icon: Megaphone },
  { key: "partners", Icon: Handshake },
  { key: "tracking", Icon: ClipboardCheck },
  { key: "reports", Icon: ChartColumn },
];

export function Objectives({ dict }: { dict: Dictionary["about"]["objectives"] }) {
  return (
    <section className={`containerWide ${styles.section}`} aria-labelledby="objectives-title">
      <header className={styles.header}>
        <h2 id="objectives-title" className={styles.title}>
          <span className={styles.line} aria-hidden="true" />
          {dict.title}
          <span className={styles.line} aria-hidden="true" />
        </h2>
        <p className={styles.subtitle}>{dict.subtitle}</p>
      </header>

      <ul className={styles.grid}>
        {ITEMS.map(({ key, Icon }) => (
          <li key={key} className={styles.item}>
            <Icon className={styles.icon} size={34} strokeWidth={1.75} aria-hidden="true" />
            <span className={styles.text}>{dict.items[key]}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
