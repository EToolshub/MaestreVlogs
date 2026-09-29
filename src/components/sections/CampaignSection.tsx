import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CampaignBuilder } from "./CampaignBuilder";
import { ageGroups, devices, outsideVenezuelaShare } from "@/data/channel";
import { formats } from "@/data/formats";
import { siteConfig } from "@/data/site";

export function CampaignSection({
  lang,
  dict,
  perVideoViews,
}: {
  lang: Locale;
  dict: Dictionary;
  perVideoViews: { median: number; mean: number };
}) {
  const t = dict.builder;
  const adults = ageGroups.filter((g) => g.id !== "13-17" && g.id !== "18-24").reduce((a, g) => a + g.share, 0);
  const formatNames = Object.fromEntries(
    formats.map((f) => [f.id, { name: dict.formats.items[f.id].name, short: dict.formats.items[f.id].short }])
  ) as Record<(typeof formats)[number]["id"], { name: string; short: string }>;

  return (
    <section id="armar-campana" className="no-print relative py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-20 h-96 w-[60%] -translate-x-1/2 rounded-full bg-brand-400/10 blur-[160px]" />
      <Container className="relative">
        <FadeIn>
          <SectionHeading index="09" eyebrow={t.eyebrow} title={t.title} highlight={t.highlight} description={t.description} />
        </FadeIn>
        <div className="mt-14">
          <CampaignBuilder
            lang={lang}
            t={t}
            formatNames={formatNames}
            audience={{
              tv: Math.round(devices.find((d) => d.id === "tv")!.views),
              abroad: Math.round(outsideVenezuelaShare),
              adults: Math.round(adults),
            }}
            perVideoViews={perVideoViews}
            contact={{
              email: siteConfig.contact.email,
              whatsapp: siteConfig.contact.whatsapp.phoneDigitsOnly,
              creatorName: siteConfig.creatorName,
            }}
          />
        </div>
      </Container>
    </section>
  );
}
