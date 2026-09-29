import { cache } from "react";
import { channelStats, perVideoViews as staticPerVideoViews, thumbnailUrl, videos as staticVideos, type PillarId } from "@/data/channel";
import { siteConfig } from "@/data/site";
import { classifyPillar } from "./pillars";

/**
 * Datos públicos del canal (YouTube Data API v3).
 *
 * - Suscriptores, vistas y número de videos: se consultan como máximo cada
 *   minuto (ruta /api/youtube/live, que el navegador vuelve a pedir cada 60 s).
 * - Lista de videos y estadísticas por video: cada 5 minutos.
 * - Los 25 más vistos de siempre: cada 6 horas (esa consulta cuesta 100 unidades).
 *
 * Orden de respaldo: API (YOUTUBE_API_KEY) → RSS público del canal → datos
 * guardados en src/data/channel.ts.
 */
export const YOUTUBE_CACHE_TAG = "youtube";
const COUNTERS_REVALIDATE = 60;
const VIDEOS_REVALIDATE = 300;
const POPULAR_REVALIDATE = 21600;

/** Videos de 3 minutos o menos se consideran Shorts. */
const SHORT_MAX_SECONDS = 180;

// Acepta también "YOTUBE_API_KEY" (así quedó escrita en Vercel la primera vez).
const apiKey = () => process.env.YOUTUBE_API_KEY || process.env.YOTUBE_API_KEY || "";

export type LiveVideo = {
  id: string;
  title: string;
  titleEn: string | null;
  publishedAt: string;
  views: number;
  likes: number | null;
  comments: number | null;
  durationSeconds: number | null;
  pillar: PillarId;
  thumb: string;
};

export type YoutubeData = {
  source: "api" | "rss" | "static";
  fetchedAt: string;
  subscribers: number;
  /** false cuando la cifra viene de los datos guardados, no de YouTube. */
  subscribersLive: boolean;
  totalViews: number;
  videoCount: number;
  /** Videos largos, del más reciente al más antiguo. */
  videos: LiveVideo[];
  /** Vistas por video para estimar campañas (mediana y promedio). */
  perVideoViews: { median: number; mean: number };
};

/** Lo que el navegador vuelve a pedir cada minuto. */
export type LiveSnapshot = {
  source: YoutubeData["source"];
  fetchedAt: string;
  subscribers: number;
  subscribersLive: boolean;
  totalViews: number;
  videoCount: number;
  latest: LiveVideo | null;
};

const known = new Map(staticVideos.map((v) => [v.id, v]));

function withKnownData(v: Omit<LiveVideo, "pillar" | "titleEn">): LiveVideo {
  const saved = known.get(v.id);
  return { ...v, titleEn: saved?.titleEn ?? null, pillar: saved?.pillar ?? classifyPillar(v.title) };
}

/** "PT12M14S" → 734 */
export function parseIsoDuration(iso: string): number {
  const m = /^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!m) return 0;
  const [, d, h, min, s] = m.map((x) => Number(x ?? 0));
  return d * 86400 + h * 3600 + min * 60 + s;
}

function decodeXml(text: string) {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number(dec)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

/** Mediana y promedio de los últimos 9 videos largos con al menos 7 días publicados. */
export function computePerVideoViews(videos: LiveVideo[], now: Date) {
  const weekAgo = now.getTime() - 7 * 24 * 3600 * 1000;
  const sample = videos
    .filter((v) => Date.parse(v.publishedAt) <= weekAgo)
    .slice(0, 9)
    .map((v) => v.views)
    .sort((a, b) => a - b);
  if (sample.length < 5) return staticPerVideoViews;
  const mid = Math.floor(sample.length / 2);
  const median = sample.length % 2 ? sample[mid] : Math.round((sample[mid - 1] + sample[mid]) / 2);
  const mean = Math.round(sample.reduce((a, b) => a + b, 0) / sample.length);
  return { median, mean };
}

/* ───────────── YouTube Data API v3 ───────────── */

const API = "https://www.googleapis.com/youtube/v3";

type ApiChannel = {
  items?: {
    statistics: { subscriberCount?: string; hiddenSubscriberCount?: boolean; viewCount: string; videoCount: string };
    contentDetails: { relatedPlaylists: { uploads: string } };
  }[];
};
type ApiPlaylist = { items?: { contentDetails: { videoId: string } }[] };
type ApiSearch = { items?: { id: { videoId: string } }[] };
type ApiVideos = {
  items?: {
    id: string;
    snippet: {
      title: string;
      publishedAt: string;
      liveBroadcastContent: string;
      thumbnails: Record<string, { url: string } | undefined>;
    };
    statistics: { viewCount?: string; likeCount?: string; commentCount?: string };
    contentDetails: { duration: string };
  }[];
};

export function videosFromApi(json: ApiVideos): LiveVideo[] {
  return (json.items ?? [])
    .filter((item) => item.snippet.liveBroadcastContent === "none")
    .map((item) => ({ item, seconds: parseIsoDuration(item.contentDetails.duration) }))
    .filter(({ seconds }) => seconds > SHORT_MAX_SECONDS)
    .map(({ item, seconds }) =>
      withKnownData({
        id: item.id,
        title: item.snippet.title,
        publishedAt: item.snippet.publishedAt,
        views: Number(item.statistics.viewCount ?? 0),
        likes: item.statistics.likeCount ? Number(item.statistics.likeCount) : null,
        comments: item.statistics.commentCount ? Number(item.statistics.commentCount) : null,
        durationSeconds: seconds,
        thumb:
          item.snippet.thumbnails.maxres?.url ??
          item.snippet.thumbnails.standard?.url ??
          item.snippet.thumbnails.high?.url ??
          thumbnailUrl(item.id),
      })
    )
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

async function getJson<T>(url: string, revalidate: number): Promise<T> {
  const res = await fetch(url, {
    next: { revalidate, tags: [YOUTUBE_CACHE_TAG] },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`YouTube ${res.status}: ${url.split("?")[0]}`);
  return res.json() as Promise<T>;
}

async function channelCounters(key: string, revalidate: number) {
  const channel = await getJson<ApiChannel>(
    `${API}/channels?part=statistics,contentDetails&id=${siteConfig.channelId}&key=${key}`,
    revalidate
  );
  const info = channel.items?.[0];
  if (!info) throw new Error("Canal no encontrado");
  const hidden = info.statistics.hiddenSubscriberCount || !info.statistics.subscriberCount;
  return {
    uploads: info.contentDetails.relatedPlaylists.uploads,
    subscribers: hidden ? channelStats.subscribers : Number(info.statistics.subscriberCount),
    subscribersLive: !hidden,
    totalViews: Number(info.statistics.viewCount),
    videoCount: Number(info.statistics.videoCount),
  };
}

async function videoDetails(ids: string[], key: string, revalidate: number) {
  const items: NonNullable<ApiVideos["items"]> = [];
  for (let i = 0; i < ids.length; i += 50) {
    const chunk = await getJson<ApiVideos>(
      `${API}/videos?part=snippet,statistics,contentDetails&id=${ids.slice(i, i + 50).join(",")}&key=${key}`,
      revalidate
    );
    items.push(...(chunk.items ?? []));
  }
  return videosFromApi({ items });
}

async function fromApi(key: string): Promise<YoutubeData> {
  const counters = await channelCounters(key, VIDEOS_REVALIDATE);
  const uploads = await getJson<ApiPlaylist>(
    `${API}/playlistItems?part=contentDetails&maxResults=50&playlistId=${counters.uploads}&key=${key}`,
    VIDEOS_REVALIDATE
  );
  const recentIds = (uploads.items ?? []).map((i) => i.contentDetails.videoId);

  // Los 25 más vistos de siempre, para que los clásicos no desaparezcan
  // cuando queden fuera de los 50 más recientes. Si falla, se sigue sin ellos.
  let popularIds: string[] = [];
  try {
    const popular = await getJson<ApiSearch>(
      `${API}/search?part=id&type=video&order=viewCount&maxResults=25&channelId=${siteConfig.channelId}&key=${key}`,
      POPULAR_REVALIDATE
    );
    popularIds = (popular.items ?? []).map((i) => i.id.videoId).filter(Boolean);
  } catch (error) {
    console.error("[youtube] búsqueda de populares no disponible:", (error as Error).message);
  }

  const now = new Date();
  const recent = new Set(recentIds);
  const apiVideos = await videoDetails([...new Set([...recentIds, ...popularIds])], key, VIDEOS_REVALIDATE);
  const liveIds = new Set(apiVideos.map((v) => v.id));
  const videos = [...apiVideos, ...fromStaticVideos().filter((v) => !liveIds.has(v.id))].sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
  );
  return {
    source: "api",
    fetchedAt: now.toISOString(),
    subscribers: counters.subscribers,
    subscribersLive: counters.subscribersLive,
    totalViews: counters.totalViews,
    videoCount: counters.videoCount,
    videos,
    perVideoViews: computePerVideoViews(apiVideos.filter((v) => recent.has(v.id)), now),
  };
}

/* ───────────── RSS público ───────────── */

export function videosFromRss(xml: string): LiveVideo[] {
  const entries = xml.split("<entry>").slice(1);
  return entries
    .map((entry) => {
      const pick = (re: RegExp) => re.exec(entry)?.[1];
      const id = pick(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const href = pick(/<link[^>]+rel="alternate"[^>]+href="([^"]+)"/) ?? "";
      if (!id || href.includes("/shorts/")) return null;
      return withKnownData({
        id,
        title: decodeXml(pick(/<title>([\s\S]*?)<\/title>/) ?? ""),
        publishedAt: pick(/<published>([^<]+)<\/published>/) ?? new Date(0).toISOString(),
        views: Number(pick(/<media:statistics[^>]*views="(\d+)"/) ?? 0),
        likes: entry.includes("<media:starRating") ? Number(pick(/<media:starRating[^>]*count="(\d+)"/) ?? 0) : null,
        comments: null,
        durationSeconds: null,
        thumb: thumbnailUrl(id),
      });
    })
    .filter((v): v is LiveVideo => v !== null)
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

async function rssVideos() {
  const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${siteConfig.channelId}`, {
    next: { revalidate: VIDEOS_REVALIDATE, tags: [YOUTUBE_CACHE_TAG] },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`RSS ${res.status}`);
  const list = videosFromRss(await res.text());
  if (!list.length) throw new Error("RSS sin videos");
  return list;
}

async function fromRss(): Promise<YoutubeData> {
  const latest = await rssVideos();
  // El RSS solo trae los 15 más recientes: se completa con los guardados.
  const ids = new Set(latest.map((v) => v.id));
  const videos = [...latest, ...fromStaticVideos().filter((v) => !ids.has(v.id))].sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
  );
  const now = new Date();
  return {
    source: "rss",
    fetchedAt: now.toISOString(),
    subscribers: channelStats.subscribers,
    subscribersLive: false,
    totalViews: channelStats.totalChannelViews,
    videoCount: channelStats.videos,
    videos,
    perVideoViews: computePerVideoViews(latest, now),
  };
}

/* ───────────── Datos guardados ───────────── */

function fromStaticVideos(): LiveVideo[] {
  return staticVideos
    .map((v) => ({
      id: v.id,
      title: v.title,
      titleEn: v.titleEn,
      publishedAt: `${v.publishedAt}T12:00:00Z`,
      views: v.views,
      likes: v.likes,
      comments: v.comments,
      durationSeconds: v.duration.split(":").reduce((acc, part) => acc * 60 + Number(part), 0),
      pillar: v.pillar,
      thumb: thumbnailUrl(v.id, "max"),
    }))
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

function fromStatic(): YoutubeData {
  return {
    source: "static",
    fetchedAt: new Date().toISOString(),
    subscribers: channelStats.subscribers,
    subscribersLive: false,
    totalViews: channelStats.totalChannelViews,
    videoCount: channelStats.videos,
    videos: fromStaticVideos(),
    perVideoViews: staticPerVideoViews,
  };
}

/** Todo lo público del canal. Una sola consulta por render. */
export const getYoutubeData = cache(async (): Promise<YoutubeData> => {
  const key = apiKey();
  if (key) {
    try {
      return await fromApi(key);
    } catch (error) {
      console.error("[youtube] API no disponible, uso RSS:", (error as Error).message);
    }
  }
  try {
    return await fromRss();
  } catch (error) {
    console.error("[youtube] RSS no disponible, uso datos guardados:", (error as Error).message);
  }
  return fromStatic();
});

/** Contadores + último video, para la actualización en vivo (cada minuto). */
export async function getLiveSnapshot(): Promise<LiveSnapshot> {
  const key = apiKey();
  if (key) {
    try {
      // Contadores cada minuto; el último video cada 5 minutos (cuida la cuota diaria).
      const counters = await channelCounters(key, COUNTERS_REVALIDATE);
      const uploads = await getJson<ApiPlaylist>(
        `${API}/playlistItems?part=contentDetails&maxResults=5&playlistId=${counters.uploads}&key=${key}`,
        VIDEOS_REVALIDATE
      );
      const ids = (uploads.items ?? []).map((i) => i.contentDetails.videoId);
      const latest = ids.length ? (await videoDetails(ids, key, VIDEOS_REVALIDATE))[0] ?? null : null;
      return {
        source: "api",
        fetchedAt: new Date().toISOString(),
        subscribers: counters.subscribers,
        subscribersLive: counters.subscribersLive,
        totalViews: counters.totalViews,
        videoCount: counters.videoCount,
        latest,
      };
    } catch (error) {
      console.error("[youtube] contadores no disponibles:", (error as Error).message);
    }
  }
  const data = await getYoutubeData();
  return {
    source: data.source,
    fetchedAt: data.fetchedAt,
    subscribers: data.subscribers,
    subscribersLive: data.subscribersLive,
    totalViews: data.totalViews,
    videoCount: data.videoCount,
    latest: data.videos[0] ?? null,
  };
}
