import { ImageResponse } from "next/og";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { channelStats, devices, outsideVenezuelaShare } from "@/data/channel";
import { getYoutubeData } from "@/lib/youtube";
import { formatCompact, formatNumber } from "@/lib/utils";

export const alt = "MaestreVlogs · Media Kit";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 21600;

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang = hasLocale(raw) ? raw : "es";
  const [dict, yt] = await Promise.all([getDictionary(lang), getYoutubeData()]);
  const tv = Math.round(devices.find((d) => d.id === "tv")!.views);

  const stats = [
    { v: formatNumber(lang, yt.subscribers), l: dict.hero.trustSubs },
    { v: formatCompact(lang, channelStats.views), l: dict.hero.trustViews },
    { v: `${formatNumber(lang, Math.round(outsideVenezuelaShare))}%`, l: dict.audience.countriesHeroLabel },
    { v: `${tv}%`, l: "Smart TV" },
  ];

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0d0d0c", color: "#f5f5f0", padding: 64, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: "#ffc21a", display: "flex", alignItems: "center", justifyContent: "center", color: "#0d0d0c", fontSize: 40, fontWeight: 800 }}>
              M
            </div>
            <div style={{ display: "flex", fontSize: 40, fontWeight: 800 }}>
              <span>Maestre</span>
              <span style={{ color: "#ffc21a" }}>Vlogs</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 24, letterSpacing: 4 }}>
            <div style={{ width: 18, height: 18, borderRadius: 9, background: "#ff453a" }} />
            MEDIA KIT 2026
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1, letterSpacing: -2 }}>{dict.hero.titleLead}</div>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.1, color: "#ffc21a", letterSpacing: -2 }}>{dict.hero.rotating[0]}</div>
          <div style={{ fontSize: 30, color: "#b3b3ab", marginTop: 20 }}>{dict.meta.ogTagline}</div>
        </div>

        <div style={{ display: "flex", gap: 20 }}>
          {stats.map((s) => (
            <div key={s.l} style={{ display: "flex", flexDirection: "column", flex: 1, border: "2px solid #262624", borderRadius: 20, padding: "18px 22px", background: "#161614" }}>
              <div style={{ fontSize: 44, fontWeight: 800 }}>{s.v}</div>
              <div style={{ fontSize: 20, color: "#9a9a92" }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 12, display: "flex", background: "repeating-linear-gradient(-45deg, #ffc21a 0 18px, #0d0d0c 18px 36px)" }} />
      </div>
    ),
    { ...size }
  );
}
