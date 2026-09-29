import { revalidatePath, revalidateTag } from "next/cache";
import { locales } from "@/i18n/config";
import { YOUTUBE_CACHE_TAG } from "@/lib/youtube";

/**
 * Actualización manual (opcional): si acabas de subir un video y no quieres
 * esperar a la actualización automática de 6 horas, abre
 *   https://TU-DOMINIO/api/revalidate?secret=TU_CLAVE
 * La clave es la variable de entorno REVALIDATE_SECRET en Vercel.
 */
export async function GET(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const provided = new URL(request.url).searchParams.get("secret");
  if (!secret || provided !== secret) {
    return Response.json({ ok: false, error: "Clave incorrecta" }, { status: 401 });
  }
  revalidateTag(YOUTUBE_CACHE_TAG, { expire: 0 });
  for (const lang of locales) revalidatePath(`/${lang}`);
  return Response.json({ ok: true, revalidatedAt: new Date().toISOString() });
}
