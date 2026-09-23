"use client";

import { useActionState, useId, useState } from "react";
import { guardarCotizacionEditada, type EstadoPanel } from "@/app/admin/actions";
import { Window } from "@/components/ui/Window";
import { formatoMXN, servicioPorId } from "@/lib/quotes/rate-card";
import type { Cotizacion } from "@/lib/quotes/repo";

const CAMPO =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-[14px] text-ink outline-none transition-colors duration-300 placeholder:text-ink/25 focus:border-ink/35";

function Etiqueta({ children, nota }: { children: string; nota?: string }) {
  return (
    <span className="label-mono mb-2.5 flex items-baseline gap-2 text-ink/40">
      {children}
      {nota ? (
        <span className="font-sans text-[11px] tracking-normal normal-case text-ink/25">{nota}</span>
      ) : null}
    </span>
  );
}

const aLineas = (valores: string[]) => valores.join("\n");
const aLista = (texto: string) =>
  texto
    .split("\n")
    .map((linea) => linea.trim())
    .filter(Boolean);

export function QuoteEditor({
  cotizacion,
  servicioId,
  bloqueada,
}: {
  cotizacion: Cotizacion;
  servicioId: string;
  bloqueada: boolean;
}) {
  const [estado, accion, pendiente] = useActionState<EstadoPanel, FormData>(
    guardarCotizacionEditada,
    null,
  );
  const id = useId();

  const [titulo, setTitulo] = useState(cotizacion.titulo);
  const [resumen, setResumen] = useState(cotizacion.resumen);
  const [alcance, setAlcance] = useState(aLineas(cotizacion.alcance));
  const [conceptos, setConceptos] = useState(cotizacion.conceptos);
  const [precioMin, setPrecioMin] = useState(String(Number(cotizacion.precio_min)));
  const [precioMax, setPrecioMax] = useState(String(Number(cotizacion.precio_max)));
  const [tiempo, setTiempo] = useState(cotizacion.tiempo_estimado);
  const [condiciones, setCondiciones] = useState(aLineas(cotizacion.condiciones));
  const [notas, setNotas] = useState(cotizacion.notas);

  const rango = servicioPorId(servicioId);

  // Se recalcula en cada render, así que el campo oculto siempre va al día.
  const datos = JSON.stringify({
    titulo,
    resumen,
    alcance: aLista(alcance),
    conceptos: conceptos.filter((concepto) => concepto.concepto.trim()),
    precio_min: Number(precioMin) || 0,
    precio_max: Number(precioMax) || 0,
    tiempo_estimado: tiempo,
    condiciones: aLista(condiciones),
    notas,
  });

  const cambiarConcepto = (indice: number, campo: "concepto" | "detalle", valor: string) =>
    setConceptos((actuales) =>
      actuales.map((concepto, i) => (i === indice ? { ...concepto, [campo]: valor } : concepto)),
    );

  return (
    <Window label={`cotización · v${cotizacion.version}`}>
      <form action={accion} className="flex flex-col gap-7 p-6 sm:p-7">
        <input type="hidden" name="cotizacionId" value={cotizacion.id} />
        <input type="hidden" name="solicitudId" value={cotizacion.solicitud_id} />
        <input type="hidden" name="datos" value={datos} />

        {cotizacion.preguntas.length > 0 ? (
          <div className="rounded-xl border border-line bg-mist px-4 py-3.5">
            <p className="label-mono mb-2 text-ink/40">Dudas de la IA</p>
            <ul className="flex flex-col gap-1.5">
              {cotizacion.preguntas.map((pregunta) => (
                <li key={pregunta} className="text-[13px] leading-relaxed text-ink/60">
                  — {pregunta}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <label htmlFor={`${id}-titulo`} className="block">
          <Etiqueta>Título</Etiqueta>
          <input
            id={`${id}-titulo`}
            value={titulo}
            onChange={(evento) => setTitulo(evento.target.value)}
            className={CAMPO}
          />
        </label>

        <label htmlFor={`${id}-resumen`} className="block">
          <Etiqueta>Resumen</Etiqueta>
          <textarea
            id={`${id}-resumen`}
            rows={4}
            value={resumen}
            onChange={(evento) => setResumen(evento.target.value)}
            className={`${CAMPO} resize-y leading-relaxed`}
          />
        </label>

        <div className="grid gap-6 sm:grid-cols-3">
          <label htmlFor={`${id}-min`} className="block">
            <Etiqueta>Precio mín.</Etiqueta>
            <input
              id={`${id}-min`}
              type="number"
              inputMode="numeric"
              step={500}
              value={precioMin}
              onChange={(evento) => setPrecioMin(evento.target.value)}
              className={`${CAMPO} tabular-nums`}
            />
          </label>

          <label htmlFor={`${id}-max`} className="block">
            <Etiqueta>Precio máx.</Etiqueta>
            <input
              id={`${id}-max`}
              type="number"
              inputMode="numeric"
              step={500}
              value={precioMax}
              onChange={(evento) => setPrecioMax(evento.target.value)}
              className={`${CAMPO} tabular-nums`}
            />
          </label>

          <label htmlFor={`${id}-tiempo`} className="block">
            <Etiqueta>Tiempo estimado</Etiqueta>
            <input
              id={`${id}-tiempo`}
              value={tiempo}
              onChange={(evento) => setTiempo(evento.target.value)}
              className={CAMPO}
            />
          </label>
        </div>

        <p className="-mt-3 text-[12px] text-ink/30">
          Tarifa de referencia · {rango.label}: {formatoMXN(rango.min)} a {formatoMXN(rango.max)}.
        </p>

        <label htmlFor={`${id}-alcance`} className="block">
          <Etiqueta nota="una línea por entregable">Alcance</Etiqueta>
          <textarea
            id={`${id}-alcance`}
            rows={6}
            value={alcance}
            onChange={(evento) => setAlcance(evento.target.value)}
            className={`${CAMPO} resize-y leading-relaxed`}
          />
        </label>

        <div>
          <Etiqueta>Conceptos incluidos</Etiqueta>
          <div className="flex flex-col gap-3">
            {conceptos.map((concepto, indice) => (
              <div key={indice} className="flex flex-col gap-2 sm:flex-row sm:items-start">
                <input
                  value={concepto.concepto}
                  onChange={(evento) => cambiarConcepto(indice, "concepto", evento.target.value)}
                  placeholder="Concepto"
                  aria-label={`Concepto ${indice + 1}`}
                  className={`${CAMPO} sm:w-1/3`}
                />
                <input
                  value={concepto.detalle}
                  onChange={(evento) => cambiarConcepto(indice, "detalle", evento.target.value)}
                  placeholder="Detalle"
                  aria-label={`Detalle del concepto ${indice + 1}`}
                  className={`${CAMPO} sm:flex-1`}
                />
                <button
                  type="button"
                  onClick={() => setConceptos((lista) => lista.filter((_, i) => i !== indice))}
                  className="h-11 shrink-0 rounded-xl border border-line px-4 text-[13px] text-ink/45 transition-colors duration-300 hover:border-ink/25 hover:text-ink"
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setConceptos((lista) => [...lista, { concepto: "", detalle: "" }])}
            className="mt-3 rounded-full border border-line px-4 py-2 text-[13px] text-ink/55 transition-colors duration-300 hover:border-ink/25 hover:text-ink"
          >
            Añadir concepto
          </button>
        </div>

        <label htmlFor={`${id}-condiciones`} className="block">
          <Etiqueta nota="una línea por condición">Condiciones</Etiqueta>
          <textarea
            id={`${id}-condiciones`}
            rows={5}
            value={condiciones}
            onChange={(evento) => setCondiciones(evento.target.value)}
            className={`${CAMPO} resize-y leading-relaxed`}
          />
        </label>

        <label htmlFor={`${id}-notas`} className="block">
          <Etiqueta nota="lo que podría mover el precio">Notas</Etiqueta>
          <textarea
            id={`${id}-notas`}
            rows={3}
            value={notas}
            onChange={(evento) => setNotas(evento.target.value)}
            className={`${CAMPO} resize-y leading-relaxed`}
          />
        </label>

        {estado?.error || estado?.ok ? (
          <p
            role="status"
            className="rounded-xl border border-line bg-mist px-4 py-3 text-[13px] leading-relaxed text-ink/70"
          >
            {estado.error ?? estado.mensaje}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xs text-[12px] leading-relaxed text-ink/35">
            {bloqueada
              ? "Ya se envió al cliente. Si la editas y vuelves a enviar, recibirá una versión corregida."
              : "Nada sale hacia el cliente hasta que tú apruebes y envíes."}
          </p>

          <div className="flex flex-wrap gap-2.5">
            <button
              type="submit"
              name="accion"
              value="guardar"
              disabled={pendiente}
              className="inline-flex h-11 items-center justify-center rounded-full border border-line-strong px-5 text-[14px] text-ink transition-colors duration-300 hover:border-ink/35 disabled:pointer-events-none disabled:opacity-55"
            >
              Guardar cambios
            </button>

            <button
              type="submit"
              name="accion"
              value="enviar"
              disabled={pendiente}
              onClick={(evento) => {
                if (!window.confirm("¿Aprobar y enviar esta cotización al cliente?")) {
                  evento.preventDefault();
                }
              }}
              className="inline-flex h-11 items-center justify-center rounded-full bg-ink px-6 text-[14px] font-medium text-paper shadow-pill transition-all duration-500 ease-premium hover:-translate-y-0.5 hover:shadow-pill-lift disabled:pointer-events-none disabled:opacity-55"
            >
              {pendiente ? "Trabajando…" : "Aprobar y enviar"}
            </button>
          </div>
        </div>
      </form>
    </Window>
  );
}
