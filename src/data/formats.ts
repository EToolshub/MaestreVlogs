/**
 * Formatos de colaboración. Los textos (nombre, descripción, qué incluye)
 * están en los diccionarios de idioma; aquí solo viven los datos que usa
 * el configurador de campañas. No hay precios públicos: cada propuesta se
 * cotiza por correo.
 */
export type FormatId = "integration" | "dedicated" | "series" | "short" | "community" | "crosspost";

export type Format = {
  id: FormatId;
  /**
   * Cuántos "videos largos" de vistas equivale una unidad. Las vistas
   * estimadas = mediana y promedio de vistas por video × este número
   * (se recalculan solas con cada actualización de YouTube).
   * null = alcance adicional sin estimar.
   */
  videoMultiplier: number | null;
  /** Videos largos de YouTube que suma (para el calendario estimado). */
  longVideos: number;
  maxQty: number;
  featured?: boolean;
};

export const formats: Format[] = [
  { id: "integration", videoMultiplier: 1, longVideos: 1, maxQty: 6, featured: true },
  { id: "dedicated", videoMultiplier: 1, longVideos: 1, maxQty: 4 },
  { id: "series", videoMultiplier: 3, longVideos: 3, maxQty: 2 },
  { id: "short", videoMultiplier: null, longVideos: 0, maxQty: 10 },
  { id: "community", videoMultiplier: null, longVideos: 0, maxQty: 6 },
  { id: "crosspost", videoMultiplier: null, longVideos: 0, maxQty: 6 },
];

/** Rango de vistas estimadas de un formato, o null si no se estima. */
export function estimateViews(format: Format, perVideo: { median: number; mean: number }): [number, number] | null {
  if (format.videoMultiplier === null) return null;
  return [perVideo.median * format.videoMultiplier, perVideo.mean * format.videoMultiplier];
}

export type PackageId = "test" | "launch" | "journey";

/** Paquetes sugeridos: precargan el configurador. */
export const packages: { id: PackageId; items: Partial<Record<FormatId, number>>; highlight?: boolean }[] = [
  { id: "test", items: { integration: 1, community: 1 } },
  { id: "launch", items: { dedicated: 1, integration: 1, short: 2, crosspost: 1 }, highlight: true },
  { id: "journey", items: { series: 1, short: 3, community: 2, crosspost: 2 } },
];
