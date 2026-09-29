import { checkAdminSecret, createOAuthState } from "@/lib/admin";
import { siteConfig } from "@/data/site";

export const dynamic = "force-dynamic";

/**
 * Paso único para conectar YouTube Analytics: abre
 *   https://TU-DOMINIO/api/youtube/connect?secret=TU_ADMIN_SECRET
 * y autoriza con la cuenta de Google dueña del canal.
 */
export async function GET(request: Request) {
  if (!checkAdminSecret(new URL(request.url).searchParams.get("secret"))) {
    return new Response("Clave incorrecta.", { status: 401 });
  }
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  if (!clientId || !process.env.YOUTUBE_CLIENT_SECRET) {
    return new Response("Faltan YOUTUBE_CLIENT_ID y YOUTUBE_CLIENT_SECRET en Vercel.", { status: 500 });
  }
  const auth = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  auth.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${siteConfig.url}/api/youtube/callback`,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/yt-analytics.readonly https://www.googleapis.com/auth/youtube.readonly",
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    state: createOAuthState(),
  }).toString();
  return Response.redirect(auth.toString(), 302);
}
