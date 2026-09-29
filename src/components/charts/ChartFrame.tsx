"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Table2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Mide el ancho real del contenedor para dibujar el SVG a tamaño 1:1. */
export function useElementWidth<T extends HTMLElement>(fallback = 600) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const update = () => setWidth(Math.max(260, Math.round(node.getBoundingClientRect().width)));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, width] as const;
}

/** Tarjeta de gráfico: título, subtítulo y botón para ver los datos en tabla. */
export function ChartFrame({
  title,
  subtitle,
  showTableLabel,
  hideTableLabel,
  table,
  children,
  className,
}: {
  title: string;
  subtitle: string;
  showTableLabel: string;
  hideTableLabel: string;
  table: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const [showTable, setShowTable] = useState(false);

  return (
    <figure className={cn("rounded-3xl border border-default bg-card p-5 sm:p-7", className)}>
      <figcaption className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-heading">{title}</h3>
          <p className="mt-0.5 text-sm text-muted">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          aria-expanded={showTable}
          className="no-print inline-flex items-center gap-1.5 rounded-full border border-ink-600 px-3 py-1.5 text-xs font-semibold text-body transition-colors hover:border-brand-400/60 hover:text-heading"
        >
          <Table2 className="h-3.5 w-3.5" aria-hidden />
          {showTable ? hideTableLabel : showTableLabel}
        </button>
      </figcaption>
      <div className="mt-6">{children}</div>
      {showTable && <div className="mt-6 overflow-x-auto">{table}</div>}
    </figure>
  );
}

export function DataTable({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <table className="w-full min-w-[280px] text-left text-sm">
      <thead>
        <tr className="border-b border-default text-xs uppercase tracking-wider text-muted">
          {head.map((h, i) => (
            <th key={h} scope="col" className={cn("py-2 font-semibold", i > 0 && "text-right")}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={String(row[0])} className="border-b border-white/[0.04]">
            {row.map((cell, i) =>
              i === 0 ? (
                <th key={i} scope="row" className="py-2 font-medium text-body-strong">
                  {cell}
                </th>
              ) : (
                <td key={i} className="py-2 text-right tabular-nums text-body">
                  {cell}
                </td>
              )
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Tooltip: el valor manda, la etiqueta acompaña. */
export function ChartTooltip({
  x,
  y,
  width,
  title,
  rows,
}: {
  x: number;
  y: number;
  width: number;
  title: string;
  rows: { label: string; value: string; color?: string }[];
}) {
  const flip = x > width - 170;
  return (
    <div
      role="status"
      className="pointer-events-none absolute z-10 min-w-[140px] rounded-xl border border-white/10 bg-ink-950/95 px-3 py-2.5 shadow-2xl backdrop-blur"
      style={{
        left: x,
        top: y,
        transform: `translate(${flip ? "calc(-100% - 12px)" : "12px"}, -50%)`,
      }}
    >
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted">{title}</p>
      {rows.map((row) => (
        <p key={row.label} className="mt-1 flex items-center gap-2 text-sm">
          {row.color && <span className="h-0.5 w-3 rounded-full" style={{ background: row.color }} />}
          <span className="font-bold text-heading">{row.value}</span>
          <span className="text-muted">{row.label}</span>
        </p>
      ))}
    </div>
  );
}
