import Link from "next/link";
import { localizedSlug, type Locale } from "@/lib/i18n/config";
import { accountPath, contactPath, newsPath } from "@/lib/navigation";
import type { Dictionary } from "@/lib/i18n/dictionaries/sw";
import styles from "./SiteFooter.module.css";

export function SiteFooter({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Pick<Dictionary, "footer" | "meta" | "nav">;
}) {
  const links = [
    { href: `/${lang}/about`, label: dict.nav.about },
    { href: `/${lang}/services`, label: dict.nav.services },
    { href: `/${lang}/${localizedSlug("membership", lang)}`, label: dict.nav.membership },
    { href: `/${lang}/${localizedSlug("projects", lang)}`, label: dict.nav.projects },
    { href: `/${lang}/${localizedSlug("documents", lang)}`, label: dict.nav.documents },
    { href: newsPath(lang), label: dict.nav.newsOpportunities },
    { href: contactPath(lang), label: dict.nav.contact },
    { href: accountPath(lang), label: dict.nav.tabs.account },
  ];
  return (
    <footer className={styles.footer}>
      <div className="container">
        <p className={styles.slogan}>{dict.footer.slogan}</p>
        <nav aria-label={dict.footer.linksLabel}>
          <ul className={styles.links}>
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className={styles.small}>
          {dict.meta.orgName} &middot; &copy; {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}
