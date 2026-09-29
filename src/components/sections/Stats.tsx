import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatsView, type Period, type Tile } from "./StatsView";
import { changePct, yearGrowth, type AnalyticsData, type Totals } from "@/lib/analytics";
import type { YoutubeData } from "@/lib/youtube";
import { fill, formatDate, formatDuration, formatNumber } from "@/lib/utils";

/** Total de suscriptores al cierre de cada mes, reconstruido desde la cifra actual. */
function cumulativeByMonth(monthly: AnalyticsData["monthly"], current: number, dataThrough: string) {
  const points: { date: string; value: number }[] = [];
  let total = current;
  for (let i = monthly.length - 1; i >= 0; i--) {
    const [y, m] = monthly[i].month.split("-").map(Number);
    const monthEnd = new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10);
    points.unshift({ date: i === monthly.length - 1 && dataThrough < monthEnd ? dataThrough : monthEnd, value: Math.max(0, total) });
    total -= monthly[i].net;
  }
  if (monthly.length) {
    // Punto de partida: último día del mes anterior al primero mostrado.
    const [y, m] = monthly[0].month.split("-").map(Number);
    points.unshift({ date: new Date(Date.UTC(y, m - 1, 0)).toISOString().slice(0, 10), value: Math.max(0, total) });
  }
  return points;
}

export function Stats({ lang, dict, analytics, yt }: { lang: Locale; dict: Dictionary; analytics: AnalyticsData; yt: YoutubeData }) {
  const t = dict.stats;
  const c = dict.charts;
  const up = (current: number, previous: number) => {
    const pct = changePct(current, previous);
    return pct !== null && pct > 0 ? fill(t.deltaUp, { pct: formatNumber(lang, pct) }) : undefined;
  };

  const commonTiles = (x: Totals, viewsHint: string): Tile[] => [
    { icon: "eye", label: t.tiles.views.label, hint: viewsHint, value: x.views },
    { icon: "clock", label: t.tiles.watchHours.label, hint: t.tiles.watchHours.hint, value: x.watchHours },
    { icon: "sparkles", label: t.tiles.avgDuration.label, hint: t.tiles.avgDuration.hint, text: formatDuration(x.avgViewDurationSeconds) },
    { icon: "heart", label: t.tiles.engagement.label, hint: t.tiles.engagement.hint, value: x.engagementRate, decimals: 1, suffix: "%" },
  ];

  const { last28, prev28, year } = analytics;
  const tiles28 = commonTiles(last28, t.tiles.views.hint28);
  tiles28[0].delta = up(last28.views, prev28.views);
  tiles28[1].delta = up(last28.watchHours, prev28.watchHours);
  tiles28.push(
    {
      icon: "userPlus",
      label: t.tiles.netSubs.label,
      hint: fill(t.tiles.netSubs.hint, { gained: formatNumber(lang, last28.subscribersGained), lost: formatNumber(lang, last28.subscribersLost) }),
      value: last28.netSubscribers,
      prefix: last28.netSubscribers > 0 ? "+" : "",
      delta: up(last28.netSubscribers, prev28.netSubscribers),
    },
    { icon: "users", label: t.tiles.nonSubs.label, hint: t.tiles.nonSubs.hint, value: analytics.nonSubscriberShare.d28, decimals: 1, suffix: "%" }
  );

  const growth = yearGrowth(yt.subscribers, year.netSubscribers);
  const tiles12 = commonTiles(year, t.tiles.views.hint12);
  tiles12.push(
    growth
      ? {
          icon: "trend",
          label: t.tiles.growth.label,
          hint: fill(t.tiles.growth.hint, { from: formatNumber(lang, growth.yearAgo), to: formatNumber(lang, yt.subscribers) }),
          value: Math.round(growth.multiple * 10) / 10,
          decimals: growth.digits,
          prefix: "×",
        }
      : {
          icon: "userPlus",
          label: t.tiles.netSubs.label,
          hint: fill(t.tiles.netSubs.hint, { gained: formatNumber(lang, year.subscribersGained), lost: formatNumber(lang, year.subscribersLost) }),
          value: year.netSubscribers,
          prefix: year.netSubscribers > 0 ? "+" : "",
        },
    { icon: "users", label: t.tiles.nonSubs.label, hint: t.tiles.nonSubs.hint, value: analytics.nonSubscriberShare.m12, decimals: 1, suffix: "%" }
  );

  const periods: Period[] = [
    {
      id: "28d",
      label: t.period28,
      tiles: tiles28,
      subs: {
        type: "columns",
        title: c.subsDailyTitle,
        subtitle: c.subsDailySubtitle,
        data: analytics.daily28.map((d) => ({
          key: d.date,
          value: d.net,
          extra: [
            { label: c.gained, value: d.gained },
            { label: c.lost, value: d.lost },
          ],
        })),
      },
      views: {
        title: c.viewsDailyTitle,
        subtitle: c.viewsDailySubtitle,
        kind: "day",
        data: analytics.daily28.map((d) => ({ key: d.date, value: d.views })),
      },
    },
    {
      id: "12m",
      label: t.period12,
      tiles: tiles12,
      subs: {
        type: "line",
        title: c.subsTitle,
        subtitle: c.subsSubtitle,
        points: cumulativeByMonth(analytics.monthly, yt.subscribers, analytics.dataThrough),
      },
      views: {
        title: c.viewsTitle,
        subtitle: c.viewsSubtitle,
        kind: "month",
        data: analytics.monthly.map((m) => ({ key: m.month, value: m.views, extra: [{ label: c.hours, value: m.hours }] })),
      },
    },
  ];

  const source = fill(analytics.source === "analytics" ? t.sourceLive : t.sourceSaved, {
    date: formatDate(lang, analytics.dataThrough),
  });

  return (
    <section id="numeros" className="relative border-t border-white/[0.06] bg-alt py-24 sm:py-32">
      <Container>
        <FadeIn>
          <SectionHeading index="02" eyebrow={t.eyebrow} title={t.title} highlight={t.highlight} />
        </FadeIn>
        <div className="mt-12">
          <StatsView lang={lang} periods={periods} periodLabel={t.periodLabel} source={source} charts={c} />
        </div>
      </Container>
    </section>
  );
}
