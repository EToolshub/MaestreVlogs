"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

/** Selector ES / EN que conserva la sección en la que estás (#ancla). */
export function LangSwitch({ lang, label, className }: { lang: Locale; label: string; className?: string }) {
  const router = useRouter();
  // Ruta sin el idioma (por ejemplo "/privacidad"), para cambiar de idioma sin salir de la página.
  const rest = usePathname().replace(/^\/(es|en)(?=\/|$)/, "");
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("inline-flex rounded-full border border-ink-600 bg-ink-900/70 p-1 font-mono text-xs", className)}
    >
      {locales.map((locale) => {
        const active = locale === lang;
        return (
          <Link
            key={locale}
            href={`/${locale}${rest}`}
            hrefLang={locale}
            aria-current={active ? "true" : undefined}
            onClick={(e) => {
              if (active) return;
              e.preventDefault();
              router.push(`/${locale}${rest}${window.location.hash}`);
            }}
            className={cn(
              "rounded-full px-2.5 py-1 font-semibold uppercase tracking-wider transition-colors",
              active ? "bg-brand-400 text-ink-950" : "text-muted hover:text-heading"
            )}
          >
            {locale}
          </Link>
        );
      })}
    </div>
  );
}
