/**
 * Métricas reales del canal, tomadas de YouTube Analytics (vía vidIQ).
 *
 * Periodo: 1 nov 2025 → 28 sep 2026, desde que el canal se reenfocó en
 * vlogs urbanos. Actualízalas cada 2–3 meses: las marcas valoran datos
 * recientes más que números grandes.
 */

export const statsPeriod = {
  from: "2025-11-01",
  to: "2026-09-28",
  updatedAt: "2026-09-29",
};

export const channelStats = {
  subscribers: 3190,
  subscribersOneYearAgo: 290,
  totalChannelViews: 259_358,
  videos: 56,
  topVideoViews: 31_685,
  avgLongVideoMinutes: 12,

  // Periodo analizado
  views: 284_155,
  engagedViews: 273_491,
  minutesWatched: 1_105_799,
  avgViewDurationSeconds: 242,
  avgViewPercentage: 33.7,
  subscribersGained: 3304,
  subscribersLost: 479,
  likes: 12_655,
  comments: 1870,
  shares: 839,
  /** % de vistas de personas que aún no están suscritas (alcance nuevo). */
  nonSubscriberViewShare: 90.7,
};

export const derived = {
  watchHours: Math.round(channelStats.minutesWatched / 60),
  netSubscribers: channelStats.subscribersGained - channelStats.subscribersLost,
  growthMultiple: Math.round((channelStats.subscribers / channelStats.subscribersOneYearAgo) * 10) / 10,
  /** (likes + comentarios + compartidos) / vistas */
  engagementRate:
    Math.round(
      ((channelStats.likes + channelStats.comments + channelStats.shares) / channelStats.views) * 1000
    ) / 10,
};

/**
 * Vistas por video para estimar el alcance de una campaña: mediana y media
 * de los últimos 9 videos largos con al menos una semana publicados.
 */
export const perVideoViews = { median: 3856, mean: 4810 };

/** Vistas y horas de visualización por mes (meses completos). */
export const monthlyViews = [
  { month: "2025-11", views: 4033, hours: 132 },
  { month: "2025-12", views: 26_744, hours: 1280 },
  { month: "2026-01", views: 26_271, hours: 1838 },
  { month: "2026-02", views: 56_120, hours: 4339 },
  { month: "2026-03", views: 21_015, hours: 1648 },
  { month: "2026-04", views: 43_253, hours: 3089 },
  { month: "2026-05", views: 21_854, hours: 1779 },
  { month: "2026-06", views: 10_702, hours: 804 },
  { month: "2026-07", views: 24_853, hours: 1466 },
  { month: "2026-08", views: 39_419, hours: 1716 },
];

/** Suscriptores totales (conteo público) a inicio de cada mes. */
export const subscriberHistory = [
  { date: "2025-09-29", subscribers: 290 },
  { date: "2025-11-01", subscribers: 361 },
  { date: "2025-12-01", subscribers: 411 },
  { date: "2026-01-01", subscribers: 737 },
  { date: "2026-02-01", subscribers: 969 },
  { date: "2026-03-01", subscribers: 1450 },
  { date: "2026-04-01", subscribers: 1630 },
  { date: "2026-05-01", subscribers: 2150 },
  { date: "2026-06-01", subscribers: 2310 },
  { date: "2026-07-01", subscribers: 2360 },
  { date: "2026-08-01", subscribers: 2650 },
  { date: "2026-09-01", subscribers: 3150 },
  { date: "2026-09-29", subscribers: 3190 },
];

/** Porcentaje de espectadores por edad. */
export const ageGroups = [
  { id: "13-17", share: 0.4 },
  { id: "18-24", share: 4.6 },
  { id: "25-34", share: 23.4 },
  { id: "35-44", share: 24.3 },
  { id: "45-54", share: 21.8 },
  { id: "55-64", share: 13.8 },
  { id: "65+", share: 11.7 },
] as const;

/** Los grupos que se destacan como "núcleo" de la audiencia. */
export const coreAgeGroups = ["25-34", "35-44", "45-54"];

export const gender = { male: 73.9, female: 26.1 };

/** Vistas por país (% del total del periodo). */
export const countries = [
  { code: "VE", share: 53.2 },
  { code: "US", share: 9.1 },
  { code: "ES", share: 5.9 },
  { code: "CO", share: 5.7 },
  { code: "CL", share: 5.1 },
  { code: "PE", share: 2.4 },
  { code: "AR", share: 2.2 },
  { code: "MX", share: 1.6 },
  { code: "OTHER", share: 14.8 },
] as const;

export const outsideVenezuelaShare = 46.8;

/** Dispositivos: % de vistas y % del tiempo de visualización. */
export const devices = [
  { id: "tv", views: 58.3, watchTime: 66.7 },
  { id: "mobile", views: 29.9, watchTime: 21.5 },
  { id: "desktop", views: 10.5, watchTime: 10.4 },
  { id: "tablet", views: 1.3, watchTime: 1.3 },
] as const;

export type PillarId = "costo" | "calle" | "dinero" | "emigrar";

export type Video = {
  id: string;
  title: string;
  titleEn: string;
  pillar: PillarId;
  views: number;
  likes: number;
  comments: number;
  duration: string;
  publishedAt: string;
};

/** Videos destacados (conteos públicos al 29 sep 2026). */
export const videos: Video[] = [
  {
    id: "0dcPGqBKhsc",
    title: "La CIUDAD SUBTERRÁNEA de Caracas | ¿Qué pasó con las Torres del Silencio?",
    titleEn: "Caracas' UNDERGROUND CITY | What happened to the Torres del Silencio?",
    pillar: "calle",
    views: 31_685,
    likes: 812,
    comments: 135,
    duration: "12:14",
    publishedAt: "2026-03-28",
  },
  {
    id: "T0wRLEPT_mc",
    title: "¿Cuánto cuesta equipar una casa en Venezuela? PRECIOS de electrodomésticos 2026",
    titleEn: "How much does it cost to furnish a home in Venezuela? 2026 appliance PRICES",
    pillar: "costo",
    views: 17_783,
    likes: 461,
    comments: 85,
    duration: "17:52",
    publishedAt: "2026-02-08",
  },
  {
    id: "86Tm-lRgmWA",
    title: "¿Cuánto vale una MOTO en Venezuela? Precios actualizados",
    titleEn: "How much is a MOTORCYCLE in Venezuela? Updated prices",
    pillar: "costo",
    views: 17_644,
    likes: 537,
    comments: 60,
    duration: "9:20",
    publishedAt: "2026-02-04",
  },
  {
    id: "CnV_sJsNanE",
    title: "$20 de compras en Venezuela | Los precios te SORPRENDERÁN",
    titleEn: "$20 of groceries in Venezuela | The prices will SURPRISE you",
    pillar: "costo",
    views: 15_370,
    likes: 267,
    comments: 77,
    duration: "13:23",
    publishedAt: "2026-01-18",
  },
  {
    id: "cCJu_1IALfU",
    title: "Comí como REY en Venezuela con $4 USD 🇻🇪 (¡QUEDÉ FULL!)",
    titleEn: "I ate like a KING in Venezuela with $4 USD 🇻🇪",
    pillar: "costo",
    views: 14_285,
    likes: 434,
    comments: 71,
    duration: "12:40",
    publishedAt: "2026-01-25",
  },
  {
    id: "eKurd9pBQSs",
    title: "Intenté vivir de YouTube en Venezuela por 1 año... esto pasó",
    titleEn: "I tried to make a living on YouTube in Venezuela for 1 year… here's what happened",
    pillar: "dinero",
    views: 14_255,
    likes: 926,
    comments: 162,
    duration: "9:23",
    publishedAt: "2026-08-09",
  },
  {
    id: "W4esHvbhzDU",
    title: "Me llegó mi primer pago de YouTube: $113 desde Venezuela",
    titleEn: "My first YouTube payout arrived: $113 from Venezuela",
    pillar: "dinero",
    views: 9140,
    likes: 571,
    comments: 173,
    duration: "8:45",
    publishedAt: "2026-07-09",
  },
  {
    id: "zOI6EiSloAw",
    title: "ASÍ ESTÁ CARACAS EN NAVIDAD: 5 REALIDADES desde Sabana Grande",
    titleEn: "CARACAS AT CHRISTMAS: 5 REALITIES from Sabana Grande",
    pillar: "calle",
    views: 7552,
    likes: 223,
    comments: 38,
    duration: "6:26",
    publishedAt: "2025-12-14",
  },
  {
    id: "EMA0a4_PaJA",
    title: "Entré al barrio más caro de Caracas y esto encontré",
    titleEn: "I walked into the most expensive neighborhood in Caracas",
    pillar: "calle",
    views: 7118,
    likes: 253,
    comments: 86,
    duration: "11:16",
    publishedAt: "2026-08-23",
  },
  {
    id: "JB3KgtNCpM4",
    title: "Caminé por Caracas a las 3 AM: ¿Qué pasó realmente?",
    titleEn: "I walked through Caracas at 3 AM: what really happened?",
    pillar: "calle",
    views: 5197,
    likes: 212,
    comments: 50,
    duration: "13:31",
    publishedAt: "2026-03-15",
  },
  {
    id: "eZhcAZXih78",
    title: "Por esto regresé a un empleo normal: El fracaso del freelance venezolano",
    titleEn: "Why I went back to a regular job: the Venezuelan freelance struggle",
    pillar: "dinero",
    views: 5012,
    likes: 260,
    comments: 88,
    duration: "11:43",
    publishedAt: "2026-04-27",
  },
  {
    id: "mWfkfgfacKo",
    title: "¿Cuánto gana REALMENTE un profesional en Venezuela? | Mi sueldo real 🇻🇪",
    titleEn: "How much does a professional REALLY earn in Venezuela? | My real salary 🇻🇪",
    pillar: "dinero",
    views: 4387,
    likes: 302,
    comments: 76,
    duration: "9:42",
    publishedAt: "2026-04-21",
  },
  {
    id: "mZ9M_eou13g",
    title: "Mi experiencia en Venezuela y por qué elegimos irnos",
    titleEn: "My experience in Venezuela and why we chose to leave",
    pillar: "emigrar",
    views: 3614,
    likes: 120,
    comments: 74,
    duration: "10:22",
    publishedAt: "2026-09-28",
  },
  {
    id: "2k17qWjU13k",
    title: "PETARE no es lo que parece | Zona colonial, mercado popular y cómo se vive aquí",
    titleEn: "PETARE is not what it seems | Colonial quarter, street market and daily life",
    pillar: "calle",
    views: 2911,
    likes: 139,
    comments: 44,
    duration: "20:13",
    publishedAt: "2026-07-24",
  },
  {
    id: "JlC1QEfXcVs",
    title: "¿Cuánto dinero se necesita para emigrar hoy? Mi desglose completo",
    titleEn: "How much money do you need to emigrate today? My full breakdown",
    pillar: "emigrar",
    views: 1287,
    likes: 89,
    comments: 93,
    duration: "10:48",
    publishedAt: "2026-05-04",
  },
];

export const thumbnailUrl = (id: string, quality: "hq" | "max" = "hq") =>
  `https://i.ytimg.com/vi/${id}/${quality === "max" ? "maxresdefault" : "hqdefault"}.jpg`;

export const videoUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
