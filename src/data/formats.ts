import { perVideoViews } from "./channel";

/**
 * Formatos de colaboración. Los textos (nombre, descripción, qué incluye)
 * están en los diccionarios de idioma; aquí solo viven los datos que usa
 * el configurador de campañas. No hay precios públicos: cada propuesta se
 * cotiza por correo.
 */
export type FormatId = "integration" | "dedicated" | "series" | "short" | "community" | "crosspost";

export type Format = {
  id: FormatId;
  /** Vistas estimadas por unidad [mínimo, máximo]. null = alcance adicional sin estimar. */
  views: [number, number] | null;
  /** Videos largos de YouTube que suma (para el calendario estimado). */
  longVideos: number;
  maxQty: number;
  featured?: boolean;
};

const perVideo: [number, number] = [perVideoViews.median, perVideoViews.mean];

export const formats: Format[] = [
  { id: "integration", views: perVideo, longVideos: 1, maxQty: 6, featured: true },
  { id: "dedicated", views: perVideo, longVideos: 1, maxQty: 4 },
  { id: "series", views: [perVideo[0] * 3, perVideo[1] * 3], longVideos: 3, maxQty: 2 },
  { id: "short", views: null, longVideos: 0, maxQty: 10 },
  { id: "community", views: null, longVideos: 0, maxQty: 6 },
  { id: "crosspost", views: null, longVideos: 0, maxQty: 6 },
];

export type PackageId = "test" | "launch" | "journey";

/** Paquetes sugeridos: precargan el configurador. */
export const packages: { id: PackageId; items: Partial<Record<FormatId, number>>; highlight?: boolean }[] = [
  { id: "test", items: { integration: 1, community: 1 } },
  { id: "launch", items: { dedicated: 1, integration: 1, short: 2, crosspost: 1 }, highlight: true },
  { id: "journey", items: { series: 1, short: 3, community: 2, crosspost: 2 } },
];
