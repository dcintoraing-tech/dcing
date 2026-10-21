/**
 * Maquetación de los correos.
 *
 * Está escrito con tablas y estilos en línea a propósito: Gmail, Outlook y
 * la mayoría de los clientes descartan hojas de estilo, flexbox y grid. Las
 * tipografías tampoco se pueden cargar, así que la serif es Georgia —presente
 * en todos los sistemas— y guarda el parecido con la del sitio.
 */
import { site } from "@/lib/site";

export const PAPEL = "#faf9f5";
export const TINTA = "#141413";
export const SUAVE = "#45443c";
export const GRIS = "#8b877b";
export const LINEA = "#e6e3d9";
export const CREMA = "#f0eee6";
export const BLANCO = "#ffffff";

const SERIF = "Georgia,'Times New Roman',serif";
const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

export const escapa = (texto: string) =>
  texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Envoltura común: fondo de papel, tarjeta centrada y ancho fijo. */
export function documento({
  preencabezado,
  contenido,
  pie,
}: {
  preencabezado: string;
  contenido: string;
  pie?: string;
}) {
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light only">
<title>${escapa(site.name)}</title></head>
<body style="margin:0;padding:0;background:${PAPEL};">
<!-- Texto de vista previa: es lo que se lee en la bandeja antes de abrir. -->
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapa(preencabezado)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${PAPEL};">
<tr><td align="center" style="padding:32px 14px 48px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
         style="max-width:600px;background:${BLANCO};border:1px solid ${LINEA};border-radius:18px;overflow:hidden;">
    ${contenido}
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
    <tr><td style="padding:26px 10px 0;font-family:${SANS};font-size:12px;line-height:1.7;color:${GRIS};">
      ${pie ?? `${escapa(site.name)} · Diseño, ingeniería y automatización · <a href="${site.url}" style="color:${GRIS};">${escapa(site.url.replace(/^https?:\/\//, ""))}</a>`}
    </td></tr>
  </table>
</td></tr></table></body></html>`;
}

/** Cabecera con el monograma. La imagen vive en el sitio, no va incrustada. */
export function cabecera({ oscura = false } = {}) {
  const fondo = oscura ? TINTA : BLANCO;
  const marca = oscura ? "logo-email-claro.png" : "logo-email.png";
  const texto = oscura ? PAPEL : TINTA;
  const nota = oscura ? "rgba(250,249,245,.45)" : GRIS;

  return `<tr><td style="padding:26px 32px;background:${fondo};border-bottom:1px solid ${oscura ? "rgba(250,249,245,.12)" : LINEA};">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="padding-right:9px;"><img src="${site.url}/${marca}" width="19" height="22" alt=""
            style="display:block;border:0;"></td>
      <td style="font-family:${SANS};font-size:19px;font-weight:600;letter-spacing:-0.6px;color:${texto};">Cing</td>
      <td style="padding-left:14px;font-family:${SANS};font-size:10px;letter-spacing:1.6px;text-transform:uppercase;color:${nota};">
        Diseño + Ingeniería</td>
    </tr></table>
  </td></tr>`;
}

export const h1 = (texto: string, color = TINTA) =>
  `<p style="margin:0;font-family:${SERIF};font-size:30px;line-height:1.2;color:${color};">${texto}</p>`;

export const rotulo = (texto: string, color = GRIS) =>
  `<p style="margin:0 0 10px;font-family:${SANS};font-size:10px;letter-spacing:1.8px;text-transform:uppercase;color:${color};">${escapa(texto)}</p>`;

export const parrafo = (texto: string, color = SUAVE) =>
  `<p style="margin:0;font-family:${SANS};font-size:15px;line-height:1.65;color:${color};">${texto}</p>`;

/** Botón sólido. Se arma con tabla para que Outlook lo respete. */
export function boton(url: string, texto: string, { claro = false } = {}) {
  const fondo = claro ? BLANCO : TINTA;
  const color = claro ? TINTA : PAPEL;
  const borde = claro ? `border:1px solid ${LINEA};` : "";
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
    <td style="background:${fondo};${borde}border-radius:999px;">
      <a href="${escapa(url)}" style="display:inline-block;padding:14px 28px;font-family:${SANS};
         font-size:15px;font-weight:600;color:${color};text-decoration:none;">${escapa(texto)}</a>
    </td></tr></table>`;
}

/** Lista con guion, el mismo recurso que usa el sitio. */
export const lista = (items: string[], color = SUAVE) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
    ${items
      .map(
        (i) => `<tr>
      <td width="22" valign="top" style="padding:7px 0 0;"><div style="width:14px;height:1px;background:${LINEA};"></div></td>
      <td style="padding:0 0 11px;font-family:${SANS};font-size:14.5px;line-height:1.6;color:${color};">${escapa(i)}</td>
    </tr>`,
      )
      .join("")}
  </table>`;

export const separador = () =>
  `<tr><td style="padding:0 32px;"><div style="height:1px;background:${LINEA};"></div></td></tr>`;

export const bloque = (contenido: string, relleno = "28px 32px") =>
  `<tr><td style="padding:${relleno};">${contenido}</td></tr>`;

export { SANS, SERIF };
