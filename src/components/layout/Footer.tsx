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
        <p>{fill(t.dataNote, { date: formatDate(lang, statsPeriod.updatedAt) })}</p>
      </Container>
    </footer>
  );
}
