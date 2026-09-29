import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { InstagramIcon, TiktokIcon, YoutubeIcon } from "@/components/icons/SocialIcons";
import { statsPeriod } from "@/data/channel";
import { siteConfig } from "@/data/site";
import { fill, formatDate } from "@/lib/utils";

export function Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const t = dict.footer;
  const socials = [
    { href: siteConfig.social.youtube, label: "YouTube", Icon: YoutubeIcon },
    { href: siteConfig.social.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: siteConfig.social.tiktok, label: "TikTok", Icon: TiktokIcon },
  ];

  return (
    <footer className="border-t border-white/[0.06] bg-ink-950">
      <Container className="flex flex-col gap-8 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-muted">{t.tagline}</p>
        </div>
        <a
          href={`/${lang}#apoyo`}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-400/40 px-4 py-2 text-sm font-bold text-brand-300 transition-colors hover:bg-brand-400/10"
        >
          ♥ {dict.live.support}
        </a>
        <ul className="flex gap-2">
          {socials.map(({ href, label, Icon }) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-11 w-11 place-items-center rounded-full border border-ink-600 text-body transition-colors hover:border-brand-400/60 hover:text-brand-400"
              >
                <Icon className="h-5 w-5" />
              </a>
            </li>
          ))}
        </ul>
      </Container>
      <Container className="flex flex-col gap-2 border-t border-white/[0.06] py-6 text-xs text-subtle sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. {t.rights}
        </p>
        <p className="flex flex-wrap gap-x-4 gap-y-1">
          <span>{fill(t.dataNote, { date: formatDate(lang, statsPeriod.updatedAt) })}</span>
          <Link href={`/${lang}/privacidad`} className="underline underline-offset-4 hover:text-heading">
            {t.privacy}
          </Link>
        </p>
      </Container>
    </footer>
  );
}
