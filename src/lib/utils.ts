import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { intlLocale, type Locale } from "@/i18n/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Rellena los marcadores {clave} de un texto del diccionario. */
export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match
  );
}

export function formatNumber(locale: Locale, value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat(intlLocale[locale], { maximumFractionDigits }).format(value);
}

/** 284155 → "284 mil" / "284K" */
export function formatCompact(locale: Locale, value: number) {
  return new Intl.NumberFormat(intlLocale[locale], {
    notation: "compact",
    maximumFractionDigits: value < 10_000 ? 1 : 0,
  }).format(value);
}

/** 242 → "4:02" */
export function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function formatMonth(locale: Locale, yyyyMm: string, month: "short" | "long" = "short") {
  const [y, m] = yyyyMm.split("-").map(Number);
  return new Intl.DateTimeFormat(intlLocale[locale], { month, year: month === "long" ? "numeric" : "2-digit", timeZone: "UTC" }).format(
    new Date(Date.UTC(y, m - 1, 1))
  );
}

export function formatDate(locale: Locale, isoDate: string) {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat(intlLocale[locale], {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

export function buildWhatsAppLink(phoneDigitsOnly: string, message: string) {
  return `https://wa.me/${phoneDigitsOnly}?text=${encodeURIComponent(message)}`;
}

export function buildMailto(email: string, subject: string, body: string) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** 734 → "12:14", 3725 → "1:02:05" */
export function formatSeconds(total: number) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mmss = `${h ? String(m).padStart(2, "0") : m}:${String(s).padStart(2, "0")}`;
  return h ? `${h}:${mmss}` : mmss;
}
