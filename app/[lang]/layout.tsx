import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BottomNav } from "@/components/BottomNav";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { isLocale, locales } from "@/lib/i18n/config";
import { isPreview } from "@/lib/preview";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import "../globals.css";
import styles from "./layout.module.css";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: Pick<LayoutProps, "params">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    title: {
      default: dict.meta.siteName,
      template: `%s | ${dict.meta.siteName}`,
    },
    description: dict.meta.description,
    // Preview deployments stay out of search engines (see lib/preview.ts).
    ...(isPreview ? { robots: { index: false, follow: false } } : {}),
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a7a2f",
  // Lets the fixed bottom navigation respect the iPhone safe area.
  viewportFit: "cover",
};

export default async function RootLayout({ children, params }: LayoutProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <html lang={lang}>
      <body>
        <a href="#main" className={styles.skip}>
          {dict.nav.skipToContent}
        </a>
        <SiteHeader lang={lang} dict={dict} />
        <main id="main" className={styles.main}>
          {children}
        </main>
        <SiteFooter lang={lang} dict={dict} />
        <BottomNav lang={lang} nav={dict.nav} />
      </body>
    </html>
  );
}
