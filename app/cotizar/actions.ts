"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { avisarInterno, correoConfigurado, enviarAcuse, enviarCotizacion } from "@/lib/email/send";
import { generarCotizacion, iaConfigurada } from "@/lib/quotes/generate";
import { formatoMXN } from "@/lib/quotes/rate-card";
import {
  actualizarCotizacion,
  crearSolicitud,
  guardarCotizacion,
  marcarEstado,
  solicitudesUltimaHora,
  type Cotizacion,
  type Solicitud,
} from "@/lib/quotes/repo";
import { solicitudSchema } from "@/lib/quotes/schemas";
import { site, urlCotizacion } from "@/lib/site";
import { enlaceWhatsApp, enviarWhatsApp, mensajeParaCliente } from "@/lib/whatsapp";

/** Lo que la pantalla de éxito necesita para mostrar la estimación al vuelo. */
export type Estimacion = {
  titulo: string;
  resumen: string;
  precio: string;
  tiempo: string;
  alcance: string[];
  url: string;
  whatsapp: string;
};

export type EstadoFormulario = {
  ok: boolean;
  mensaje?: string;
  errores?: Record<string, string>;
  estimacion?: Estimacion;
} | null;

const LIMITE_POR_HORA = 3;

async function datosPeticion() {
  const cabeceras = await headers();
  const reenviada = cabeceras.get("x-forwarded-for");
  return {
    ip: reenviada?.split(",")[0]?.trim() || cabeceras.get("x-real-ip") || null,
    userAgent: cabeceras.get("user-agent"),
  };
}

/**
 * Envío al cliente, después de responderle a la pantalla.
 *
 * Va en `after()` para que nadie espere a que Resend y Meta contesten: la
 * estimación ya se mostró en pantalla, esto solo la hace llegar a su bandeja
 * y a su teléfono.
 */
function entregar(solicitud: Solicitud, cotizacion: Cotizacion) {
  after(async () => {
    let entregada = false;

    if (correoConfigurado()) {
      try {
        await enviarCotizacion(solicitud, cotizacion);
        entregada = true;
      } catch (error) {
        console.error("[cotizar] fallo al enviar la cotización:", error);
        // Si la cotización no salió, al menos que no reciba silencio.
        await enviarAcuse(solicitud).catch(() => {});
      }
    }

    try {
      const wa = await enviarWhatsApp(solicitud, cotizacion);
      if (!wa.enviado && wa.motivo !== "sin credenciales") {
        console.error("[cotizar] WhatsApp no salió:", wa.motivo);
      }
    } catch (error) {
      console.error("[cotizar] fallo al enviar WhatsApp:", error);
    }

    if (correoConfigurado()) {
      await avisarInterno(solicitud, cotizacion).catch(() => {});
    }

    await marcarEstado(solicitud.id, entregada ? "enviada" : "borrador").catch(() => {});
  });
}

/** Trabajo diferido cuando la cotización no se pudo armar en el momento. */
function generarDespues(solicitud: Solicitud) {
  after(async () => {
    if (correoConfigurado()) {
      await enviarAcuse(solicitud).catch(() => {});
      await avisarInterno(solicitud).catch(() => {});
    }
    try {
      await marcarEstado(solicitud.id, "generando");
      const { cotizacion, modelo } = await generarCotizacion({
        nombre: solicitud.nombre,
        empresa: solicitud.empresa,
        servicio: solicitud.servicio,
        servicioOtro: solicitud.servicio_otro,
        descripcion: solicitud.descripcion,
      });
      const recien = await guardarCotizacion(solicitud.id, cotizacion, modelo);
      const guardada = await actualizarCotizacion(recien.id, {
        estado: "enviada",
        enviada_at: new Date().toISOString(),
      });
      if (correoConfigurado()) await enviarCotizacion(solicitud, guardada);
      await marcarEstado(solicitud.id, "enviada", null);
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : String(error);
      console.error("[cotizar] fallo al generar cotización:", mensaje);
      await marcarEstado(solicitud.id, "nueva", mensaje).catch(() => {});
    }
  });
}

export async function enviarSolicitud(
  _anterior: EstadoFormulario,
  formData: FormData,
): Promise<EstadoFormulario> {
  const crudo = {
    nombre: String(formData.get("nombre") ?? ""),
    celular: String(formData.get("celular") ?? ""),
    correo: String(formData.get("correo") ?? "").toLowerCase(),
    empresa: String(formData.get("empresa") ?? ""),
    servicio: String(formData.get("servicio") ?? ""),
    servicioOtro: String(formData.get("servicioOtro") ?? ""),
    descripcion: String(formData.get("descripcion") ?? ""),
    sitioWeb: String(formData.get("sitioWeb") ?? ""),
  };

  // Campo trampa lleno: es un bot. Respondemos como si todo hubiera salido bien.
  if (crudo.sitioWeb.length > 0) {
    return { ok: true };
  }

  const validado = solicitudSchema.safeParse(crudo);
  if (!validado.success) {
    const errores: Record<string, string> = {};
    for (const problema of validado.error.issues) {
      const campo = String(problema.path[0] ?? "");
      if (campo && !errores[campo]) errores[campo] = problema.message;
    }
    return { ok: false, errores, mensaje: "Revisa los campos marcados." };
  }

  const datos = validado.data;
  const { ip, userAgent } = await datosPeticion();

  try {
    const recientes = await solicitudesUltimaHora(ip, datos.correo);
    if (recientes.porCorreo >= LIMITE_POR_HORA || recientes.porIp >= LIMITE_POR_HORA) {
      return {
        ok: false,
        mensaje: `Ya recibimos varias solicitudes tuyas en la última hora. Escríbenos directo a ${site.email} y lo vemos ahí.`,
      };
    }

    const solicitud = await crearSolicitud({
      nombre: datos.nombre,
      celular: datos.celular,
      correo: datos.correo,
      empresa: datos.empresa,
      servicio: datos.servicio,
      servicioOtro: datos.servicioOtro,
      descripcion: datos.descripcion,
      ip,
      userAgent,
    });

    /*
     * Con plantilla la cotización es cálculo puro y sale en milisegundos, así
     * que se arma aquí mismo y el cliente la ve en pantalla sin esperar nada.
     * Con IA de por medio hay una llamada de varios segundos: ahí sí conviene
     * responder primero y entregar después.
     */
    if (!iaConfigurada()) {
      const { cotizacion, modelo } = await generarCotizacion({
        nombre: solicitud.nombre,
        empresa: solicitud.empresa,
        servicio: solicitud.servicio,
        servicioOtro: solicitud.servicio_otro,
        descripcion: solicitud.descripcion,
      });
      /*
       * Se marca enviada antes de responder: el enlace se enseña en pantalla
       * de inmediato, y la página pública oculta los borradores. Si esperara
       * al correo, el cliente podría abrirlo y encontrarse un 404.
       */
      const guardada = await actualizarCotizacion(
        (await guardarCotizacion(solicitud.id, cotizacion, modelo)).id,
        { estado: "enviada", enviada_at: new Date().toISOString() },
      );
      entregar(solicitud, guardada);

      return {
        ok: true,
        estimacion: {
          titulo: guardada.titulo,
          resumen: guardada.resumen,
          precio: `${formatoMXN(Number(guardada.precio_min))} – ${formatoMXN(Number(guardada.precio_max))}`,
          tiempo: guardada.tiempo_estimado,
          alcance: guardada.alcance.slice(0, 4),
          url: urlCotizacion(guardada.token),
          whatsapp: enlaceWhatsApp(
            process.env.WHATSAPP_NEGOCIO || site.celular,
            mensajeParaCliente(solicitud, guardada),
          ),
        },
      };
    }

    generarDespues(solicitud);
    return { ok: true };
  } catch (error) {
    console.error("[cotizar] error al registrar solicitud:", error);
    return {
      ok: false,
      mensaje: `No pudimos registrar tu solicitud. Inténtalo de nuevo en un momento o escríbenos a ${site.email}.`,
    };
  }
}
