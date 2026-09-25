/**
 * Generador de cotizaciones sin IA.
 *
 * Arma un borrador a partir de la tarifa publicada y de las señales que deja
 * el cliente en su descripción. No pretende adivinar: da un punto de partida
 * razonable que el administrador corrige en el panel antes de enviar nada.
 */
import {
  AVISO_ESTIMACION,
  MANTENIMIENTO,
  formatoMXN,
  servicioPorId,
  type ServicioId,
} from "./rate-card";
import type { CotizacionIA, DatosSolicitud } from "./schemas";

export const PLANTILLA = "plantilla-v1";

/** Señales que encarecen un proyecto. Cada una encontrada suma un punto. */
const SENALES: { id: string; palabras: string[]; nota: string }[] = [
  {
    id: "pagos",
    palabras: ["pago", "cobro", "cobrar", "tarjeta", "checkout", "carrito", "tienda", "vender", "ecommerce", "stripe", "mercado pago"],
    nota: "cobros en línea",
  },
  {
    id: "usuarios",
    palabras: ["usuario", "login", "sesion", "sesión", "cuenta", "registro", "rol", "permiso", "contraseña"],
    nota: "usuarios y permisos",
  },
  {
    id: "inventario",
    palabras: ["inventario", "stock", "almacen", "almacén", "producto", "catalogo", "catálogo"],
    nota: "control de inventario",
  },
  {
    id: "integracion",
    palabras: ["integrar", "integracion", "integración", "api", "conectar", "sincronizar", "erp", "crm", "whatsapp", "excel"],
    nota: "conexión con otras herramientas",
  },
  {
    id: "movil",
    palabras: ["app", "movil", "móvil", "celular", "android", "ios", "aplicacion movil"],
    nota: "uso desde el celular",
  },
  {
    id: "datos",
    palabras: ["reporte", "dashboard", "metrica", "métrica", "kpi", "analisis", "análisis", "estadistica", "estadística"],
    nota: "reportes y métricas",
  },
  {
    id: "escala",
    palabras: ["sucursal", "multiples", "múltiples", "varias", "equipo", "empresas", "clientes internos"],
    nota: "varias sucursales o equipos",
  },
  {
    id: "ia",
    palabras: ["inteligencia artificial", "chatbot", "bot", "automatico", "automático", "automatizar"],
    nota: "automatización o IA",
  },
];

type Bloque = { alcance: string[]; conceptos: { concepto: string; detalle: string }[] };

const BLOQUES: Record<ServicioId, Bloque> = {
  "sitio-web": {
    alcance: [
      "Diseño visual a medida, sin plantillas genéricas",
      "Desarrollo del sitio adaptado a celular, tablet y escritorio",
      "Formulario de contacto conectado a tu correo",
      "Optimización básica para buscadores y velocidad de carga",
      "Publicación en línea y configuración del dominio",
    ],
    conceptos: [
      { concepto: "Diseño de interfaz", detalle: "Propuesta visual y estructura de las secciones" },
      { concepto: "Desarrollo del sitio", detalle: "Maquetación responsiva y programación" },
      { concepto: "Contenido y formularios", detalle: "Montaje de textos e imágenes, formulario de contacto" },
      { concepto: "SEO técnico y rendimiento", detalle: "Metadatos, tiempos de carga y accesibilidad" },
      { concepto: "Publicación", detalle: "Despliegue, dominio y certificado de seguridad" },
    ],
  },
  automatizacion: {
    alcance: [
      "Mapeo del proceso actual y de los puntos que se repiten a mano",
      "Diseño del flujo automatizado de punta a punta",
      "Conexión entre las herramientas que ya usas",
      "Reglas de validación y avisos cuando algo falla",
      "Pruebas con casos reales antes de dejarlo corriendo",
    ],
    conceptos: [
      { concepto: "Levantamiento del proceso", detalle: "Sesiones para entender cómo se hace hoy" },
      { concepto: "Diseño del flujo", detalle: "Definición de pasos, disparadores y excepciones" },
      { concepto: "Desarrollo de la automatización", detalle: "Programación y conexión de servicios" },
      { concepto: "Pruebas y ajuste", detalle: "Validación con datos reales y corrección" },
      { concepto: "Capacitación", detalle: "Sesión para que tu equipo lo opere sin depender de nosotros" },
    ],
  },
  "datos-bi": {
    alcance: [
      "Centralización de la información que hoy vive dispersa",
      "Limpieza y estandarización de los datos",
      "Tablero con los indicadores que importan para decidir",
      "Actualización automática sin captura manual",
      "Accesos por persona o por área",
    ],
    conceptos: [
      { concepto: "Diagnóstico de fuentes", detalle: "Qué datos existen, dónde están y en qué estado" },
      { concepto: "Integración de datos", detalle: "Conexión y carga automática desde cada fuente" },
      { concepto: "Modelado", detalle: "Estructura para que los números cuadren y sean comparables" },
      { concepto: "Tablero de control", detalle: "Visualizaciones e indicadores definidos contigo" },
      { concepto: "Capacitación", detalle: "Cómo leer e interpretar el tablero" },
    ],
  },
  "ia-apis": {
    alcance: [
      "Definición del caso de uso y de qué debe resolver el modelo",
      "Integración del servicio de inteligencia artificial",
      "Conexión con los sistemas o canales donde va a operar",
      "Controles para evitar respuestas fuera de lugar",
      "Panel o registro para revisar lo que hace",
    ],
    conceptos: [
      { concepto: "Definición del caso de uso", detalle: "Alcance, límites y criterios de calidad" },
      { concepto: "Integración del modelo", detalle: "Conexión con el proveedor y ajuste de instrucciones" },
      { concepto: "Desarrollo de la interfaz", detalle: "Dónde y cómo lo usan las personas" },
      { concepto: "Pruebas y afinación", detalle: "Iteración con casos reales hasta que responda bien" },
      { concepto: "Monitoreo", detalle: "Registro de uso para revisar y corregir" },
    ],
  },
  plataforma: {
    alcance: [
      "Definición funcional de los módulos del sistema",
      "Diseño de interfaz y de la experiencia de uso",
      "Desarrollo con usuarios, roles y permisos",
      "Base de datos y lógica propia de tu negocio",
      "Despliegue en producción con respaldos",
    ],
    conceptos: [
      { concepto: "Descubrimiento", detalle: "Levantamiento de requerimientos y reglas del negocio" },
      { concepto: "Diseño de producto", detalle: "Arquitectura, pantallas y flujos de usuario" },
      { concepto: "Desarrollo", detalle: "Programación por módulos con entregas parciales" },
      { concepto: "Usuarios y permisos", detalle: "Registro, accesos y niveles por rol" },
      { concepto: "Pruebas y despliegue", detalle: "Control de calidad, publicación y respaldos" },
      { concepto: "Capacitación", detalle: "Entrenamiento a los usuarios del sistema" },
    ],
  },
  saas: {
    alcance: [
      "Arquitectura multiempresa con datos aislados por cliente",
      "Registro, planes y cobro recurrente",
      "Panel de administración para tu operación",
      "Panel para cada cliente con su propia información",
      "Infraestructura, monitoreo y respaldos",
    ],
    conceptos: [
      { concepto: "Arquitectura del producto", detalle: "Modelo multiempresa, seguridad y escalabilidad" },
      { concepto: "Diseño de producto", detalle: "Flujos de alta, uso diario y administración" },
      { concepto: "Desarrollo del núcleo", detalle: "Funcionalidad principal del sistema" },
      { concepto: "Suscripciones y cobro", detalle: "Planes, facturación recurrente y control de acceso" },
      { concepto: "Panel administrativo", detalle: "Gestión de clientes, métricas y soporte" },
      { concepto: "Infraestructura", detalle: "Despliegue, monitoreo, respaldos y alertas" },
    ],
  },
  otro: {
    alcance: [
      "Sesión inicial para delimitar el problema y el resultado esperado",
      "Propuesta de solución con alternativas y sus implicaciones",
      "Desarrollo de la solución acordada",
      "Pruebas con casos reales",
      "Entrega con documentación de lo construido",
    ],
    conceptos: [
      { concepto: "Descubrimiento", detalle: "Entender el problema antes de proponer herramientas" },
      { concepto: "Propuesta técnica", detalle: "Camino recomendado y por qué" },
      { concepto: "Desarrollo", detalle: "Construcción de la solución" },
      { concepto: "Pruebas", detalle: "Validación con información real" },
      { concepto: "Entrega", detalle: "Publicación y documentación" },
    ],
  },
};

const redondea = (valor: number) => Math.round(valor / 500) * 500;

function detectaSenales(texto: string) {
  const plano = texto.toLowerCase();
  return SENALES.filter((senal) => senal.palabras.some((palabra) => plano.includes(palabra)));
}

/** Rangos donde una descripción cargada de señales ya no cabe. */
const RANGOS_CHICOS: ServicioId[] = ["sitio-web", "automatizacion", "datos-bi"];

function preguntasPendientes(texto: string, servicio: ServicioId) {
  const plano = texto.toLowerCase();
  const preguntas: string[] = [];

  const hablaDePlazo = /(plazo|fecha|urgente|cuanto|cuánto|semana|mes|antes de|para el)/.test(plano);
  if (!hablaDePlazo) preguntas.push("¿Para cuándo necesitas tenerlo listo?");

  const hablaDeContenido = /(texto|contenido|logo|imagen|foto|marca|manual)/.test(plano);
  if (!hablaDeContenido && servicio === "sitio-web") {
    preguntas.push("¿Ya tienes textos, logo e imágenes, o hay que producirlos?");
  }

  const hablaDeExistente = /(ya teng|actual|existe|tenemos|usamos|migrar|sistema)/.test(plano);
  if (!hablaDeExistente) {
    preguntas.push("¿Hay algo funcionando hoy que haya que conservar o migrar?");
  }

  if (texto.trim().length < 140) {
    preguntas.push("La descripción es breve: conviene una llamada para delimitar el alcance.");
  }

  return preguntas.slice(0, 4);
}

export function cotizacionDePlantilla(datos: DatosSolicitud): CotizacionIA {
  const servicio = servicioPorId(datos.servicio);
  const id = servicio.id;
  const bloque = BLOQUES[id];

  const senales = detectaSenales(datos.descripcion);
  const detallada = datos.descripcion.trim().length >= 260;

  // Posición dentro del rango: más señales de complejidad, más arriba.
  const razon = Math.min(1, senales.length / 5);
  const ancho = servicio.max - servicio.min;
  const centro = servicio.min + ancho * (0.18 + 0.62 * razon);
  // Una descripción vaga merece una banda más amplia, no un número falso.
  const banda = ancho * (detallada ? 0.2 : 0.32);

  const precioMin = Math.max(servicio.min, redondea(centro - banda / 2));
  const precioMax = Math.min(servicio.max, redondea(Math.max(centro + banda / 2, precioMin + 500)));

  const paraQuien = datos.empresa?.trim() || datos.nombre.split(" ")[0];
  const titulo =
    id === "otro" && datos.servicioOtro
      ? `${datos.servicioOtro.trim()} — ${paraQuien}`
      : `${servicio.label} para ${paraQuien}`;

  const mencion =
    senales.length > 0
      ? ` Consideramos lo que nos señalaste sobre ${senales
          .slice(0, 3)
          .map((s) => s.nota)
          .join(", ")}.`
      : "";

  // El cliente pudo elegir mal la categoría: si describe mucho más de lo que
  // el rango cubre, el administrador debe verlo antes de enviar.
  const desbordado = RANGOS_CHICOS.includes(id) && senales.length >= 4;
  const preguntas = preguntasPendientes(datos.descripcion, id);
  if (desbordado) {
    preguntas.unshift(
      `Eligió "${servicio.label}" pero describe ${senales.map((s) => s.nota).join(", ")}. Probablemente sea una plataforma a medida: revisa si hay que recotizar en otro rango.`,
    );
  }

  const resumen =
    `Preparamos esta estimación a partir de lo que nos describiste.${mencion}` +
    ` El rango contempla ${servicio.descripcion.toLowerCase()}` +
    ` El número final se cierra después de una llamada donde revisamos el alcance a detalle.`;

  const conceptos = [
    ...bloque.conceptos,
    { concepto: "Mantenimiento incluido", detalle: MANTENIMIENTO.incluido },
  ];

  const condiciones = [
    AVISO_ESTIMACION,
    `Incluye ${MANTENIMIENTO.incluido.toLowerCase()}. Después, el soporte mensual va de ${formatoMXN(MANTENIMIENTO.despuesMin)} a ${formatoMXN(MANTENIMIENTO.despuesMax)}.`,
    "Se trabaja con 50% de anticipo y el resto contra entrega.",
    "Incluye dos rondas de ajustes sobre lo acordado; cambios de alcance se cotizan aparte.",
    "Servicios de terceros (dominio, hospedaje, licencias) se facturan por separado.",
  ];

  const notas = detallada
    ? "El precio se mueve dentro del rango según el número de módulos y las integraciones que confirmemos en la llamada."
    : "Con la información actual el rango es amplio a propósito. Se cierra en cuanto definamos alcance y prioridades.";

  return {
    titulo,
    servicio: id,
    resumen,
    alcance: bloque.alcance,
    conceptos,
    precio_min: precioMin,
    precio_max: precioMax,
    tiempo_estimado: servicio.tiempo,
    condiciones,
    notas,
    preguntas: preguntas.slice(0, 5),
    confianza: detallada && senales.length >= 2 ? "media" : "baja",
  };
}
