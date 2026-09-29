"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BatteryMedium, MapPin, Plane } from "lucide-react";

type Slide = { id: string; title: string; views: string; thumb: string };

/**
 * Visor de cámara: pasa por los videos más vistos con la interfaz de una
 * cámara grabando (REC, código de tiempo, batería, ubicación).
 */
export function Viewfinder({
  slides,
  labels,
}: {
  slides: Slide[];
  labels: { location: string; next: string; topVideo: string; views: string };
}) {
  const [index, setIndex] = useState(0);
  const [frames, setFrames] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), 4200);
    return () => window.clearInterval(id);
  }, [slides.length, reduce]);

  useEffect(() => {
    if (reduce) return;
    const start = performance.now();
    const id = window.setInterval(() => setFrames(Math.floor(((performance.now() - start) / 1000) * 30)), 100);
    return () => window.clearInterval(id);
  }, [reduce]);

  // Código de tiempo HH:MM:SS:FF que arranca en 00:12:14 (duración del video más visto).
  const total = 12 * 60 * 30 + 14 * 30 + frames;
  const ff = total % 30;
  const ss = Math.floor(total / 30) % 60;
  const mm = Math.floor(total / 1800) % 60;
  const hh = Math.floor(total / 108000);
  const timecode = [hh, mm, ss, ff].map((n) => String(n).padStart(2, "0")).join(":");

  const slide = slides[index];

  return (
    <figure className="relative">
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-ink-700 via-ink-850 to-ink-950 shadow-[0_40px_120px_-30px_rgb(255_194_26/0.28)]">
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={slide.thumb}
              alt={slide.title}
              fill
              priority={index === 0}
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Capa HUD */}
        <div className="bg-scanlines pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/45" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-10 animate-scan bg-gradient-to-b from-transparent via-white/[0.05] to-transparent" />

        <span className="viewfinder-corner left-3 top-3 rounded-tl-md border-l-2 border-t-2" />
        <span className="viewfinder-corner right-3 top-3 rounded-tr-md border-r-2 border-t-2" />
        <span className="viewfinder-corner bottom-3 left-3 rounded-bl-md border-b-2 border-l-2" />
        <span className="viewfinder-corner bottom-3 right-3 rounded-br-md border-b-2 border-r-2" />

        {/* Centro: retícula de enfoque */}
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2">
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/50" />
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/50" />
        </div>

        <div className="absolute inset-x-5 top-5 flex items-center justify-between font-mono text-[11px] font-semibold tracking-widest text-white sm:inset-x-7 sm:top-6 sm:text-xs">
          <span className="flex items-center gap-2 rounded bg-black/40 px-2 py-1 backdrop-blur">
            <span className="h-2.5 w-2.5 animate-rec rounded-full bg-rec-400" />
            REC
          </span>
          <span className="hidden tabular-nums sm:inline" aria-hidden>
            {timecode}
          </span>
          <span className="flex items-center gap-2 rounded bg-black/40 px-2 py-1 backdrop-blur">
            4K · 30
            <BatteryMedium className="h-4 w-4" aria-hidden />
          </span>
        </div>

        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3 sm:inset-x-7 sm:bottom-6">
          <div className="flex flex-col gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest sm:text-[11px]">
            <span className="inline-flex w-fit items-center gap-1.5 rounded bg-brand-400 px-2 py-1 text-ink-950">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {labels.location}
            </span>
            <span className="inline-flex w-fit items-center gap-1.5 rounded bg-world-500 px-2 py-1 text-white">
              <Plane className="h-3.5 w-3.5" aria-hidden />
              {labels.next} · ???
            </span>
          </div>
          <span className="font-mono text-[11px] tabular-nums text-white/80 sm:hidden" aria-hidden>
            {timecode}
          </span>
        </div>
      </div>

      <figcaption className="mt-4 flex items-start justify-between gap-4 px-1">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            {index === 0 ? labels.topVideo : `0${index + 1} / 0${slides.length}`}
          </p>
          <p className="mt-1 line-clamp-1 text-sm font-semibold text-body-strong">{slide.title}</p>
        </div>
        <p className="shrink-0 text-right text-sm font-bold text-heading">
          {slide.views} <span className="font-medium text-muted">{labels.views}</span>
        </p>
      </figcaption>

      <div className="mt-3 flex gap-1.5 px-1" aria-hidden>
        {slides.map((s, i) => (
          <span
            key={s.id}
            className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i === index ? "bg-brand-400" : "bg-white/10"}`}
          />
        ))}
      </div>
    </figure>
  );
}
