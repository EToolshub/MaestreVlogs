import { Plus } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Faq({ dict }: { dict: Dictionary }) {
  const t = dict.faq;
  return (
    <section className="relative py-24 sm:py-32">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <FadeIn>
          <SectionHeading index="11" eyebrow={t.eyebrow} title={t.title} highlight={t.highlight} />
        </FadeIn>
        <FadeIn delay={0.08}>
          <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {t.items.map((item, i) => (
              <details key={item.q} className="group py-2" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-left text-lg font-semibold text-heading transition-colors hover:text-brand-300 [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink-600 text-body transition-transform duration-300 group-open:rotate-45 group-open:border-brand-400 group-open:text-brand-400">
                    <Plus className="h-4 w-4" aria-hidden />
                  </span>
                </summary>
                <p className="text-pretty pb-5 pr-12 leading-relaxed text-body">{item.a}</p>
              </details>
            ))}
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
