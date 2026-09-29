import { ShieldCheck } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Process({ dict }: { dict: Dictionary }) {
  const t = dict.process;
  return (
    <section className="relative border-y border-white/[0.06] bg-alt py-24 sm:py-32">
      <Container>
        <FadeIn>
          <SectionHeading index="10" eyebrow={t.eyebrow} title={t.title} highlight={t.highlight} />
        </FadeIn>

        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.steps.map((step, i) => (
            <li key={step.title}>
              <FadeIn delay={(i % 3) * 0.06} className="h-full">
                <div className="group relative h-full overflow-hidden rounded-3xl border border-default bg-card p-6 sm:p-7">
                  <span
                    aria-hidden
                    className="font-display absolute -right-2 -top-6 text-[7rem] leading-none text-white/[0.04] transition-colors duration-300 group-hover:text-brand-400/10"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-xs font-semibold text-brand-300">
                    {String(i + 1).padStart(2, "0")} / {String(t.steps.length).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-heading">{step.title}</h3>
                  <p className="text-pretty mt-2 leading-relaxed text-body">{step.text}</p>
                </div>
              </FadeIn>
            </li>
          ))}
        </ol>

        <FadeIn>
          <div className="mt-6 rounded-3xl border border-brand-400/25 bg-brand-400/[0.06] p-6 sm:p-8">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-brand-300">
              <ShieldCheck className="h-4 w-4" aria-hidden />
              {t.rulesTitle}
            </h3>
            <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {t.rules.map((rule) => (
                <li key={rule} className="flex items-start gap-3 text-body-strong">
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-400 text-[11px] font-bold text-ink-950" aria-hidden>
                    ✓
                  </span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
