"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { avisarInterno, correoConfigurado, enviarAcuse } from "@/lib/email/send";
import { MODELO, generarCotizacion, iaConfigurada } from "@/lib/quotes/generate";
import {
  crearSolicitud,
  guardarCotizacion,
  marcarEstado,
  solicitudesUltimaHora,
  type Solicitud,
} from "@/lib/quotes/repo";
import { solicitudSchema } from "@/lib/quotes/schemas";

export type EstadoFormulario = {
  ok: boolean;
  mensaje?: string;
  errores?: Record<string, string>;
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

/** Trabajo posterior a la respuesta: el cliente no espera a la IA ni al correo. */
function procesarEnSegundoPlano(solicitud: Solicitud) {
  after(async () => {
    if (correoConfigurado()) {
      try {
        await enviarAcuse(solicitud);
        await avisarInterno(solicitud);
      } catch (error) {
        console.error("[cotizar] fallo al enviar acuse:", error);
      }
    }

    if (!iaConfigurada()) return;

    try {
      await marcarEstado(solicitud.id, "generando");
      const ia = await generarCotizacion({
        nombre: solicitud.nombre,
        empresa: solicitud.empresa,
        servicio: solicitud.servicio,
        servicioOtro: solicitud.servicio_otro,
        descripcion: solicitud.descripcion,
      });
      await guardarCotizacion(solicitud.id, ia, MODELO);
      await marcarEstado(solicitud.id, "borrador", null);
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : String(error);
      console.error("[cotizar] fallo al generar cotización:", mensaje);
      // Vuelve a "nueva" para que el panel permita reintentar a mano.
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
        mensaje:
          "Ya recibimos varias solicitudes tuyas en la última hora. Escríbenos directo a hola@dcing.com y lo vemos ahí.",
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

    procesarEnSegundoPlano(solicitud);

    return { ok: true };
  } catch (error) {
    console.error("[cotizar] error al registrar solicitud:", error);
    return {
      ok: false,
      mensaje:
        "No pudimos registrar tu solicitud. Inténtalo de nuevo en un momento o escríbenos a hola@dcing.com.",
    };
  }
}
