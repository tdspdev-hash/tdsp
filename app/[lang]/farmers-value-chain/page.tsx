import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Handshake } from "lucide-react";
import { ClosingBanner } from "@/components/membership/ClosingBanner";
import { ValueChainBody } from "@/components/valuechain/ValueChainBody";
import { PageHero } from "@/components/PageHero";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getDictionary(lang).valueChain.title };
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  return (
    <>
      <PageHero
        lang={lang}
        homeLabel={dict.nav.welcome}
        breadcrumbLabel={dict.valueChain.breadcrumbLabel}
        title={dict.valueChain.title}
        text={dict.valueChain.hero.text}
        photoLabel={dict.valueChain.hero.photoLabel}
        photoMobile="/vc-hero-mobile.jpg"
        photoDesktop="/vc-hero-desktop.jpg"
        titleMaxEm={6.4}
        fluidBelow1440
      />
      <ValueChainBody lang={lang} dict={dict.valueChain} />
      <ClosingBanner lang={lang} dict={dict.valueChain.banner} image="/vc-banner.jpg" Icon={Handshake} />
    </>
  );
}
