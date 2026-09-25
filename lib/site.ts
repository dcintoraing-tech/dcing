/**
 * Canonical origin. Vercel builds fall back to the project's production domain
 * so OG images, canonical tags and the sitemap resolve before the custom
 * domain is attached.
 */
function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "https://dcing.com";
}

export const site = {
  name: "DCing",
  url: resolveSiteUrl(),
  email: "dcintora.ing@gmail.com",
  /** Celular de contacto, en nacional para mostrar y sin signos para wa.me. */
  celular: "55 4844 5514",
  tagline: "Transformamos negocios en sistemas digitales.",
  subline: "Diseño + ingeniería + automatización.",
  description:
    "DCing es una firma de transformación digital. Diseñamos e implementamos sistemas digitales: plataformas, automatización, datos e inteligencia artificial.",
} as const;

export const mailto = `mailto:${site.email}?subject=${encodeURIComponent(
  "Nuevo proyecto — DCing",
)}`;

/** Ruta del formulario público de cotización. */
export const rutaCotizar = "/cotizar";

/** Enlace permanente a una cotización, el que recibe el cliente. */
export function urlCotizacion(token: string) {
  return `${site.url}/cotizacion/${token}`;
}

// Con "/" delante funcionan igual desde la home que desde /cotizar.
export const navLinks = [
  { label: "Servicios", href: "/#servicios" },
  { label: "Proceso", href: "/#proceso" },
  { label: "Proyectos", href: "/#proyectos" },
] as const;

export type ServiceId = "dev" | "auto" | "data" | "ai" | "saas";

export const services: {
  id: ServiceId;
  number: string;
  title: string;
  description: string;
  file: string;
}[] = [
  {
    id: "dev",
    number: "01",
    title: "Desarrollo digital",
    description: "Sitios web, plataformas y aplicaciones.",
    file: "producto.app",
  },
  {
    id: "auto",
    number: "02",
    title: "Automatización",
    description: "Procesos más rápidos, inteligentes y conectados.",
    file: "flujos.run",
  },
  {
    id: "data",
    number: "03",
    title: "Datos & BI",
    description: "Dashboards, análisis y sistemas de información.",
    file: "métricas.db",
  },
  {
    id: "ai",
    number: "04",
    title: "IA & APIs",
    description: "Integración de inteligencia artificial y servicios externos.",
    file: "modelos.api",
  },
  {
    id: "saas",
    number: "05",
    title: "Sistemas SaaS",
    description: "Diseño, organización e integración de plataformas SaaS.",
    file: "núcleo.sys",
  },
];

export type StepId = "descubrir" | "disenar" | "construir" | "automatizar" | "evolucionar";

export const steps: {
  id: StepId;
  number: string;
  title: string;
  description: string;
  detail: string;
}[] = [
  {
    id: "descubrir",
    number: "01",
    title: "Descubrir",
    description: "Entendemos el negocio antes que el software.",
    detail: "Mapeamos procesos, datos y puntos de fricción reales.",
  },
  {
    id: "disenar",
    number: "02",
    title: "Diseñar",
    description: "Estructura, interfaz y experiencia.",
    detail: "Definimos la arquitectura y el lenguaje visual del sistema.",
  },
  {
    id: "construir",
    number: "03",
    title: "Construir",
    description: "Ingeniería sólida, entregas continuas.",
    detail: "Desarrollo por módulos con calidad y despliegue frecuente.",
  },
  {
    id: "automatizar",
    number: "04",
    title: "Automatizar",
    description: "Menos fricción, más sistema.",
    detail: "Conectamos herramientas y eliminamos el trabajo manual.",
  },
  {
    id: "evolucionar",
    number: "05",
    title: "Evolucionar",
    description: "Medimos, ajustamos, escalamos.",
    detail: "El sistema crece con el negocio, no al revés.",
  },
];

export type ProjectId = "meridian" | "atlas" | "kora" | "nucleo";

export const projects: {
  id: ProjectId;
  name: string;
  category: string;
  description: string;
  domain: string;
  year: string;
}[] = [
  {
    id: "meridian",
    name: "Meridian",
    category: "Plataforma SaaS",
    description: "Operación financiera unificada para equipos distribuidos.",
    domain: "meridian.app",
    year: "2025",
  },
  {
    id: "atlas",
    name: "Atlas",
    category: "Automatización",
    description: "Motor de flujos que conecta catorce sistemas internos.",
    domain: "atlas.systems",
    year: "2025",
  },
  {
    id: "kora",
    name: "Kora",
    category: "Comercio digital",
    description: "Tienda y catálogo con inventario en tiempo real.",
    domain: "kora.store",
    year: "2024",
  },
  {
    id: "nucleo",
    name: "Núcleo",
    category: "Datos & BI",
    description: "Centro de análisis para decisiones diarias.",
    domain: "nucleo.bi",
    year: "2024",
  },
];
