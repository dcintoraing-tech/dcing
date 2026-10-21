"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useActionState, useId, useState } from "react";
import { enviarSolicitud, type EstadoFormulario } from "@/app/cotizar/actions";
import { Window } from "@/components/ui/Window";
import { EASE } from "@/lib/motion";
import { SERVICIOS } from "@/lib/quotes/rate-card";

const CAMPO =
  "w-full rounded-xl border bg-surface px-4 py-3 text-[15px] text-ink outline-none transition-colors duration-300 placeholder:text-ink/25 focus:border-ink/35";

const FLECHA =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%238b8b93' stroke-width='1.5' stroke-linecap='round'%3E%3Cpath d='M4 6.5l4 4 4-4'/%3E%3C/svg%3E\")";

function Etiqueta({
  htmlFor,
  children,
  opcional,
}: {
  htmlFor: string;
  children: string;
  opcional?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="label-mono mb-2.5 block text-ink/40">
      {children}
      {opcional ? <span className="ml-2 text-ink/25">opcional</span> : null}
    </label>
  );
}

function Aviso({ id, mensaje }: { id: string; mensaje?: string }) {
  if (!mensaje) return null;
  return (
    <p id={id} className="mt-2 text-[12.5px] leading-snug text-ink/55">
      {mensaje}
    </p>
  );
}

export function QuoteForm() {
  const [estado, accion, pendiente] = useActionState<EstadoFormulario, FormData>(
    enviarSolicitud,
    null,
  );
  const [servicio, setServicio] = useState("sitio-web");
  const id = useId();

  const errores = estado?.errores ?? {};
  const borde = (campo: string) => (errores[campo] ? "border-ink/40" : "border-line");

  if (estado?.ok) {
    const est = estado.estimacion;
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <Window label={est ? `cotización · ${est.tiempo}` : "solicitud.enviada"}>
          {est ? (
            <>
              {/* La estimación se enseña aquí mismo: esperar un correo para
                  saber el precio es justo donde se pierde a la gente. */}
              <div className="px-6 pt-10 pb-8 text-center sm:px-10">
                <span className="label-mono text-ink/35">Tu cotización estimada</span>
                <h2 className="display mt-5 text-[clamp(1.7rem,3.6vw,2.4rem)] leading-tight text-balance">
                  {est.titulo}
                </h2>
                <p className="mx-auto mt-4 max-w-md text-[14.5px] leading-relaxed text-ink/50">
                  {est.resumen}
                </p>
              </div>

              <div className="bg-contrast px-6 py-8 text-center text-on-contrast sm:px-10">
                <span className="label-mono text-on-contrast/40">Inversión estimada</span>
                <p className="mt-3.5 text-[clamp(1.9rem,5vw,2.9rem)] leading-none font-medium tracking-[-0.035em] tabular-nums">
                  {est.precio}
                </p>
                <p className="mt-3 text-[13.5px] text-on-contrast/55">
                  MXN · Tiempo estimado: {est.tiempo}
                </p>
              </div>

              <div className="border-t border-line px-6 py-7 sm:px-10">
                <span className="label-mono text-ink/35">Incluye</span>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {est.alcance.map((punto) => (
                    <li key={punto} className="flex gap-3.5 text-[14px] leading-relaxed text-ink/65">
                      <span aria-hidden="true" className="mt-[9px] h-px w-3.5 shrink-0 bg-ink/25" />
                      {punto}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-4 border-t border-line px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-10">
                <p className="max-w-[22ch] text-[12.5px] leading-relaxed text-ink/40">
                  Te la mandamos también por correo. Si ajustamos el alcance, el precio se mueve.
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {est.whatsapp ? (
                    <a
                      href={est.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 text-[14.5px] font-medium text-paper shadow-pill transition-all duration-500 ease-premium hover:-translate-y-0.5 hover:shadow-pill-lift"
                    >
                      Platicarlo por WhatsApp
                    </a>
                  ) : null}
                  <a
                    href={est.url}
                    className="inline-flex h-12 items-center justify-center rounded-full border border-line-strong px-6 text-[14.5px] text-ink transition-colors duration-300 hover:border-ink/35"
                  >
                    Ver completa
                  </a>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center px-6 py-16 text-center sm:px-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                  <path
                    d="M5 12.5l4.5 4.5L19 7.5"
                    stroke="var(--paper)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h2 className="display mt-7 text-[clamp(1.7rem,3.4vw,2.2rem)] leading-tight">
                Recibimos tu solicitud.
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink/50">
                Estamos preparando tu cotización estimada. Te llega por correo en unos minutos.
              </p>
              <p className="label-mono mt-8 text-ink/30">Revisa también tu bandeja de spam</p>
            </div>
          )}
        </Window>
      </motion.div>
    );
  }

  return (
    <Window label="cotizar.dcing">
      <form action={accion} className="flex flex-col gap-6 p-6 sm:p-8">
        {/* Campo trampa: invisible para personas, irresistible para bots. */}
        <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
          <label htmlFor={`${id}-sitio`}>No llenar</label>
          <input id={`${id}-sitio`} name="sitioWeb" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <Etiqueta htmlFor={`${id}-nombre`}>Nombre</Etiqueta>
            <input
              id={`${id}-nombre`}
              name="nombre"
              autoComplete="name"
              required
              className={`${CAMPO} ${borde("nombre")}`}
              placeholder="Tu nombre"
              aria-invalid={Boolean(errores.nombre)}
              aria-describedby={errores.nombre ? `${id}-nombre-error` : undefined}
            />
            <Aviso id={`${id}-nombre-error`} mensaje={errores.nombre} />
          </div>

          <div>
            <Etiqueta htmlFor={`${id}-celular`}>Celular</Etiqueta>
            <input
              id={`${id}-celular`}
              name="celular"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              className={`${CAMPO} ${borde("celular")}`}
              placeholder="55 1234 5678"
              aria-invalid={Boolean(errores.celular)}
              aria-describedby={errores.celular ? `${id}-celular-error` : undefined}
            />
            <Aviso id={`${id}-celular-error`} mensaje={errores.celular} />
          </div>

          <div>
            <Etiqueta htmlFor={`${id}-correo`}>Correo electrónico</Etiqueta>
            <input
              id={`${id}-correo`}
              name="correo"
              type="email"
              autoComplete="email"
              required
              className={`${CAMPO} ${borde("correo")}`}
              placeholder="tu@empresa.com"
              aria-invalid={Boolean(errores.correo)}
              aria-describedby={errores.correo ? `${id}-correo-error` : undefined}
            />
            <Aviso id={`${id}-correo-error`} mensaje={errores.correo} />
          </div>

          <div>
            <Etiqueta htmlFor={`${id}-empresa`} opcional>
              Empresa o negocio
            </Etiqueta>
            <input
              id={`${id}-empresa`}
              name="empresa"
              autoComplete="organization"
              className={`${CAMPO} ${borde("empresa")}`}
              placeholder="Nombre del negocio"
            />
          </div>
        </div>

        <div>
          <Etiqueta htmlFor={`${id}-servicio`}>¿Qué necesitas?</Etiqueta>
          <select
            id={`${id}-servicio`}
            name="servicio"
            value={servicio}
            onChange={(evento) => setServicio(evento.target.value)}
            className={`${CAMPO} ${borde("servicio")} appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-11`}
            style={{ backgroundImage: FLECHA }}
          >
            {SERVICIOS.map((opcion) => (
              <option key={opcion.id} value={opcion.id}>
                {opcion.label}
              </option>
            ))}
          </select>
          <p className="mt-2 text-[12.5px] leading-snug text-ink/35">
            {SERVICIOS.find((opcion) => opcion.id === servicio)?.descripcion}
          </p>
        </div>

        {servicio === "otro" ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <Etiqueta htmlFor={`${id}-otro`}>Dinos qué servicio buscas</Etiqueta>
            <input
              id={`${id}-otro`}
              name="servicioOtro"
              className={`${CAMPO} ${borde("servicioOtro")}`}
              placeholder="Por ejemplo: migrar mi tienda a otra plataforma"
              aria-invalid={Boolean(errores.servicioOtro)}
              aria-describedby={errores.servicioOtro ? `${id}-otro-error` : undefined}
            />
            <Aviso id={`${id}-otro-error`} mensaje={errores.servicioOtro} />
          </motion.div>
        ) : null}

        <div>
          <Etiqueta htmlFor={`${id}-descripcion`}>Cuéntanos qué necesitas</Etiqueta>
          <textarea
            id={`${id}-descripcion`}
            name="descripcion"
            rows={6}
            required
            className={`${CAMPO} ${borde("descripcion")} resize-y leading-relaxed`}
            placeholder="Qué hace tu negocio, qué problema quieres resolver, si ya tienes algo funcionando y para cuándo lo necesitas. Entre más contexto, más precisa la estimación."
            aria-invalid={Boolean(errores.descripcion)}
            aria-describedby={errores.descripcion ? `${id}-descripcion-error` : undefined}
          />
          <Aviso id={`${id}-descripcion-error`} mensaje={errores.descripcion} />
        </div>

        {estado?.mensaje && !estado.ok ? (
          <p className="rounded-xl border border-line bg-mist px-4 py-3 text-[13.5px] leading-relaxed text-ink/70">
            {estado.mensaje}
          </p>
        ) : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xs text-[12.5px] leading-relaxed text-ink/35">
            La ves al instante. Es una estimación, no un precio cerrado. Al enviar aceptas el{" "}
            <Link
              href="/privacidad"
              className="text-ink/60 underline underline-offset-2 transition-colors duration-300 hover:text-ink"
            >
              aviso de privacidad
            </Link>
            .
          </p>

          <button
            type="submit"
            disabled={pendiente}
            className="group/btn inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-7 text-[15px] font-medium text-paper shadow-pill transition-all duration-500 ease-premium hover:-translate-y-0.5 hover:shadow-pill-lift disabled:pointer-events-none disabled:opacity-55"
          >
            {pendiente ? "Calculando…" : "Ver mi cotización"}
            {!pendiente ? (
              <span
                aria-hidden="true"
                className="transition-transform duration-500 ease-premium group-hover/btn:translate-x-1"
              >
                →
              </span>
            ) : null}
          </button>
        </div>
      </form>
    </Window>
  );
}
