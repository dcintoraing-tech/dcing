# DCing

Landing de **DCing** — firma de transformación digital: diseño, ingeniería y automatización.

Monocromo estricto (blanco, negro y grises), interfaz inspirada en macOS y experiencia construida sobre movimiento más que sobre texto. Todo el material visual —objetos 3D, mockups de producto e ilustraciones de servicios— está **generado por código**: no hay imágenes externas ni bancos de fotos.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** con tokens de color duales (claro / oscuro)
- **Framer Motion** para scroll, parallax y microinteracciones
- **React Three Fiber / Three.js** para el hero y la retícula de transformación

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de producción
npm run lint
```

## Estructura

```
app/               layout, página, OG image, icon, robots, sitemap
components/
  sections/        Nav, Hero, Services, Process, Projects, Transformation, Contact
  ui/              Window (ventana macOS), ButtonLink, Reveal, Logo, ThemeSwitch
  three/           escenas de React Three Fiber
  mockups/         interfaces de producto en SVG (Meridian, Atlas, Kora, Núcleo)
  visuals/         animaciones SVG de servicios y proceso
lib/               contenido del sitio, tema y helpers de motion
```

## Contenido

Todo el texto, los servicios, el proceso y los proyectos viven en [`lib/site.ts`](lib/site.ts). Es el único archivo que hay que tocar para cambiar copy, correo de contacto o casos.

> Los cuatro proyectos (Meridian, Atlas, Kora, Núcleo) son **casos ficticios de portafolio** y `hola@dcing.com` es un correo provisional. Reemplázalos antes de publicar.

## Tema claro / oscuro

El switch de la barra de navegación alterna el tema. La preferencia se guarda en `localStorage` y, si no hay ninguna, se usa la del sistema. Un script inline en `app/layout.tsx` aplica el tema antes del primer pintado para que no haya parpadeo.

Los colores son variables CSS definidas en `app/globals.css` (`:root` y `[data-theme="dark"]`), así que los SVG y las escenas 3D cambian con el tema sin recargar.

## Accesibilidad y rendimiento

- Respeta `prefers-reduced-motion`: las animaciones se detienen y los visuales quedan en su estado final.
- Los canvas WebGL solo renderizan cuando están en pantalla.
- Metadata completa, OG image generada, `sitemap.xml`, `robots.txt` y datos estructurados JSON-LD.

## Despliegue en Vercel

El proyecto es Next.js estándar: no requiere configuración extra.

1. Importa el repositorio en [vercel.com/new](https://vercel.com/new).
2. Framework preset: **Next.js** (se detecta solo). Sin variables de entorno obligatorias.
3. Opcional: define `NEXT_PUBLIC_SITE_URL` con el dominio final (por ejemplo `https://dcing.com`) para que los enlaces canónicos y la OG image apunten ahí. Sin esa variable se usa el dominio de producción de Vercel.
