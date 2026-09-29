"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight, X } from "lucide-react";

export type PlayableVideo = { id: string; title: string; url: string };

/** Reproductor de YouTube (modo privacidad mejorada) en un diálogo modal. */
export function PlayerDialog({
  video,
  onClose,
  labels,
}: {
  video: PlayableVideo | null;
  onClose: () => void;
  labels: { close: string; watchOnYoutube: string };
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (video && !dialog.open) dialog.showModal();
    if (!video && dialog.open) dialog.close();
  }, [video]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-label={video?.title}
      className="m-auto w-[min(100%-2rem,960px)] overflow-visible bg-transparent p-0 text-heading backdrop:bg-black/85 backdrop:backdrop-blur-sm"
    >
      {video && (
        <div>
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="line-clamp-1 font-semibold text-white">{video.title}</p>
            <button
              type="button"
              onClick={onClose}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label={labels.close}
              autoFocus
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
          <a
            href={video.url}
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
  );
}
