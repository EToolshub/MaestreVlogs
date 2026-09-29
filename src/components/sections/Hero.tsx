import { ArrowRight, TrendingUp, Tv } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Magnetic } from "@/components/ui/Magnetic";
import { WordRotator } from "@/components/ui/WordRotator";
import { Marquee } from "@/components/ui/Marquee";
import { YoutubeIcon } from "@/components/icons/SocialIcons";
import { Viewfinder } from "./Viewfinder";
import { siteConfig } from "@/data/site";
import { channelStats, derived, devices, thumbnailUrl, videos } from "@/data/channel";
import { formatCompact, formatNumber } from "@/lib/utils";

export function Hero({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.hero;
  const tv = devices.find((d) => d.id === "tv")!;

  const slides = videos.slice(0, 5).map((v) => ({
    id: v.id,
    title: lang === "en" ? v.titleEn : v.title,
    views: formatNumber(lang, v.views),
    thumb: thumbnailUrl(v.id, "max"),
  }));

  return (
    <section className="relative -mt-[4.25rem] overflow-hidden pt-[4.25rem]">
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_15%,black,transparent)]" />
      <div className="pointer-events-none absolute -top-40 right-[-10%] h-[560px] w-[560px] rounded-full bg-brand-400/20 blur-[140px]" />
      <div className="pointer-events-none absolute -left-40 top-1/2 h-80 w-80 rounded-full bg-world-500/15 blur-[120px]" />
      <div className="bg-noise pointer-events-none absolute inset-0 hidden sm:block" />

      <Container className="relative grid items-center gap-12 pb-14 pt-12 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pb-20">
        <div>
          <span className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-2 pr-4 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-body-strong backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rec-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rec-400" />
            </span>
            {t.badge}
          </span>

          <h1 className="font-display mt-7 text-[3.4rem] leading-[0.9] text-heading sm:text-7xl lg:text-[5.6rem]">
            <span className="block">{t.titleLead}</span>
            <WordRotator words={t.rotating} className="text-brand-400" />
          </h1>

          <p className="text-pretty mt-7 max-w-xl text-lg leading-relaxed text-body">{t.subtitle}</p>

          <div className="no-print mt-9 flex flex-col gap-3 sm:flex-row">
            <Magnetic>
              <Button href="#contacto" size="lg" icon={<ArrowRight className="h-5 w-5" />} iconPosition="right" className="w-full sm:w-auto">
                {t.ctaPrimary}
              </Button>
            </Magnetic>
            <Button
              href={siteConfig.social.youtube}
              variant="secondary"
              size="lg"
              icon={<YoutubeIcon className="h-5 w-5 text-rec-400" />}
            >
              {t.ctaSecondary}
            </Button>
          </div>

          <dl className="mt-10 grid max-w-xl grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-ink-900/60 backdrop-blur">
            <TrustStat value={formatNumber(lang, channelStats.subscribers)} label={t.trustSubs} />
            <TrustStat value={formatCompact(lang, channelStats.views)} label={t.trustViews} />
            <TrustStat value={`${formatNumber(lang, derived.engagementRate, 1)}%`} label={t.trustEngagement} />
          </dl>
        </div>

        <div className="relative">
          <Viewfinder
            slides={slides}
            labels={{ location: t.location, next: t.next, topVideo: t.topVideo, views: t.views }}
          />

          <div className="no-print pointer-events-none absolute -left-4 -top-5 hidden animate-float items-center gap-2 rounded-2xl border border-white/10 bg-ink-850/90 px-4 py-3 text-sm font-semibold shadow-2xl backdrop-blur-md sm:flex lg:-left-10">
            <TrendingUp className="h-4 w-4 text-brand-400" aria-hidden />
            <span className="text-heading">×{formatNumber(lang, derived.growthMultiple, 1)}</span>
            <span className="text-body">{t.growthChip}</span>
          </div>
          <div
            style={{ animationDelay: "1.4s" }}
            className="no-print pointer-events-none absolute -right-3 top-[38%] hidden animate-float items-center gap-2 rounded-2xl border border-white/10 bg-ink-850/90 px-4 py-3 text-sm font-semibold shadow-2xl backdrop-blur-md sm:flex lg:-right-8"
          >
            <Tv className="h-4 w-4 text-world-400" aria-hidden />
            <span className="text-heading">{formatNumber(lang, Math.round(tv.views))}%</span>
            <span className="text-body">{t.tvChip}</span>
          </div>
        </div>
      </Container>

      {/* Cinta de precaución con los lugares grabados */}
      <div className="relative -mx-4 -rotate-[1.5deg] border-y-2 border-ink-950 bg-brand-400 py-3 sm:py-4">
        <Marquee
          items={dict.places}
          itemClassName="font-display text-2xl uppercase text-ink-950 sm:text-3xl"
          separatorClassName="bg-ink-950"
        />
      </div>
      <div className="bg-caution h-3 opacity-80" aria-hidden />
    </section>
  );
}

function TrustStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col-reverse px-3 py-4 text-center sm:px-5">
      <dt className="mt-0.5 text-[11px] leading-tight text-muted sm:text-xs">{label}</dt>
      <dd className="text-xl font-extrabold text-heading sm:text-2xl">{value}</dd>
    </div>
  );
}
