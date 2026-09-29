"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Eye, MessageSquareText, Play, RefreshCw, ThumbsUp } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { PillarId } from "@/data/channel";
import { TimeAgo } from "@/components/ui/TimeAgo";
import { PlayerDialog, type PlayableVideo } from "./PlayerDialog";
import { cn } from "@/lib/utils";

export type GalleryVideo = {
  id: string;
  title: string;
  pillar: PillarId;
  viewCount: number;
  views: string;
  likes: string | null;
  comments: string | null;
  duration: string | null;
  publishedAt: string;
  isNew: boolean;
  thumb: string;
  url: string;
};

type Labels = {
  all: string;
  views: string;
  likes: string;
  comments: string;
  play: string;
  close: string;
  watchOnYoutube: string;
  filterLabel: string;
  more: string;
  tabsLabel: string;
  tabRecent: string;
  tabPopular: string;
  newBadge: string;
  autoNote: string;
};

const INITIAL = 9;

/**
 * Galería de videos. Recibe la lista ya ordenada del más reciente al más
 * antiguo (viene de YouTube y se actualiza sola); "Más vistos" la reordena.
 */
export function VideoGallery({
  lang,
  videos,
  pillars,
  labels,
}: {
  lang: Locale;
  videos: GalleryVideo[];
  pillars: { id: PillarId; name: string }[];
  labels: Labels;
}) {
  const [order, setOrder] = useState<"recent" | "popular">("recent");
  const [filter, setFilter] = useState<PillarId | "all">("all");
  const [showAll, setShowAll] = useState(false);
  const [playing, setPlaying] = useState<PlayableVideo | null>(null);

  const filtered = useMemo(() => {
    const list = filter === "all" ? videos : videos.filter((v) => v.pillar === filter);
    return order === "popular" ? [...list].sort((a, b) => b.viewCount - a.viewCount) : list;
  }, [videos, filter, order]);

  const visible = showAll ? filtered : filtered.slice(0, INITIAL);
  const pillarName = (id: PillarId) => pillars.find((p) => p.id === id)?.name ?? id;
  const availablePillars = pillars.filter((p) => videos.some((v) => v.pillar === p.id));

  return (
    <div>
      <div className="no-print flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="tablist" aria-label={labels.tabsLabel} className="inline-flex w-fit rounded-full border border-ink-600 bg-ink-900 p-1">
          {(["recent", "popular"] as const).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={order === key}
              onClick={() => setOrder(key)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-bold transition-colors",
                order === key ? "bg-brand-400 text-ink-950" : "text-body hover:text-heading"
              )}
            >
              {key === "recent" ? labels.tabRecent : labels.tabPopular}
            </button>
          ))}
        </div>

        <div role="group" aria-label={labels.filterLabel} className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {[{ id: "all" as const, name: labels.all }, ...availablePillars].map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={filter === p.id}
              onClick={() => setFilter(p.id)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                filter === p.id
                  ? "border-brand-400/70 bg-brand-400/15 text-brand-200"
                  : "border-ink-600 text-body hover:border-brand-400/50 hover:text-heading"
              )}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 flex items-center gap-2 text-xs text-muted">
        <RefreshCw className="h-3.5 w-3.5" aria-hidden />
        {labels.autoNote}
      </p>

      <motion.ul layout className="mt-8 grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((video) => (
            <motion.li
              key={video.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
            >
              <button
                type="button"
                onClick={() => setPlaying({ id: video.id, title: video.title, url: video.url })}
                className="group block w-full text-left"
                aria-label={`${labels.play}: ${video.title}`}
              >
                <span className="relative block aspect-video overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-ink-700 to-ink-900">
                  <Image
                    src={video.thumb}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  <span className="absolute left-3 top-3 flex gap-1.5">
                    {video.isNew && (
                      <span className="rounded-full bg-rec-400 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                        {labels.newBadge}
                      </span>
                    )}
                    <span className="rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                      {pillarName(video.pillar)}
                    </span>
                  </span>
                  {video.duration && (
                    <span className="absolute bottom-3 right-3 rounded bg-black/75 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-white">
                      {video.duration}
                    </span>
                  )}
                  <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 scale-90 place-items-center rounded-full bg-brand-400 text-ink-950 opacity-0 shadow-2xl transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                    <Play className="ml-0.5 h-6 w-6 fill-current" aria-hidden />
                  </span>
                </span>
                <span className="mt-4 line-clamp-2 block font-semibold leading-snug text-heading transition-colors group-hover:text-brand-300">
                  {video.title}
                </span>
                <span className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Eye className="h-4 w-4" aria-hidden />
                    <span className="font-semibold text-body-strong">{video.views}</span> {labels.views}
                  </span>
                  {video.likes && (
                    <span className="inline-flex items-center gap-1.5">
                      <ThumbsUp className="h-4 w-4" aria-hidden />
                      {video.likes}
                      <span className="sr-only">{labels.likes}</span>
                    </span>
                  )}
                  {video.comments && (
                    <span className="inline-flex items-center gap-1.5">
                      <MessageSquareText className="h-4 w-4" aria-hidden />
                      {video.comments}
                      <span className="sr-only">{labels.comments}</span>
                    </span>
                  )}
                  <TimeAgo iso={video.publishedAt} locale={lang} className="text-subtle" />
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {!showAll && filtered.length > INITIAL && (
        <div className="no-print mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-2 rounded-full border border-ink-600 px-5 py-2.5 text-sm font-semibold text-body-strong transition-colors hover:border-brand-400/60 hover:text-heading"
          >
            {labels.more} ({filtered.length - INITIAL})
            <ChevronDown className="h-4 w-4" aria-hidden />
          </button>
        </div>
      )}

      <PlayerDialog video={playing} onClose={() => setPlaying(null)} labels={labels} />
    </div>
  );
}
