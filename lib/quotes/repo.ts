import { randomBytes } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { CotizacionIA } from "./schemas";

export type EstadoSolicitud =
  | "nueva"
  | "generando"
  | "borrador"
  | "aprobada"
  | "enviada"
  | "descartada";

export type Solicitud = {
  id: string;
  created_at: string;
  updated_at: string;
  nombre: string;
  celular: string;
  correo: string;
  empresa: string | null;
  servicio: string;
  servicio_otro: string | null;
  descripcion: string;
  estado: EstadoSolicitud;
  error_ia: string | null;
  ip: string | null;
  user_agent: string | null;
};

export type Cotizacion = {
  id: string;
  solicitud_id: string;
  created_at: string;
  updated_at: string;
  version: number;
  token: string;
  titulo: string;
  servicio: string;
  resumen: string;
  alcance: string[];
  conceptos: { concepto: string; detalle: string }[];
  precio_min: number;
  precio_max: number;
  moneda: string;
  tiempo_estimado: string;
  condiciones: string[];
  notas: string;
  preguntas: string[];
  confianza: "alta" | "media" | "baja";
  estado: "borrador" | "aprobada" | "enviada";
  enviada_at: string | null;
  modelo: string | null;
};

function nuevoToken() {
  return randomBytes(12).toString("base64url");
}

export async function crearSolicitud(datos: {
  nombre: string;
  celular: string;
  correo: string;
  empresa?: string | null;
  servicio: string;
  servicioOtro?: string | null;
  descripcion: string;
  ip: string | null;
  userAgent: string | null;
}): Promise<Solicitud> {
  const { data, error } = await supabaseAdmin()
    .from("solicitudes")
    .insert({
      nombre: datos.nombre,
      celular: datos.celular,
      correo: datos.correo,
      empresa: datos.empresa || null,
      servicio: datos.servicio,
      servicio_otro: datos.servicioOtro || null,
      descripcion: datos.descripcion,
      ip: datos.ip,
      user_agent: datos.userAgent,
    })
    .select()
    .single();

  if (error) throw new Error(`No se pudo guardar la solicitud: ${error.message}`);
  return data as Solicitud;
}

/** Límite anti-abuso: cuántas solicitudes lleva esta IP o este correo en la última hora. */
export async function solicitudesUltimaHora(ip: string | null, correo: string) {
  const desde = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const cliente = supabaseAdmin();

  const porCorreo = await cliente
    .from("solicitudes")
    .select("id", { count: "exact", head: true })
    .eq("correo", correo)
    .gte("created_at", desde);

  let porIp = 0;
  if (ip) {
    const res = await cliente
      .from("solicitudes")
      .select("id", { count: "exact", head: true })
      .eq("ip", ip)
      .gte("created_at", desde);
    porIp = res.count ?? 0;
  }

  return { porCorreo: porCorreo.count ?? 0, porIp };
}

export async function marcarEstado(id: string, estado: EstadoSolicitud, errorIa?: string | null) {
  const { error } = await supabaseAdmin()
    .from("solicitudes")
    .update({ estado, ...(errorIa !== undefined ? { error_ia: errorIa } : {}) })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function guardarCotizacion(
  solicitudId: string,
  ia: CotizacionIA,
  modelo: string,
): Promise<Cotizacion> {
  const cliente = supabaseAdmin();

  const previas = await cliente
    .from("cotizaciones")
    .select("version")
    .eq("solicitud_id", solicitudId)
    .order("version", { ascending: false })
    .limit(1);

  const version = (previas.data?.[0]?.version ?? 0) + 1;

  const { data, error } = await cliente
    .from("cotizaciones")
    .insert({
      solicitud_id: solicitudId,
      version,
      token: nuevoToken(),
      titulo: ia.titulo,
      servicio: ia.servicio,
      resumen: ia.resumen,
      alcance: ia.alcance,
      conceptos: ia.conceptos,
      precio_min: ia.precio_min,
      precio_max: ia.precio_max,
      tiempo_estimado: ia.tiempo_estimado,
      condiciones: ia.condiciones,
      notas: ia.notas,
      preguntas: ia.preguntas,
      confianza: ia.confianza,
      modelo,
    })
    .select()
    .single();

  if (error) throw new Error(`No se pudo guardar la cotización: ${error.message}`);
  return data as Cotizacion;
}

export async function listarSolicitudes(limite = 100) {
  const { data, error } = await supabaseAdmin()
    .from("solicitudes")
    .select("*, cotizaciones(id, version, token, precio_min, precio_max, estado, confianza)")
    .order("created_at", { ascending: false })
    .limit(limite);

  if (error) throw new Error(error.message);
  return (data ?? []) as (Solicitud & {
    cotizaciones: Pick<
      Cotizacion,
      "id" | "version" | "token" | "precio_min" | "precio_max" | "estado" | "confianza"
    >[];
  })[];
}

export async function obtenerSolicitud(id: string) {
  const cliente = supabaseAdmin();

  const solicitud = await cliente.from("solicitudes").select("*").eq("id", id).maybeSingle();
  if (solicitud.error) throw new Error(solicitud.error.message);
  if (!solicitud.data) return null;

  const cotizaciones = await cliente
    .from("cotizaciones")
    .select("*")
    .eq("solicitud_id", id)
    .order("version", { ascending: false });
  if (cotizaciones.error) throw new Error(cotizaciones.error.message);

  return {
    solicitud: solicitud.data as Solicitud,
    cotizaciones: (cotizaciones.data ?? []) as Cotizacion[],
  };
}

export async function obtenerPorToken(token: string) {
  const cliente = supabaseAdmin();

  const cotizacion = await cliente
    .from("cotizaciones")
    .select("*")
    .eq("token", token)
    .maybeSingle();
  if (cotizacion.error) throw new Error(cotizacion.error.message);
  if (!cotizacion.data) return null;

  const fila = cotizacion.data as Cotizacion;
  const solicitud = await cliente
    .from("solicitudes")
    .select("*")
    .eq("id", fila.solicitud_id)
    .maybeSingle();
  if (solicitud.error) throw new Error(solicitud.error.message);

  return { cotizacion: fila, solicitud: solicitud.data as Solicitud | null };
}

export async function actualizarCotizacion(
  id: string,
  campos: Partial<
    Pick<
      Cotizacion,
      | "titulo"
      | "resumen"
      | "alcance"
      | "conceptos"
      | "precio_min"
      | "precio_max"
      | "tiempo_estimado"
      | "condiciones"
      | "notas"
      | "estado"
      | "enviada_at"
    >
  >,
) {
  const { data, error } = await supabaseAdmin()
    .from("cotizaciones")
    .update(campos)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Cotizacion;
}
