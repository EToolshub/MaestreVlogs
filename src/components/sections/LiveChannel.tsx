import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { LivePanel } from "./LivePanel";
import { siteConfig } from "@/data/site";
import type { YoutubeData } from "@/lib/youtube";

/** Suscriptores y último video, en vivo desde YouTube. */
export function LiveChannel({ lang, dict, yt }: { lang: Locale; dict: Dictionary; yt: YoutubeData }) {
  const t = dict.live;
  return (
    <section id="en-vivo" className="relative border-b border-white/[0.06] py-20 sm:py-24">
      <div className="pointer-events-none absolute right-[10%] top-10 h-80 w-80 rounded-full bg-rec-400/10 blur-[130px]" />
      <Container className="relative">
        <FadeIn>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <h2 className="font-display mt-4 text-[2.6rem] leading-[0.95] text-heading sm:text-6xl">
            {t.title} <span className="text-brand-400">{t.highlight}</span>
          </h2>
        </FadeIn>
        <div className="mt-10">
          <LivePanel
            lang={lang}
            t={t}
            viewsLabel={dict.videos.views}
            youtubeUrl={siteConfig.social.youtube}
            handle={siteConfig.social.youtubeHandle}
            initial={{
              source: yt.source,
              fetchedAt: yt.fetchedAt,
              subscribers: yt.subscribers,
              subscribersLive: yt.subscribersLive,
              totalViews: yt.totalViews,
              videoCount: yt.videoCount,
              latest: yt.videos[0] ?? null,
            }}
          />
        </div>
      </Container>
    </section>
  );
}
