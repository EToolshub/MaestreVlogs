import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Clave de administración (variable ADMIN_SECRET en Vercel). Protege las
 * rutas /api/revalidate y /api/youtube/connect.
 */
export const adminSecret = () => process.env.ADMIN_SECRET || process.env.REVALIDATE_SECRET || "";

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function checkAdminSecret(provided: string | null) {
  const secret = adminSecret();
  return Boolean(secret && provided && safeEqual(provided, secret));
}

const sign = (value: string) => createHmac("sha256", adminSecret()).update(value).digest("hex");

/** Valor "state" de OAuth firmado y con caducidad (15 min). */
export function createOAuthState() {
  const ts = Date.now().toString();
  return `${ts}.${sign(ts)}`;
}

export function verifyOAuthState(state: string | null) {
  if (!state || !adminSecret()) return false;
  const [ts, sig] = state.split(".");
  if (!ts || !sig || Date.now() - Number(ts) > 15 * 60 * 1000) return false;
  return safeEqual(sig, sign(ts));
}
