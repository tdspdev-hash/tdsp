import Link from "next/link";
import { ArrowRight, Calendar, ChartColumn, FilePenLine, Handshake, MapPin, Sprout, type LucideIcon } from "lucide-react";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { getProjects } from "@/lib/data/projects";
import { localizedSlug } from "@/lib/i18n/config";
import { contactPath } from "@/lib/navigation";
import { PageHero } from "../PageHero";
import { ClosingBanner } from "../membership/ClosingBanner";
import styles from "./ProjectsContent.module.css";

type Service = keyof ReturnType<typeof getDictionary>["projectsPage"]["services"];
const SERVICES: { key: Service; Icon: LucideIcon; cream?: boolean }[] = [
  { key: "implementation", Icon: Sprout },
  { key: "proposals", Icon: FilePenLine, cream: true },
  { key: "partnerships", Icon: Handshake },
  { key: "monitoring", Icon: ChartColumn, cream: true },
];

/** Shared body of /sw/miradi-na-andiko and /en/projects-and-proposals. */
export async function ProjectsContent({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const { projects, source } = await getProjects(lang);
  const d = dict.projectsPage;
  // Both buttons use the existing contact page (no enquiry form or other route exists).
  const contact = contactPath(lang);

  return (
    <>
      <PageHero
        lang={lang}
        homeLabel={dict.nav.welcome}
        breadcrumbLabel={d.breadcrumbLabel}
        title={d.title}
        text={d.hero.text}
        photoLabel={d.hero.photoLabel}
        photoMobile="/pm-hero-mobile.jpg"
        photoDesktop="/pm-hero-desktop.jpg"
        titleMaxEm={5.4}
        fluidBelow1440
        photoFitMobile="cover"
        minHeightMobileRem={20}
        textMaxMobilePct={42}
        titleXlRem={3.95}
        photoWidthMobilePct={78}
        photoPositionMd="0% center"
      />

      <div className={`containerWide ${styles.wrap}`}>
        <section className={styles.services} aria-labelledby="pm-services">
          <h2 id="pm-services" className={styles.h}>{d.servicesTitle}</h2>
          <ul className={styles.serviceGrid}>
            {SERVICES.map(({ key, Icon, cream }) => (
              <li key={key} className={`${styles.service} ${cream ? styles.cream : ""}`}>
                <Icon aria-hidden="true" strokeWidth={1.6} className={styles.serviceIcon} />
                <div>
                  <h3>{d.services[key].title}</h3>
                  <p>{d.services[key].text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className={`containerWide ${styles.main}`}>
        <section aria-labelledby="pm-list" className={styles.list}>
          <h2 id="pm-list" className={styles.h}>{d.list.title}</h2>
          {source === "error" ? (
            <p className={styles.empty} role="alert">{d.list.error}</p>
          ) : projects.length === 0 ? (
            <p className={styles.empty}>{d.list.empty}</p>
          ) : (
            <ul className={styles.cards} data-source={source}>
              {projects.map((p) => (
                <li key={p.slug} className={styles.card}>
                  <div className={styles.photoWrap}>
                    {p.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image} alt={p.title} className={styles.photo} loading="lazy" />
                    )}
                    <span className={styles.badge}>{d.list.status[p.status]}</span>
                  </div>
                  <div className={styles.cardBody}>
                    <h3>
                      <Link href={`/${lang}/${localizedSlug("projects", lang)}/${p.slug}`} className={styles.cardLink}>
                        {p.title}
                      </Link>
                    </h3>
                    <p>{p.summary}</p>
                    <span className={styles.more} aria-hidden="true">{d.detail.view}<ArrowRight size={16} /></span>
                  </div>
                  <dl className={styles.meta}>
                    {p.period && <div><dt className="srOnly">{d.list.period}</dt><Calendar size={16} aria-hidden="true" /><dd>{p.period}</dd></div>}
                    {p.location && <div><dt className="srOnly">{d.list.location}</dt><MapPin size={16} aria-hidden="true" /><dd>{p.location}</dd></div>}
                  </dl>
                </li>
              ))}
            </ul>
          )}
          {projects.some((p) => p.isSample) && <p className={styles.note} role="note">{d.list.mockNote}</p>}
        </section>

        <aside className={styles.proposal} aria-labelledby="pm-proposal">
          <FilePenLine aria-hidden="true" strokeWidth={1.5} className={styles.proposalIcon} />
          <div>
            <h2 id="pm-proposal">{d.proposal.title}</h2>
            <p>{d.proposal.text}</p>
            <Link href={contact} className={styles.cta}>
              {d.proposal.cta}
              <ArrowRight size={20} aria-hidden="true" />
            </Link>
          </div>
        </aside>
      </div>

      <ClosingBanner lang={lang} dict={d.banner} image="/pm-banner.jpg" Icon={Handshake} href={contact} />
    </>
  );
}
