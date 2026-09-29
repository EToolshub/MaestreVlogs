import { verifyOAuthState } from "@/lib/admin";
import { siteConfig } from "@/data/site";

export const dynamic = "force-dynamic";

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function page(title: string, body: string, status = 200) {
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${escape(title)}</title>
<style>body{margin:0;background:#0d0d0c;color:#f5f5f0;font:16px/1.6 system-ui,sans-serif}main{max-width:680px;margin:0 auto;padding:40px 20px}h1{font-size:26px;margin:0 0 12px}.ok{color:#ffc21a}.warn{background:#3a1a14;border:1px solid #e5362b;border-radius:12px;padding:12px 16px}textarea{width:100%;box-sizing:border-box;min-height:120px;background:#161614;color:#fff;border:1px solid #34342f;border-radius:12px;padding:12px;font:14px monospace}ol{padding-left:20px}code{background:#1c1c1a;padding:2px 6px;border-radius:6px}button{background:#ffc21a;color:#0d0d0c;border:0;border-radius:999px;padding:10px 18px;font-weight:700;cursor:pointer}</style></head>
<body><main>${body}</main></body></html>`;
  return new Response(html, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "referrer-policy": "no-referrer",
      "x-robots-tag": "noindex",
    },
  });
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  if (params.get("error")) {
    return page("Conexión cancelada", `<h1>Conexión cancelada</h1><p>Google respondió: <code>${escape(params.get("error")!)}</code>. Puedes intentarlo de nuevo.</p>`, 400);
  }
  if (!verifyOAuthState(params.get("state"))) {
    return page("Enlace caducado", "<h1>Enlace caducado o inválido</h1><p>Vuelve a abrir <code>/api/youtube/connect?secret=…</code> y repite el proceso.</p>", 400);
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: params.get("code") ?? "",
      client_id: process.env.YOUTUBE_CLIENT_ID ?? "",
      client_secret: process.env.YOUTUBE_CLIENT_SECRET ?? "",
      redirect_uri: `${siteConfig.url}/api/youtube/callback`,
      grant_type: "authorization_code",
    }),
    cache: "no-store",
  });
  const tokens = (await tokenRes.json()) as { refresh_token?: string; access_token?: string; error_description?: string };
  if (!tokenRes.ok || !tokens.refresh_token) {
    return page("No se pudo conectar", `<h1>No se pudo conectar</h1><p>${escape(tokens.error_description ?? "Google no devolvió el token de acceso permanente.")}</p><p>Revisa que la app esté publicada ("En producción") y repite el proceso.</p>`, 400);
  }

  // Qué canal se autorizó (para avisar si no es el del media kit).
  let channelTitle = "";
  let channelId = "";
  try {
    const me = await fetch("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
      cache: "no-store",
    });
    const json = (await me.json()) as { items?: { id: string; snippet: { title: string } }[] };
    channelId = json.items?.[0]?.id ?? "";
    channelTitle = json.items?.[0]?.snippet.title ?? "";
  } catch {
    // Solo informativo.
  }
  const wrongChannel = channelId && channelId !== siteConfig.channelId;

  return page(
    "YouTube conectado",
    `<h1 class="ok">✓ YouTube Analytics autorizado</h1>
<p>Canal autorizado: <strong>${escape(channelTitle || "desconocido")}</strong> <code>${escape(channelId)}</code></p>
${wrongChannel ? `<p class="warn">Ojo: este no es el canal del media kit (<code>${siteConfig.channelId}</code>). Repite el proceso y, en la pantalla de Google, elige el canal MaestreVlogs.</p>` : ""}
<p>Último paso: copia este código y guárdalo en Vercel.</p>
<textarea id="t" readonly>${escape(tokens.refresh_token)}</textarea>
<p><button onclick="navigator.clipboard.writeText(document.getElementById('t').value);this.textContent='Copiado ✓'">Copiar código</button></p>
<ol>
<li>Vercel → proyecto <strong>maestrevlogs</strong> → Settings → Environments → Production → Environment Variables.</li>
<li>Añade <code>YOUTUBE_REFRESH_TOKEN</code> con este código y guarda.</li>
<li>Deployments → ⋯ → Redeploy.</li>
</ol>
<p>No compartas este código: permite leer las estadísticas privadas de tu canal (solo lectura).</p>`
  );
}
