import { ExternalLink } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";
import styles from "./ContactContent.module.css";

/**
 * Location card. TDSP's exact office coordinates are NOT verified, so this is
 * an illustrative map-style graphic with NO pin and an honest caption; the link
 * runs a map SEARCH for the documented address (it does not claim an exact point).
 */
export function MapCard({ dict }: { dict: Dictionary["contactPage"]["map"] }) {
  const href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Mbagala Kilungule, Dar es Salaam, Tanzania")}`;
  return (
    <figure className={styles.map}>
      <svg viewBox="0 0 400 300" role="img" aria-label={dict.label} className={styles.mapSvg} preserveAspectRatio="xMidYMid slice">
        <rect width="400" height="300" fill="#f1efe8" />
        <path d="M250 0h150v300H300c-30-60 10-110-20-160S230 40 250 0z" fill="#9dd3f0" />
        <path d="M0 200c60-30 90 10 140 0s70-40 120-20l-10 120H0z" fill="#e8e6dc" />
        <path d="M300 190c40-20 70-5 100 10v70h-90c20-30-30-50-10-80z" fill="#cfe5c2" />
        <g fill="none" strokeLinecap="round">
          <path d="M60 0c20 80 70 110 40 200s40 70 80 100" stroke="#f6d56b" strokeWidth="5" />
          <path d="M0 150c80 20 120 0 190 40s90 20 110 70" stroke="#f6d56b" strokeWidth="4" />
          <path d="M120 0c10 60 40 80 70 130" stroke="#fff" strokeWidth="3" />
          <path d="M0 90c60 10 110 40 160 20" stroke="#fff" strokeWidth="3" />
          <path d="M150 300c20-50 70-60 100-110" stroke="#fff" strokeWidth="3" />
        </g>
        <text x="40" y="170" fontSize="15" fontFamily="inherit" fill="#2b3a33">{dict.city}</text>
      </svg>
      <figcaption className={styles.mapCaption}>
        <strong>{dict.caption}</strong>
        <span>{dict.note}</span>
        <a href={href} target="_blank" rel="noopener noreferrer">
          {dict.open}
          <ExternalLink size={16} aria-hidden="true" />
        </a>
      </figcaption>
    </figure>
  );
}
