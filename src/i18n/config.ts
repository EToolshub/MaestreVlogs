export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** Etiqueta regional para Intl (formato de números y fechas). */
export const intlLocale: Record<Locale, string> = {
  es: "es-VE",
  en: "en-US",
};
