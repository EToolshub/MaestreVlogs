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
| — | En vivo desde YouTube | Suscriptores actuales, próxima meta y último video (se actualiza solo) |
| 01 | Quién está detrás | Credencial de creador, historia y cita |
| 02 | El canal en números | 6 indicadores animados + gráficos interactivos de suscriptores y vistas por mes (con vista en tabla) |
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

La estructura sigue lo que recomiendan las guías de media kits de creadores en
2026 y los "work with me" de youtubers grandes: primero confianza y resultados,
después audiencia (edad, países, dispositivos), formatos claros, proceso y
contacto. La cifra de suscriptores no va delante porque las marcas no fijan
precios con ella: se fijan en vistas por video, interacción y audiencia.

## Datos en vivo desde YouTube (se actualizan solos cada 6 horas)

La web se conecta a tu canal y se regenera como máximo cada 6 horas. Sin
tocar nada, cada vez que subes un video:

- La sección **En vivo** muestra tus suscriptores actuales, vistas totales,
  videos publicados, tu próxima meta y tu **último video** con botón para
  verlo en la propia web o en YouTube.
- La **galería de videos** lo añade arriba (pestaña "Recientes", con la
  etiqueta "Nuevo" durante 7 días) y lo clasifica solo en un tema según el
  título ([`src/lib/pillars.ts`](src/lib/pillars.ts)).
- "Más vistos", los videos de la portada, el gráfico de suscriptores y las
  vistas estimadas del configurador de campañas se recalculan con las cifras
  nuevas.

Cómo funciona ([`src/lib/youtube.ts`](src/lib/youtube.ts)):

1. **YouTube Data API v3** (recomendado, necesita `YOUTUBE_API_KEY`):
   suscriptores exactos, estadísticas de los últimos 50 videos y de los 25
   más vistos de siempre. Usa ~105 unidades por actualización, muy por debajo
   del límite gratuito de 10.000 al día.
2. **RSS público del canal** (sin clave): últimos 15 videos con vistas y me
   gusta. Los suscriptores se quedan con la cifra guardada.
3. **Datos guardados** en `src/data/channel.ts`, si YouTube no responde.

La regeneración ocurre con la primera visita después de pasadas las 6 horas;
esa visita ve la versión anterior y las siguientes ya ven la nueva.

### Activar la API de YouTube (5 minutos, gratis)

1. Entra en [console.cloud.google.com](https://console.cloud.google.com/),
   crea un proyecto (por ejemplo "MaestreVlogs web").
2. Menú → **APIs y servicios → Biblioteca** → busca **YouTube Data API v3** →
   **Habilitar**.
3. **APIs y servicios → Credenciales → Crear credenciales → Clave de API**.
   En "Restricciones de API" elige **YouTube Data API v3** y guarda.
4. En Vercel: tu proyecto → **Settings → Environment Variables** → añade
   `YOUTUBE_API_KEY` con esa clave → **Redeploy**.

Opcional: añade también `REVALIDATE_SECRET` (una palabra secreta cualquiera).
Así, justo después de subir un video puedes abrir
`https://TU-DOMINIO/api/revalidate?secret=TU_PALABRA` y la web se actualiza
en ese momento, sin esperar las 6 horas.

Las métricas de YouTube Analytics (edad, países, dispositivos, horas de
visualización) no son públicas: siguen en `src/data/channel.ts` y se
actualizan a mano (ver abajo).

## Antes de publicar: edita esto

Todo el contenido editable vive en `src/data/` y `src/i18n/dictionaries/`. No
hace falta tocar componentes.

| Archivo | Qué contiene |
| --- | --- |
| [`src/data/site.ts`](src/data/site.ts) | Nombre, correo, **WhatsApp**, redes, dominio |
| [`src/data/channel.ts`](src/data/channel.ts) | Métricas de YouTube Analytics, audiencia y videos guardados (respaldo si YouTube no responde; también guarda los títulos en inglés) |
| [`src/data/formats.ts`](src/data/formats.ts) | Formatos y paquetes del configurador |
| [`src/i18n/dictionaries/es.ts`](src/i18n/dictionaries/es.ts) | Todos los textos en español |
| [`src/i18n/dictionaries/en.ts`](src/i18n/dictionaries/en.ts) | Todos los textos en inglés (mismas claves) |

La web está publicada en **https://maestrevlogs-mediakit.vercel.app**. Si
compras un dominio propio, cámbialo en `url` de `src/data/site.ts`.

## Actualizar las métricas (cada 2–3 meses)

Las marcas valoran datos recientes. En YouTube Studio → Estadísticas → Modo
avanzado, elige el mismo periodo y copia a `src/data/channel.ts`:

1. Vistas, horas de visualización, duración media, suscriptores ganados/perdidos, me gusta, comentarios y compartidos.
2. Edad y género, países, tipo de dispositivo.
3. Vistas por mes y suscriptores a inicio de cada mes.
4. `statsPeriod.updatedAt` con la fecha del día.

Suscriptores, vistas y videos ya se actualizan solos (ver "Datos en vivo").
Si quieres el título en inglés de un video nuevo, añádelo a `videos` en
`src/data/channel.ts` con su `titleEn`.

Las cifras derivadas (tasa de interacción, crecimiento, horas) se calculan solas.

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
nuevo y cada `push` a `main` publica una nueva versión. Añade
`YOUTUBE_API_KEY` (ver arriba) para los datos en vivo. No necesita base de
datos: el formulario y el configurador abren el correo o WhatsApp del
visitante con el mensaje ya redactado.
