import { ArrowUpRight, Check } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { formats } from "@/data/formats";
import { formatIcons } from "@/lib/format-icons";
import { cn, formatNumber } from "@/lib/utils";

export function Formats({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.formats;

  return (
    <section id="formatos" className="relative border-t border-white/[0.06] bg-alt py-24 sm:py-32">
      <Container>
        <FadeIn>
          <SectionHeading index="08" eyebrow={t.eyebrow} title={t.title} highlight={t.highlight} description={t.description} />
        </FadeIn>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {formats.map((format, i) => {
            const copy = t.items[format.id];
            const Icon = formatIcons[format.id];
            return (
              <li key={format.id}>
                <FadeIn delay={(i % 3) * 0.06} className="h-full">
                  <SpotlightCard
                    className={cn("flex h-full flex-col p-6 sm:p-7", format.featured && "border-brand-400/40 bg-gradient-to-b from-brand-400/[0.07] to-transparent")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-ink-800 text-brand-400">
                        <Icon className="h-6 w-6" aria-hidden />
                      </span>
                      {format.featured && (
                        <span className="rounded-full bg-brand-400 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-950">
                          {t.mostRequested}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-heading">{copy.name}</h3>
                    <p className="mt-1.5 text-body">{copy.short}</p>
                    <ul className="mt-5 flex-1 space-y-2.5">
                      {copy.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-body-strong">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" aria-hidden />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-6 flex items-baseline justify-between gap-3 border-t border-white/[0.06] pt-4 text-sm">
                      <span className="text-muted">{format.views ? t.estViews : t.extraReach}</span>
                      {format.views ? (
                        <span className="font-bold text-heading">
                          {formatNumber(lang, format.views[0])}–{formatNumber(lang, format.views[1])}
                          <span className="ml-1 font-normal text-muted">{t.perUnit}</span>
                        </span>
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-brand-400" aria-hidden />
                      )}
                    </p>
                  </SpotlightCard>
                </FadeIn>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
