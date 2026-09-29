"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Eye, MessageSquareText, Play, ThumbsUp, X } from "lucide-react";
import type { PillarId } from "@/data/channel";
import { cn } from "@/lib/utils";

export type GalleryVideo = {
  id: string;
  title: string;
  pillar: PillarId;
  views: string;
  likes: string;
  comments: string;
  duration: string;
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
};

const INITIAL = 9;

export function VideoGallery({
  videos,
  pillars,
  labels,
}: {
  videos: GalleryVideo[];
  pillars: { id: PillarId; name: string }[];
  labels: Labels;
}) {
  const [filter, setFilter] = useState<PillarId | "all">("all");
  const [showAll, setShowAll] = useState(false);
  const [playing, setPlaying] = useState<GalleryVideo | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const filtered = filter === "all" ? videos : videos.filter((v) => v.pillar === filter);
  const visible = showAll || filter !== "all" ? filtered : filtered.slice(0, INITIAL);
  const pillarName = (id: PillarId) => pillars.find((p) => p.id === id)?.name ?? id;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (playing && !dialog.open) dialog.showModal();
    if (!playing && dialog.open) dialog.close();
  }, [playing]);

  return (
    <div>
      <div role="group" aria-label={labels.filterLabel} className="no-print -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {[{ id: "all" as const, name: labels.all }, ...pillars].map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={filter === p.id}
            onClick={() => setFilter(p.id)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
              filter === p.id
                ? "border-brand-400 bg-brand-400 text-ink-950"
                : "border-ink-600 text-body hover:border-brand-400/50 hover:text-heading"
            )}
          >
            {p.name}
          </button>
        ))}
      </div>

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
                onClick={() => setPlaying(video)}
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
                  <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                    {pillarName(video.pillar)}
                  </span>
                  <span className="absolute bottom-3 right-3 rounded bg-black/75 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-white">
                    {video.duration}
                  </span>
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
                  <span className="inline-flex items-center gap-1.5">
                    <ThumbsUp className="h-4 w-4" aria-hidden />
                    {video.likes}
                    <span className="sr-only">{labels.likes}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MessageSquareText className="h-4 w-4" aria-hidden />
                    {video.comments}
                    <span className="sr-only">{labels.comments}</span>
                  </span>
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {filter === "all" && !showAll && filtered.length > INITIAL && (
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

      <dialog
        ref={dialogRef}
        onClose={() => setPlaying(null)}
        onClick={(e) => e.target === e.currentTarget && setPlaying(null)}
        aria-label={playing?.title}
        className="m-auto w-[min(100%-2rem,960px)] overflow-visible bg-transparent p-0 text-heading backdrop:bg-black/85 backdrop:backdrop-blur-sm"
      >
        {playing && (
          <div>
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="line-clamp-1 font-semibold text-white">{playing.title}</p>
              <button
                type="button"
                onClick={() => setPlaying(null)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                aria-label={labels.close}
                autoFocus
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${playing.id}?autoplay=1&rel=0`}
                title={playing.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <a
              href={playing.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300 hover:text-brand-200"
            >
              {labels.watchOnYoutube}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        )}
      </dialog>
    </div>
  );
}
