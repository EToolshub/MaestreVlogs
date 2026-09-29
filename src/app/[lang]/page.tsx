import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getYoutubeData } from "@/lib/youtube";
import { getAnalytics } from "@/lib/analytics";
import { Hero } from "@/components/sections/Hero";
import { LiveChannel } from "@/components/sections/LiveChannel";
import { About } from "@/components/sections/About";
import { Stats } from "@/components/sections/Stats";
import { Audience } from "@/components/sections/Audience";
import { WhyBrands } from "@/components/sections/WhyBrands";
import { Content } from "@/components/sections/Content";
import { NextChapter } from "@/components/sections/NextChapter";
import { Brands } from "@/components/sections/Brands";
import { Formats } from "@/components/sections/Formats";
import { CampaignSection } from "@/components/sections/CampaignSection";
import { Process } from "@/components/sections/Process";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { Support } from "@/components/sections/Support";

// La página se vuelve a generar con datos frescos de YouTube como máximo cada
// 5 minutos (debe ser un número literal). Suscriptores, vistas y último video
// además se actualizan en el navegador cada minuto (/api/youtube/live).
export const revalidate = 300;

export default async function MediaKitPage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [dict, yt, analytics] = await Promise.all([getDictionary(lang), getYoutubeData(), getAnalytics()]);

  return (
    <>
      <Hero lang={lang} dict={dict} yt={yt} analytics={analytics} />
      <LiveChannel lang={lang} dict={dict} yt={yt} />
      <About dict={dict} />
      <Stats lang={lang} dict={dict} yt={yt} analytics={analytics} />
      <Audience lang={lang} dict={dict} analytics={analytics} />
      <WhyBrands lang={lang} dict={dict} analytics={analytics} yt={yt} />
      <Content lang={lang} dict={dict} yt={yt} />
      <NextChapter dict={dict} />
      <Brands dict={dict} />
      <Formats lang={lang} dict={dict} perVideoViews={yt.perVideoViews} />
      <CampaignSection lang={lang} dict={dict} perVideoViews={yt.perVideoViews} analytics={analytics} />
      <Process dict={dict} />
      <Faq dict={dict} />
      <Contact dict={dict} />
      <Support lang={lang} dict={dict} />
    </>
  );
}
