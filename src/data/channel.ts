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

/* ───────────────────────────────────────────────────────────────────────
   Respaldo de YouTube Analytics (se usa solo si la conexión OAuth con
   YouTube Analytics no está configurada o falla). Con la conexión activa,
   estos números se reemplazan solos por los de YouTube cada hora.
   Filas: [fecha, vistas, minutos vistos, suscriptores ganados, perdidos,
           me gusta, comentarios, compartidos]
   ─────────────────────────────────────────────────────────────────────── */
export type MetricRow = [string, number, number, number, number, number, number, number];

export const savedAnalytics = {
  updatedAt: "2026-09-29",
  daily: [
    ["2026-07-30", 610, 1954, 4, 1, 10, 1, 3], ["2026-07-31", 219, 1105, 3, 1, 12, 1, 0],
    ["2026-08-01", 157, 840, 2, 0, 4, 0, 1], ["2026-08-02", 113, 573, 0, 0, 4, 0, 1],
    ["2026-08-03", 81, 390, 1, 0, 5, 0, 0], ["2026-08-04", 566, 2889, 4, 1, 39, 4, 1],
    ["2026-08-05", 585, 2206, 3, 1, 36, 5, 1], ["2026-08-06", 1258, 4285, 8, 0, 36, 4, 5],
    ["2026-08-07", 713, 1971, 1, 1, 23, 2, 2], ["2026-08-08", 2288, 1895, 6, 1, 42, 3, 3],
    ["2026-08-09", 2506, 4562, 33, 7, 162, 20, 6], ["2026-08-10", 5395, 7627, 68, 11, 242, 16, 11],
    ["2026-08-11", 1640, 4445, 36, 7, 92, 7, 7], ["2026-08-12", 1107, 3044, 32, 0, 83, 6, 6],
    ["2026-08-13", 1401, 4243, 43, 11, 88, 12, 7], ["2026-08-14", 2787, 8788, 57, 16, 177, 16, 9],
    ["2026-08-15", 2987, 9307, 86, 17, 187, 11, 14], ["2026-08-16", 2377, 7011, 57, 10, 135, 4, 8],
    ["2026-08-17", 1022, 2806, 17, 0, 42, 5, 1], ["2026-08-18", 680, 1876, 16, 1, 33, 2, 6],
    ["2026-08-19", 1274, 4576, 14, 2, 112, 15, 7], ["2026-08-20", 800, 2967, 13, 5, 32, 12, 6],
    ["2026-08-21", 772, 2535, 14, 2, 33, 6, 9], ["2026-08-22", 591, 2121, 12, 0, 46, 5, 0],
    ["2026-08-23", 1516, 5968, 13, 1, 102, 25, 3], ["2026-08-24", 1512, 5265, 26, 2, 80, 8, 5],
    ["2026-08-25", 846, 2786, 12, 0, 34, 3, 3], ["2026-08-26", 545, 1705, 8, 1, 17, 3, 2],
    ["2026-08-27", 1359, 2113, 4, 1, 20, 2, 4], ["2026-08-28", 1024, 1515, 4, 0, 21, 3, 1],
    ["2026-08-29", 627, 1040, 4, 1, 14, 1, 4], ["2026-08-30", 517, 844, 2, 0, 13, 2, 1],
    ["2026-08-31", 373, 774, 5, 0, 8, 0, 1], ["2026-09-01", 301, 722, 1, 0, 10, 0, 0],
    ["2026-09-02", 220, 429, 0, 0, 7, 0, 1], ["2026-09-03", 262, 700, 2, 1, 4, 0, 2],
    ["2026-09-04", 258, 580, 2, 1, 5, 0, 0], ["2026-09-05", 643, 1582, 2, 3, 33, 6, 0],
    ["2026-09-06", 1518, 3099, 3, 0, 45, 7, 0], ["2026-09-07", 900, 1456, 3, 0, 12, 1, 1],
    ["2026-09-08", 904, 1437, 3, 1, 19, 2, 1], ["2026-09-09", 886, 1630, 6, 1, 16, 2, 1],
    ["2026-09-10", 421, 750, 0, 0, -2, 1, 0], ["2026-09-11", 385, 680, 1, 0, 8, 2, 0],
    ["2026-09-12", 309, 687, 0, 0, 4, 3, 0], ["2026-09-13", 303, 591, 0, 1, 8, 1, 1],
    ["2026-09-14", 191, 360, 1, 1, 2, 0, 0], ["2026-09-15", 163, 315, 3, 0, 3, 1, 0],
    ["2026-09-16", 145, 241, 1, 1, 5, 0, 0], ["2026-09-17", 217, 560, 0, 0, 0, 3, 0],
    ["2026-09-18", 215, 583, 1, 0, 7, 0, 0], ["2026-09-19", 229, 634, 0, 1, 3, 0, 0],
    ["2026-09-20", 244, 555, 1, 0, 2, 0, 1], ["2026-09-21", 202, 452, 2, 0, 3, 0, 0],
    ["2026-09-22", 180, 346, 0, 0, 2, 0, 0], ["2026-09-23", 181, 356, 1, 0, 2, 0, 0],
    ["2026-09-24", 199, 418, 1, 0, 4, 0, 0], ["2026-09-25", 227, 538, 2, 0, 11, 0, 0],
    ["2026-09-26", 188, 585, 3, 0, 5, 1, 0], ["2026-09-27", 214, 578, 0, 2, 1, 0, 0],
  ] as MetricRow[],
  monthly: [
    ["2025-10", 24932, 11428, 86, 16, 477, 75, 43], ["2025-11", 4033, 7893, 45, 5, 226, 87, 17],
    ["2025-12", 26744, 76778, 373, 37, 1146, 163, 102], ["2026-01", 26271, 110301, 259, 35, 914, 142, 75],
    ["2026-02", 56120, 260360, 577, 88, 1774, 168, 162], ["2026-03", 21015, 98854, 204, 23, 992, 178, 60],
    ["2026-04", 43253, 185365, 599, 87, 2369, 362, 124], ["2026-05", 21854, 106769, 206, 33, 1269, 231, 51],
    ["2026-06", 10702, 48213, 62, 18, 522, 95, 12], ["2026-07", 24853, 87987, 339, 43, 1263, 212, 93],
    ["2026-08", 39419, 102978, 601, 99, 1962, 202, 135], ["2026-09", 10105, 20875, 39, 13, 219, 30, 8],
  ] as MetricRow[],
  /** % de vistas de no suscriptores: últimos 28 días y últimos 12 meses. */
  nonSubscriberShare: { d28: 90.7, m12: 91.3 },
  /** Duración media por vista según YouTube (segundos). */
  avgViewDuration: { d28: 257, prev28: 172, m12: 233 },
};
