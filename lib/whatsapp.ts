import { formatoMXN } from "@/lib/quotes/rate-card";
import type { Cotizacion, Solicitud } from "@/lib/quotes/repo";
import { urlCotizacion } from "@/lib/site";

/** Normaliza un celular mexicano a formato internacional sin signos. */
export function telefonoInternacional(celular: string) {
  const digitos = celular.replace(/\D/g, "");
  if (digitos.length === 10) return `52${digitos}`;
  if (digitos.length === 12 && digitos.startsWith("52")) return digitos;
  if (digitos.length === 13 && digitos.startsWith("521")) return `52${digitos.slice(3)}`;
  return digitos;
}

/** Enlace wa.me con el mensaje ya escrito: quien lo abre solo le da enviar. */
export function enlaceWhatsApp(celular: string, mensaje: string) {
  const numero = telefonoInternacional(celular);
  if (!numero) return "";
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

const nombrePila = (completo: string) => completo.trim().split(/\s+/)[0];

/** Lo que recibe el cliente: el precio por delante y el enlace para el detalle. */
export function mensajeCotizacion(solicitud: Solicitud, cotizacion: Cotizacion) {
  return [
    `Hola ${nombrePila(solicitud.nombre)}, soy de DCing.`,
    "",
    `Ya está tu cotización estimada para *${cotizacion.titulo}*:`,
    `*${formatoMXN(Number(cotizacion.precio_min))} a ${formatoMXN(Number(cotizacion.precio_max))} ${cotizacion.moneda}*`,
    `Tiempo estimado: ${cotizacion.tiempo_estimado}`,
    "",
    `Puedes verla completa aquí: ${urlCotizacion(cotizacion.token)}`,
    "",
    "Es una estimación: si ajustamos el alcance, el precio se mueve. ¿La vemos?",
  ].join("\n");
}

/** Lo que el cliente envía cuando abre el WhatsApp desde el correo o el sitio. */
export function mensajeParaCliente(solicitud: Solicitud, cotizacion: Cotizacion) {
  return `Hola, soy ${solicitud.nombre}. Acabo de recibir la cotización de "${cotizacion.titulo}" y quiero platicarla.`;
}

/* ───────────────────────── envío automático ───────────────────────── */

export function whatsappConfigurado() {
  return Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_ID);
}

/**
 * Envía por la API de WhatsApp Cloud de Meta.
 *
 * Mandar un mensaje a alguien que no te escribió primero exige una *plantilla*
 * aprobada por Meta: no se puede mandar texto libre. Por eso el contenido va
 * como plantilla con parámetros, y el nombre de esa plantilla se configura
 * aparte. Sin credenciales esto no hace nada y el flujo sigue con el enlace
 * wa.me, que sí funciona sin trámite.
 */
export async function enviarWhatsApp(solicitud: Solicitud, cotizacion: Cotizacion) {
  if (!whatsappConfigurado()) return { enviado: false, motivo: "sin credenciales" as const };

  const numero = telefonoInternacional(solicitud.celular);
  if (!numero) return { enviado: false, motivo: "celular no válido" as const };

  const plantilla = process.env.WHATSAPP_TEMPLATE;
  const idioma = process.env.WHATSAPP_TEMPLATE_LANG || "es_MX";

  const cuerpo = plantilla
    ? {
        messaging_product: "whatsapp",
        to: numero,
        type: "template",
        template: {
          name: plantilla,
          language: { code: idioma },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: nombrePila(solicitud.nombre) },
                { type: "text", text: cotizacion.titulo },
                {
                  type: "text",
                  text: `${formatoMXN(Number(cotizacion.precio_min))} a ${formatoMXN(Number(cotizacion.precio_max))}`,
                },
                { type: "text", text: cotizacion.tiempo_estimado },
                { type: "text", text: urlCotizacion(cotizacion.token) },
              ],
            },
          ],
        },
      }
    : // Sin plantilla solo funciona dentro de una conversación ya abierta.
      {
        messaging_product: "whatsapp",
        to: numero,
        type: "text",
        text: { preview_url: true, body: mensajeCotizacion(solicitud, cotizacion) },
      };

  const respuesta = await fetch(
    `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cuerpo),
    },
  );

  if (!respuesta.ok) {
    const detalle = await respuesta.text();
    return { enviado: false, motivo: `${respuesta.status} ${detalle.slice(0, 300)}` };
  }
  return { enviado: true, motivo: "ok" as const };
}
