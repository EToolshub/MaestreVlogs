import { Clock, Globe2, Handshake, Rocket, Tv, UserCheck } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { yearGrowth, type AnalyticsData } from "@/lib/analytics";
import type { YoutubeData } from "@/lib/youtube";
import { fill, formatDuration, formatNumber } from "@/lib/utils";

const icons = [Handshake, Globe2, UserCheck, Tv, Clock, Rocket];

export function WhyBrands({
  lang,
  dict,
  analytics,
  yt,
}: {
  lang: Locale;
  dict: Dictionary;
  analytics: AnalyticsData;
  yt: YoutubeData;
}) {
  const t = dict.why;
  const { audience, year } = analytics;
  const adults = audience.ageGroups.filter((g) => g.id !== "13-17" && g.id !== "18-24").reduce((a, g) => a + g.share, 0);
  const growth = yearGrowth(yt.subscribers, year.netSubscribers);
  const vars = {
    comments: formatNumber(lang, year.comments),
    abroad: formatNumber(lang, audience.outsideVenezuelaShare, 1),
    adults: formatNumber(lang, Math.round(adults)),
    tv: formatNumber(lang, Math.round(audience.devices.find((d) => d.id === "tv")?.views ?? 0)),
    duration: formatDuration(year.avgViewDurationSeconds),
    growth: growth ? formatNumber(lang, growth.multiple, growth.digits) : "",
  };

  return (
    <section className="relative border-y border-white/[0.06] bg-alt py-24 sm:py-32">
      <Container>
        <FadeIn>
          <SectionHeading index="04" eyebrow={t.eyebrow} title={t.title} highlight={t.highlight} />
        </FadeIn>
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <li key={item.title}>
                <FadeIn delay={(i % 3) * 0.06} className="h-full">
                  <SpotlightCard className="flex h-full flex-col p-6 sm:p-8">
                    <div className="flex items-center justify-between gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-400/10 text-brand-400">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <span className="font-mono text-xs text-subtle">0{i + 1}</span>
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-heading">{item.title}</h3>
                    <p className="text-pretty mt-3 flex-1 leading-relaxed text-body">{item.text}</p>
                    <p className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-brand-400 px-3 py-1 text-xs font-bold text-ink-950">
                      {fill(item.stat, vars)}
                    </p>
                  </SpotlightCard>
                </FadeIn>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
