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
| 01 | Quién está detrás | Credencial de creador, historia y cita |
| 02 | El canal en números | 6 indicadores animados + gráficos interactivos de suscriptores y vistas por mes (con vista en tabla) |
| 03 | Audiencia | Edad, países (Venezuela frente a la diáspora), dispositivos (Smart TV), género y temas |
| 04 | Por qué funciona | 6 argumentos de venta, cada uno respaldado por un dato |
| 05 | Contenido | 4 pilares + galería de videos filtrable con reproductor integrado |
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

## Antes de publicar: edita esto

Todo el contenido editable vive en `src/data/` y `src/i18n/dictionaries/`. No
hace falta tocar componentes.

| Archivo | Qué contiene |
| --- | --- |
| [`src/data/site.ts`](src/data/site.ts) | Nombre, correo, **WhatsApp**, redes, dominio |
| [`src/data/channel.ts`](src/data/channel.ts) | Métricas de YouTube Analytics, audiencia y videos destacados |
| [`src/data/formats.ts`](src/data/formats.ts) | Formatos y paquetes del configurador |
| [`src/i18n/dictionaries/es.ts`](src/i18n/dictionaries/es.ts) | Todos los textos en español |
| [`src/i18n/dictionaries/en.ts`](src/i18n/dictionaries/en.ts) | Todos los textos en inglés (mismas claves) |

Pendiente marcado con `// TODO` en `src/data/site.ts`:

- `url`: tu dominio final, cuando conectes la web en Vercel.

## Actualizar las métricas (cada 2–3 meses)

Las marcas valoran datos recientes. En YouTube Studio → Estadísticas → Modo
avanzado, elige el mismo periodo y copia a `src/data/channel.ts`:

1. Vistas, horas de visualización, duración media, suscriptores ganados/perdidos, me gusta, comentarios y compartidos.
2. Edad y género, países, tipo de dispositivo.
3. Vistas por mes y suscriptores a inicio de cada mes.
4. Conteos de los videos destacados y `perVideoViews` (mediana y promedio de los últimos videos).
5. `statsPeriod.updatedAt` con la fecha del día.

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
nuevo y cada `push` a `main` publica una nueva versión. No necesita variables
de entorno ni base de datos: el formulario y el configurador abren el correo
del visitante con el mensaje ya redactado.
