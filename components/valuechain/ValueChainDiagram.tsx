import { Cog, Sprout, Store, Truck, type LucideIcon } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";
import styles from "./ValueChainDiagram.module.css";

type Key = keyof Dictionary["valueChain"]["diagram"]["stages"];
const STAGES: { key: Key; img: string; Icon: LucideIcon; pos: string }[] = [
  { key: "production", img: "/vc-production.jpg", Icon: Sprout, pos: "tl" },
  { key: "processing", img: "/vc-processing.jpg", Icon: Cog, pos: "tr" },
  { key: "markets", img: "/vc-markets.jpg", Icon: Store, pos: "bl" },
  { key: "transport", img: "/vc-transport.jpg", Icon: Truck, pos: "br" },
];

const Arrow = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 60 30" aria-hidden="true" focusable="false">
    <path d="M4 24C16 4 40 2 54 16" fill="none" stroke="#ffc000" strokeWidth="4" strokeLinecap="round" />
    <path d="M44 10l11 7-13 3" fill="none" stroke="#ffc000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Four-stage cycle built from real image elements, HTML labels and an HTML emblem. */
export function ValueChainDiagram({ dict }: { dict: Dictionary["valueChain"]["diagram"] }) {
  return (
    <figure className={styles.diagram} aria-label={dict.label}>
      {STAGES.map(({ key, img, Icon, pos }) => (
        <div key={key} className={`${styles.card} ${styles[pos]}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img} alt={dict.alts[key]} className={styles.photo} loading="lazy" />
          <span className={styles.label}>
            <Icon aria-hidden="true" className={styles.icon} />
            <span>{dict.stages[key]}</span>
          </span>
        </div>
      ))}
      <Arrow className={`${styles.arrow} ${styles.aTop}`} />
      <Arrow className={`${styles.arrow} ${styles.aRight}`} />
      <Arrow className={`${styles.arrow} ${styles.aBottom}`} />
      <Arrow className={`${styles.arrow} ${styles.aLeft}`} />
      <div className={styles.emblem}>
        <Sprout aria-hidden="true" className={styles.emblemIcon} />
        <span>{dict.center}</span>
      </div>
    </figure>
  );
}
