/**
 * Tarifas de referencia (MXN) para negocio pequeño en CDMX. La IA estima
 * DENTRO de estos rangos; nunca fuera. Cambiar un rango aquí solo afecta a las
 * cotizaciones nuevas: las ya generadas guardan su propio precio.
 */
export type ServicioId =
  | "sitio-web"
  | "automatizacion"
  | "datos-bi"
  | "ia-apis"
  | "plataforma"
  | "saas"
  | "otro";

export type Servicio = {
  id: ServicioId;
  label: string;
  descripcion: string;
  min: number;
  max: number;
  tiempo: string;
};

export const SERVICIOS: Servicio[] = [
  {
    id: "sitio-web",
    label: "Sitio web / landing",
    descripcion: "Sitio institucional, landing de campaña o catálogo sin carrito.",
    min: 8000,
    max: 25000,
    tiempo: "1 a 3 semanas",
  },
  {
    id: "automatizacion",
    label: "Automatización de procesos",
    descripcion: "Conectar herramientas, eliminar capturas manuales, flujos internos.",
    min: 7000,
    max: 30000,
    tiempo: "1 a 4 semanas",
  },
  {
    id: "datos-bi",
    label: "Datos & BI",
    descripcion: "Dashboards, reportes automáticos y centralización de información.",
    min: 10000,
    max: 35000,
    tiempo: "2 a 5 semanas",
  },
  {
    id: "ia-apis",
    label: "IA & APIs",
    descripcion: "Integración de modelos de IA y conexión con servicios externos.",
    min: 12000,
    max: 45000,
    tiempo: "2 a 6 semanas",
  },
  {
    id: "plataforma",
    label: "Plataforma o aplicación a medida",
    descripcion: "Sistema con usuarios, roles y lógica propia del negocio.",
    min: 35000,
    max: 110000,
    tiempo: "5 a 10 semanas",
  },
  {
    id: "saas",
    label: "Sistema SaaS",
    descripcion: "Producto multiempresa con suscripciones y administración.",
    min: 60000,
    max: 160000,
    tiempo: "10 a 20 semanas",
  },
  {
    id: "otro",
    label: "Otro (lo describo)",
    descripcion: "Algo que no encaja en las categorías anteriores.",
    min: 8000,
    max: 60000,
    tiempo: "2 a 8 semanas",
  },
];

export const MANTENIMIENTO = {
  incluido: "1 mes de mantenimiento y soporte incluido tras la entrega",
  despuesMin: 1200,
  despuesMax: 3500,
} as const;

export const AVISO_ESTIMACION =
  "Estimación preliminar sujeta a revisión. Para formalizar costo y alcance definitivos, agendemos una llamada.";

export function servicioPorId(id: string): Servicio {
  return SERVICIOS.find((s) => s.id === id) ?? SERVICIOS[SERVICIOS.length - 1];
}

export function formatoMXN(valor: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(valor);
}
