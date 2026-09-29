import { Ban, Bike, Camera, GraduationCap, Landmark, Plane, ShoppingBasket, Wallet, Wifi } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";

const icons = [Wallet, Wifi, Plane, Camera, ShoppingBasket, Bike, GraduationCap, Landmark];

export function Brands({ dict }: { dict: Dictionary }) {
  const t = dict.brands;
  return (
    <section className="relative py-24 sm:py-32">
      <Container>
        <FadeIn>
          <SectionHeading index="07" eyebrow={t.eyebrow} title={t.title} highlight={t.highlight} />
        </FadeIn>

        <ul className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-default bg-[var(--border-default)] sm:grid-cols-2 lg:grid-cols-4">
          {t.items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <li key={item.title} className="group bg-card p-6 transition-colors hover:bg-ink-800 sm:p-7">
                <Icon className="h-6 w-6 text-brand-400 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden />
                <h3 className="mt-5 font-bold text-heading">{item.title}</h3>
                <p className="text-pretty mt-2 text-sm leading-relaxed text-body">{item.text}</p>
              </li>
            );
          })}
        </ul>

        <FadeIn>
          <div className="mt-6 rounded-3xl border border-rec-400/25 bg-rec-400/[0.05] p-6 sm:p-8">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-rec-300">
              <Ban className="h-4 w-4" aria-hidden />
              {t.notTitle}
            </h3>
            <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
              {t.notItems.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-body-strong">
                  <span className="mt-2.5 h-1.5 w-3 shrink-0 rounded-full bg-rec-400" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
