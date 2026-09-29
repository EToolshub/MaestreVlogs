import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { statsPeriod } from "@/data/channel";
import { siteConfig } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/privacidad"].flatMap((path) =>
    locales.map((lang) => ({
      url: `${siteConfig.url}/${lang}${path}`,
      lastModified: statsPeriod.updatedAt,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${siteConfig.url}/${l}${path}`])) },
    }))
  );
}
