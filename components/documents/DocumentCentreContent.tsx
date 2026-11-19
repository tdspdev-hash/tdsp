import Link from "next/link";
import { ArrowRight, BookOpen, ChartColumn, Download, FileText, Info, Layers, LayoutGrid, Mail, Search, type LucideIcon } from "lucide-react";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedSlug, type Locale } from "@/lib/i18n/config";
import { DOCUMENT_CATEGORIES, filterDocuments, formatDate, formatSize, isCategory, type DocumentCategory, type DocumentRecord } from "@/lib/documents";
import { contactPath } from "@/lib/navigation";
import { PageHero } from "../PageHero";
import { ClosingBanner } from "../membership/ClosingBanner";
import mk from "../masoko/MasokoContent.module.css";
import styles from "./DocumentCentreContent.module.css";

const BENEFITS = [
  { key: "official", Icon: Layers },
  { key: "publications", Icon: FileText },
  { key: "learning", Icon: BookOpen },
  { key: "download", Icon: Download },
] as const;

const CAT_ICON: Record<DocumentCategory, LucideIcon> = { policy: FileText, training: BookOpen, reports: ChartColumn, publications: Layers, other: Info };

/**
 * Document Centre. Search and category filters are plain links/GET forms
 * (?q=, ?cat=), so they work without JavaScript and the results are real
 * server-side filters of the published-document list. The list is empty until
 * TDSP approves public documents; the page then shows honest empty states.
 */
export function DocumentCentreContent({
  lang,
  published,
  query,
  category,
}: {
  lang: Locale;
  published: DocumentRecord[];
  query: string;
  category: string | undefined;
}) {
  const dict = getDictionary(lang);
  const d = dict.documentsPage;
  const base = `/${lang}/${localizedSlug("documents", lang)}`;
  const cat = isCategory(category) ? category : undefined;
  const results = filterDocuments(published, { query, category: cat }, lang);
  const featured = published.find((x) => x.featured) ?? null;
  const filtering = !!query.trim() || !!cat;
  const hrefFor = (c?: DocumentCategory) => {
    const p = new URLSearchParams();
    if (c) p.set("cat", c);
    if (query.trim()) p.set("q", query.trim());
    const qs = p.toString();
    return qs ? `${base}?${qs}` : base;
  };

  return (
    <>
      <PageHero
        lang={lang}
        homeLabel={dict.nav.welcome}
        breadcrumbLabel={d.breadcrumbLabel}
        title={d.title}
        text={d.hero.text}
        photoLabel={d.hero.imageLabel}
        photoMobile="/dc-hero-mobile.jpg"
        photoDesktop="/dc-hero-desktop.jpg"
        fluidBelow1440
        photoFitMobile="cover"
        minHeightMobileRem={22}
        textMaxMobilePct={62}
        photoWidthMobilePct={62}
        photoPositionMobile="right 0%"
        titleMobile="clamp(1.45rem, 6.8vw, 2.1rem)"
        titleMaxEm={9.2}
        titleMdVw={3.5}
        titleXlRem={3.4}
        photoPositionMd="100% center"
        photoWidthMdPct={56}
        flushBottomDesktop
        compactDesktop
      >
        <form action={base} method="get" role="search" aria-label={d.hero.searchLabel} className={styles.search}>
          <Search size={22} aria-hidden="true" className={styles.searchIcon} />
          <input type="search" name="q" defaultValue={query} placeholder={d.hero.placeholder} aria-label={d.hero.searchLabel} className={styles.searchInput} />
          {cat && <input type="hidden" name="cat" value={cat} />}
          <button type="submit" className={styles.searchButton}>{d.hero.searchButton}</button>
        </form>
      </PageHero>

      <div className={`containerWide ${mk.wrap}`}>
        <ul className={mk.benefits}>
          {BENEFITS.map(({ key, Icon }) => (
            <li key={key} className={mk.benefit}>
              <Icon aria-hidden="true" strokeWidth={1.7} className={mk.benefitIcon} />
              <div>
                <h3>{d.benefits[key].title}</h3>
                <p>{d.benefits[key].text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className={`containerWide ${styles.layout}`}>
        <nav aria-labelledby="dc-cats" className={styles.cats}>
          <div className={styles.catsHead}>
            <h2 id="dc-cats">{d.categories.title}</h2>
            <Link href={base} className={styles.viewAll}>
              {d.categories.viewAll}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <ul className={styles.catList}>
            <li>
              <Link href={hrefFor()} className={`${styles.cat} ${!cat ? styles.catActive : ""}`} aria-current={!cat ? "true" : undefined}>
                <LayoutGrid size={24} aria-hidden="true" />
                <span>{d.categories.all}</span>
              </Link>
            </li>
            {DOCUMENT_CATEGORIES.map((c) => {
              const Icon = CAT_ICON[c];
              return (
                <li key={c}>
                  <Link href={hrefFor(c)} className={`${styles.cat} ${cat === c ? styles.catActive : ""}`} aria-current={cat === c ? "true" : undefined}>
                    <Icon size={24} aria-hidden="true" />
                    <span>{d.categories.items[c]}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <section aria-labelledby="dc-recent" className={styles.recent}>
          <h2 id="dc-recent" className={mk.h}>{filtering ? d.recent.resultsFor : d.recent.title}</h2>
          {results.length > 0 ? (
            <ul className={styles.rows}>
              {results.map((doc) => (
                <li key={doc.id} className={styles.row}>
                  <span className={styles.pdf} aria-hidden="true">{doc.format}</span>
                  <div className={styles.rowBody}>
                    <h3>{doc.title[lang]}</h3>
                    <p>
                      {d.categories.items[doc.category]} <span aria-hidden="true">•</span> {formatSize(doc.sizeBytes)} <span aria-hidden="true">•</span> {d.recent.published}: {formatDate(doc.publishedAt, lang)}
                    </p>
                  </div>
                  <a href={`/documents/${doc.file}`} download className={styles.dl} aria-label={`${d.recent.download}: ${doc.title[lang]}`}>
                    <Download size={18} aria-hidden="true" />
                    {d.recent.download}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.empty} role="status">
              <FileText size={34} aria-hidden="true" />
              <p>{published.length === 0 ? d.recent.none : d.recent.noResults}</p>
              {published.length > 0 && filtering && <Link href={base} className={styles.clear}>{d.recent.clear}</Link>}
            </div>
          )}
        </section>

        <aside aria-label={d.featured.badge} className={styles.featured}>
          {featured ? (
            <>
              <span className={styles.badge}>{d.featured.badge}</span>
              <h3>{featured.title[lang]}</h3>
              {featured.description && <p>{featured.description[lang]}</p>}
              <p className={styles.fmeta}>{featured.format} <span aria-hidden="true">|</span> {formatSize(featured.sizeBytes)}</p>
              <a href={`/documents/${featured.file}`} download className={styles.featuredCta}>
                <Download size={20} aria-hidden="true" />
                {d.featured.download}
              </a>
            </>
          ) : (
            <>
              <span className={styles.badge}>{d.featured.badge}</span>
              <p className={styles.featuredNone}>{d.featured.none}</p>
            </>
          )}
        </aside>
      </div>

      <div className="containerWide">
        <p className={mk.note} role="note">{d.accessNote}</p>
      </div>

      <ClosingBanner lang={lang} dict={d.banner} image="/dc-banner.jpg" Icon={Mail} href={contactPath(lang)} variant="dark" />
    </>
  );
}
