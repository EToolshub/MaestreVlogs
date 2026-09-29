import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { hasLocale, type Locale } from "@/i18n/config";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/data/site";
import { formatDate } from "@/lib/utils";

const UPDATED_AT = "2026-09-29";

const links = {
  youtubeTerms: "https://www.youtube.com/t/terms",
  googlePrivacy: "https://policies.google.com/privacy",
  userDataPolicy: "https://developers.google.com/terms/api-services-user-data-policy",
  permissions: "https://myaccount.google.com/permissions",
  gaOptOut: "https://tools.google.com/dlpage/gaoptout",
  googlePartners: "https://policies.google.com/technologies/partner-sites",
};

type Block = { title: string; paragraphs: React.ReactNode[] };

const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-300 underline underline-offset-4 hover:text-brand-200">
    {children}
  </a>
);

const email = siteConfig.contact.email;
const Mail = () => <A href={`mailto:${email}`}>{email}</A>;

const content: Record<Locale, { title: string; description: string; back: string; updated: string; blocks: Block[] }> = {
  es: {
    title: "Política de privacidad",
    description: "Cómo trata los datos la web del media kit de MaestreVlogs.",
    back: "Volver al media kit",
    updated: "Última actualización",
    blocks: [
      {
        title: "1. Responsable",
        paragraphs: [
          <>
            Esta web es el media kit del canal de YouTube <strong>{siteConfig.name}</strong>, de {siteConfig.creatorName}. Para cualquier
            consulta sobre privacidad escribe a <Mail />.
          </>,
        ],
      },
      {
        title: "2. Datos de los visitantes",
        paragraphs: [
          "No hay registro ni cuentas de usuario, y la web no usa cookies de publicidad.",
          "El formulario de contacto, el configurador de campañas y la sección de apoyo no guardan nada en ningún servidor: solo abren tu aplicación de correo o WhatsApp con el mensaje ya redactado, y tú decides si lo envías.",
          "El proveedor de alojamiento (Vercel) puede registrar datos técnicos como la dirección IP o el navegador en sus registros de servidor, por motivos de seguridad y funcionamiento.",
        ],
      },
      {
        title: "3. Estadísticas de visitas (Google Analytics)",
        paragraphs: [
          "Usamos Google Analytics para saber cuántas personas visitan la web, desde qué países y dispositivos, cómo llegaron y qué secciones ven. Estos datos se miran siempre en conjunto, nunca persona por persona, y sirven solo para mejorar el media kit.",
          <>
            Google Analytics guarda cookies propias en tu navegador (por ejemplo, <code>_ga</code>) y Google trata esos datos según su{" "}
            <A href={links.googlePrivacy}>Política de privacidad</A> (<A href={links.googlePartners}>cómo usa Google los datos de los sitios que usan sus servicios</A>).
            Puedes bloquearlas desde la configuración de tu navegador o con el <A href={links.gaOptOut}>complemento de inhabilitación de Google Analytics</A>.
          </>,
        ],
      },
      {
        title: "4. Servicios de terceros",
        paragraphs: [
          <>
            Las miniaturas se cargan desde servidores de YouTube, y los videos se reproducen con el reproductor de YouTube en modo de privacidad
            mejorada (youtube-nocookie.com) solo cuando pulsas reproducir. En ambos casos se aplica la <A href={links.googlePrivacy}>Política de
            privacidad de Google</A>.
          </>,
          "Los enlaces a PayPal, Binance, WhatsApp, Instagram y TikTok llevan a servicios externos que tienen sus propias políticas de privacidad.",
        ],
      },
      {
        title: "5. Uso de los Servicios de API de YouTube",
        paragraphs: [
          <>
            Esta web usa los Servicios de API de YouTube para mostrar datos públicos del canal {siteConfig.name} (suscriptores, vistas y videos)
            y estadísticas de YouTube Analytics del propio canal. Al usar esta web aceptas las{" "}
            <A href={links.youtubeTerms}>Condiciones del Servicio de YouTube</A>. Consulta también la{" "}
            <A href={links.googlePrivacy}>Política de privacidad de Google</A>.
          </>,
          "Las estadísticas se muestran siempre como totales y porcentajes (vistas, tiempo de visualización, suscriptores, edad, género, país y dispositivo de la audiencia). Nunca incluyen datos de personas concretas.",
        ],
      },
      {
        title: "6. Aplicación de Google \"MaestreVlogs web\"",
        paragraphs: [
          "Solo el titular del canal inicia sesión con Google en esta aplicación. Lo hace una única vez, para autorizar el acceso de solo lectura a las estadísticas de su canal (permisos youtube.readonly y yt-analytics.readonly). Los visitantes nunca inician sesión con Google.",
          "El token de autorización se guarda cifrado como variable de entorno del servidor. No se comparte, no se vende y no se usa para publicidad: solo sirve para mostrar las estadísticas del canal en esta web. Los datos obtenidos se guardan en caché como máximo una hora y después se vuelven a pedir a YouTube.",
          <>
            El uso de la información recibida de las API de Google cumple la{" "}
            <A href={links.userDataPolicy}>Política de Datos del Usuario de los Servicios de API de Google</A>, incluidos los requisitos de Uso
            Limitado. El titular puede retirar el acceso en cualquier momento desde <A href={links.permissions}>myaccount.google.com/permissions</A>.
          </>,
        ],
      },
      {
        title: "7. Contacto y cambios",
        paragraphs: [
          <>
            Para preguntas o solicitudes sobre tus datos escribe a <Mail />. Si esta política cambia, la nueva versión se publicará en esta página
            con su fecha.
          </>,
        ],
      },
    ],
  },
  en: {
    title: "Privacy policy",
    description: "How the MaestreVlogs media kit website handles data.",
    back: "Back to the media kit",
    updated: "Last updated",
    blocks: [
      {
        title: "1. Who we are",
        paragraphs: [
          <>
            This website is the media kit of the YouTube channel <strong>{siteConfig.name}</strong>, run by {siteConfig.creatorName}. For any
            privacy question, email <Mail />.
          </>,
        ],
      },
      {
        title: "2. Visitor data",
        paragraphs: [
          "There are no user accounts or sign-ups, and the site uses no advertising cookies.",
          "The contact form, the campaign builder and the support section store nothing on any server: they only open your email app or WhatsApp with a pre-written message, and you decide whether to send it.",
          "The hosting provider (Vercel) may record technical data such as IP address or browser in its server logs for security and operation.",
        ],
      },
      {
        title: "3. Visit statistics (Google Analytics)",
        paragraphs: [
          "We use Google Analytics to learn how many people visit the site, from which countries and devices, how they arrived and which sections they view. This data is only looked at in aggregate, never person by person, and is used solely to improve the media kit.",
          <>
            Google Analytics stores first-party cookies in your browser (for example, <code>_ga</code>) and Google processes that data under its{" "}
            <A href={links.googlePrivacy}>Privacy Policy</A> (<A href={links.googlePartners}>how Google uses information from sites that use its services</A>).
            You can block them in your browser settings or with the <A href={links.gaOptOut}>Google Analytics opt-out add-on</A>.
          </>,
        ],
      },
      {
        title: "4. Third-party services",
        paragraphs: [
          <>
            Thumbnails load from YouTube servers, and videos play in YouTube&apos;s privacy-enhanced player (youtube-nocookie.com) only when you
            press play. The <A href={links.googlePrivacy}>Google Privacy Policy</A> applies to both.
          </>,
          "Links to PayPal, Binance, WhatsApp, Instagram and TikTok lead to external services with their own privacy policies.",
        ],
      },
      {
        title: "5. Use of YouTube API Services",
        paragraphs: [
          <>
            This website uses YouTube API Services to show public data about the {siteConfig.name} channel (subscribers, views and videos) and the
            channel&apos;s own YouTube Analytics statistics. By using this website you agree to the{" "}
            <A href={links.youtubeTerms}>YouTube Terms of Service</A>. See also the <A href={links.googlePrivacy}>Google Privacy Policy</A>.
          </>,
          "Statistics are always shown as totals and percentages (views, watch time, subscribers, audience age, gender, country and device). They never include data about specific people.",
        ],
      },
      {
        title: "6. The \"MaestreVlogs web\" Google app",
        paragraphs: [
          "Only the channel owner signs in with Google to this app, once, to grant read-only access to the channel's statistics (youtube.readonly and yt-analytics.readonly scopes). Visitors never sign in with Google.",
          "The authorization token is stored encrypted as a server environment variable. It is not shared, sold or used for advertising; it is only used to show the channel's statistics on this website. Retrieved data is cached for at most one hour and then requested again from YouTube.",
          <>
            Use of information received from Google APIs adheres to the{" "}
            <A href={links.userDataPolicy}>Google API Services User Data Policy</A>, including the Limited Use requirements. The owner can revoke
            access at any time at <A href={links.permissions}>myaccount.google.com/permissions</A>.
          </>,
        ],
      },
      {
        title: "7. Contact and changes",
        paragraphs: [
          <>
            For questions or requests about your data, email <Mail />. If this policy changes, the new version will be posted on this page with
            its date.
          </>,
        ],
      },
    ],
  },
};

export async function generateMetadata({ params }: PageProps<"/[lang]/privacidad">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = content[lang];
  return {
    title: `${t.title} · ${siteConfig.name}`,
    description: t.description,
    alternates: {
      canonical: `/${lang}/privacidad`,
      languages: { es: "/es/privacidad", en: "/en/privacidad" },
    },
  };
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacidad">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = content[lang];

  return (
    <Container className="max-w-3xl pb-24 pt-32 sm:pt-40">
      <Link href={`/${lang}`} className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-heading">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {t.back}
      </Link>
      <h1 className="mt-8 font-display text-5xl text-heading sm:text-6xl">{t.title}</h1>
      <p className="mt-4 text-sm text-muted">
        {t.updated}: {formatDate(lang, UPDATED_AT)}
      </p>
      <div className="mt-12 space-y-10">
        {t.blocks.map((block) => (
          <section key={block.title}>
            <h2 className="text-xl font-bold text-heading">{block.title}</h2>
            <div className="mt-3 space-y-3 leading-relaxed text-body">
              {block.paragraphs.map((p, i) => (
                <p key={i} className="text-pretty">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Container>
  );
}
