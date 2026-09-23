import { Resend } from "resend";
import { formatoMXN } from "@/lib/quotes/rate-card";
import type { Cotizacion, Solicitud } from "@/lib/quotes/repo";

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

const escapa = (texto: string) =>
  texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function envoltura(contenido: string) {
  return `<!doctype html><html lang="es"><body style="margin:0;padding:32px 16px;background:#f5f5f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0a0a0b;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e7e7ea;border-radius:16px;overflow:hidden;">
<tr><td style="padding:28px 32px;border-bottom:1px solid #e7e7ea;">
  <span style="font-size:17px;font-weight:600;letter-spacing:-0.5px;">DCing</span>
  <span style="font-size:11px;letter-spacing:2px;color:#8b8b93;margin-left:10px;text-transform:uppercase;">Diseño + Ingeniería</span>
</td></tr>
<tr><td style="padding:32px;">${contenido}</td></tr>
<tr><td style="padding:20px 32px;border-top:1px solid #e7e7ea;font-size:11px;color:#8b8b93;">
  DCing · Transformamos negocios en sistemas digitales.
</td></tr>
</table></body></html>`;
}

/** Se envía apenas llega la solicitud, antes de que exista cotización. */
export async function enviarAcuse(solicitud: Solicitud) {
  const contenido = `
<p style="margin:0 0 18px;font-size:19px;font-weight:600;">Recibimos tu solicitud, ${escapa(solicitud.nombre.split(" ")[0])}.</p>
<p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#3f3f46;">
  Ya estamos analizando lo que nos describiste para prepararte una cotización estimada.
  Te la enviamos por este medio en menos de 24 horas hábiles.
</p>
<p style="margin:0 0 8px;font-size:11px;letter-spacing:1.5px;color:#8b8b93;text-transform:uppercase;">Lo que nos contaste</p>
<p style="margin:0;padding:14px 16px;background:#f5f5f6;border-radius:10px;font-size:13px;line-height:1.6;color:#3f3f46;white-space:pre-wrap;">${escapa(solicitud.descripcion)}</p>`;

  await resend().emails.send({
    from: remitente(),
    to: solicitud.correo,
    subject: "Recibimos tu solicitud — DCing",
    html: envoltura(contenido),
  });
}

/** Aviso interno para el administrador. */
export async function avisarInterno(solicitud: Solicitud) {
  const destino = process.env.NOTIFY_EMAIL;
  if (!destino) return;

  const contenido = `
<p style="margin:0 0 16px;font-size:17px;font-weight:600;">Nueva solicitud</p>
<p style="margin:0 0 6px;font-size:13px;"><strong>${escapa(solicitud.nombre)}</strong>${solicitud.empresa ? ` · ${escapa(solicitud.empresa)}` : ""}</p>
<p style="margin:0 0 6px;font-size:13px;color:#3f3f46;">${escapa(solicitud.correo)} · ${escapa(solicitud.celular)}</p>
<p style="margin:0 0 16px;font-size:13px;color:#3f3f46;">Servicio: ${escapa(solicitud.servicio_otro || solicitud.servicio)}</p>
<p style="margin:0;padding:14px 16px;background:#f5f5f6;border-radius:10px;font-size:13px;line-height:1.6;white-space:pre-wrap;">${escapa(solicitud.descripcion)}</p>`;

  await resend().emails.send({
    from: remitente(),
    to: destino,
    subject: `Solicitud de ${solicitud.nombre}`,
    html: envoltura(contenido),
  });
}

/** Cotización aprobada por el administrador. */
export async function enviarCotizacion(
  solicitud: Solicitud,
  cotizacion: Cotizacion,
  url: string,
) {
  const lista = (items: string[]) =>
    items
      .map(
        (i) =>
          `<li style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#3f3f46;">${escapa(i)}</li>`,
      )
      .join("");

  const conceptos = cotizacion.conceptos
    .map(
      (c) =>
        `<tr><td style="padding:10px 0;border-bottom:1px solid #f0f0f2;font-size:13px;"><strong>${escapa(c.concepto)}</strong><br><span style="color:#8b8b93;">${escapa(c.detalle)}</span></td></tr>`,
    )
    .join("");

  const contenido = `
<p style="margin:0 0 6px;font-size:11px;letter-spacing:1.5px;color:#8b8b93;text-transform:uppercase;">Cotización estimada</p>
<p style="margin:0 0 20px;font-size:21px;font-weight:600;line-height:1.3;">${escapa(cotizacion.titulo)}</p>

<p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#3f3f46;">${escapa(cotizacion.resumen)}</p>

<div style="padding:18px 20px;background:#0a0a0b;border-radius:12px;margin:0 0 24px;">
  <p style="margin:0 0 4px;font-size:11px;letter-spacing:1.5px;color:rgba(255,255,255,0.5);text-transform:uppercase;">Inversión estimada</p>
  <p style="margin:0;font-size:24px;font-weight:600;color:#ffffff;">${formatoMXN(cotizacion.precio_min)} – ${formatoMXN(cotizacion.precio_max)} MXN</p>
  <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.6);">Tiempo estimado: ${escapa(cotizacion.tiempo_estimado)}</p>
</div>

<p style="margin:0 0 10px;font-size:11px;letter-spacing:1.5px;color:#8b8b93;text-transform:uppercase;">Alcance</p>
<ul style="margin:0 0 24px;padding-left:18px;">${lista(cotizacion.alcance)}</ul>

<p style="margin:0 0 6px;font-size:11px;letter-spacing:1.5px;color:#8b8b93;text-transform:uppercase;">Conceptos incluidos</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">${conceptos}</table>

<p style="margin:0 0 10px;font-size:11px;letter-spacing:1.5px;color:#8b8b93;text-transform:uppercase;">Condiciones</p>
<ul style="margin:0 0 28px;padding-left:18px;">${lista(cotizacion.condiciones)}</ul>

<a href="${escapa(url)}" style="display:inline-block;padding:13px 24px;background:#0a0a0b;color:#ffffff;text-decoration:none;border-radius:999px;font-size:14px;font-weight:500;">Ver cotización completa</a>

<p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#8b8b93;">
  ¿Dudas o quieres ajustar el alcance? Responde este correo y lo revisamos.
</p>`;

  await resend().emails.send({
    from: remitente(),
    to: solicitud.correo,
    subject: `Tu cotización estimada — ${cotizacion.titulo}`,
    html: envoltura(contenido),
  });
}
