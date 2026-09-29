"use client";

import { useState, type KeyboardEvent, type PointerEvent } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { monthlyViews, subscriberHistory } from "@/data/channel";
import { formatCompact, formatDate, formatMonth, formatNumber } from "@/lib/utils";
import { ChartFrame, ChartTooltip, DataTable, useElementWidth } from "./ChartFrame";

const HEIGHT = 260;
const M = { top: 20, right: 20, bottom: 30, left: 48 };

/** Flechas ← → mueven el punto activo (mismo detalle que al pasar el cursor). */
function useKeyboardIndex(length: number) {
  const [active, setActive] = useState<number | null>(null);
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    setActive((i) => {
      const current = i ?? (e.key === "ArrowRight" ? -1 : length);
      return Math.min(length - 1, Math.max(0, current + (e.key === "ArrowRight" ? 1 : -1)));
    });
  };
  return { active, setActive, onKeyDown };
}

export function SubscribersChart({
  lang,
  t,
  live,
}: {
  lang: Locale;
  t: Dictionary["charts"];
  /** Cifra actual de YouTube: se añade como último punto si es más reciente. */
  live?: { date: string; subscribers: number } | null;
}) {
  const lastSaved = subscriberHistory[subscriberHistory.length - 1];
  const history = live && live.date > lastSaved.date ? [...subscriberHistory, live] : subscriberHistory;
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const { active, setActive, onKeyDown } = useKeyboardIndex(history.length);

  const times = history.map((d) => Date.parse(d.date));
  const t0 = times[0];
  const t1 = times[times.length - 1];
  const maxValue = Math.max(...history.map((d) => d.subscribers));
  const lastValue = history[history.length - 1].subscribers;
  const yMax = maxValue * 1.12;
  const plotW = width - M.left - M.right;
  const plotH = HEIGHT - M.top - M.bottom;

  const x = (time: number) => M.left + ((time - t0) / (t1 - t0)) * plotW;
  const y = (value: number) => M.top + plotH - (value / yMax) * plotH;

  const points = history.map((d, i) => [x(times[i]), y(d.subscribers)] as const);
  const line = points.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)},${py.toFixed(1)}`).join("");
  const area = `${line}L${points[points.length - 1][0]},${M.top + plotH}L${points[0][0]},${M.top + plotH}Z`;
  const step = yMax <= 4500 ? 1000 : yMax <= 9000 ? 2000 : yMax <= 22000 ? 5000 : 10000;
  const yTicks = Array.from({ length: Math.floor(yMax / step) + 1 }, (_, i) => i * step).filter((v) => v < yMax);
  const lastIndex = history.length - 1;
  const xTickIndexes = width < 420 ? [0, 7, lastIndex] : [0, 3, 7, lastIndex];

  function handleMove(e: PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    let nearest = 0;
    points.forEach(([pointX], i) => {
      if (Math.abs(pointX - px) < Math.abs(points[nearest][0] - px)) nearest = i;
    });
    setActive(nearest);
  }

  const last = points[points.length - 1];
  const activePoint = active !== null ? points[active] : null;

  return (
    <ChartFrame
      title={t.subsTitle}
      subtitle={t.subsSubtitle}
      showTableLabel={t.showTable}
      hideTableLabel={t.hideTable}
      table={
        <DataTable
          head={[t.date, t.subscribers]}
          rows={history.map((d) => [formatDate(lang, d.date), formatNumber(lang, d.subscribers)])}
        />
      }
    >
      <div ref={ref} className="relative">
        <svg
          width={width}
          height={HEIGHT}
          viewBox={`0 0 ${width} ${HEIGHT}`}
          style={{ maxWidth: "100%", height: "auto" }}
          role="img"
          aria-label={`${t.subsTitle}: ${formatNumber(lang, history[0].subscribers)} → ${formatNumber(lang, lastValue)}`}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerMove={handleMove}
          onPointerLeave={() => setActive(null)}
          onBlur={() => setActive(null)}
          className="block touch-pan-y overflow-visible rounded-lg focus-visible:outline-offset-4"
        >
          <defs>
            <linearGradient id="subs-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-accent)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--chart-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {yTicks.map((v) => (
            <g key={v}>
              <line x1={M.left} x2={width - M.right} y1={y(v)} y2={y(v)} stroke="var(--chart-grid)" strokeWidth={1} />
              <text x={M.left - 10} y={y(v)} dy="0.32em" textAnchor="end" className="fill-[var(--text-subtle)] text-[11px] tabular-nums">
                {formatNumber(lang, v)}
              </text>
            </g>
          ))}

          {xTickIndexes.map((i) => (
            <text
              key={i}
              x={points[i][0]}
              y={HEIGHT - 8}
              textAnchor={i === 0 ? "start" : i === history.length - 1 ? "end" : "middle"}
              className="fill-[var(--text-subtle)] text-[11px]"
            >
              {formatMonth(lang, history[i].date.slice(0, 7))}
            </text>
          ))}

          <path d={area} fill="url(#subs-fill)" />
          <path d={line} fill="none" stroke="var(--chart-accent)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

          {/* Punto final con etiqueta directa */}
          <circle cx={last[0]} cy={last[1]} r={5} fill="var(--chart-accent)" stroke="var(--chart-surface)" strokeWidth={2} />
          <text x={last[0] - 10} y={last[1] - 14} textAnchor="end" className="fill-[var(--text-heading)] text-sm font-bold">
            {formatNumber(lang, lastValue)}
          </text>

          {activePoint && (
            <g aria-hidden>
              <line
                x1={activePoint[0]}
                x2={activePoint[0]}
                y1={M.top}
                y2={M.top + plotH}
                stroke="var(--text-subtle)"
                strokeWidth={1}
              />
              <circle cx={activePoint[0]} cy={activePoint[1]} r={5} fill="var(--chart-accent)" stroke="var(--chart-surface)" strokeWidth={2} />
            </g>
          )}
        </svg>

        {active !== null && activePoint && (
          <ChartTooltip
            x={activePoint[0]}
            y={activePoint[1]}
            width={width}
            title={formatDate(lang, history[active].date)}
            rows={[
              {
                label: t.subscribers.toLowerCase(),
                value: formatNumber(lang, history[active].subscribers),
                color: "var(--chart-accent)",
              },
            ]}
          />
        )}
      </div>
    </ChartFrame>
  );
}

export function MonthlyViewsChart({ lang, t }: { lang: Locale; t: Dictionary["charts"] }) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const { active, setActive, onKeyDown } = useKeyboardIndex(monthlyViews.length);

  const maxValue = Math.max(...monthlyViews.map((d) => d.views));
  const peakIndex = monthlyViews.findIndex((d) => d.views === maxValue);
  const yMax = Math.ceil((maxValue * 1.1) / 10_000) * 10_000;
  const plotW = width - M.left - M.right;
  const plotH = HEIGHT - M.top - M.bottom;
  const band = plotW / monthlyViews.length;
  const barW = Math.min(24, band * 0.62);
  const y = (value: number) => M.top + plotH - (value / yMax) * plotH;
  const yTicks = [0, 20_000, 40_000, 60_000].filter((v) => v <= yMax);
  const sparseLabels = band < 40;

  function barPath(cx: number, value: number) {
    const top = y(value);
    const bottom = M.top + plotH;
    const r = Math.min(4, (bottom - top) / 2);
    const x0 = cx - barW / 2;
    const x1 = cx + barW / 2;
    // Extremo de datos redondeado (4px) y base recta.
    return `M${x0},${bottom}V${top + r}Q${x0},${top} ${x0 + r},${top}H${x1 - r}Q${x1},${top} ${x1},${top + r}V${bottom}Z`;
  }

  const activeRow = active !== null ? monthlyViews[active] : null;
  const activeX = active !== null ? M.left + band * active + band / 2 : 0;

  return (
    <ChartFrame
      title={t.viewsTitle}
      subtitle={t.viewsSubtitle}
      showTableLabel={t.showTable}
      hideTableLabel={t.hideTable}
      table={
        <DataTable
          head={[t.month, t.views, t.hours]}
          rows={monthlyViews.map((d) => [
            formatMonth(lang, d.month, "long"),
            formatNumber(lang, d.views),
            formatNumber(lang, d.hours),
          ])}
        />
      }
    >
      <div ref={ref} className="relative">
        <svg
          width={width}
          height={HEIGHT}
          viewBox={`0 0 ${width} ${HEIGHT}`}
          style={{ maxWidth: "100%", height: "auto" }}
          role="img"
          aria-label={`${t.viewsTitle}. ${t.peak}: ${formatMonth(lang, monthlyViews[peakIndex].month, "long")}, ${formatNumber(lang, maxValue)}`}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerLeave={() => setActive(null)}
          onBlur={() => setActive(null)}
          className="block touch-pan-y overflow-visible rounded-lg focus-visible:outline-offset-4"
        >
          {yTicks.map((v) => (
            <g key={v}>
              <line x1={M.left} x2={width - M.right} y1={y(v)} y2={y(v)} stroke="var(--chart-grid)" strokeWidth={1} />
              <text x={M.left - 10} y={y(v)} dy="0.32em" textAnchor="end" className="fill-[var(--text-subtle)] text-[11px] tabular-nums">
                {v === 0 ? "0" : formatCompact(lang, v)}
              </text>
            </g>
          ))}

          {monthlyViews.map((d, i) => {
            const cx = M.left + band * i + band / 2;
            const isActive = active === i;
            return (
              <g key={d.month} onPointerEnter={() => setActive(i)}>
                {/* Zona sensible más grande que la barra */}
                <rect x={M.left + band * i} y={M.top} width={band} height={plotH} fill="transparent" />
                <path
                  d={barPath(cx, d.views)}
                  fill="var(--chart-accent)"
                  opacity={active === null || isActive ? 1 : 0.45}
                  className="transition-opacity duration-200"
                />
                {(!sparseLabels || i % 2 === 0) && (
                  <text x={cx} y={HEIGHT - 8} textAnchor="middle" className="fill-[var(--text-subtle)] text-[11px]">
                    {formatMonth(lang, d.month).split(" ")[0].replace(".", "")}
                  </text>
                )}
                {i === peakIndex && (
                  <text x={cx} y={y(d.views) - 8} textAnchor="middle" className="fill-[var(--text-heading)] text-xs font-bold">
                    {formatCompact(lang, d.views)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {activeRow && (
          <ChartTooltip
            x={activeX}
            y={Math.max(M.top + 30, y(activeRow.views))}
            width={width}
            title={formatMonth(lang, activeRow.month, "long")}
            rows={[
              { label: t.views.toLowerCase(), value: formatNumber(lang, activeRow.views), color: "var(--chart-accent)" },
              { label: t.hours.toLowerCase(), value: formatNumber(lang, activeRow.hours) },
            ]}
          />
        )}
      </div>
    </ChartFrame>
  );
}
