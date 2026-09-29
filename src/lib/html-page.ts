/** Páginas HTML sencillas para las rutas de administración (conexión y diagnóstico). */

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const styles =
  "body{margin:0;background:#0d0d0c;color:#f5f5f0;font:16px/1.6 system-ui,sans-serif}main{max-width:720px;margin:0 auto;padding:40px 20px}" +
  "h1{font-size:26px;margin:0 0 12px}h2{font-size:18px;margin:28px 0 8px}.ok{color:#ffc21a}.muted{color:#a3a39a;font-size:14px}" +
  ".warn{background:#3a1a14;border:1px solid #e5362b;border-radius:12px;padding:12px 16px}" +
  "textarea{width:100%;box-sizing:border-box;min-height:120px;background:#161614;color:#fff;border:1px solid #34342f;border-radius:12px;padding:12px;font:14px monospace}" +
  "ol{padding-left:20px}code{background:#1c1c1a;padding:2px 6px;border-radius:6px;word-break:break-all}" +
  "button,.btn{display:inline-block;background:#ffc21a;color:#0d0d0c;border:0;border-radius:999px;padding:10px 18px;font-weight:700;cursor:pointer;text-decoration:none}" +
  ".checks{list-style:none;padding:0;margin:0}.checks li{display:flex;gap:12px;padding:14px 0;border-bottom:1px solid #26261f}" +
  ".checks .icon{flex:none;font-size:20px;line-height:1.4}.checks strong{display:block}.checks .detail{color:#d6d6cc;font-size:15px}" +
  ".checks .hint{margin-top:6px;color:#ffc21a;font-size:14px}";

export function htmlPage(title: string, body: string, status = 200) {
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${escapeHtml(title)}</title>
<style>${styles}</style></head>
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
