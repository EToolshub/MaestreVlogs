import { cache } from "react";
import { unstable_cache } from "next/cache";
import { ageGroups as savedAgeGroups, countries as savedCountries, devices as savedDevices, gender as savedGender, outsideVenezuelaShare as savedOutside, savedAnalytics, type MetricRow } from "@/data/channel";

/**
 * Métricas privadas del canal desde YouTube Analytics API (OAuth del dueño
 * del canal): últimos 28 días, 28 días anteriores, detalle diario, últimos
 * 12 meses y audiencia (edad, género, países, dispositivos).
 *
 * YouTube procesa estas métricas con 1–2 días de retraso, así que se
 * consultan como máximo una vez por hora. Si faltan las variables
 * YOUTUBE_CLIENT_ID / YOUTUBE_CLIENT_SECRET / YOUTUBE_REFRESH_TOKEN o la
 * consulta falla, se usan los datos reales guardados en src/data/channel.ts.
 */
const ANALYTICS_REVALIDATE = 3600;

export type Totals = {
  views: number;
  watchHours: number;
  avgViewDurationSeconds: number;
  subscribersGained: number;
  subscribersLost: number;
  netSubscribers: number;
  likes: number;
  comments: number;
  shares: number;
  /** (me gusta + comentarios + compartidos) / vistas, en % */
  engagementRate: number;
};

export type DailyPoint = { date: string; views: number; net: number; gained: number; lost: number };
export type MonthlyPoint = { month: string; views: number; hours: number; net: number };

export type Audience = {
  ageGroups: { id: string; share: number }[];
  gender: { male: number; female: number };
  countries: { code: string; share: number }[];
  outsideVenezuelaShare: number;
  devices: { id: "tv" | "mobile" | "desktop" | "tablet"; views: number; watchTime: number }[];
};

export type AnalyticsData = {
  source: "analytics" | "saved";
  /** Cuándo se consultó YouTube (o se guardaron los datos). */
  updatedAt: string;
  /** Último día con datos procesados por YouTube. */
  dataThrough: string;
  last28: Totals;
  prev28: Totals;
  daily28: DailyPoint[];
  year: Totals;
  monthly: MonthlyPoint[];
  nonSubscriberShare: { d28: number; m12: number };
  audience: Audience;
  /** true = audiencia de los últimos 90 días; false = la guardada (nov 2025 – sep 2026). */
  audienceIsLive: boolean;
};

/* ───────────── cálculo común (datos en vivo y guardados) ───────────── */

const DAY = 24 * 3600 * 1000;
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);

export function totalsOf(rows: MetricRow[]): Totals {
  const sum = (i: number) => rows.reduce((acc, r) => acc + (Number(r[i]) || 0), 0);
  const views = sum(1);
  const minutes = sum(2);
  const gained = sum(3);
  const lost = sum(4);
  const likes = sum(5);
  const comments = sum(6);
  const shares = sum(7);
  return {
    views,
    watchHours: Math.round(minutes / 60),
    avgViewDurationSeconds: views ? Math.round((minutes * 60) / views) : 0,
    subscribersGained: gained,
    subscribersLost: lost,
    netSubscribers: gained - lost,
    likes,
    comments,
    shares,
    engagementRate: views ? Math.round(((likes + comments + shares) / views) * 1000) / 10 : 0,
  };
}

/** Ventanas de 28 días que terminan en el último día con datos. */
export function windowsFrom(daily: MetricRow[]) {
  const withData = daily.filter((r) => r[1] > 0);
  const lastDay = withData.length ? withData[withData.length - 1][0] : daily[daily.length - 1][0];
  const end = Date.parse(`${lastDay}T00:00:00Z`);
  const byDate = new Map(daily.map((r) => [r[0], r]));
  const range = (fromOffset: number, toOffset: number) => {
    const out: MetricRow[] = [];
    for (let t = end - fromOffset * DAY; t <= end - toOffset * DAY; t += DAY) {
      const d = iso(t);
      out.push(byDate.get(d) ?? [d, 0, 0, 0, 0, 0, 0, 0]);
    }
    return out;
  };
  const last = range(27, 0);
  const prev = range(55, 28);
  return {
    dataThrough: lastDay,
    last28: totalsOf(last),
    prev28: totalsOf(prev),
    daily28: last.map((r) => ({ date: r[0], views: r[1], net: r[3] - r[4], gained: r[3], lost: r[4] })),
  };
}

function monthlyFrom(rows: MetricRow[]): MonthlyPoint[] {
  return rows.map((r) => ({ month: r[0], views: r[1], hours: Math.round(r[2] / 60), net: r[3] - r[4] }));
}

function savedData(): AnalyticsData {
  const windows = windowsFrom(savedAnalytics.daily);
  const avg = savedAnalytics.avgViewDuration;
  return {
    source: "saved",
    updatedAt: `${savedAnalytics.updatedAt}T12:00:00Z`,
    ...windows,
    last28: { ...windows.last28, avgViewDurationSeconds: avg.d28 },
    prev28: { ...windows.prev28, avgViewDurationSeconds: avg.prev28 },
    year: { ...totalsOf(savedAnalytics.monthly), avgViewDurationSeconds: avg.m12 },
    monthly: monthlyFrom(savedAnalytics.monthly),
    nonSubscriberShare: savedAnalytics.nonSubscriberShare,
    audience: {
      ageGroups: savedAgeGroups.map((g) => ({ id: g.id, share: g.share })),
      gender: savedGender,
      countries: savedCountries.map((c) => ({ code: c.code, share: c.share })),
      outsideVenezuelaShare: savedOutside,
      devices: savedDevices.map((d) => ({ ...d })),
    },
    audienceIsLive: false,
  };
}

/* ───────────── YouTube Analytics API ───────────── */

export const analyticsConfigured = () =>
  Boolean(process.env.YOUTUBE_CLIENT_ID && process.env.YOUTUBE_CLIENT_SECRET && process.env.YOUTUBE_REFRESH_TOKEN);

async function accessToken() {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.YOUTUBE_CLIENT_ID!,
      client_secret: process.env.YOUTUBE_CLIENT_SECRET!,
      refresh_token: process.env.YOUTUBE_REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`token ${res.status} ${(await res.text()).slice(0, 120)}`);
  return ((await res.json()) as { access_token: string }).access_token;
}

type Row = Record<string, string | number>;

async function report(token: string, params: Record<string, string>): Promise<Row[]> {
  const url = `https://youtubeanalytics.googleapis.com/v2/reports?${new URLSearchParams({ ids: "channel==MINE", ...params })}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`analytics ${res.status} ${(await res.text()).slice(0, 160)}`);
  const json = (await res.json()) as { columnHeaders: { name: string }[]; rows?: (string | number)[][] };
  const names = json.columnHeaders.map((h) => h.name);
  return (json.rows ?? []).map((r) => Object.fromEntries(r.map((v, i) => [names[i], v])));
}

const METRICS = "views,estimatedMinutesWatched,subscribersGained,subscribersLost,likes,comments,shares";
const toRow = (key: string, r: Row): MetricRow => [
  key,
  Number(r.views),
  Number(r.estimatedMinutesWatched),
  Number(r.subscribersGained),
  Number(r.subscribersLost),
  Number(r.likes),
  Number(r.comments),
  Number(r.shares),
];

const ageId: Record<string, string> = {
  "age13-17": "13-17",
  "age18-24": "18-24",
  "age25-34": "25-34",
  "age35-44": "35-44",
  "age45-54": "45-54",
  "age55-64": "55-64",
  "age65-": "65+",
};
const deviceId: Record<string, Audience["devices"][number]["id"]> = {
  TV: "tv",
  GAME_CONSOLE: "tv",
  MOBILE: "mobile",
  DESKTOP: "desktop",
  TABLET: "tablet",
};

const round1 = (n: number) => Math.round(n * 10) / 10;

async function fetchAnalytics(): Promise<AnalyticsData> {
  const token = await accessToken();
  const now = Date.now();
  const today = iso(now);
  const monthStart = (offset: number) => {
    const d = new Date(now);
    return iso(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - offset, 1));
  };
  const days90 = { startDate: iso(now - 89 * DAY), endDate: today };

  const [dailyRows, monthlyRows, ageRows, countryRows, deviceRows] = await Promise.all([
    report(token, { startDate: iso(now - 64 * DAY), endDate: today, metrics: METRICS, dimensions: "day", sort: "day" }),
    report(token, { startDate: monthStart(11), endDate: monthStart(0), metrics: METRICS, dimensions: "month", sort: "month" }),
    report(token, { ...days90, metrics: "viewerPercentage", dimensions: "ageGroup,gender" }),
    report(token, { ...days90, metrics: "views", dimensions: "country", sort: "-views", maxResults: "50" }),
    report(token, { ...days90, metrics: "views,estimatedMinutesWatched", dimensions: "deviceType" }),
  ]);

  const daily = dailyRows.map((r) => toRow(String(r.day), r));
  if (!daily.length) throw new Error("analytics sin datos diarios");
  const windows = windowsFrom(daily);
  const monthly = monthlyRows.map((r) => toRow(String(r.month), r));

  const nonSubs = async (startDate: string, endDate: string) => {
    const rows = await report(token, { startDate, endDate, metrics: "views", dimensions: "subscribedStatus" });
    const total = rows.reduce((a, r) => a + Number(r.views), 0);
    const unsub = rows.filter((r) => r.subscribedStatus === "UNSUBSCRIBED").reduce((a, r) => a + Number(r.views), 0);
    return total ? round1((unsub / total) * 100) : 0;
  };
  // La duración media se pide a YouTube tal cual (así coincide con Studio).
  const avgDuration = async (startDate: string, endDate: string) => {
    const [row] = await report(token, { startDate, endDate, metrics: "averageViewDuration" });
    return row ? Math.round(Number(row.averageViewDuration)) : 0;
  };
  const endT = Date.parse(`${windows.dataThrough}T00:00:00Z`);
  const end28 = windows.dataThrough;
  const start28 = iso(endT - 27 * DAY);
  const [d28, m12, avg28, avgPrev, avg12] = await Promise.all([
    nonSubs(start28, end28),
    nonSubs(monthStart(11), today),
    avgDuration(start28, end28),
    avgDuration(iso(endT - 55 * DAY), iso(endT - 28 * DAY)),
    avgDuration(monthStart(11), today),
  ]);

  // Audiencia (últimos 90 días)
  const ages = new Map<string, number>();
  let male = 0;
  let female = 0;
  for (const r of ageRows) {
    const pct = Number(r.viewerPercentage);
    const id = ageId[String(r.ageGroup)];
    if (id) ages.set(id, (ages.get(id) ?? 0) + pct);
    if (r.gender === "male") male += pct;
    if (r.gender === "female") female += pct;
  }
  const genderTotal = male + female || 1;

  const countryTotal = countryRows.reduce((a, r) => a + Number(r.views), 0) || 1;
  const top = countryRows.slice(0, 8).map((r) => ({ code: String(r.country), share: round1((Number(r.views) / countryTotal) * 100) }));
  const topShare = top.reduce((a, c) => a + c.share, 0);
  const ve = countryRows.find((r) => r.country === "VE");

  const devices = new Map<string, { views: number; minutes: number }>();
  for (const r of deviceRows) {
    const id = deviceId[String(r.deviceType)];
    if (!id) continue;
    const prev = devices.get(id) ?? { views: 0, minutes: 0 };
    devices.set(id, { views: prev.views + Number(r.views), minutes: prev.minutes + Number(r.estimatedMinutesWatched) });
  }
  const dv = [...devices.values()].reduce((a, d) => a + d.views, 0) || 1;
  const dm = [...devices.values()].reduce((a, d) => a + d.minutes, 0) || 1;

  return {
    source: "analytics",
    updatedAt: new Date(now).toISOString(),
    ...windows,
    last28: { ...windows.last28, avgViewDurationSeconds: avg28 || windows.last28.avgViewDurationSeconds },
    prev28: { ...windows.prev28, avgViewDurationSeconds: avgPrev || windows.prev28.avgViewDurationSeconds },
    year: { ...totalsOf(monthly), avgViewDurationSeconds: avg12 || totalsOf(monthly).avgViewDurationSeconds },
    monthly: monthlyFrom(monthly),
    nonSubscriberShare: { d28, m12 },
    audience: {
      ageGroups: Object.values(ageId).map((id) => ({ id, share: round1(ages.get(id) ?? 0) })),
      gender: { male: round1((male / genderTotal) * 100), female: round1((female / genderTotal) * 100) },
      countries: [...top, { code: "OTHER", share: round1(Math.max(0, 100 - topShare)) }],
      outsideVenezuelaShare: round1(100 - (Number(ve?.views ?? 0) / countryTotal) * 100),
      devices: (["tv", "mobile", "desktop", "tablet"] as const).map((id) => ({
        id,
        views: round1(((devices.get(id)?.views ?? 0) / dv) * 100),
        watchTime: round1(((devices.get(id)?.minutes ?? 0) / dm) * 100),
      })),
    },
    audienceIsLive: true,
  };
}

// Se guarda una hora en la caché de Next (compartida entre visitas e idiomas).
const cachedAnalytics = unstable_cache(fetchAnalytics, ["youtube-analytics-v1"], {
  revalidate: ANALYTICS_REVALIDATE,
  tags: ["youtube"],
});

export const getAnalytics = cache(async (): Promise<AnalyticsData> => {
  if (!analyticsConfigured()) return savedData();
  try {
    return await cachedAnalytics();
  } catch (error) {
    console.error("[analytics] YouTube Analytics no disponible, uso datos guardados:", (error as Error).message);
    return savedData();
  }
});

/** Variación en % entre dos cifras (null si no hay base para comparar). */
export const changePct = (current: number, previous: number) =>
  previous > 0 ? Math.round(((current - previous) / previous) * 100) : null;

/**
 * Multiplicador de crecimiento en 12 meses (suscriptores de hoy / hace un año).
 * null si los datos no permiten un cálculo fiable (p. ej. canal muy nuevo).
 */
export function yearGrowth(subscribers: number, netLastYear: number) {
  const yearAgo = subscribers - netLastYear;
  if (yearAgo < 50 || yearAgo >= subscribers) return null;
  const multiple = subscribers / yearAgo;
  return { yearAgo, multiple, digits: multiple >= 10 ? 0 : 1 };
}
