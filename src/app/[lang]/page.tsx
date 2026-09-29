import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { Hero } from "@/components/sections/Hero";
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

export default async function MediaKitPage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <Hero lang={lang} dict={dict} />
      <About dict={dict} />
      <Stats lang={lang} dict={dict} />
      <Audience lang={lang} dict={dict} />
      <WhyBrands lang={lang} dict={dict} />
      <Content lang={lang} dict={dict} />
      <NextChapter dict={dict} />
      <Brands dict={dict} />
      <Formats lang={lang} dict={dict} />
      <CampaignSection lang={lang} dict={dict} />
      <Process dict={dict} />
      <Faq dict={dict} />
      <Contact dict={dict} />
    </>
  );
}
