import type { PillarId } from "@/data/channel";

/**
 * Asigna automáticamente un tema (pilar) a los videos nuevos según su
 * título, para que los filtros de la galería funcionen sin tocar código.
 * El orden importa: se revisa "emigrar" antes que "dinero" y "costo".
 */
const rules: { pillar: PillarId; words: string[] }[] = [
  {
    pillar: "emigrar",
    words: ["emigr", "irnos", "nos vamos", "me voy", "mudanza", "aeropuerto", "visa", "pasaporte", "llegamos", "nuevo pais", "extranjero", "despedida", "pasaje", "avion", "vuelo", "maleta", "salir de venezuela"],
  },
  {
    pillar: "dinero",
    words: ["sueldo", "salario", " gano", " gana ", " ganar", "cobre", "trabaj", "empleo", "freelance", "youtube", " pago", "negocio", "kiosko", "emprend", "sobrevive", "ahorr"],
  },
  {
    pillar: "costo",
    words: ["cuanto cuesta", "cuanto vale", "precio", "costo", "compras", "comida", "comi ", "mercado", "supermercado", "barato", " caro", "$"],
  },
];

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export function classifyPillar(title: string): PillarId {
  const t = ` ${normalize(title)} `;
  for (const rule of rules) {
    if (rule.words.some((w) => t.includes(w))) return rule.pillar;
  }
  return "calle";
}
