import { checkAdminSecret } from "@/lib/admin";
import { escapeHtml, htmlPage } from "@/lib/html-page";
import { siteConfig } from "@/data/site";
import { apiKey, apiKeyVariable, getYoutubeData, videosFromApi } from "@/lib/youtube";
import { accessToken, getAnalytics, report } from "@/lib/analytics";
import { milestoneProgress, reachedMilestones } from "@/lib/milestones";

export const dynamic = "force-dynamic";

/**
 * Diagnóstico: comprueba en este momento, sin caché, cada conexión con
 * YouTube y dice qué está mostrando la web.
 *   https://TU-DOMINIO/api/youtube/status?secret=TU_ADMIN_SECRET
 */

type Check = { label: string; ok: boolean | null; detail: string; hint?: string };
type GoogleError = { error?: string | { message?: string }; error_description?: string };

const API = "https://www.googleapis.com/youtube/v3";
const n = (value: number) => new Intl.NumberFormat("es-VE").format(value);

/** Quita claves y tokens de cualquier texto antes de mostrarlo. */
const redact = (text: string) =>
  [apiKey(), process.env.YOUTUBE_CLIENT_SECRET, process.env.YOUTUBE_REFRESH_TOKEN]
    .filter((v): v is string => Boolean(v && v.length > 6))
    .reduce((acc, secret) => acc.split(secret).join("***"), text);

async function getGoogle<T>(url: string, token?: string): Promise<T> {
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  const body = (await res.json().catch(() => ({}))) as T & GoogleError;
  if (!res.ok) {
    const e = body.error;
    const message = typeof e === "string" ? `${e} ${body.error_description ?? ""}` : (e?.message ?? res.statusText);
    throw new Error(`${res.status} · ${message}`);
  }
  return body;
}

/** Explicación en palabras simples de los errores más comunes de Google. */
function hintFor(message: string) {
  const m = message.toLowerCase();
  if (m.includes("api key not valid") || m.includes("api_key_invalid"))
    return "La clave de API está mal copiada. Vuelve a copiarla desde Google Cloud → Credenciales y reemplázala en Vercel.";
  if (m.includes("api_key_service_blocked") || (m.includes("requests to this api") && m.includes("blocked")))
    return "La clave no tiene permiso para YouTube Data API v3. En Google Cloud → Credenciales → tu clave → Restricciones de API, marca «YouTube Data API v3» y guarda.";
  if (m.includes("referer") || m.includes("referrer") || m.includes("ip address") || m.includes("blocked"))
    return "La clave tiene restricción por sitio web o IP. En Google Cloud → Credenciales → tu clave → Restricciones de aplicaciones, elige «Ninguna» y guarda.";
  if (m.includes("has not been used") || m.includes("is disabled") || m.includes("service_disabled"))
    return "Esa API no está habilitada en el proyecto de Google Cloud. Búscala en APIs y servicios → Biblioteca y pulsa Habilitar.";
  if (m.includes("quota")) return "Se agotó la cuota diaria de YouTube. Se renueva sola a medianoche (hora del Pacífico).";
  if (m.includes("invalid_grant"))
    return "El refresh token no es válido o caducó. Abre de nuevo /api/youtube/connect, copia el código nuevo y reemplaza YOUTUBE_REFRESH_TOKEN en Vercel (y haz Redeploy).";
  if (m.includes("invalid_client") || m.includes("unauthorized_client"))
    return "El ID o el secreto del cliente están mal copiados en Vercel (YOUTUBE_CLIENT_ID / YOUTUBE_CLIENT_SECRET).";
  if (m.includes("insufficient") || m.includes("forbidden"))
    return "La cuenta autorizada no tiene acceso a las estadísticas de este canal. Repite la conexión eligiendo el canal MaestreVlogs.";
  return undefined;
}

async function run(label: string, checks: Check[], task: () => Promise<string>) {
  try {
    checks.push({ label, ok: true, detail: await task() });
    return true;
  } catch (error) {
    const detail = redact((error as Error).message);
    checks.push({ label, ok: false, detail, hint: hintFor(detail) });
    return false;
  }
}

type ApiChannel = {
  items?: {
    snippet?: { title: string };
    statistics: { subscriberCount?: string; viewCount: string; videoCount: string };
    contentDetails: { relatedPlaylists: { uploads: string } };
  }[];
};

export async function GET(request: Request) {
  if (!checkAdminSecret(new URL(request.url).searchParams.get("secret"))) {
    return new Response("Clave incorrecta.", { status: 401 });
  }

  const checks: Check[] = [];

  /* 1 · Datos públicos (YouTube Data API v3) */
  const key = apiKey();
  let uploads = "";
  if (!key) {
    checks.push({
      label: "Clave de YouTube Data API",
      ok: false,
      detail: "No hay variable YOUTUBE_API_KEY en Vercel.",
      hint: "Crea YOUTUBE_API_KEY en Vercel con la clave de Google Cloud y haz Redeploy.",
    });
  } else {
    await run("Suscriptores, vistas y videos (en vivo)", checks, async () => {
      const json = await getGoogle<ApiChannel>(`${API}/channels?part=snippet,statistics,contentDetails&id=${siteConfig.channelId}&key=${key}`);
      const info = json.items?.[0];
      if (!info) throw new Error("La API respondió, pero no encontró el canal.");
      uploads = info.contentDetails.relatedPlaylists.uploads;
      const subs = Number(info.statistics.subscriberCount ?? 0);
      const goal = milestoneProgress(subs);
      const reached = reachedMilestones(subs);
      return (
        `${info.snippet?.title ?? "Canal"}: ${n(subs)} suscriptores · ${n(Number(info.statistics.viewCount))} vistas · ${n(Number(info.statistics.videoCount))} videos. ` +
        `Próxima meta: ${n(goal.goal)} (faltan ${n(goal.remaining)})` +
        (reached.length ? ` · metas cumplidas: ${reached.map(n).join(", ")}` : "") +
        `. Variable usada: ${apiKeyVariable()}.`
      );
    });
    if (uploads) {
      await run("Último video subido", checks, async () => {
        const list = await getGoogle<{ items?: { contentDetails: { videoId: string } }[] }>(
          `${API}/playlistItems?part=contentDetails&maxResults=10&playlistId=${uploads}&key=${key}`
        );
        const ids = (list.items ?? []).map((i) => i.contentDetails.videoId);
        if (!ids.length) throw new Error("El canal no tiene videos públicos.");
        const videos = videosFromApi(await getGoogle(`${API}/videos?part=snippet,statistics,contentDetails&id=${ids.join(",")}&key=${key}`));
        const v = videos[0];
        if (!v) return "Los últimos 10 videos son Shorts; la web muestra el último video largo guardado.";
        return `«${v.title}» · publicado el ${v.publishedAt.slice(0, 10)} · ${n(v.views)} vistas.`;
      });
    }
  }

  /* 2 · Estadísticas privadas (YouTube Analytics, OAuth) */
  const missing = ["YOUTUBE_CLIENT_ID", "YOUTUBE_CLIENT_SECRET", "YOUTUBE_REFRESH_TOKEN"].filter((v) => !process.env[v]);
  if (missing.length) {
    checks.push({
      label: "Conexión con YouTube Analytics",
      ok: false,
      detail: `Faltan en Vercel: ${missing.join(", ")}.`,
      hint: "Crea esas variables con los nombres exactos y haz Redeploy.",
    });
  } else {
    let token = "";
    await run("Permiso de Google (refresh token)", checks, async () => {
      token = await accessToken();
      return "Google aceptó el ID, el secreto y el refresh token.";
    });
    if (token) {
      await run("Canal autorizado", checks, async () => {
        const me = await getGoogle<{ items?: { id: string; snippet: { title: string } }[] }>(`${API}/channels?part=snippet&mine=true`, token);
        const channel = me.items?.[0];
        if (!channel) throw new Error("La cuenta autorizada no tiene canal de YouTube (forbidden).");
        if (channel.id !== siteConfig.channelId) {
          throw new Error(`Se autorizó «${channel.snippet.title}» (${channel.id}), no MaestreVlogs (forbidden).`);
        }
        return `${channel.snippet.title} (${channel.id}).`;
      });
      const now = Date.now();
      const day = 24 * 3600 * 1000;
      const iso = (t: number) => new Date(t).toISOString().slice(0, 10);
      await run("Estadísticas de los últimos 28 días", checks, async () => {
        const rows = await report(token, {
          startDate: iso(now - 34 * day),
          endDate: iso(now),
          metrics: "views,subscribersGained,subscribersLost",
          dimensions: "day",
          sort: "day",
        });
        const withData = rows.filter((r) => Number(r.views) > 0);
        if (!withData.length) throw new Error("YouTube Analytics no devolvió datos diarios.");
        const last = withData.slice(-28);
        const views = last.reduce((a, r) => a + Number(r.views), 0);
        const net = last.reduce((a, r) => a + Number(r.subscribersGained) - Number(r.subscribersLost), 0);
        return `${n(views)} vistas y ${net >= 0 ? "+" : ""}${n(net)} suscriptores netos. Datos procesados hasta el ${String(withData.at(-1)!.day)} (YouTube tarda ~2 días).`;
      });
      await run("Audiencia (últimos 90 días)", checks, async () => {
        const range = { startDate: iso(now - 89 * day), endDate: iso(now) };
        const [ages, countries, devices] = await Promise.all([
          report(token, { ...range, metrics: "viewerPercentage", dimensions: "ageGroup,gender" }),
          report(token, { ...range, metrics: "views", dimensions: "country", sort: "-views", maxResults: "10" }),
          report(token, { ...range, metrics: "views", dimensions: "deviceType" }),
        ]);
        const parts = [`${ages.length} grupos de edad/género`, `${countries.length} países`, `${devices.length} tipos de dispositivo`];
        if (!ages.length || !countries.length || !devices.length) {
          return `${parts.join(" · ")}. Falta alguna parte, así que la web muestra la audiencia guardada.`;
        }
        return `${parts.join(" · ")}. País principal: ${String(countries[0].country)}.`;
      });
    }
  }

  /* 3 · Lo que la web está mostrando ahora mismo (con su caché) */
  const [yt, analytics] = await Promise.all([getYoutubeData(), getAnalytics()]);
  const ytLabel = { api: "YouTube Data API (en vivo)", rss: "RSS público (respaldo)", static: "datos guardados (respaldo)" }[yt.source];
  checks.push({
    label: "Lo que muestra la web",
    ok: yt.source === "api" && analytics.source === "analytics",
    detail:
      `Canal y videos: ${ytLabel}. Estadísticas: ${analytics.source === "analytics" ? `YouTube Analytics (hasta el ${analytics.dataThrough})` : "datos guardados (respaldo)"}. ` +
      `Audiencia: ${analytics.audienceIsLive ? "últimos 90 días" : "guardada"}.`,
    hint:
      yt.source === "api" && analytics.source === "analytics"
        ? undefined
        : "Si todo lo de arriba está en verde, la web se pondrá al día sola en unos minutos (o pulsa «Actualizar ahora»).",
  });

  const failed = checks.filter((c) => c.ok === false).length;
  const icon = (ok: boolean | null) => (ok ? "✅" : ok === false ? "❌" : "⏭️");
  const secret = new URL(request.url).searchParams.get("secret") ?? "";
  const body = `
<h1 class="${failed ? "" : "ok"}">${failed ? `Hay ${failed} ${failed === 1 ? "cosa" : "cosas"} por revisar` : "✓ Todo funciona"}</h1>
<p class="muted">Diagnóstico de ${escapeHtml(siteConfig.url.replace("https://", ""))} · ${escapeHtml(new Date().toISOString().replace("T", " ").slice(0, 16))} UTC</p>
<ul class="checks">
${checks
  .map(
    (c) => `<li><span class="icon">${icon(c.ok)}</span><div><strong>${escapeHtml(c.label)}</strong><div class="detail">${escapeHtml(c.detail)}</div>${
      c.hint ? `<div class="hint">→ ${escapeHtml(c.hint)}</div>` : ""
    }</div></li>`
  )
  .join("\n")}
</ul>
<h2>Actualizar la web ahora</h2>
<p class="muted">La web ya se actualiza sola (contadores cada minuto, videos cada 5 minutos, estadísticas cada hora). Este botón solo adelanta la próxima actualización.</p>
<p><a class="btn" href="/api/revalidate?secret=${encodeURIComponent(secret)}">Actualizar ahora</a></p>`;

  return htmlPage(failed ? "Diagnóstico: revisar" : "Diagnóstico: todo bien", body);
}
