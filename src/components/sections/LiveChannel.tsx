import { Clapperboard, Eye, Radio } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Container } from "@/components/ui/Container";
import { CountUp } from "@/components/ui/CountUp";
import { FadeIn } from "@/components/ui/FadeIn";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { TimeAgo } from "@/components/ui/TimeAgo";
import { YoutubeIcon } from "@/components/icons/SocialIcons";
import { LatestVideoCard } from "./LatestVideoCard";
import { siteConfig } from "@/data/site";
import type { YoutubeData } from "@/lib/youtube";
import { toGalleryVideo } from "@/lib/video-view";
import { fill, formatNumber } from "@/lib/utils";

const milestones = [1000, 2500, 5000, 10_000, 25_000, 50_000, 100_000, 250_000, 500_000, 1_000_000];

/** Suscriptores y último video, tomados de YouTube (se regenera cada 6 h). */
export function LiveChannel({ lang, dict, yt }: { lang: Locale; dict: Dictionary; yt: YoutubeData }) {
  const t = dict.live;
  const latest = yt.videos[0] ? toGalleryVideo(yt.videos[0], lang, new Date(yt.fetchedAt)) : null;
  const isLive = yt.source !== "static";
  const goal = milestones.find((m) => m > yt.subscribers) ?? yt.subscribers;
  const previous = [...milestones].reverse().find((m) => m <= yt.subscribers) ?? 0;
  const progress = goal > previous ? Math.min(1, (yt.subscribers - previous) / (goal - previous)) : 1;

  return (
    <section id="en-vivo" className="relative border-b border-white/[0.06] py-20 sm:py-24">
      <div className="pointer-events-none absolute right-[10%] top-10 h-80 w-80 rounded-full bg-rec-400/10 blur-[130px]" />
      <Container className="relative">
        <FadeIn>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>{t.eyebrow}</Eyebrow>
              <h2 className="font-display mt-4 text-[2.6rem] leading-[0.95] text-heading sm:text-6xl">
                {t.title} <span className="text-brand-400">{t.highlight}</span>
              </h2>
            </div>
            <p className="flex items-center gap-2 text-sm text-muted">
              <Radio className={isLive ? "h-4 w-4 text-rec-400" : "h-4 w-4 text-subtle"} aria-hidden />
              {isLive ? (
                <span>
                  {t.updated} <TimeAgo iso={yt.fetchedAt} locale={lang} className="font-semibold text-body-strong" /> ·{" "}
                  {t.refreshNote}
                </span>
              ) : (
                <span>{t.savedNote}</span>
              )}
            </p>
          </div>
        </FadeIn>

        <div className="mt-10 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <FadeIn className="h-full">
            <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-gradient-to-br from-rec-500/[0.12] via-ink-850 to-ink-850 p-6 sm:p-8">
              <p className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                <YoutubeIcon className="h-5 w-5 text-rec-400" />
                {siteConfig.social.youtubeHandle}
              </p>
              <p className="mt-6 text-6xl font-extrabold tracking-tight text-heading sm:text-7xl">
                <CountUp to={yt.subscribers} locale={lang} duration={2} />
              </p>
              <p className="mt-1 text-lg font-semibold text-body-strong">{t.subscribers}</p>

              <dl className="mt-8 grid grid-cols-2 gap-3 border-t border-white/[0.08] pt-6">
                <div className="flex flex-col-reverse gap-1">
                  <dt className="flex items-center gap-1.5 text-xs text-muted">
                    <Eye className="h-3.5 w-3.5" aria-hidden />
                    {t.totalViews}
                  </dt>
                  <dd className="text-2xl font-extrabold text-heading">{formatNumber(lang, yt.totalViews)}</dd>
                </div>
                <div className="flex flex-col-reverse gap-1">
                  <dt className="flex items-center gap-1.5 text-xs text-muted">
                    <Clapperboard className="h-3.5 w-3.5" aria-hidden />
                    {t.videos}
                  </dt>
                  <dd className="text-2xl font-extrabold text-heading">{formatNumber(lang, yt.videoCount)}</dd>
                </div>
              </dl>

              {/* Medidor: el relleno avanza hacia la siguiente meta de suscriptores */}
              <div className="mt-8">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-semibold text-body-strong">
                    {t.nextGoal}: {formatNumber(lang, goal)}
                  </span>
                  <span className="text-muted">{fill(t.remaining, { n: formatNumber(lang, Math.max(0, goal - yt.subscribers)) })}</span>
                </div>
                <div
                  role="meter"
                  aria-label={t.nextGoal}
                  aria-valuemin={previous}
                  aria-valuemax={goal}
                  aria-valuenow={yt.subscribers}
                  className="mt-2.5 h-3 overflow-hidden rounded-full bg-brand-400/15"
                >
                  <div className="h-full rounded-full bg-brand-400" style={{ width: `${Math.round(progress * 100)}%` }} />
                </div>
              </div>

              <div className="min-h-8 flex-1" aria-hidden />
              <a
                href={`${siteConfig.social.youtube}?sub_confirmation=1`}
                target="_blank"
                rel="noopener noreferrer"
                className="no-print inline-flex h-12 items-center justify-center gap-2 rounded-full bg-rec-500 px-6 font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-rec-400"
              >
                <YoutubeIcon className="h-5 w-5" />
                {t.subscribe}
              </a>
            </div>
          </FadeIn>

          {latest && (
            <FadeIn delay={0.08} className="h-full">
              <LatestVideoCard
                lang={lang}
                video={latest}
                labels={{
                  latest: t.latest,
                  newBadge: t.newBadge,
                  published: t.published,
                  watchHere: t.watchHere,
                  watchOnYoutube: t.watchOnYoutube,
                  close: t.close,
                  views: dict.videos.views,
                }}
              />
            </FadeIn>
          )}
        </div>
      </Container>
    </section>
  );
}
