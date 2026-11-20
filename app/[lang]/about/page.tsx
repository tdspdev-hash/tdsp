import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutHero } from "@/components/about/AboutHero";
import { Objectives } from "@/components/about/Objectives";
import { PurposeCards } from "@/components/about/PurposeCards";
import { WhoWeAre } from "@/components/about/WhoWeAre";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getDictionary(lang).about.title };
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { about } = getDictionary(lang);

  return (
    <>
      <AboutHero lang={lang} dict={about} />
      <WhoWeAre dict={about.who} />
      <PurposeCards lang={lang} dict={about.purpose} />
      <Objectives dict={about.objectives} />
    </>
  );
}
