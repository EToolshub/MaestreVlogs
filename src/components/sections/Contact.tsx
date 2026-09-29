import { Mail } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InstagramIcon, TiktokIcon, WhatsappIcon, YoutubeIcon } from "@/components/icons/SocialIcons";
import { ContactForm } from "./ContactForm";
import { CopyEmail } from "./CopyEmail";
import { PrintButton } from "./PrintButton";
import { formats } from "@/data/formats";
import { siteConfig } from "@/data/site";
import { buildWhatsAppLink, fill } from "@/lib/utils";

export function Contact({ dict }: { dict: Dictionary }) {
  const t = dict.contact;
  const { email, whatsapp } = siteConfig.contact;
  const interests = [...formats.map((f) => dict.formats.items[f.id].name), t.interestUnsure];
  const socials = [
    { href: siteConfig.social.youtube, label: siteConfig.social.youtubeHandle, name: "YouTube", Icon: YoutubeIcon },
    { href: siteConfig.social.instagram, label: siteConfig.social.instagramHandle, name: "Instagram", Icon: InstagramIcon },
    { href: siteConfig.social.tiktok, label: siteConfig.social.tiktokHandle, name: "TikTok", Icon: TiktokIcon },
  ];

  return (
    <section id="contacto" className="relative overflow-hidden border-t border-white/[0.06] py-24 sm:py-32">
      <div className="bg-caution absolute inset-x-0 top-0 h-2 opacity-70" aria-hidden />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-brand-400/10 blur-[150px]" />
      <Container className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <FadeIn>
          <SectionHeading index="12" eyebrow={t.eyebrow} title={t.title} highlight={t.highlight} description={t.description} />

          <div className="mt-10 space-y-6">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted">{t.direct}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 break-all text-lg font-bold text-heading underline-offset-4 hover:text-brand-300 hover:underline sm:text-xl"
                >
                  <Mail className="h-5 w-5 shrink-0 text-brand-400" aria-hidden />
                  {email}
                </a>
                <CopyEmail email={email} label={t.copyEmail} copiedLabel={t.copied} />
              </div>
              {whatsapp.phoneDigitsOnly && (
                <a
                  href={buildWhatsAppLink(whatsapp.phoneDigitsOnly, fill(t.whatsappGreeting, { name: siteConfig.creatorName }))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 font-semibold text-body-strong hover:text-heading"
                >
                  <WhatsappIcon className="h-5 w-5 text-whatsapp" />
                  {t.whatsapp} · {whatsapp.displayNumber}
                </a>
              )}
            </div>

            <div className="no-print max-w-md">
              <PrintButton label={t.download} hint={t.downloadHint} />
            </div>

            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted">{t.socials}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {socials.map(({ href, label, name, Icon }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${name} ${label}`}
                      className="inline-flex items-center gap-2 rounded-full border border-ink-600 px-4 py-2 text-sm font-semibold text-body-strong transition-colors hover:border-brand-400/60 hover:text-heading"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.08} className="no-print">
          <ContactForm t={t} email={email} interests={interests} />
        </FadeIn>
      </Container>
    </section>
  );
}
