import { Globe2, Tv, Users } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { coreAgeGroups } from "@/data/channel";
import { intlLocale } from "@/i18n/config";
import type { AnalyticsData } from "@/lib/analytics";
import { cn, fill, formatNumber } from "@/lib/utils";

/**
 * Gráficos de barras en HTML (se leen sin JS, se imprimen bien y cada valor
 * va rotulado). Forma "énfasis": un color destaca lo importante y el gris
 * da contexto.
 */
export function Audience({ lang, dict, analytics }: { lang: Locale; dict: Dictionary; analytics: AnalyticsData }) {
  const t = dict.audience;
  const pct = (v: number) => `${formatNumber(lang, v, 1)}%`;
  const { ageGroups, countries, devices, gender, outsideVenezuelaShare } = analytics.audience;
  // Nombres de país en el idioma de la página (cualquier país que aparezca).
  const regionNames = new Intl.DisplayNames([intlLocale[lang]], { type: "region" });
  const countryName = (code: string) =>
    code === "OTHER" ? t.countryNames.OTHER : (t.countryNames as Record<string, string>)[code] ?? regionNames.of(code) ?? code;
  const description = fill(t.description, { period: analytics.audienceIsLive ? t.periodLive : t.periodSaved });

  const adults = ageGroups.filter((g) => g.id !== "13-17" && g.id !== "18-24").reduce((a, g) => a + g.share, 0);
  const core = ageGroups.filter((g) => coreAgeGroups.includes(g.id)).reduce((a, g) => a + g.share, 0);
  const maxAge = Math.max(...ageGroups.map((g) => g.share));
  const maxCountry = Math.max(...countries.map((c) => c.share));
  const tv = devices.find((d) => d.id === "tv") ?? { id: "tv", views: 0, watchTime: 0 };

  return (
    <section id="audiencia" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute right-0 top-40 h-96 w-96 rounded-full bg-world-500/10 blur-[140px]" />
      <Container className="relative">
        <FadeIn>
          <SectionHeading index="03" eyebrow={t.eyebrow} title={t.title} highlight={t.highlight} description={description} />
        </FadeIn>

        <div className="mt-14 grid gap-4 lg:grid-cols-2">
          {/* Edad */}
          <FadeIn>
            <Card icon={<Users className="h-5 w-5" />} title={t.ageTitle}>
              <HeroFigure value={pct(Math.round(adults))} label={t.ageHeroLabel} />
              <ul className="mt-7 space-y-2.5">
                {ageGroups.map((g) => {
                  const isCore = coreAgeGroups.includes(g.id);
                  return (
                    <li key={g.id} className="group grid grid-cols-[3.5rem_1fr_3.5rem] items-center gap-3 text-sm">
                      <span className="font-medium text-body-strong tabular-nums">{g.id}</span>
                      <span className="relative h-6">
                        <span
                          className={cn(
                            "absolute inset-y-0 left-0 rounded-r-[4px] transition-[filter] duration-200 group-hover:brightness-125",
                            isCore ? "bg-[var(--chart-accent)]" : "bg-[var(--chart-muted)]"
                          )}
                          style={{ width: `${Math.max(1, (g.share / maxAge) * 100)}%` }}
                        />
                      </span>
                      <span className="text-right font-bold text-heading tabular-nums">{pct(g.share)}</span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-5 flex items-center gap-2 text-sm text-body">
                <span className="h-3 w-3 rounded-sm bg-[var(--chart-accent)]" aria-hidden />
                {fill(t.ageCore, { share: formatNumber(lang, core, 1) })}
              </p>
            </Card>
          </FadeIn>

          {/* Países */}
          <FadeIn delay={0.06}>
            <Card icon={<Globe2 className="h-5 w-5" />} title={t.countriesTitle}>
              <HeroFigure value={pct(outsideVenezuelaShare)} label={t.countriesHeroLabel} />
              <ul className="mt-7 space-y-2.5">
                {countries.map((c) => {
                  const isHome = c.code === "VE";
                  return (
                    <li key={c.code} className="group grid grid-cols-[7.5rem_1fr_3.5rem] items-center gap-3 text-sm sm:grid-cols-[8.5rem_1fr_3.5rem]">
                      <span className="truncate font-medium text-body-strong">{countryName(c.code)}</span>
                      <span className="relative h-6">
                        <span
                          className={cn(
                            "absolute inset-y-0 left-0 rounded-r-[4px] transition-[filter] duration-200 group-hover:brightness-125",
                            isHome ? "bg-[var(--chart-muted)]" : "bg-[var(--chart-world)]"
                          )}
                          style={{ width: `${Math.max(1, (c.share / maxCountry) * 100)}%` }}
                        />
                      </span>
                      <span className="text-right font-bold text-heading tabular-nums">{pct(c.share)}</span>
                    </li>
                  );
                })}
              </ul>
              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-body" aria-label="Leyenda">
                <li className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-[var(--chart-muted)]" aria-hidden />
                  {t.inVenezuela}
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-[var(--chart-world)]" aria-hidden />
                  {t.outside}
                </li>
              </ul>
            </Card>
          </FadeIn>

          {/* Dispositivos */}
          <FadeIn>
            <Card icon={<Tv className="h-5 w-5" />} title={t.devicesTitle}>
              <HeroFigure value={pct(tv.views)} label={t.devicesHeroLabel} />
              <div className="mt-7 space-y-5">
                {(["views", "watchTime"] as const).map((metric) => (
                  <div key={metric}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                      {metric === "views" ? t.viewsLabel : t.watchLabel}
                    </p>
                    {/* Barra apilada con 2px de separación entre segmentos */}
                    <div className="flex h-9 gap-[2px] overflow-hidden rounded-[6px]">
                      {devices.map((d) => (
                        <span
                          key={d.id}
                          title={`${t.deviceNames[d.id]}: ${pct(d[metric])}`}
                          className={cn(
                            "flex h-full items-center justify-start px-2 text-xs font-bold transition-[filter] hover:brightness-125",
                            d.id === "tv" ? "bg-[var(--chart-accent)] text-ink-950" : "bg-[var(--chart-muted)] text-white"
                          )}
                          style={{ width: `${d[metric]}%` }}
                        >
                          {d[metric] >= 18 ? pct(d[metric]) : null}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {devices.map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-2 text-body">
                    <span className="flex items-center gap-2">
                      <span
                        className={cn("h-3 w-3 rounded-sm", d.id === "tv" ? "bg-[var(--chart-accent)]" : "bg-[var(--chart-muted)]")}
                        aria-hidden
                      />
                      {t.deviceNames[d.id]}
                    </span>
                    <span className="font-semibold tabular-nums text-body-strong">{pct(d.views)}</span>
                  </li>
                ))}
              </ul>
              <p className="text-pretty mt-5 text-sm leading-relaxed text-body">
                {fill(t.devicesNote, { share: formatNumber(lang, tv.watchTime, 1) })}
              </p>
            </Card>
          </FadeIn>

          {/* Género + intereses */}
          <FadeIn delay={0.06}>
            <Card icon={<Users className="h-5 w-5" />} title={t.genderTitle}>
              <div className="flex h-9 gap-[2px] overflow-hidden rounded-[6px]">
                <span
                  className="flex items-center bg-[var(--chart-accent)] px-3 text-xs font-bold text-ink-950"
                  style={{ width: `${gender.male}%` }}
                >
                  {pct(gender.male)}
                </span>
                <span
                  className="flex items-center justify-end bg-[var(--chart-muted)] px-3 text-xs font-bold text-white"
                  style={{ width: `${gender.female}%` }}
                >
                  {pct(gender.female)}
                </span>
              </div>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-body">
                <li className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-[var(--chart-accent)]" aria-hidden />
                  {t.male} · {pct(gender.male)}
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-[var(--chart-muted)]" aria-hidden />
                  {t.female} · {pct(gender.female)}
                </li>
              </ul>

              <h4 className="mt-9 text-sm font-bold text-heading">{t.interestsTitle}</h4>
              <ul className="mt-4 flex flex-wrap gap-2">
                {t.interests.map((interest) => (
                  <li
                    key={interest}
                    className="rounded-full border border-ink-600 bg-white/[0.02] px-3.5 py-1.5 text-sm font-medium text-body-strong transition-colors hover:border-brand-400/50 hover:text-heading"
                  >
                    {interest}
                  </li>
                ))}
              </ul>
            </Card>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="h-full rounded-3xl border border-default bg-card p-6 sm:p-8">
      <h3 className="flex items-center gap-2.5 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        <span className="text-brand-400">{icon}</span>
        {title}
      </h3>
      <div className="mt-5">{children}</div>
    </div>
  );
}

/** Cifra protagonista de la tarjeta: misma tipografía sans, sin tabular-nums. */
function HeroFigure({ value, label }: { value: string; label: string }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="text-5xl font-extrabold tracking-tight text-heading sm:text-6xl">{value}</span>
      <span className="text-base font-medium text-body">{label}</span>
    </p>
  );
}
