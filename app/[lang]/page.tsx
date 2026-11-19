import { notFound } from "next/navigation";
import { Hero } from "@/components/home/Hero";
import { ImpactStats } from "@/components/home/ImpactStats";
import { MembershipBanner } from "@/components/home/MembershipBanner";
import { ServiceCards } from "@/components/home/ServiceCards";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import styles from "./home.module.css";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { home } = getDictionary(lang);

  const steps = [
    { key: "register", ...home.steps.register },
    { key: "pay", ...home.steps.pay },
    { key: "receipt", ...home.steps.receipt },
    { key: "approval", ...home.steps.approval },
  ];

  return (
    <>
      <Hero lang={lang} dict={home.hero} />
      <ImpactStats dict={home.stats} />
      <ServiceCards lang={lang} dict={home.services} />
      <MembershipBanner lang={lang} dict={home.banner} />

      <section className="containerWide" aria-labelledby="steps-title">
        <h2 id="steps-title">{home.stepsTitle}</h2>
        <ol className={styles.steps}>
          {steps.map((step, i) => (
            <li key={step.key} className={styles.step}>
              <span className={styles.stepNumber} aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
