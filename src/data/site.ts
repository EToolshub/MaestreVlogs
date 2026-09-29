/**
 * Configuración general del media kit.
 * Todo lo que es "dato de contacto" o "enlace" vive aquí: cámbialo una vez
 * y se actualiza en toda la web (ES y EN).
 */
export const siteConfig = {
  name: "MaestreVlogs",
  /** Cómo firmas: aparece en "Quién está detrás" y en los mensajes a marcas. */
  creatorName: "Gabo",
  // Dominio público en Vercel. Si compras un dominio propio, cámbialo aquí.
  url: "https://maestrevlogs.vercel.app",
  /** ID de medición de Google Analytics 4 (vacío = sin analítica). */
  googleAnalyticsId: "G-X59X3P6CND",

  contact: {
    email: "1maestre1contact@gmail.com",
    whatsapp: {
      // Número con código de país, solo dígitos. Si lo dejas vacío, el botón
      // de WhatsApp desaparece de la web.
      phoneDigitsOnly: "584164086825",
      displayNumber: "+58 416 408 6825",
    },
  },

  /** Apoyos de la comunidad (sección "Apoya el canal"). */
  support: {
    paypalMe: "https://www.paypal.com/paypalme/gabo01ldr",
    binanceUid: "281448770",
    amounts: [3, 5, 10, 20, 50],
  },

  social: {
    youtube: "https://www.youtube.com/@MaestreVlogs",
    youtubeHandle: "@MaestreVlogs",
    instagram: "https://www.instagram.com/gabo.maestre1",
    instagramHandle: "@gabo.maestre1",
    tiktok: "https://www.tiktok.com/@maestre.vlogs",
    tiktokHandle: "@maestre.vlogs",
  },

  channelId: "UCEdq3QdTk1GiSYTmPk-JXOw",
  avatarUrl:
    "https://yt3.ggpht.com/MDyXG6VOraW8s7sNc-IFxPLxoz_yiTk9kBhHtJ8fVQD2tq2uDUBqASYI0xoJk8FUcIqu_rUBvw=s800-c-k-c0x00ffffff-no-rj",
} as const;
