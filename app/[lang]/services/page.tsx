import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { isLocale, localizedSlug, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import ui from "@/components/ui.module.css";
import styles from "./services.module.css";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getDictionary(lang).services.title };
}

/** Destination of each service; "other" has no page of its own. */
function target(key: string, lang: Locale): string | null {
  const base = `/${lang}`;
  const map: Record<string, string> = {
    membership: `${base}/${localizedSlug("membership", lang)}`,
    project: `${base}/${localizedSlug("projects", lang)}`,
    financial: `${base}/financial-linkage`,
    markets: `${base}/${localizedSlug("markets", lang)}`,
    training: `${base}/${localizedSlug("training", lang)}`,
    valueChain: `${base}/farmers-value-chain`,
    providers: `${base}/${localizedSlug("providers", lang)}`,
    documents: `${base}/${localizedSlug("documents", lang)}`,
  };
  return map[key] ?? null;
}

export default async function ServicesPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { services } = getDictionary(lang);
  const items = Object.entries(services.items);

  return (
    <div className="container page">
      <h1>{services.title}</h1>
      <p>{services.intro}</p>
      <ul className={styles.list}>
        {items.map(([key, item]) => (
          <li key={key} id={key} className={`${ui.card} ${styles.item}`}>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
            {target(key, lang) && (
              <Link href={target(key, lang)!} className={styles.open}>
                {services.open}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
