import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedSlug, type Locale } from "@/lib/i18n/config";
import styles from "./ProjectDetail.module.css";

/** Shown when Supabase is configured but the project could not be read. Never shows sample data. */
export function ProjectUnavailable({ lang }: { lang: Locale }) {
  const d = getDictionary(lang).projectsPage;
  return (
    <div className={`containerWide ${styles.wrap}`}>
      <article className={styles.article}>
        <p className={styles.note} role="alert">{d.list.error}</p>
        <Link href={`/${lang}/${localizedSlug("projects", lang)}`} className={styles.back}>
          <ArrowLeft size={20} aria-hidden="true" />
          {d.detail.back}
        </Link>
      </article>
    </div>
  );
}
