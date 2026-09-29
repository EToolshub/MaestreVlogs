import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getYoutubeData } from "@/lib/youtube";
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

// La página se vuelve a generar con datos frescos de YouTube como máximo
// cada 6 horas (21600 s). Debe ser un número literal.
export const revalidate = 21600;

export default async function MediaKitPage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const [dict, yt] = await Promise.all([getDictionary(lang), getYoutubeData()]);

  return (
    <>
      <Hero lang={lang} dict={dict} yt={yt} />
      <LiveChannel lang={lang} dict={dict} yt={yt} />
      <About dict={dict} />
      <Stats lang={lang} dict={dict} yt={yt} />
      <Audience lang={lang} dict={dict} />
      <WhyBrands lang={lang} dict={dict} />
      <Content lang={lang} dict={dict} yt={yt} />
      <NextChapter dict={dict} />
      <Brands dict={dict} />
      <Formats lang={lang} dict={dict} perVideoViews={yt.perVideoViews} />
      <CampaignSection lang={lang} dict={dict} perVideoViews={yt.perVideoViews} />
      <Process dict={dict} />
      <Faq dict={dict} />
      <Contact dict={dict} />
    </>
  );
}
