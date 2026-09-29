import Image from "next/image";
import { Banknote, Footprints, Plane, ShoppingBasket } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { VideoGallery, type GalleryVideo } from "./VideoGallery";
import { thumbnailUrl, videoUrl, videos, type PillarId } from "@/data/channel";
import { formatCompact, formatNumber } from "@/lib/utils";

const pillarOrder: PillarId[] = ["costo", "calle", "dinero", "emigrar"];
const pillarIcons = { costo: ShoppingBasket, calle: Footprints, dinero: Banknote, emigrar: Plane };

export function Content({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.pillars;
  const title = (v: (typeof videos)[number]) => (lang === "en" ? v.titleEn : v.title);

  const gallery: GalleryVideo[] = videos.map((v) => ({
    id: v.id,
    title: title(v),
    pillar: v.pillar,
    views: formatNumber(lang, v.views),
    likes: formatNumber(lang, v.likes),
    comments: formatNumber(lang, v.comments),
    duration: v.duration,
    thumb: thumbnailUrl(v.id, "max"),
    url: videoUrl(v.id),
  }));

  return (
    <section id="contenido" className="relative py-24 sm:py-32">
      <Container>
        <FadeIn>
          <SectionHeading index="05" eyebrow={t.eyebrow} title={t.title} highlight={t.highlight} description={t.description} />
        </FadeIn>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillarOrder.map((id, i) => {
            const pillar = t.items[id];
            const Icon = pillarIcons[id];
            const top = videos.filter((v) => v.pillar === id).sort((a, b) => b.views - a.views)[0];
            return (
              <li key={id}>
                <FadeIn delay={i * 0.06} className="h-full">
                  <SpotlightCard className="flex h-full flex-col overflow-hidden">
                    <div className="relative aspect-[16/9] bg-gradient-to-br from-ink-700 to-ink-900">
                      <Image src={thumbnailUrl(top.id, "max")} alt="" fill sizes="(min-width: 1024px) 300px, 50vw" className="object-cover opacity-70" />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-850 via-ink-850/40 to-transparent" />
                      <span className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-xl bg-brand-400 text-ink-950">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <span className="absolute right-4 top-4 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[11px] font-semibold text-white backdrop-blur">
                        {formatCompact(lang, top.views)} ▶
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-display text-3xl text-heading">{pillar.name}</h3>
                      <p className="text-pretty mt-3 flex-1 text-sm leading-relaxed text-body">{pillar.text}</p>
                      <p className="mt-5 border-t border-white/[0.06] pt-4 text-xs text-muted">
                        <span className="font-semibold uppercase tracking-wider">{t.topVideo}:</span>{" "}
                        <span className="text-body-strong">{title(top)}</span>
                      </p>
                    </div>
                  </SpotlightCard>
                </FadeIn>
              </li>
            );
          })}
        </ul>

        <div className="mt-24">
          <FadeIn>
            <SectionHeading eyebrow={dict.videos.eyebrow} title={dict.videos.title} highlight={dict.videos.highlight} description={dict.videos.description} />
          </FadeIn>
          <div className="mt-10">
            <VideoGallery
              videos={gallery}
              pillars={pillarOrder.map((id) => ({ id, name: t.items[id].name }))}
              labels={dict.videos}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
