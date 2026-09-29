import Image from "next/image";
import { Banknote, Footprints, Plane, ShoppingBasket } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { VideoGallery } from "./VideoGallery";
import type { PillarId } from "@/data/channel";
import type { YoutubeData } from "@/lib/youtube";
import { toGalleryVideo, videoTitle } from "@/lib/video-view";
import { formatCompact } from "@/lib/utils";

const pillarOrder: PillarId[] = ["costo", "calle", "dinero", "emigrar"];
const pillarIcons = { costo: ShoppingBasket, calle: Footprints, dinero: Banknote, emigrar: Plane };

export function Content({ lang, dict, yt }: { lang: Locale; dict: Dictionary; yt: YoutubeData }) {
  const t = dict.pillars;
  const now = new Date(yt.fetchedAt);
  const gallery = yt.videos.map((v) => toGalleryVideo(v, lang, now));

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
            const top = yt.videos.filter((v) => v.pillar === id).sort((a, b) => b.views - a.views)[0];
            return (
              <li key={id}>
                <FadeIn delay={i * 0.06} className="h-full">
                  <SpotlightCard className="flex h-full flex-col overflow-hidden">
                    <div className="relative aspect-[16/9] bg-gradient-to-br from-ink-700 to-ink-900">
                      {top && <Image src={top.thumb} alt="" fill sizes="(min-width: 1024px) 300px, 50vw" className="object-cover opacity-70" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-850 via-ink-850/40 to-transparent" />
                      <span className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-xl bg-brand-400 text-ink-950">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      {top && (
                        <span className="absolute right-4 top-4 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[11px] font-semibold text-white backdrop-blur">
                          {formatCompact(lang, top.views)} ▶
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-display text-3xl text-heading">{pillar.name}</h3>
                      <p className="text-pretty mt-3 flex-1 text-sm leading-relaxed text-body">{pillar.text}</p>
                      {top && (
                        <p className="mt-5 border-t border-white/[0.06] pt-4 text-xs text-muted">
                          <span className="font-semibold uppercase tracking-wider">{t.topVideo}:</span>{" "}
                          <span className="text-body-strong">{videoTitle(top, lang)}</span>
                        </p>
                      )}
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
              lang={lang}
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
