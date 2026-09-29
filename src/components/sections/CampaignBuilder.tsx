"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Mail, Minus, Plus, RotateCcw } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { estimateViews, formats, packages, type FormatId, type PackageId } from "@/data/formats";
import { formatIcons } from "@/lib/format-icons";
import { buildMailto, buildWhatsAppLink, cn, fill, formatNumber } from "@/lib/utils";
import { WhatsappIcon } from "@/components/icons/SocialIcons";

type Quantities = Record<FormatId, number>;

const empty = (): Quantities => ({ integration: 0, dedicated: 0, series: 0, short: 0, community: 0, crosspost: 0 });

const fromPackage = (id: PackageId): Quantities => ({
  ...empty(),
  ...packages.find((p) => p.id === id)!.items,
});

export function CampaignBuilder({
  lang,
  t,
  formatNames,
  audience,
  contact,
  perVideoViews,
}: {
  lang: Locale;
  t: Dictionary["builder"];
  formatNames: Record<FormatId, { name: string; short: string }>;
  audience: { tv: number; abroad: number; adults: number };
  contact: { email: string; whatsapp: string; creatorName: string };
  perVideoViews: { median: number; mean: number };
}) {
  const [qty, setQty] = useState<Quantities>(() => fromPackage("launch"));
  const [activePackage, setActivePackage] = useState<PackageId | null>("launch");
  const [copied, setCopied] = useState(false);

  const summary = useMemo(() => {
    let min = 0;
    let max = 0;
    let longVideos = 0;
    let extra = false;
    const lines: string[] = [];
    for (const format of formats) {
      const n = qty[format.id];
      if (!n) continue;
      lines.push(`• ${n}× ${formatNames[format.id].name}`);
      longVideos += n * format.longVideos;
      const views = estimateViews(format, perVideoViews);
      if (views) {
        min += n * views[0];
        max += n * views[1];
      } else {
        extra = true;
      }
    }
    const weeksMin = longVideos === 0 ? 1 : 2 + Math.max(0, longVideos - 1);
    const weeksMax = longVideos === 0 ? 2 : weeksMin + 1 + Math.floor(longVideos / 3);
    return { min, max, extra, lines, weeksMin, weeksMax, total: lines.length };
  }, [qty, formatNames, perVideoViews]);

  const range =
    summary.max > 0 ? `${formatNumber(lang, summary.min)} – ${formatNumber(lang, summary.max)}` : "—";

  const message = [
    fill(t.messageIntro, { name: contact.creatorName }),
    "",
    ...summary.lines,
    "",
    summary.max > 0 ? fill(t.messageEstimate, { range }) : "",
    "",
    t.messageOutro,
  ]
    .filter((line, i, all) => !(line === "" && all[i - 1] === ""))
    .join("\n");

  function change(id: FormatId, delta: number, maxQty: number) {
    setActivePackage(null);
    setQty((q) => ({ ...q, [id]: Math.min(maxQty, Math.max(0, q[id] + delta)) }));
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sin permiso de portapapeles: el correo sigue disponible.
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
      <div className="min-w-0">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted">{t.packagesLabel}</p>
        <div role="radiogroup" aria-label={t.packagesLabel} className="mt-4 grid gap-3 sm:grid-cols-3">
          {packages.map((pkg) => {
            const active = activePackage === pkg.id;
            return (
              <button
                key={pkg.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => {
                  setQty(fromPackage(pkg.id));
                  setActivePackage(pkg.id);
                }}
                className={cn(
                  "relative rounded-2xl border p-4 text-left transition-all duration-200",
                  active
                    ? "border-brand-400 bg-brand-400/10 shadow-[0_0_0_1px_var(--color-brand-400)]"
                    : "border-default bg-card hover:border-ink-500"
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-bold text-heading">{t.packages[pkg.id].name}</span>
                  <span
                    className={cn(
                      "grid h-5 w-5 place-items-center rounded-full border",
                      active ? "border-brand-400 bg-brand-400 text-ink-950" : "border-ink-500"
                    )}
                    aria-hidden
                  >
                    {active && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                </span>
                <span className="mt-1.5 block text-sm leading-snug text-body">{t.packages[pkg.id].text}</span>
              </button>
            );
          })}
        </div>

        <p className="mt-10 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted">{t.formatsLabel}</p>
        <ul className="mt-4 divide-y divide-white/[0.06] rounded-2xl border border-default bg-card">
          {formats.map((format) => {
            const Icon = formatIcons[format.id];
            const n = qty[format.id];
            const name = formatNames[format.id].name;
            return (
              <li key={format.id} className="flex items-center gap-4 p-4 sm:px-5">
                <span
                  className={cn(
                    "grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors",
                    n ? "bg-brand-400 text-ink-950" : "bg-ink-800 text-muted"
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-heading">{name}</span>
                  <span className="block truncate text-sm text-muted">{formatNames[format.id].short}</span>
                </span>
                <span className="flex items-center gap-1 rounded-full border border-ink-600 p-1">
                  <button
                    type="button"
                    onClick={() => change(format.id, -1, format.maxQty)}
                    disabled={n === 0}
                    aria-label={`${t.decrease}: ${name}`}
                    className="grid h-8 w-8 place-items-center rounded-full text-body transition-colors hover:bg-white/10 hover:text-heading disabled:opacity-30"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <output aria-live="polite" className="w-6 text-center font-bold tabular-nums text-heading">
                    {n}
                  </output>
                  <button
                    type="button"
                    onClick={() => change(format.id, 1, format.maxQty)}
                    disabled={n >= format.maxQty}
                    aria-label={`${t.increase}: ${name}`}
                    className="grid h-8 w-8 place-items-center rounded-full text-body transition-colors hover:bg-white/10 hover:text-heading disabled:opacity-30"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Resumen */}
      <aside className="rounded-3xl border border-brand-400/30 bg-gradient-to-b from-brand-400/[0.09] to-ink-850 p-6 sm:p-7 lg:sticky lg:top-24">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-3xl text-heading">{t.summaryTitle}</h3>
          <button
            type="button"
            onClick={() => {
              setQty(empty());
              setActivePackage(null);
            }}
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-muted transition-colors hover:bg-white/5 hover:text-heading"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            {t.reset}
          </button>
        </div>

        {summary.total === 0 ? (
          <p className="mt-6 text-body">{t.empty}</p>
        ) : (
          <div aria-live="polite">
            <p className="mt-6 text-sm font-semibold text-body-strong">{t.estViews}</p>
            <p className="mt-1 text-4xl font-extrabold tracking-tight text-heading sm:text-[2.6rem]">{range}</p>
            {summary.extra && <p className="mt-1 text-sm font-semibold text-brand-300">{t.extraReach}</p>}
            <p className="mt-2 text-xs leading-relaxed text-muted">
              {fill(t.estViewsNote, {
                median: formatNumber(lang, perVideoViews.median),
                mean: formatNumber(lang, perVideoViews.mean),
              })}
            </p>

            <p className="mt-6 text-sm font-semibold text-body-strong">{t.audienceTitle}</p>
            <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
              {[
                { v: audience.tv, l: t.tvLabel },
                { v: audience.abroad, l: t.abroadLabel },
                { v: audience.adults, l: t.adultsLabel },
              ].map((item) => (
                <div key={item.l} className="flex flex-col-reverse rounded-xl bg-ink-950/50 px-2 py-3">
                  <dt className="mt-0.5 text-[11px] leading-tight text-muted">{item.l}</dt>
                  <dd className="text-lg font-extrabold text-heading">{formatNumber(lang, item.v)}%</dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 text-sm font-semibold text-body-strong">{t.timelineLabel}</p>
            <p className="mt-1 text-sm text-body">
              {fill(t.timelineValue, { min: summary.weeksMin, max: summary.weeksMax })}
            </p>

            <ul className="mt-6 space-y-1.5 border-t border-white/[0.08] pt-5 text-sm text-body-strong">
              {summary.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-7 grid gap-2.5">
          <a
            href={buildMailto(contact.email, t.emailSubject, message)}
            aria-disabled={summary.total === 0}
            className={cn(
              "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-400 px-5 font-bold text-ink-950 transition-all hover:-translate-y-0.5 hover:bg-brand-300",
              summary.total === 0 && "pointer-events-none opacity-45"
            )}
          >
            <Mail className="h-5 w-5" aria-hidden />
            {t.request}
          </a>
          {contact.whatsapp && (
            <a
              href={buildWhatsAppLink(contact.whatsapp, message)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-whatsapp px-5 font-bold text-ink-950 transition-all hover:-translate-y-0.5 hover:brightness-110",
                summary.total === 0 && "pointer-events-none opacity-45"
              )}
            >
              <WhatsappIcon className="h-5 w-5" />
              {t.whatsapp}
            </a>
          )}
          <button
            type="button"
            onClick={copySummary}
            disabled={summary.total === 0}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-ink-600 px-5 text-sm font-semibold text-body-strong transition-colors hover:border-brand-400/60 hover:text-heading disabled:opacity-45"
          >
            {copied ? <Check className="h-4 w-4 text-brand-400" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
            {copied ? t.copied : t.copy}
          </button>
        </div>
      </aside>
    </div>
  );
}
