"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Clapperboard, Eye, HeartHandshake, UserPlus } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { YoutubeIcon } from "@/components/icons/SocialIcons";
import { LatestVideoCard } from "./LatestVideoCard";
import type { LiveSnapshot } from "@/lib/youtube";
import { milestoneProgress, reachedMilestones } from "@/lib/milestones";
import { toGalleryVideo } from "@/lib/video-view";
import { fill, formatNumber } from "@/lib/utils";

const POLL_MS = 60_000;

/**
 * Suscriptores, vistas, metas y último video. Arranca con los datos que
 * generó el servidor y luego vuelve a preguntar a /api/youtube/live cada
 * minuto mientras la pestaña está visible.
 */
export function LivePanel({
  lang,
  initial,
  t,
  viewsLabel,
  youtubeUrl,
  handle,
}: {
  lang: Locale;
  initial: LiveSnapshot;
  t: Dictionary["live"];
  viewsLabel: string;
  youtubeUrl: string;
  handle: string;
}) {
  const [snap, setSnap] = useState(initial);
  const [now, setNow] = useState<number | null>(null);
  const [gain, setGain] = useState(0);
  const lastCheck = useRef(0);
  const subsRef = useRef(initial.subscribers);

  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      if (document.hidden) return;
      lastCheck.current = Date.now();
      try {
        const res = await fetch("/api/youtube/live", { cache: "no-store" });
        if (!res.ok) return;
        const next = (await res.json()) as LiveSnapshot;
        if (cancelled) return;
        if (next.subscribers > subsRef.current) setGain(next.subscribers - subsRef.current);
        subsRef.current = next.subscribers;
        setSnap(next);
      } catch {
        // Sin conexión: se mantienen los últimos datos.
      }
    }
    refresh();
    const poll = window.setInterval(refresh, POLL_MS);
    const clock = window.setInterval(() => setNow(Date.now()), 5000);
    const onVisible = () => {
      if (!document.hidden && Date.now() - lastCheck.current > POLL_MS - 5000) refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    const firstTick = window.setTimeout(() => setNow(Date.now()), 0);
    return () => {
      cancelled = true;
      window.clearTimeout(firstTick);
      window.clearInterval(poll);
      window.clearInterval(clock);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  useEffect(() => {
    if (!gain) return;
    const id = window.setTimeout(() => setGain(0), 4500);
    return () => window.clearTimeout(id);
  }, [gain]);

  const isLive = snap.source !== "static";
  const seconds = now ? Math.max(0, Math.round((now - Date.parse(snap.fetchedAt)) / 1000)) : null;
  const ago =
    seconds === null
      ? ""
      : seconds < 10
        ? t.justNow
        : seconds < 120
          ? fill(t.secondsAgo, { n: seconds })
          : new Intl.RelativeTimeFormat(lang, { numeric: "auto" }).format(-Math.round(seconds / 60), "minute");

  const { goal, from, progress, remaining } = milestoneProgress(snap.subscribers);
  const reached = reachedMilestones(snap.subscribers).slice(-4);
  const latest = snap.latest ? toGalleryVideo(snap.latest, lang, new Date()) : null;

  return (
    <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="relative flex h-full flex-col rounded-3xl border border-white/10 bg-gradient-to-br from-rec-500/[0.12] via-ink-850 to-ink-850 p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            <YoutubeIcon className="h-5 w-5 text-rec-400" />
            {handle}
          </p>
          {isLive && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rec-500/15 px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-rec-300">
              <span className="h-2 w-2 animate-rec rounded-full bg-rec-400" />
              {t.liveBadge}
            </span>
          )}
        </div>

        <div className="relative mt-6">
          <p className="text-6xl font-extrabold tracking-tight text-heading sm:text-7xl" aria-live="polite">
            <AnimatedNumber value={snap.subscribers} locale={lang} />
          </p>
          <AnimatePresence>
            {gain > 0 && (
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute -top-3 right-0 inline-flex items-center gap-1.5 rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-ink-950 shadow-lg"
              >
                <UserPlus className="h-3.5 w-3.5" aria-hidden />+{gain} · {t.newSubs}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <p className="mt-1 text-lg font-semibold text-body-strong">{t.subscribers}</p>
        <p className="mt-2 text-xs text-muted">
          {isLive ? (
            <>
              {t.updated} <span className="font-semibold text-body-strong">{ago}</span> · {t.refreshNote}
            </>
          ) : (
            t.savedNote
          )}
        </p>

        <dl className="mt-7 grid grid-cols-2 gap-3 border-t border-white/[0.08] pt-6">
          <div className="flex flex-col-reverse gap-1">
            <dt className="flex items-center gap-1.5 text-xs text-muted">
              <Eye className="h-3.5 w-3.5" aria-hidden />
              {t.totalViews}
            </dt>
            <dd className="text-2xl font-extrabold text-heading">
              <AnimatedNumber value={snap.totalViews} locale={lang} />
            </dd>
          </div>
          <div className="flex flex-col-reverse gap-1">
            <dt className="flex items-center gap-1.5 text-xs text-muted">
              <Clapperboard className="h-3.5 w-3.5" aria-hidden />
              {t.videos}
            </dt>
            <dd className="text-2xl font-extrabold text-heading">
              <AnimatedNumber value={snap.videoCount} locale={lang} />
            </dd>
          </div>
        </dl>

        {/* Medidor: avanza hacia la siguiente meta y la meta cambia sola al alcanzarla */}
        <div className="mt-7">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="font-semibold text-body-strong">
              {t.nextGoal}: {formatNumber(lang, goal)}
            </span>
            <span className="text-muted">{fill(t.remaining, { n: formatNumber(lang, remaining) })}</span>
          </div>
          <div
            role="meter"
            aria-label={t.nextGoal}
            aria-valuemin={from}
            aria-valuemax={goal}
            aria-valuenow={snap.subscribers}
            className="mt-2.5 h-3 overflow-hidden rounded-full bg-brand-400/15"
          >
            <motion.div
              className="h-full rounded-full bg-brand-400"
              initial={false}
              animate={{ width: `${Math.round(progress * 100)}%` }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          {reached.length > 0 && (
            <p className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-muted">
              <span>{t.reached}:</span>
              {reached.map((m) => (
                <span key={m} className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-2 py-0.5 font-semibold text-body-strong">
                  <Check className="h-3 w-3 text-emerald-400" aria-hidden />
                  {formatNumber(lang, m)}
                </span>
              ))}
            </p>
          )}
        </div>

        <div className="min-h-8 flex-1" aria-hidden />
        <div className="no-print grid gap-2.5 sm:grid-cols-2">
          <a
            href={`${youtubeUrl}?sub_confirmation=1`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-rec-500 px-5 font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-rec-400"
          >
            <YoutubeIcon className="h-5 w-5" />
            {t.subscribe}
          </a>
          <a
            href="#apoyo"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-ink-600 px-5 font-bold text-heading transition-all hover:-translate-y-0.5 hover:border-brand-400/60"
          >
            <HeartHandshake className="h-5 w-5 text-brand-400" aria-hidden />
            {t.support}
          </a>
        </div>
      </div>

      {latest && (
        <LatestVideoCard
          key={latest.id}
          lang={lang}
          video={latest}
          labels={{
            latest: t.latest,
            newBadge: t.newBadge,
            published: t.published,
            watchHere: t.watchHere,
            watchOnYoutube: t.watchOnYoutube,
            close: t.close,
            views: viewsLabel,
          }}
        />
      )}
    </div>
  );
}
