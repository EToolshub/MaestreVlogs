import { revalidatePath, revalidateTag } from "next/cache";
import { locales } from "@/i18n/config";
import { checkAdminSecret } from "@/lib/admin";
import { YOUTUBE_CACHE_TAG } from "@/lib/youtube";

/**
 * Actualización manual (opcional): fuerza a pedir todo de nuevo a YouTube.
 *   https://TU-DOMINIO/api/revalidate?secret=TU_ADMIN_SECRET
 */
export async function GET(request: Request) {
  if (!checkAdminSecret(new URL(request.url).searchParams.get("secret"))) {
    return Response.json({ ok: false, error: "Clave incorrecta" }, { status: 401 });
  }
  revalidateTag(YOUTUBE_CACHE_TAG, { expire: 0 });
  for (const lang of locales) revalidatePath(`/${lang}`);
  return Response.json({ ok: true, revalidatedAt: new Date().toISOString() });
}
