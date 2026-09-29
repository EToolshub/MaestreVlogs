# MaestreVlogs · Media Kit web

Web de media kit para presentar el canal **[MaestreVlogs](https://www.youtube.com/@MaestreVlogs)**
a marcas y agencias. Bilingüe (español / inglés), responsive, interactiva y con
datos reales de YouTube Analytics.

Construida con Next.js 16 (App Router), TypeScript y Tailwind CSS v4, con la
misma base técnica que Pixolve Agency.

- `/es`: versión en español
- `/en`: versión en inglés
- `/`: redirige a `/es` o `/en` según el idioma del navegador

## Qué incluye

| # | Sección | Para qué sirve |
| --- | --- | --- |
| — | Portada | Visor de cámara (REC, código de tiempo) que pasa por tus videos más vistos, titular rotativo y cifras clave |
| — | En vivo desde YouTube | Suscriptores, vistas y videos que se actualizan cada minuto, metas automáticas (5.000 → 7.500 → 10.000…) y último video |
| 01 | Quién está detrás | Credencial de creador, historia y cita |
| 02 | El canal en números | Pestañas **Últimos 28 días** (principal) y **Últimos 12 meses**: indicadores animados y gráficos interactivos de suscriptores y vistas (con vista en tabla) |
| 03 | Audiencia | Edad, países (Venezuela frente a la diáspora), dispositivos (Smart TV), género y temas |
| 04 | Por qué funciona | 6 argumentos de venta, cada uno respaldado por un dato |
| 05 | Contenido | 4 pilares + galería "Recientes / Más vistos" que se actualiza sola, filtrable y con reproductor integrado |
| 06 | El próximo capítulo | Línea de tiempo "De Caracas al mundo": la emigración como oportunidad para marcas |
| 07 | Marcas ideales | Categorías que encajan y con qué **no** trabajas (seguridad de marca) |
| 08 | Formatos | Integración, video dedicado, serie, Short, post en comunidad, Instagram/TikTok |
| 09 | Arma tu campaña | Configurador: la marca elige formatos, ve el alcance estimado y te envía el brief por correo |
| 10 | Cómo trabajamos | Proceso en 6 pasos + reglas de la casa |
| 11 | Preguntas frecuentes | Lo que las marcas suelen preguntar |
| 12 | Contacto | Correo, redes, formulario y botón **Descargar media kit (PDF)** |
| 13 | Apoya al creador | Donación por PayPal o Binance Pay + mensaje directo a tu WhatsApp |

La estructura sigue lo que recomiendan las guías de media kits de creadores en
2026 y los "work with me" de youtubers grandes: primero confianza y resultados,
después audiencia (edad, países, dispositivos), formatos claros, proceso y
contacto. La cifra de suscriptores no va delante porque las marcas no fijan
precios con ella: se fijan en vistas por video, interacción y audiencia.

## Datos en vivo desde YouTube

Nada se actualiza a mano. Hay tres niveles, todos automáticos:

| Qué | Cada cuánto | De dónde sale |
| --- | --- | --- |
| Suscriptores, vistas totales, número de videos y último video (sección **En vivo**) | **Cada minuto**, sin recargar la página | YouTube Data API v3 (`YOUTUBE_API_KEY`) |
| Galería de videos, portada, vistas por video del configurador | Cada 5 minutos | YouTube Data API v3 |
| Últimos 28 días, últimos 12 meses, edad, países, dispositivos, % de no suscriptores | Cada hora (YouTube publica estos datos con ~2 días de retraso) | YouTube Analytics API (OAuth, ver abajo) |

Cuando subes un video:

- La sección **En vivo** lo muestra en menos de un minuto como "Último video",
  con botón para verlo en la propia web o en YouTube.
- La **galería** lo añade arriba (pestaña "Recientes", con la etiqueta "Nuevo"
  durante 7 días) y lo clasifica solo en un tema según el título
  ([`src/lib/pillars.ts`](src/lib/pillars.ts)).
- "Más vistos", la portada y las vistas estimadas del configurador se
  recalculan con las cifras nuevas.

**Metas automáticas** ([`src/lib/milestones.ts`](src/lib/milestones.ts)): la
meta sigue la serie 1.000 → 2.500 → 5.000 → 7.500 → 10.000 → 25.000 → 50.000 →
75.000 → 100.000… Al alcanzar una, la barra pasa sola a la siguiente y la meta
cumplida aparece como insignia.

Nota: YouTube redondea públicamente los suscriptores a 3 cifras (por ejemplo,
3.190 se muestra como 3.19K en YouTube, y la API da 3190). La web muestra
exactamente lo que da YouTube.

Si una fuente falla, la web usa la siguiente ([`src/lib/youtube.ts`](src/lib/youtube.ts),
[`src/lib/analytics.ts`](src/lib/analytics.ts)):

- Datos públicos: **YouTube Data API v3** → **RSS público del canal** (últimos
  15 videos) → **datos guardados** en `src/data/channel.ts`.
- Estadísticas: **YouTube Analytics API** → datos reales guardados
  (`savedAnalytics` en `src/data/channel.ts`).

Consumo de la API: unas 3.500 unidades al día como máximo, dentro del límite
gratuito de 10.000.

### Paso 1 · Clave de la YouTube Data API v3 (datos públicos)

1. [console.cloud.google.com](https://console.cloud.google.com/) → crea un
   proyecto (por ejemplo "MaestreVlogs web").
2. **APIs y servicios → Biblioteca** → **YouTube Data API v3** → **Habilitar**.
3. **APIs y servicios → Credenciales → Crear credenciales → Clave de API**. En
   "Restricciones de API" elige **YouTube Data API v3** y guarda.
4. Vercel → proyecto → **Settings → Environment Variables** → añade
   `YOUTUBE_API_KEY` con esa clave → **Redeploy**.

### Paso 2 · YouTube Analytics (28 días, 12 meses y audiencia)

Estos datos son privados de tu canal, así que se conectan una sola vez con tu
cuenta de Google:

1. En el mismo proyecto de Google Cloud: **Biblioteca → YouTube Analytics API
   → Habilitar**.
2. **APIs y servicios → Pantalla de consentimiento de OAuth** (o "Google Auth
   Platform"): tipo **Externo**, nombre de la app "MaestreVlogs web", tu
   correo como soporte y contacto. Después, en **Público**, pulsa **Publicar
   app** (estado "En producción"): si se queda en "Prueba", el permiso caduca
   cada 7 días.
3. **Credenciales → Crear credenciales → ID de cliente de OAuth** → tipo
   **Aplicación web** → en "URI de redireccionamiento autorizados" añade
   `https://maestrevlogs.vercel.app/api/youtube/callback` → **Crear**. Copia el
   **ID de cliente** y el **Secreto del cliente**.
4. En Vercel añade `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET` y
   `ADMIN_SECRET` (una contraseña larga que inventes, solo para ti) →
   **Redeploy**.
5. Abre `https://maestrevlogs.vercel.app/api/youtube/connect?secret=TU_ADMIN_SECRET`,
   elige la cuenta/canal **MaestreVlogs** y acepta. Google avisará de que la
   app "no está verificada": pulsa **Configuración avanzada → Ir a
   MaestreVlogs web** (es tu propia app). La página final muestra un
   **refresh token**.
6. En Vercel añade `YOUTUBE_REFRESH_TOKEN` con ese valor → **Redeploy**.

Listo: las pestañas "Últimos 28 días" y "Últimos 12 meses" y la sección de
audiencia pasan a leer YouTube Analytics cada hora.

### Forzar una actualización (opcional)

`https://maestrevlogs.vercel.app/api/revalidate?secret=TU_ADMIN_SECRET`
vuelve a pedir todo a YouTube en ese momento. (`REVALIDATE_SECRET` sigue
funcionando como alternativa a `ADMIN_SECRET`.)

## Antes de publicar: edita esto

Todo el contenido editable vive en `src/data/` y `src/i18n/dictionaries/`. No
hace falta tocar componentes.

| Archivo | Qué contiene |
| --- | --- |
| [`src/data/site.ts`](src/data/site.ts) | Nombre, correo, **WhatsApp**, redes, dominio, **PayPal y Binance** (`support`) |
| [`src/data/channel.ts`](src/data/channel.ts) | Datos guardados de respaldo (si YouTube no responde) y títulos en inglés de los videos |
| [`src/data/formats.ts`](src/data/formats.ts) | Formatos y paquetes del configurador |
| [`src/i18n/dictionaries/es.ts`](src/i18n/dictionaries/es.ts) | Todos los textos en español |
| [`src/i18n/dictionaries/en.ts`](src/i18n/dictionaries/en.ts) | Todos los textos en inglés (mismas claves) |

La web está publicada en **https://maestrevlogs.vercel.app** (también
responde en maestrevlogs-mediakit.vercel.app). Si
compras un dominio propio, cámbialo en `url` de `src/data/site.ts`.

## Apoya al creador

La sección 13 permite donar por **PayPal** (enlace paypal.me con el monto ya
puesto) o **Binance Pay** (UID con botón de copiar). Después, el visitante
pulsa "Enviar mensaje por WhatsApp" y te llega un mensaje con su nombre, el
monto, el método y su mensaje. Cambia los datos o los montos sugeridos en
`support` de [`src/data/site.ts`](src/data/site.ts).

## Títulos en inglés

Los videos nuevos aparecen con su título original en la versión inglesa. Si
quieres traducir uno, añádelo a `videos` en `src/data/channel.ts` con su
`titleEn`.

## Marca y diseño

- Paleta: negro asfalto, amarillo señalización `#FFC21A`, rojo REC `#FF453A` y
  azul "mundo" `#3F7FF0`, definida como tokens en [`src/app/globals.css`](src/app/globals.css).
- Tipografías: Anton (titulares tipo cartel), Manrope (texto) y JetBrains Mono
  (detalles de cámara).
- Los colores de los gráficos se validaron para daltonismo y contraste sobre el
  fondo oscuro y en impresión.
- Logotipo e isotipo en [`src/components/brand/Logo.tsx`](src/components/brand/Logo.tsx)
  (SVG); favicon en `src/app/icon.svg`.

## PDF del media kit

El botón **Descargar media kit (PDF)** abre la impresión del navegador con una
hoja de estilos propia (fondo blanco, sin menús ni formularios). Elige "Guardar
como PDF" para adjuntarlo en correos.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Despliegue

Listo para [Vercel](https://vercel.com): importa el repositorio en un proyecto
nuevo y cada `push` a `main` publica una nueva versión. Añade las variables
de `.env.example` (ver "Datos en vivo"). No necesita base de
datos: el formulario y el configurador abren el correo o WhatsApp del
visitante con el mensaje ya redactado.
