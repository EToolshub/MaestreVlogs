"use client";

import { useEffect, useState } from "react";
import { intlLocale, type Locale } from "@/i18n/config";

const units: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];

function relative(iso: string, locale: Locale) {
  const seconds = (Date.parse(iso) - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat(intlLocale[locale], { numeric: "auto" });
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  }
  return rtf.format(0, "minute");
}

/**
 * "hace 3 días". El HTML del servidor muestra la fecha exacta y el navegador
 * la cambia por el tiempo relativo (así no depende de cuándo se generó la página).
 */
export function TimeAgo({ iso, locale, className }: { iso: string; locale: Locale; className?: string }) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setLabel(relative(iso, locale));
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, [iso, locale]);

  const absolute = new Intl.DateTimeFormat(intlLocale[locale], {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "America/Caracas",
  }).format(new Date(iso));

  return (
    <time dateTime={iso} title={absolute} className={className}>
      {label ?? absolute}
    </time>
  );
}
