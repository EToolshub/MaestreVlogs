import Image from "next/image";
import { BadgeCheck, Quote } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InstagramIcon, TiktokIcon, YoutubeIcon } from "@/components/icons/SocialIcons";
import { siteConfig } from "@/data/site";
import { fill } from "@/lib/utils";

export function About({ dict }: { dict: Dictionary }) {
  const t = dict.about;
  const socials = [
    { href: siteConfig.social.youtube, label: siteConfig.social.youtubeHandle, Icon: YoutubeIcon },
    { href: siteConfig.social.instagram, label: siteConfig.social.instagramHandle, Icon: InstagramIcon },
    { href: siteConfig.social.tiktok, label: siteConfig.social.tiktokHandle, Icon: TiktokIcon },
  ];

  return (
    <section id="sobre-mi" className="relative py-24 sm:py-32">
      <Container className="grid items-center gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <FadeIn>
          {/* Credencial de prensa */}
          <div className="relative mx-auto max-w-sm rotate-[-2deg] rounded-[28px] border border-white/10 bg-card p-4 shadow-[0_40px_100px_-40px_rgb(0_0_0/0.9)] transition-transform duration-500 hover:rotate-0">
            <div className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rounded-md bg-ink-600" aria-hidden />
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-brand-400/30 via-ink-800 to-world-500/30">
              <Image
                src={siteConfig.avatarUrl}
                alt={`${siteConfig.creatorName} — ${siteConfig.name}`}
                fill
                sizes="(min-width: 1024px) 360px, 80vw"
                className="object-cover"
              />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded bg-black/60 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur">
                <span className="h-2 w-2 animate-rec rounded-full bg-rec-400" />
                Creator ID
              </span>
            </div>
            <div className="px-2 pb-2 pt-5">
              <p className="flex items-center gap-2 font-display text-3xl text-heading">
                {siteConfig.creatorName}
                <BadgeCheck className="h-6 w-6 text-brand-400" aria-hidden />
              </p>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">{siteConfig.name}</p>
              <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-dashed border-white/10 pt-5">
                {t.facts.map((fact) => (
                  <div key={fact.label} className="flex flex-col-reverse">
                    <dt className="text-[11px] uppercase tracking-wider text-subtle">{fact.label}</dt>
                    <dd className="text-sm font-bold text-heading">{fact.value}</dd>
                  </div>
                ))}
              </dl>
              <ul className="mt-5 flex flex-wrap gap-2">
                {socials.map(({ href, label, Icon }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-ink-600 px-3 py-1.5 text-xs font-semibold text-body-strong transition-colors hover:border-brand-400/60 hover:text-heading"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <SectionHeading
            index="01"
            eyebrow={t.eyebrow}
            title={fill(t.title, { name: siteConfig.creatorName })}
            highlight={t.highlight}
          />
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-body">
            {t.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="text-pretty">
                {p}
              </p>
            ))}
          </div>
          <blockquote className="relative mt-10 rounded-3xl border border-brand-400/20 bg-brand-400/[0.06] p-6 sm:p-8">
            <Quote className="absolute -top-4 left-6 h-8 w-8 rounded-full bg-brand-400 p-1.5 text-ink-950" aria-hidden />
            <p className="text-pretty text-xl font-semibold leading-snug text-heading sm:text-2xl">“{t.quote}”</p>
            <footer className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-muted">
              — {siteConfig.creatorName}, {siteConfig.name}
            </footer>
          </blockquote>
        </FadeIn>
      </Container>
    </section>
  );
}
