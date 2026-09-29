import { Clock, Eye, Heart, Sparkles, TrendingUp, Users } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Container } from "@/components/ui/Container";
import { CountUp } from "@/components/ui/CountUp";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { MonthlyViewsChart, SubscribersChart } from "@/components/charts/GrowthCharts";
import { channelStats, derived } from "@/data/channel";
import { fill, formatDuration, formatNumber } from "@/lib/utils";
import type { YoutubeData } from "@/lib/youtube";

export function Stats({ lang, dict, yt }: { lang: Locale; dict: Dictionary; yt: YoutubeData }) {
  const t = dict.stats;

  const tiles = [
    {
      Icon: Eye,
      value: <CountUp to={channelStats.views} locale={lang} />,
      ...t.tiles.views,
    },
    {
      Icon: Clock,
      value: <CountUp to={derived.watchHours} locale={lang} />,
      ...t.tiles.watchHours,
    },
    {
      Icon: Sparkles,
      // m:ss no se anima para que no parpadee un formato raro.
      value: <span>{formatDuration(channelStats.avgViewDurationSeconds)}</span>,
      label: t.tiles.avgDuration.label,
      hint: t.tiles.avgDuration.hint,
    },
    {
      Icon: Heart,
      value: <CountUp to={derived.engagementRate} decimals={1} suffix="%" locale={lang} />,
      ...t.tiles.engagement,
    },
    {
      Icon: TrendingUp,
      value: <CountUp to={derived.growthMultiple} decimals={0} prefix="×" locale={lang} />,
      label: t.tiles.growth.label,
      hint: fill(t.tiles.growth.hint, {
        from: formatNumber(lang, channelStats.subscribersOneYearAgo),
        to: formatNumber(lang, channelStats.subscribers),
      }),
    },
    {
      Icon: Users,
      value: <CountUp to={channelStats.nonSubscriberViewShare} decimals={1} suffix="%" locale={lang} />,
      ...t.tiles.nonSubs,
    },
  ];

  return (
    <section id="numeros" className="relative border-t border-white/[0.06] bg-alt py-24 sm:py-32">
      <Container>
        <FadeIn>
          <SectionHeading index="02" eyebrow={t.eyebrow} title={t.title} highlight={t.highlight} description={t.description} />
        </FadeIn>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {tiles.map(({ Icon, value, label, hint }, i) => (
            <FadeIn key={label} delay={i * 0.05}>
              <SpotlightCard className="h-full p-5 sm:p-7">
                <Icon className="h-5 w-5 text-brand-400" aria-hidden />
                <dl className="mt-5 flex flex-col-reverse gap-2">
                  <dt>
                    <span className="block text-sm font-bold text-body-strong sm:text-base">{label}</span>
                    <span className="mt-1 block text-xs leading-snug text-muted sm:text-sm">{hint}</span>
                  </dt>
                  <dd className="text-[2.1rem] font-extrabold leading-none tracking-tight text-heading sm:text-5xl">
                    {value}
                  </dd>
                </dl>
              </SpotlightCard>
            </FadeIn>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <FadeIn>
            <SubscribersChart
              lang={lang}
              t={dict.charts}
              live={yt.subscribersLive ? { date: yt.fetchedAt.slice(0, 10), subscribers: yt.subscribers } : null}
            />
          </FadeIn>
          <FadeIn delay={0.08}>
            <MonthlyViewsChart lang={lang} t={dict.charts} />
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
