import { z } from "zod";
import { SERVICIOS } from "./rate-card";

const IDS = SERVICIOS.map((s) => s.id) as [string, ...string[]];

/** Lo que envía el formulario público. */
export const solicitudSchema = z
  .object({
    nombre: z.string().trim().min(2, "Escribe tu nombre").max(120),
    celular: z
      .string()
      .trim()
      .min(8, "Número demasiado corto")
      .max(20)
      .regex(/^[\d+()\s-]+$/, "Solo números, espacios y + ( ) -"),
    correo: z.email("Correo no válido").max(160),
    empresa: z.string().trim().max(120).optional(),
    servicio: z.enum(IDS),
    servicioOtro: z.string().trim().max(160).optional(),
    descripcion: z
      .string()
      .trim()
      .min(20, "Cuéntanos un poco más: al menos 20 caracteres")
      .max(4000),
    /** Campo trampa: los bots lo llenan, las personas no lo ven. */
    sitioWeb: z.string().max(0).optional(),
  })
  .refine(
    (d) => d.servicio !== "otro" || (d.servicioOtro?.trim().length ?? 0) >= 3,
    { message: "Describe brevemente qué necesitas", path: ["servicioOtro"] },
  );

export type SolicitudInput = z.infer<typeof solicitudSchema>;

/**
 * Forma exacta que debe devolver Claude. Se usa como structured output, así
 * que se mantiene plana y sin campos opcionales.
 */
export const cotizacionIASchema = z.object({
  titulo: z.string(),
  servicio: z.string(),
  resumen: z.string(),
  alcance: z.array(z.string()),
  conceptos: z.array(z.object({ concepto: z.string(), detalle: z.string() })),
  precio_min: z.number(),
  precio_max: z.number(),
  tiempo_estimado: z.string(),
  condiciones: z.array(z.string()),
  notas: z.string(),
  confianza: z.enum(["alta", "media", "baja"]),
  preguntas: z.array(z.string()),
});

export type CotizacionIA = z.infer<typeof cotizacionIASchema>;

/** Campos que el administrador puede editar antes de aprobar. */
export const cotizacionEditSchema = z.object({
  titulo: z.string().trim().min(3).max(200),
  resumen: z.string().trim().min(10).max(2000),
  alcance: z.array(z.string().trim().min(1)).max(20),
  conceptos: z
    .array(z.object({ concepto: z.string().trim().min(1), detalle: z.string().trim() }))
    .max(20),
  precio_min: z.number().min(0),
  precio_max: z.number().min(0),
  tiempo_estimado: z.string().trim().min(2).max(120),
  condiciones: z.array(z.string().trim().min(1)).max(20),
  notas: z.string().trim().max(2000),
});
