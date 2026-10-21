import { Resend } from "resend";
import { AVISO_ESTIMACION, formatoMXN, servicioPorId } from "@/lib/quotes/rate-card";
import type { Cotizacion, Solicitud } from "@/lib/quotes/repo";
import { site, urlCotizacion } from "@/lib/site";
import { enlaceWhatsApp, mensajeParaCliente } from "@/lib/whatsapp";
import {
  BLANCO,
  CREMA,
  GRIS,
  LINEA,
  PAPEL,
  SANS,
  SERIF,
  SUAVE,
  TINTA,
  bloque,
  boton,
  cabecera,
  documento,
  escapa,
  h1,
  lista,
  parrafo,
  rotulo,
  separador,
} from "./plantilla";

let cliente: Resend | null = null;

function resend() {
  if (cliente) return cliente;
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Falta RESEND_API_KEY. Revisa .env.local o las variables en Vercel.");
  }
  cliente = new Resend(process.env.RESEND_API_KEY);
  return cliente;
}

export function correoConfigurado() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM);
}

function remitente() {
  return process.env.RESEND_FROM || "DCing <onboarding@resend.dev>";
}

const nombrePila = (completo: string) => completo.trim().split(/\s+/)[0];

/* ───────────────────────── cotización ───────────────────────── */

/**
 * La cotización completa, no un enlace a ella.
 *
 * Quien la recibe debe poder leerla entera sin salir del correo: si hay que
 * dar un clic para ver el precio, la mitad no lo da. El enlace y el WhatsApp
 * quedan para actuar, no para enterarse.
 */
export function htmlCotizacion(solicitud: Solicitud, cotizacion: Cotizacion) {
  const url = urlCotizacion(cotizacion.token);
  const servicio = solicitud.servicio_otro || servicioPorId(solicitud.servicio).label;
  // El número del negocio: configurable, y si no, el que está en site.ts.
  const whatsapp = enlaceWhatsApp(
    process.env.WHATSAPP_NEGOCIO || site.celular,
    mensajeParaCliente(solicitud, cotizacion),
  );

  const conceptos = cotizacion.conceptos
    .map(
      (c, i) => `<tr>
      <td style="padding:13px 0;${i ? `border-top:1px solid ${LINEA};` : ""}">
        <p style="margin:0;font-family:${SANS};font-size:14.5px;font-weight:600;color:${TINTA};">${escapa(c.concepto)}</p>
        <p style="margin:4px 0 0;font-family:${SANS};font-size:13.5px;line-height:1.55;color:${GRIS};">${escapa(c.detalle)}</p>
      </td></tr>`,
    )
    .join("");

  const contenido = `
    ${cabecera()}

    ${bloque(
      `${rotulo("Cotización estimada")}
       ${h1(escapa(cotizacion.titulo))}
       <div style="height:14px"></div>
       ${parrafo(escapa(cotizacion.resumen))}`,
      "32px 32px 26px",
    )}

    <!-- El precio va arriba y sobre fondo oscuro: es lo que vienen a ver. -->
    <tr><td style="padding:0 32px 30px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
             style="background:${TINTA};border-radius:14px;">
        <tr><td style="padding:26px 28px;">
          ${rotulo("Inversión estimada", "rgba(250,249,245,.5)")}
          <p style="margin:0;font-family:${SERIF};font-size:34px;line-height:1.1;color:${PAPEL};">
            ${formatoMXN(Number(cotizacion.precio_min))} – ${formatoMXN(Number(cotizacion.precio_max))}</p>
          <p style="margin:10px 0 0;font-family:${SANS};font-size:13.5px;color:rgba(250,249,245,.62);">
            ${escapa(cotizacion.moneda)} · Tiempo estimado: ${escapa(cotizacion.tiempo_estimado)}</p>
        </td></tr>
      </table>
    </td></tr>

    ${separador()}
    ${bloque(`${rotulo("Servicio solicitado")}${parrafo(escapa(servicio), TINTA)}`)}

    ${separador()}
    ${bloque(`${rotulo("Qué incluye el alcance")}${lista(cotizacion.alcance)}`)}

    ${separador()}
    ${bloque(
      `${rotulo("Conceptos incluidos")}
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${conceptos}</table>`,
    )}

    ${separador()}
    ${bloque(`${rotulo("Condiciones")}${lista(cotizacion.condiciones, GRIS)}`)}

    ${
      cotizacion.notas
        ? bloque(
            `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                    style="background:${CREMA};border-radius:12px;">
               <tr><td style="padding:18px 20px;font-family:${SANS};font-size:13.5px;line-height:1.6;color:${SUAVE};">
                 ${escapa(cotizacion.notas)}</td></tr></table>`,
            "0 32px 28px",
          )
        : ""
    }

    <!-- Cierre: un paso siguiente claro y dos formas de darlo. -->
    <tr><td style="padding:0 32px 34px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
             style="background:${PAPEL};border:1px solid ${LINEA};border-radius:14px;">
        <tr><td style="padding:26px 26px 24px;">
          <p style="margin:0;font-family:${SERIF};font-size:21px;line-height:1.3;color:${TINTA};">
            ¿Lo vemos con calma?</p>
          <p style="margin:10px 0 20px;font-family:${SANS};font-size:14.5px;line-height:1.6;color:${SUAVE};">
            Respóndeme este correo o escríbeme por WhatsApp y ajustamos el alcance a lo que
            realmente necesitas. Si algo sobra, lo quitamos y el precio baja.</p>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            ${whatsapp ? `<td style="padding-right:10px;">${boton(whatsapp, "Escribir por WhatsApp")}</td>` : ""}
            <td>${boton(url, "Ver cotización en línea", { claro: true })}</td>
          </tr></table>
        </td></tr>
      </table>
    </td></tr>`;

  return {
    asunto: `Tu cotización: ${cotizacion.titulo} — ${formatoMXN(Number(cotizacion.precio_min))} a ${formatoMXN(Number(cotizacion.precio_max))}`,
    html: documento({
      preencabezado: `${formatoMXN(Number(cotizacion.precio_min))} a ${formatoMXN(Number(cotizacion.precio_max))} · ${cotizacion.tiempo_estimado}. ${AVISO_ESTIMACION}`,
      contenido,
    }),
  };
}

export async function enviarCotizacion(solicitud: Solicitud, cotizacion: Cotizacion) {
  const { asunto, html } = htmlCotizacion(solicitud, cotizacion);
  await resend().emails.send({
    from: remitente(),
    to: solicitud.correo,
    replyTo: site.email,
    subject: asunto,
    html,
  });
}

/* ───────────────── acuse (solo si la cotización falla) ───────────────── */

/**
 * Respaldo: si la cotización no se pudo generar, el cliente igual recibe
 * señal de vida en lugar de silencio.
 */
export async function enviarAcuse(solicitud: Solicitud) {
  const contenido = `
    ${cabecera()}
    ${bloque(
      `${rotulo("Solicitud recibida")}
       ${h1(`Gracias, ${escapa(nombrePila(solicitud.nombre))}.`)}
       <div style="height:14px"></div>
       ${parrafo(
         "Ya tenemos tu solicitud y la estamos revisando a mano. Te mandamos la cotización estimada en menos de 24 horas hábiles.",
       )}`,
      "32px 32px 26px",
    )}
    ${separador()}
    ${bloque(
      `${rotulo("Lo que nos contaste")}
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
              style="background:${CREMA};border-radius:12px;">
         <tr><td style="padding:18px 20px;font-family:${SANS};font-size:14px;line-height:1.65;color:${SUAVE};white-space:pre-wrap;">${escapa(solicitud.descripcion)}</td></tr>
       </table>`,
    )}`;

  await resend().emails.send({
    from: remitente(),
    to: solicitud.correo,
    replyTo: site.email,
    subject: "Recibimos tu solicitud — DCing",
    html: documento({
      preencabezado: "Estamos preparando tu cotización estimada.",
      contenido,
    }),
  });
}

/* ───────────────────────── aviso interno ───────────────────────── */

export async function avisarInterno(solicitud: Solicitud, cotizacion?: Cotizacion) {
  const destino = process.env.NOTIFY_EMAIL;
  if (!destino) return;

  const servicio = solicitud.servicio_otro || servicioPorId(solicitud.servicio).label;
  const wa = enlaceWhatsApp(solicitud.celular, `Hola ${nombrePila(solicitud.nombre)}, soy de DCing.`);

  const contenido = `
    ${cabecera({ oscura: true })}
    ${bloque(
      `${rotulo("Nueva solicitud")}
       ${h1(escapa(solicitud.nombre))}
       <div style="height:6px"></div>
       ${parrafo(
         `${solicitud.empresa ? escapa(solicitud.empresa) + " · " : ""}${escapa(servicio)}`,
         GRIS,
       )}
       <div style="height:18px"></div>
       ${lista([solicitud.correo, solicitud.celular])}
       <div style="height:8px"></div>
       <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
         <td style="padding-right:10px;">${boton(wa, "WhatsApp")}</td>
         <td>${boton(`${site.url}/admin`, "Abrir panel", { claro: true })}</td>
       </tr></table>`,
      "30px 32px 26px",
    )}
    ${separador()}
    ${bloque(
      `${rotulo("Descripción")}
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
              style="background:${CREMA};border-radius:12px;">
         <tr><td style="padding:18px 20px;font-family:${SANS};font-size:14px;line-height:1.65;color:${SUAVE};white-space:pre-wrap;">${escapa(solicitud.descripcion)}</td></tr>
       </table>`,
    )}
    ${
      cotizacion
        ? `${separador()}${bloque(
            `${rotulo("Cotización enviada")}
             ${parrafo(
               `${escapa(cotizacion.titulo)} · <strong style="color:${TINTA}">${formatoMXN(Number(cotizacion.precio_min))} – ${formatoMXN(Number(cotizacion.precio_max))}</strong> · ${escapa(cotizacion.tiempo_estimado)} · confianza ${escapa(cotizacion.confianza)}`,
             )}
             ${
               cotizacion.preguntas.length
                 ? `<div style="height:14px"></div>${rotulo("Puntos por confirmar")}${lista(cotizacion.preguntas, GRIS)}`
                 : ""
             }`,
          )}`
        : ""
    }`;

  await resend().emails.send({
    from: remitente(),
    to: destino,
    replyTo: solicitud.correo,
    subject: `${cotizacion ? "Cotización enviada" : "Solicitud"} · ${solicitud.nombre}${solicitud.empresa ? ` (${solicitud.empresa})` : ""}`,
    html: documento({
      preencabezado: `${servicio} · ${solicitud.correo}`,
      contenido,
      pie: "Aviso interno de DCing.",
    }),
  });
}

export { BLANCO };
