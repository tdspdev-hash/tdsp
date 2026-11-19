import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { ClosingBanner } from "./ClosingBanner";
import { PageHero } from "../PageHero";
import { MembershipPanel } from "./MembershipPanel";

/** Shared body of /sw/uanachama and /en/membership. */
export function MembershipContent({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  return (
    <>
      <PageHero
        lang={lang}
        homeLabel={dict.nav.welcome}
        breadcrumbLabel={dict.membership.breadcrumbLabel}
        title={dict.membership.hero.title}
        text={dict.membership.hero.text}
        photoLabel={dict.membership.hero.photoLabel}
        photoMobile="/membership-hero-mobile.jpg"
        photoDesktop="/membership-hero-desktop.jpg"
      />
      <MembershipPanel lang={lang} dict={dict.membership} />
      <ClosingBanner lang={lang} dict={dict.membership.banner} />
    </>
  );
}
