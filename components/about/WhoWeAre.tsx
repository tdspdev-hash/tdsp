import Image from "next/image";
import { Handshake, Layers, Leaf, UsersRound, type LucideIcon } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";
import styles from "./WhoWeAre.module.css";

const FOCUS: { key: keyof Dictionary["about"]["who"]["focus"]; Icon: LucideIcon; accent?: boolean }[] = [
  { key: "farming", Icon: Leaf },
  { key: "empowerment", Icon: UsersRound },
  { key: "markets", Icon: Layers },
  { key: "partnership", Icon: Handshake, accent: true },
];

/**
 * "TDSP ni Nani?": the white card that overlaps the hero. One column on
 * phones (photo, then text, then a 2x2 grid of focus areas); two columns on
 * desktop with the four focus areas in a row.
 * The photo is an interim placeholder from the design mockup (AI-generated,
 * not a real TDSP beneficiary) and must be replaced with approved photography.
 */
export function WhoWeAre({ dict }: { dict: Dictionary["about"]["who"] }) {
  return (
    <section className={`containerWide ${styles.wrap}`} aria-labelledby="who-title">
      <div className={styles.card}>
        <div className={styles.photo}>
          <Image
            src="/hero-farmer.jpg"
            alt={dict.photoAlt}
            fill
            sizes="(min-width: 900px) 40vw, 100vw"
            className={styles.img}
          />
          <span className={styles.photoAccent} aria-hidden="true" />
        </div>

        <div className={styles.body}>
          <p className={styles.eyebrow}>
            <span className={styles.line} aria-hidden="true" />
            {dict.eyebrow}
          </p>
          <h2 id="who-title" className={styles.title}>
            {dict.title}
          </h2>
          <p className={styles.text}>{dict.text}</p>
          <p className={styles.registration}>{dict.registration}</p>

          <ul className={styles.focus} aria-label={dict.focusLabel}>
            {FOCUS.map(({ key, Icon, accent }) => (
              <li key={key} className={styles.focusItem}>
                <Icon
                  size={36}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className={accent ? styles.iconGold : styles.icon}
                />
                <span className={styles.focusLabel}>{dict.focus[key]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
