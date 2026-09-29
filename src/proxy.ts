import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, type Locale } from "@/i18n/config";

/** Elige el idioma según el navegador (Accept-Language): inglés o español. */
function preferredLocale(request: NextRequest): Locale {
  const header = request.headers.get("accept-language") ?? "";
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { lang: tag.slice(0, 2).toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of ranked) {
    if (hasLocale(lang)) return lang;
  }
  return defaultLocale;
}

// Solo actúa en la raíz: "/" → "/es" o "/en". El resto de rutas ya llevan idioma.
export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/"],
};
