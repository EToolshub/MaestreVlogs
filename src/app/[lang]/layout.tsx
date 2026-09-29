import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Anton, JetBrains_Mono, Manrope } from "next/font/google";
import "../globals.css";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { siteConfig } from "@/data/site";

const anton = Anton({ variable: "--font-anton", subsets: ["latin"], weight: "400" });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400", "500", "600"] });

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = await getDictionary(lang);

  return {
    metadataBase: new URL(siteConfig.url),
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: { es: "/es", en: "/en", "x-default": "/es" },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `/${lang}`,
      siteName: siteConfig.name,
      locale: lang === "es" ? "es_VE" : "en_US",
      type: "profile",
    },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0d0d0c",
  viewportFit: "cover",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.creatorName,
    alternateName: siteConfig.name,
    url: `${siteConfig.url}/${lang}`,
    image: siteConfig.avatarUrl,
    email: `mailto:${siteConfig.contact.email}`,
    sameAs: [siteConfig.social.youtube, siteConfig.social.instagram, siteConfig.social.tiktok],
  };

  return (
    <html lang={lang} className={`${anton.variable} ${manrope.variable} ${jetbrains.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col overflow-x-clip bg-surface text-heading">
        <a
          href="#contenido-principal"
          className="sr-only z-[90] rounded-full bg-brand-400 px-4 py-2 font-semibold text-ink-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          {dict.nav.skip}
        </a>
        <script
          type="application/ld+json"
          // JSON generado en el servidor a partir de datos propios.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema).replace(/</g, "\\u003c") }}
        />
        <MotionProvider>
          <ScrollProgress />
          <Header lang={lang} nav={dict.nav} />
          <main id="contenido-principal" className="flex-1">
            {children}
          </main>
          <Footer lang={lang} dict={dict} />
        </MotionProvider>
      </body>
    </html>
  );
}
