import Link from "next/link";
import { ArrowLeft, Calendar, CircleDot, Handshake, MapPin } from "lucide-react";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { localizedSlug, type Locale } from "@/lib/i18n/config";
import { contactPath } from "@/lib/navigation";
import type { MockProject } from "@/lib/projects-mock";
import { PageHero } from "../PageHero";
import { ClosingBanner } from "../membership/ClosingBanner";
import styles from "./ProjectDetail.module.css";

/**
 * Detail page of one project, shared by /sw/miradi-na-andiko/[id] and
 * /en/projects-and-proposals/[id]. Information only: no donations, targets or
 * funding figures (those need an approved change request). While the project
 * list is sample data, every page shows a visible "sample" note.
 */
export function ProjectDetail({ lang, project }: { lang: Locale; project: MockProject }) {
  const dict = getDictionary(lang);
  const d = dict.projectsPage;
  const item = d.list.items[project.id];
  const info = d.detail.items[project.id];
  const listHref = `/${lang}/${localizedSlug("projects", lang)}`;

  return (
    <>
      <PageHero
        lang={lang}
        homeLabel={dict.nav.welcome}
        breadcrumbLabel={d.breadcrumbLabel}
        title={item.title}
        parentCrumbs={[{ label: d.title, href: listHref }]}
        text={item.text}
        photoLabel={d.hero.photoLabel}
        photoMobile="/pm-hero-mobile.jpg"
        photoDesktop="/pm-hero-desktop.jpg"
        titleMaxEm={6}
        fluidBelow1440
        titleMdVw={3.2}
        titleXlRem={2.2}
        titleMobile="min(1.7rem, 6.4vw)"
        photoFitMobile="cover"
        minHeightMobileRem={20}
        textMaxMobilePct={42}
        photoWidthMobilePct={78}
        photoPositionMd="0% center"
      />

      <div className={`containerWide ${styles.wrap}`}>
        <article className={styles.article}>
          <p className={styles.note} role="note">{d.detail.sampleNote}</p>

          <div className={styles.photoWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.image} alt={item.alt} className={styles.photo} />
            <span className={styles.badge}>{d.list.status[project.status]}</span>
          </div>

          <dl className={styles.facts}>
            <div><dt><CircleDot size={18} aria-hidden="true" />{d.detail.facts.status}</dt><dd>{d.list.status[project.status]}</dd></div>
            <div><dt><Calendar size={18} aria-hidden="true" />{d.detail.facts.period}</dt><dd>{project.period}</dd></div>
            <div><dt><MapPin size={18} aria-hidden="true" />{d.detail.facts.location}</dt><dd>{project.location}</dd></div>
          </dl>

          <section aria-labelledby="pd-about" className={styles.section}>
            <h2 id="pd-about" className={styles.h}>{d.detail.aboutTitle}</h2>
            <p>{info.p1}</p>
            <p>{info.p2}</p>
          </section>

          <section aria-labelledby="pd-objectives" className={styles.section}>
            <h2 id="pd-objectives" className={styles.h}>{d.detail.objectivesTitle}</h2>
            <ul className={styles.list}>
              <li>{info.o1}</li>
              <li>{info.o2}</li>
              <li>{info.o3}</li>
            </ul>
          </section>

          <section aria-labelledby="pd-target" className={styles.section}>
            <h2 id="pd-target" className={styles.h}>{d.detail.targetTitle}</h2>
            <p>{info.target}</p>
          </section>

          <Link href={listHref} className={styles.back}>
            <ArrowLeft size={20} aria-hidden="true" />
            {d.detail.back}
          </Link>
        </article>
      </div>

      <ClosingBanner lang={lang} dict={d.banner} image="/pm-banner.jpg" Icon={Handshake} href={contactPath(lang)} />
    </>
  );
}
