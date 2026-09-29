import type { Locale } from "@/i18n/config";
import type { GalleryVideo } from "@/components/sections/VideoGallery";
import { videoUrl } from "@/data/channel";
import type { LiveVideo } from "./youtube";
import { formatNumber, formatSeconds } from "./utils";

// Solo tipos de ./youtube: este archivo también se usa en el navegador.

/** Un video es "Nuevo" durante sus primeros 7 días. */
export const isNewVideo = (v: LiveVideo, now: Date) => now.getTime() - Date.parse(v.publishedAt) < 7 * 24 * 3600 * 1000;

export const videoTitle = (v: LiveVideo, lang: Locale) => (lang === "en" && v.titleEn ? v.titleEn : v.title);

export function toGalleryVideo(v: LiveVideo, lang: Locale, now: Date): GalleryVideo {
  return {
    id: v.id,
    title: videoTitle(v, lang),
    pillar: v.pillar,
    viewCount: v.views,
    views: formatNumber(lang, v.views),
    likes: v.likes === null ? null : formatNumber(lang, v.likes),
    comments: v.comments === null ? null : formatNumber(lang, v.comments),
    duration: v.durationSeconds ? formatSeconds(v.durationSeconds) : null,
    publishedAt: v.publishedAt,
    isNew: isNewVideo(v, now),
    thumb: v.thumb,
    url: videoUrl(v.id),
  };
}
