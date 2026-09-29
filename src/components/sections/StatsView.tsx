"use client";

import { useState } from "react";
import { Clock, Eye, Heart, Sparkles, TrendingUp, UserPlus, Users } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { CountUp } from "@/components/ui/CountUp";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ColumnChart, LineChart, type ColumnDatum } from "@/components/charts/Charts";
import { cn } from "@/lib/utils";

const icons = { eye: Eye, clock: Clock, sparkles: Sparkles, heart: Heart, userPlus: UserPlus, trend: TrendingUp, users: Users };

export type Tile = {
  icon: keyof typeof icons;
  label: string;
  hint: string;
  value?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Texto fijo en lugar de número animado (p. ej. "4:17"). */
  text?: string;
  /** Solo se envía cuando la variación es positiva. */
  delta?: string;
};

export type Period = {
  id: "28d" | "12m";
  label: string;
  tiles: Tile[];
  subs:
    | { type: "columns"; title: string; subtitle: string; data: ColumnDatum[] }
    | { type: "line"; title: string; subtitle: string; points: { date: string; value: number }[] };
  views: { title: string; subtitle: string; data: ColumnDatum[]; kind: "day" | "month" };
};

export function StatsView({
  lang,
  periods,
  periodLabel,
  source,
  charts,
}: {
  lang: Locale;
  periods: Period[];
  periodLabel: string;
  source: string;
  charts: Dictionary["charts"];
}) {
  const [active, setActive] = useState<Period["id"]>(periods[0].id);
  const period = periods.find((p) => p.id === active) ?? periods[0];

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" aria-label={periodLabel} className="no-print inline-flex w-fit rounded-full border border-ink-600 bg-ink-900 p-1">
          {periods.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={p.id === active}
              onClick={() => setActive(p.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-bold transition-colors",
                p.id === active ? "bg-brand-400 text-ink-950" : "text-body hover:text-heading"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted">{source}</p>
      </div>

      <div key={period.id} className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {period.tiles.map((tile) => {
          const Icon = icons[tile.icon];
          return (
            <SpotlightCard key={tile.label} className="h-full p-5 sm:p-7">
              <div className="flex items-start justify-between gap-2">
                <Icon className="h-5 w-5 text-brand-400" aria-hidden />
                {tile.delta && (
                  <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[11px] font-bold text-emerald-300">{tile.delta}</span>
                )}
              </div>
              <dl className="mt-5 flex flex-col-reverse gap-2">
                <dt>
                  <span className="block text-sm font-bold text-body-strong sm:text-base">{tile.label}</span>
                  <span className="mt-1 block text-xs leading-snug text-muted sm:text-sm">{tile.hint}</span>
                </dt>
                <dd className="text-[2.1rem] font-extrabold leading-none tracking-tight text-heading sm:text-5xl">
                  {tile.text ?? (
                    <CountUp
                      to={tile.value ?? 0}
                      decimals={tile.decimals ?? 0}
                      prefix={tile.prefix}
                      suffix={tile.suffix}
                      locale={lang}
                    />
                  )}
                </dd>
              </dl>
            </SpotlightCard>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {period.subs.type === "columns" ? (
          <ColumnChart
            key={`${period.id}-subs`}
            lang={lang}
            t={charts}
            title={period.subs.title}
            subtitle={period.subs.subtitle}
            data={period.subs.data}
            kind="day"
            valueLabel={charts.net}
            peakLabel={charts.best}
            signed
          />
        ) : (
          <LineChart
            key={`${period.id}-subs`}
            lang={lang}
            t={charts}
            title={period.subs.title}
            subtitle={period.subs.subtitle}
            points={period.subs.points}
            valueLabel={charts.subscribers}
          />
        )}
        <ColumnChart
          key={`${period.id}-views`}
          lang={lang}
          t={charts}
          title={period.views.title}
          subtitle={period.views.subtitle}
          data={period.views.data}
          kind={period.views.kind}
          valueLabel={charts.views}
          peakLabel={period.views.kind === "day" ? charts.best : charts.peak}
        />
      </div>
    </div>
  );
}
