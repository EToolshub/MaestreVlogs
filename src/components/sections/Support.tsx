import { Coffee } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SupportForm } from "./SupportForm";
import { siteConfig } from "@/data/site";

/** Apoyos de la comunidad por PayPal o Binance, con aviso por WhatsApp. */
export function Support({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.support;
  return (
    <section id="apoyo" className="no-print relative overflow-hidden border-t border-white/[0.06] bg-alt py-24 sm:py-32">
      <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-brand-400/10 blur-[150px]" />
      <Container className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <FadeIn>
          <SectionHeading index="13" eyebrow={t.eyebrow} title={t.title} highlight={t.highlight} description={t.description} />
          <div className="mt-10 flex items-start gap-4 rounded-3xl border border-brand-400/20 bg-brand-400/[0.06] p-6">
            <Coffee className="mt-0.5 h-6 w-6 shrink-0 text-brand-400" aria-hidden />
            <div>
              <p className="font-bold text-heading">{t.thanks}</p>
              <p className="mt-1 text-sm leading-relaxed text-body">{t.other}</p>
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={0.08}>
          <SupportForm
            lang={lang}
            t={t}
            creatorName={siteConfig.creatorName}
            paypalMe={siteConfig.support.paypalMe}
            binanceUid={siteConfig.support.binanceUid}
            amounts={[...siteConfig.support.amounts]}
            whatsapp={siteConfig.contact.whatsapp.phoneDigitsOnly}
          />
        </FadeIn>
      </Container>
    </section>
  );
}
