import { ArrowRight, Plane } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

export function NextChapter({ dict }: { dict: Dictionary }) {
  const t = dict.chapter;
  const nowIndex = t.steps.length - 2;

  return (
    <section className="relative overflow-hidden border-y border-white/[0.06] bg-alt py-24 sm:py-32">
      <div className="pointer-events-none absolute -right-40 top-10 h-[480px] w-[480px] rounded-full bg-world-500/15 blur-[150px]" />
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <Container className="relative">
        <FadeIn>
          <SectionHeading index="06" eyebrow={t.eyebrow} title={t.title} highlight={t.highlight} description={t.description} />
        </FadeIn>

        <ol className="relative mt-16 grid gap-0 lg:grid-cols-6 lg:gap-4">
          {/* Línea de ruta: vertical en móvil, horizontal en escritorio */}
          <span aria-hidden className="absolute bottom-6 left-[11px] top-2 w-0.5 bg-gradient-to-b from-brand-400 via-brand-400 to-world-500 lg:bottom-auto lg:left-0 lg:right-0 lg:top-[11px] lg:h-0.5 lg:w-auto lg:bg-gradient-to-r" />
          {t.steps.map((step, i) => {
            const future = i > nowIndex;
            const now = i === nowIndex;
            return (
              <li key={step.date} className="relative pb-10 pl-10 lg:pb-0 lg:pl-0 lg:pt-10">
                <FadeIn delay={i * 0.07}>
                  <span
                    aria-hidden
                    className={cn(
                      "absolute left-0 top-0.5 grid h-6 w-6 place-items-center rounded-full border-2 lg:top-0",
                      future
                        ? "border-world-400 bg-world-500 text-white"
                        : now
                          ? "border-rec-400 bg-ink-950"
                          : "border-brand-400 bg-ink-950"
                    )}
                  >
                    {future ? (
                      <Plane className="h-3 w-3" />
                    ) : (
                      <span className={cn("h-2 w-2 rounded-full", now ? "animate-rec bg-rec-400" : "bg-brand-400")} />
                    )}
                  </span>
                  <p className={cn("font-mono text-xs font-semibold uppercase tracking-[0.18em]", future ? "text-world-300" : "text-brand-300")}>
                    {step.date}
                    {now && <span className="ml-2 rounded bg-rec-400 px-1.5 py-0.5 text-[10px] text-white">{t.now}</span>}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-heading">{step.title}</h3>
                  <p className="text-pretty mt-1.5 text-sm leading-relaxed text-body">{step.text}</p>
                </FadeIn>
              </li>
            );
          })}
        </ol>

        <FadeIn>
          <div className="mt-14 flex flex-col gap-6 rounded-3xl border border-world-500/25 bg-world-500/[0.07] p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-world-300">{t.opportunitiesTitle}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {t.opportunities.map((o) => (
                  <li key={o} className="rounded-full border border-world-400/30 bg-ink-950/40 px-3.5 py-1.5 text-sm font-medium text-body-strong">
                    {o}
                  </li>
                ))}
              </ul>
            </div>
            <Button href="#armar-campana" size="lg" icon={<ArrowRight className="h-5 w-5" />} iconPosition="right" className="shrink-0">
              {t.cta}
            </Button>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
