"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Eye, MessageSquareText, Play, ThumbsUp } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { TimeAgo } from "@/components/ui/TimeAgo";
import type { GalleryVideo } from "./VideoGallery";
import { PlayerDialog } from "./PlayerDialog";

/** Tarjeta del último video subido, con reproductor integrado. */
export function LatestVideoCard({
  lang,
  video,
  labels,
}: {
  lang: Locale;
  video: GalleryVideo;
  labels: { latest: string; newBadge: string; published: string; watchHere: string; watchOnYoutube: string; close: string; views: string };
}) {
  const [open, setOpen] = useState(false);

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-card">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block aspect-video w-full overflow-hidden bg-gradient-to-br from-ink-700 to-ink-900"
        aria-label={`${labels.watchHere}: ${video.title}`}
      >
        <Image
          src={video.thumb}
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 640px, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
        <span className="absolute left-4 top-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded bg-black/60 px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-white backdrop-blur">
            <span className="h-2 w-2 animate-rec rounded-full bg-rec-400" />
            {labels.latest}
          </span>
          {video.isNew && (
            <span className="rounded bg-rec-400 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
              {labels.newBadge}
            </span>
          )}
        </span>
        {video.duration && (
          <span className="absolute bottom-4 right-4 rounded bg-black/75 px-1.5 py-0.5 font-mono text-xs font-semibold text-white">
            {video.duration}
          </span>
        )}
        <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand-400 text-ink-950 shadow-[0_10px_40px_-5px_rgb(255_194_26/0.6)] transition-transform duration-300 group-hover:scale-110">
          <Play className="ml-1 h-7 w-7 fill-current" aria-hidden />
        </span>
      </button>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-pretty text-lg font-bold leading-snug text-heading sm:text-xl">{video.title}</h3>
        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
          <span>
            {labels.published} <TimeAgo iso={video.publishedAt} locale={lang} className="text-body-strong" />
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Eye className="h-4 w-4" aria-hidden />
            <span className="font-semibold text-body-strong">{video.views}</span> {labels.views}
          </span>
          {video.likes && (
            <span className="inline-flex items-center gap-1.5">
              <ThumbsUp className="h-4 w-4" aria-hidden />
              {video.likes}
            </span>
          )}
          {video.comments && (
            <span className="inline-flex items-center gap-1.5">
              <MessageSquareText className="h-4 w-4" aria-hidden />
              {video.comments}
            </span>
          )}
        </p>
        <div className="no-print mt-5 flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-400 px-6 font-bold text-ink-950 transition-all hover:-translate-y-0.5 hover:bg-brand-300"
          >
            <Play className="h-4 w-4 fill-current" aria-hidden />
            {labels.watchHere}
          </button>
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-ink-600 px-6 font-bold text-heading transition-all hover:-translate-y-0.5 hover:border-brand-400/60"
          >
            {labels.watchOnYoutube}
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>

      <PlayerDialog
        video={open ? { id: video.id, title: video.title, url: video.url } : null}
        onClose={() => setOpen(false)}
        labels={labels}
      />
    </article>
  );
}
