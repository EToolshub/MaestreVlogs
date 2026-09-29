import { getLiveSnapshot } from "@/lib/youtube";

// Se genera como máximo una vez por minuto, sin importar cuántas personas
// tengan la web abierta: así se cuida la cuota diaria de la API de YouTube.
export const revalidate = 60;

export async function GET() {
  return Response.json(await getLiveSnapshot());
}
