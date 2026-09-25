"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  abrirSesion,
  adminConfigurado,
  cerrarSesion,
  haySesion,
  passwordCorrecta,
} from "@/lib/admin/auth";
import { correoConfigurado, enviarCotizacion } from "@/lib/email/send";
import { generarCotizacion } from "@/lib/quotes/generate";
import {
  actualizarCotizacion,
  guardarCotizacion,
  marcarEstado,
  obtenerSolicitud,
} from "@/lib/quotes/repo";
import { cotizacionEditSchema } from "@/lib/quotes/schemas";
import { urlCotizacion } from "@/lib/site";

export type EstadoAcceso = { error?: string } | null;
export type EstadoPanel = { ok?: boolean; mensaje?: string; error?: string } | null;

/** Las acciones no confían en el layout: cada una revisa la sesión. */
async function puerta() {
  if (!(await haySesion())) redirect("/admin/login");
}

function mensajeDe(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export async function entrar(_anterior: EstadoAcceso, formData: FormData): Promise<EstadoAcceso> {
  if (!adminConfigurado()) {
    return { error: "Falta configurar ADMIN_PASSWORD y ADMIN_SESSION_SECRET." };
  }

  const intento = String(formData.get("password") ?? "");
  if (!passwordCorrecta(intento)) {
    // Freno mínimo contra fuerza bruta desde un formulario.
    await new Promise((listo) => setTimeout(listo, 600));
    return { error: "Contraseña incorrecta." };
  }

  await abrirSesion();
  redirect("/admin");
}

export async function salir() {
  await cerrarSesion();
  redirect("/admin/login");
}

/** Pide a Claude una versión nueva de la cotización para esta solicitud. */
export async function regenerar(
  _anterior: EstadoPanel,
  formData: FormData,
): Promise<EstadoPanel> {
  await puerta();

  const solicitudId = String(formData.get("solicitudId") ?? "");
  const registro = await obtenerSolicitud(solicitudId);
  if (!registro) return { error: "Solicitud no encontrada." };

  const { solicitud } = registro;

  try {
    await marcarEstado(solicitud.id, "generando");
    const { cotizacion, modelo } = await generarCotizacion({
      nombre: solicitud.nombre,
      empresa: solicitud.empresa,
      servicio: solicitud.servicio,
      servicioOtro: solicitud.servicio_otro,
      descripcion: solicitud.descripcion,
    });
    const nueva = await guardarCotizacion(solicitud.id, cotizacion, modelo);
    await marcarEstado(solicitud.id, "borrador", null);

    revalidatePath("/admin");
    revalidatePath(`/admin/${solicitud.id}`);
    return { ok: true, mensaje: `Versión ${nueva.version} generada.` };
  } catch (error) {
    const mensaje = mensajeDe(error);
    await marcarEstado(solicitud.id, "nueva", mensaje).catch(() => {});
    return { error: `No se pudo generar: ${mensaje}` };
  }
}

/**
 * Guarda las ediciones del administrador y, si la acción es "enviar", aprueba
 * la cotización y se la manda al cliente. El envío nunca ocurre solo.
 */
export async function guardarCotizacionEditada(
  _anterior: EstadoPanel,
  formData: FormData,
): Promise<EstadoPanel> {
  await puerta();

  const cotizacionId = String(formData.get("cotizacionId") ?? "");
  const solicitudId = String(formData.get("solicitudId") ?? "");
  const accion = String(formData.get("accion") ?? "guardar");

  let crudo: unknown;
  try {
    crudo = JSON.parse(String(formData.get("datos") ?? ""));
  } catch {
    return { error: "No se pudieron leer los datos del formulario." };
  }

  const validado = cotizacionEditSchema.safeParse(crudo);
  if (!validado.success) {
    const problema = validado.error.issues[0];
    return { error: `Revisa "${problema?.path.join(".") || "el formulario"}": ${problema?.message}` };
  }

  const datos = validado.data;
  if (datos.precio_max < datos.precio_min) {
    return { error: "El precio máximo no puede ser menor que el mínimo." };
  }

  // Se comprueba antes de tocar la base: nada de aprobar algo que no podrá salir.
  if (accion === "enviar" && !correoConfigurado()) {
    return { error: "Configura RESEND_API_KEY y RESEND_FROM para poder enviar." };
  }

  try {
    const actualizada = await actualizarCotizacion(cotizacionId, {
      ...datos,
      estado: accion === "enviar" ? "aprobada" : "borrador",
    });

    if (accion !== "enviar") {
      await marcarEstado(solicitudId, "borrador");
      revalidatePath(`/admin/${solicitudId}`);
      return { ok: true, mensaje: "Cambios guardados." };
    }

    const registro = await obtenerSolicitud(solicitudId);
    if (!registro) return { error: "Solicitud no encontrada." };

    await enviarCotizacion(registro.solicitud, actualizada, urlCotizacion(actualizada.token));

    await actualizarCotizacion(cotizacionId, {
      estado: "enviada",
      enviada_at: new Date().toISOString(),
    });
    await marcarEstado(solicitudId, "enviada");

    revalidatePath("/admin");
    revalidatePath(`/admin/${solicitudId}`);
    return { ok: true, mensaje: `Enviada a ${registro.solicitud.correo}.` };
  } catch (error) {
    return { error: mensajeDe(error) };
  }
}

export async function cambiarEstadoSolicitud(formData: FormData) {
  await puerta();

  const id = String(formData.get("solicitudId") ?? "");
  const estado = String(formData.get("estado") ?? "");
  if (estado !== "descartada" && estado !== "nueva") return;

  await marcarEstado(id, estado);
  revalidatePath("/admin");
  revalidatePath(`/admin/${id}`);
}
