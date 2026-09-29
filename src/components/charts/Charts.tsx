"use client";

import { useState, type KeyboardEvent, type PointerEvent } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { formatCompact, formatDate, formatMonth, formatNumber } from "@/lib/utils";
import { ChartFrame, ChartTooltip, DataTable, useElementWidth } from "./ChartFrame";

const HEIGHT = 260;
const M = { top: 24, right: 20, bottom: 30, left: 48 };

type Kind = "day" | "month";

/** Paso "bonito" para los ejes: 1, 2, 2,5 o 5 × 10^n. */
function niceStep(raw: number) {
  const pow = 10 ** Math.floor(Math.log10(Math.max(raw, 1e-9)));
  const n = raw / pow;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * pow;
}

function ticks(min: number, max: number) {
  const step = niceStep((max - min) / 4 || 1);
  const out: number[] = [];
  for (let v = Math.floor(min / step) * step; v <= max + 1e-9; v += step) out.push(Math.round(v * 100) / 100);
  return out;
}

const label = (lang: Locale, kind: Kind, key: string, long = false) => {
  if (kind === "month") return long ? formatMonth(lang, key, "long") : formatMonth(lang, key).split(" ")[0].replace(".", "");
  return long ? formatDate(lang, key) : String(Number(key.slice(8, 10)));
};

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

const svgProps = (width: number) => ({
  width,
  height: HEIGHT,
  viewBox: `0 0 ${width} ${HEIGHT}`,
  style: { maxWidth: "100%", height: "auto" } as const,
  role: "img" as const,
  tabIndex: 0,
  className: "block touch-pan-y overflow-visible rounded-lg focus-visible:outline-offset-4",
});

export type ColumnDatum = { key: string; value: number; extra?: { label: string; value: number }[] };

/**
 * Columnas de una serie. Admite negativos (p. ej. días con más bajas que
 * suscriptores nuevos): van hacia abajo desde la línea base y en gris.
 */
export function ColumnChart({
  lang,
  t,
  title,
  subtitle,
  data,
  kind,
  valueLabel,
  peakLabel,
  signed,
}: {
  lang: Locale;
  t: Dictionary["charts"];
  title: string;
  subtitle: string;
  data: ColumnDatum[];
  kind: Kind;
  valueLabel: string;
  peakLabel: string;
  /** Muestra "+" en los valores positivos (suscriptores netos). */
  signed?: boolean;
}) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const { active, setActive, onKeyDown } = useKeyboardIndex(data.length);

  const values = data.map((d) => d.value);
  const rawMax = Math.max(0, ...values);
  const rawMin = Math.min(0, ...values);
  const tickValues = ticks(rawMin, rawMax === 0 && rawMin === 0 ? 1 : rawMax * 1.12);
  const yMin = tickValues[0];
  const yMax = tickValues[tickValues.length - 1];
  const plotW = width - M.left - M.right;
  const plotH = HEIGHT - M.top - M.bottom;
  const band = plotW / data.length;
  const barW = Math.max(3, Math.min(24, band * 0.62));
  const y = (v: number) => M.top + plotH - ((v - yMin) / (yMax - yMin || 1)) * plotH;
  const peakIndex = values.indexOf(rawMax);
  const labelEvery = kind === "day" ? (band < 16 ? 7 : band < 26 ? 4 : 2) : band < 40 ? 2 : 1;
  const fmt = (v: number) => `${signed && v > 0 ? "+" : ""}${formatNumber(lang, v)}`;

  function barPath(cx: number, value: number) {
    const base = y(0);
    const tip = y(value);
    const x0 = cx - barW / 2;
    const x1 = cx + barW / 2;
    const h = Math.abs(base - tip);
    if (h < 0.5) return "";
    const r = Math.min(4, h / 2, barW / 2);
    // Extremo de datos redondeado (4px) y base recta.
    return value >= 0
      ? `M${x0},${base}V${tip + r}Q${x0},${tip} ${x0 + r},${tip}H${x1 - r}Q${x1},${tip} ${x1},${tip + r}V${base}Z`
      : `M${x0},${base}V${tip - r}Q${x0},${tip} ${x0 + r},${tip}H${x1 - r}Q${x1},${tip} ${x1},${tip - r}V${base}Z`;
  }

  const activeRow = active !== null ? data[active] : null;
  const activeX = active !== null ? M.left + band * active + band / 2 : 0;

  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      showTableLabel={t.showTable}
      hideTableLabel={t.hideTable}
      table={
        <DataTable
          head={[kind === "day" ? t.day : t.month, valueLabel, ...(data[0]?.extra?.map((e) => e.label) ?? [])]}
          rows={data.map((d) => [label(lang, kind, d.key, true), fmt(d.value), ...(d.extra?.map((e) => formatNumber(lang, e.value)) ?? [])])}
        />
      }
    >
      <div ref={ref} className="relative">
        <svg
          {...svgProps(width)}
          aria-label={`${title}. ${peakLabel}: ${data[peakIndex] ? `${label(lang, kind, data[peakIndex].key, true)}, ${fmt(rawMax)}` : "—"}`}
          onKeyDown={onKeyDown}
          onPointerLeave={() => setActive(null)}
          onBlur={() => setActive(null)}
        >
          {tickValues.map((v) => (
            <g key={v}>
              <line x1={M.left} x2={width - M.right} y1={y(v)} y2={y(v)} stroke="var(--chart-grid)" strokeWidth={v === 0 ? 1.5 : 1} />
              <text x={M.left - 10} y={y(v)} dy="0.32em" textAnchor="end" className="fill-[var(--text-subtle)] text-[11px] tabular-nums">
                {v === 0 ? "0" : Math.abs(v) >= 10_000 ? formatCompact(lang, v) : formatNumber(lang, v)}
              </text>
            </g>
          ))}

          {data.map((d, i) => {
            const cx = M.left + band * i + band / 2;
            return (
              <g key={d.key} onPointerEnter={() => setActive(i)}>
                {/* Zona sensible más grande que la barra */}
                <rect x={M.left + band * i} y={M.top} width={band} height={plotH} fill="transparent" />
                <path
                  d={barPath(cx, d.value)}
                  fill={d.value >= 0 ? "var(--chart-accent)" : "var(--chart-muted)"}
                  opacity={active === null || active === i ? 1 : 0.45}
                  className="transition-opacity duration-200"
                />
                {i % labelEvery === 0 && (
                  <text x={cx} y={HEIGHT - 8} textAnchor="middle" className="fill-[var(--text-subtle)] text-[11px]">
                    {label(lang, kind, d.key)}
                  </text>
                )}
                {i === peakIndex && rawMax > 0 && (
                  <text x={cx} y={y(d.value) - 8} textAnchor="middle" className="fill-[var(--text-heading)] text-xs font-bold">
                    {Math.abs(d.value) >= 10_000 ? formatCompact(lang, d.value) : fmt(d.value)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {activeRow && (
          <ChartTooltip
            x={activeX}
            y={Math.max(M.top + 30, Math.min(y(activeRow.value), y(0)))}
            width={width}
            title={label(lang, kind, activeRow.key, true)}
            rows={[
              { label: valueLabel.toLowerCase(), value: fmt(activeRow.value), color: "var(--chart-accent)" },
              ...(activeRow.extra?.map((e) => ({ label: e.label.toLowerCase(), value: formatNumber(lang, e.value) })) ?? []),
            ]}
          />
        )}
      </div>
    </ChartFrame>
  );
}

/** Línea de una serie (total acumulado de suscriptores). */
export function LineChart({
  lang,
  t,
  title,
  subtitle,
  points,
  valueLabel,
}: {
  lang: Locale;
  t: Dictionary["charts"];
  title: string;
  subtitle: string;
  points: { date: string; value: number }[];
  valueLabel: string;
}) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const { active, setActive, onKeyDown } = useKeyboardIndex(points.length);

  const times = points.map((d) => Date.parse(d.date));
  const t0 = times[0];
  const t1 = times[times.length - 1];
  const maxValue = Math.max(...points.map((d) => d.value));
  const lastValue = points[points.length - 1]?.value ?? 0;
  const tickValues = ticks(0, maxValue * 1.12);
  const yMax = tickValues[tickValues.length - 1];
  const plotW = width - M.left - M.right;
  const plotH = HEIGHT - M.top - M.bottom;
  const x = (time: number) => M.left + ((time - t0) / (t1 - t0 || 1)) * plotW;
  const y = (value: number) => M.top + plotH - (value / (yMax || 1)) * plotH;

  const xy = points.map((d, i) => [x(times[i]), y(d.value)] as const);
  const line = xy.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)},${py.toFixed(1)}`).join("");
  const area = xy.length ? `${line}L${xy[xy.length - 1][0]},${M.top + plotH}L${xy[0][0]},${M.top + plotH}Z` : "";
  const lastIndex = points.length - 1;
  const xTickIndexes = [...new Set(width < 420 ? [0, Math.round(lastIndex / 2), lastIndex] : [0, Math.round(lastIndex / 3), Math.round((2 * lastIndex) / 3), lastIndex])];

  function handleMove(e: PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * width;
    let nearest = 0;
    xy.forEach(([pointX], i) => {
      if (Math.abs(pointX - px) < Math.abs(xy[nearest][0] - px)) nearest = i;
    });
    setActive(nearest);
  }

  const last = xy[xy.length - 1];
  const activePoint = active !== null ? xy[active] : null;

  return (
    <ChartFrame
      title={title}
      subtitle={subtitle}
      showTableLabel={t.showTable}
      hideTableLabel={t.hideTable}
      table={<DataTable head={[t.date, valueLabel]} rows={points.map((d) => [formatDate(lang, d.date), formatNumber(lang, d.value)])} />}
    >
      <div ref={ref} className="relative">
        <svg
          {...svgProps(width)}
          aria-label={`${title}: ${formatNumber(lang, points[0]?.value ?? 0)} → ${formatNumber(lang, lastValue)}`}
          onKeyDown={onKeyDown}
          onPointerMove={handleMove}
          onPointerLeave={() => setActive(null)}
          onBlur={() => setActive(null)}
        >
          <defs>
            <linearGradient id="line-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-accent)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--chart-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {tickValues.map((v) => (
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
              x={xy[i][0]}
              y={HEIGHT - 8}
              textAnchor={i === 0 ? "start" : i === lastIndex ? "end" : "middle"}
              className="fill-[var(--text-subtle)] text-[11px]"
            >
              {formatMonth(lang, points[i].date.slice(0, 7))}
            </text>
          ))}
          <path d={area} fill="url(#line-fill)" />
          <path d={line} fill="none" stroke="var(--chart-accent)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {last && (
            <>
              <circle cx={last[0]} cy={last[1]} r={5} fill="var(--chart-accent)" stroke="var(--chart-surface)" strokeWidth={2} />
              <text x={last[0] - 10} y={last[1] - 14} textAnchor="end" className="fill-[var(--text-heading)] text-sm font-bold">
                {formatNumber(lang, lastValue)}
              </text>
            </>
          )}
          {activePoint && (
            <g aria-hidden>
              <line x1={activePoint[0]} x2={activePoint[0]} y1={M.top} y2={M.top + plotH} stroke="var(--text-subtle)" strokeWidth={1} />
              <circle cx={activePoint[0]} cy={activePoint[1]} r={5} fill="var(--chart-accent)" stroke="var(--chart-surface)" strokeWidth={2} />
            </g>
          )}
        </svg>
        {active !== null && activePoint && (
          <ChartTooltip
            x={activePoint[0]}
            y={activePoint[1]}
            width={width}
            title={formatDate(lang, points[active].date)}
            rows={[{ label: valueLabel.toLowerCase(), value: formatNumber(lang, points[active].value), color: "var(--chart-accent)" }]}
          />
        )}
      </div>
    </ChartFrame>
  );
}
