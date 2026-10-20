"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE } from "@/lib/motion";
import { site } from "@/lib/site";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

/**
 * Entrada del hero. El monograma no acompaña al nombre: **es** su primera
 * letra, así que lo único que se escribe es "Cing".
 *
 * El círculo no aparece sin más: llega como un aro amplio y delgado que se
 * contrae mientras engorda, hasta cerrarse en disco. Un aro de radio R y
 * grosor G cubre de R − G/2 a R + G/2, así que terminar en R = 145.5 con
 * G = 291 da exactamente el disco de radio 291 del logo, sin cambiar de
 * figura a medio camino.
 *
 * Después baja el asta, y "Cing" sale de detrás de ella. Como la fila está
 * centrada, al crecer el ancho del texto la marca se recorre sola hacia la
 * izquierda: ese reacomodo es parte del efecto, no un salto de maquetación.
 */

/** Cuándo abre la palabra y cuánto tarda, en segundos. */
const APERTURA = { retraso: 1.25, duracion: 0.95 };

/** Estado final del aro, el que lo vuelve disco sólido. */
const DISCO = { r: 145.5, grosor: 291 };
/** Estado inicial: aro amplio y fino, por fuera de donde acabará. */
const ARO = { r: 430, grosor: 3 };

export function HeroLogo() {
  const reduce = useReducedMotionSafe();
  const medidor = useRef<HTMLSpanElement>(null);
  const [ancho, setAncho] = useState(0);
  const [cumplido, setCumplido] = useState(false);

  // El ancho natural de "Cing" cambia con el clamp tipográfico, así que se
  // mide en lugar de suponerse: es el destino de la animación de apertura.
  useEffect(() => {
    const nodo = medidor.current;
    if (!nodo) return;

    const medir = () => setAncho(nodo.getBoundingClientRect().width);
    medir();

    const observador = new ResizeObserver(medir);
    observador.observe(nodo);
    return () => observador.disconnect();
  }, []);

  /*
   * El recorte se suelta por reloj y no con onAnimationComplete: el ancho
   * arranca en 0 porque todavía no se ha medido, y esa animación de cero a
   * cero termina de inmediato —ya con el ancho real en el closure—, así que
   * el callback se disparaba antes de que la palabra empezara a abrirse.
   */
  useEffect(() => {
    const reloj = setTimeout(
      () => setCumplido(true),
      (APERTURA.retraso + APERTURA.duracion) * 1000 + 80,
    );
    return () => clearTimeout(reloj);
  }, []);

  // Una vez abierta, la palabra deja de recortarse y vuelve a su ancho natural.
  const abierta = reduce || cumplido;

  const t = (duration: number, delay: number) =>
    reduce ? { duration: 0 } : { duration, delay, ease: EASE };

  return (
    <h1 className="mt-8 flex flex-col items-center">
      <span className="sr-only">
        {site.name} — {site.tagline}
      </span>

      <div
        aria-hidden="true"
        className="flex items-baseline justify-center text-[clamp(3.6rem,13vw,9rem)] leading-[0.82] font-medium tracking-[-0.055em]"
      >
        <motion.svg
          viewBox="0 0 694 806"
          initial={{ opacity: reduce ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={t(0.5, 0.05)}
          className="h-[1.12em] w-auto overflow-visible"
        >
          {/* El aro se cierra en disco: es el mismo elemento de principio a fin. */}
          <motion.circle
            cx="291"
            cy="515"
            fill="none"
            stroke="currentColor"
            initial={{
              r: reduce ? DISCO.r : ARO.r,
              strokeWidth: reduce ? DISCO.grosor : ARO.grosor,
            }}
            animate={{ r: DISCO.r, strokeWidth: DISCO.grosor }}
            transition={t(1.15, 0.15)}
          />
          {/* El asta baja después, y de detrás de ella sale el texto. */}
          <motion.rect
            x="515"
            y="0"
            width="179"
            fill="currentColor"
            initial={{ height: reduce ? 806 : 0 }}
            animate={{ height: 806 }}
            transition={t(0.8, 0.55)}
          />
        </motion.svg>

        <motion.span
          initial={{ width: reduce ? "auto" : 0 }}
          animate={{ width: reduce || abierta ? "auto" : ancho }}
          transition={t(APERTURA.duracion, APERTURA.retraso)}
          className="inline-block"
          style={{
            /*
             * No se usa overflow: recortaría también arriba y abajo, y con
             * una interlínea de 0.82 la caja es más baja que las letras, así
             * que la cola de la "g" quedaba cortada. El recorte va solo a los
             * lados, con holgura vertical de sobra, y desaparece al terminar.
             */
            clipPath: reduce || abierta ? "none" : "inset(-60% 0 -60% 0)",
          }}
        >
          <motion.span
            ref={medidor}
            initial={{ opacity: reduce ? 1 : 0, x: reduce ? 0 : "-0.22em" }}
            animate={{ opacity: 1, x: 0 }}
            transition={t(1.05, 1.3)}
            className="inline-block whitespace-nowrap"
          >
            Cing
          </motion.span>
        </motion.span>
      </div>

      <motion.span
        aria-hidden="true"
        initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={t(1, 1.95)}
        className="display mt-7 max-w-[19ch] text-[clamp(1.5rem,3.4vw,2.7rem)] leading-[1.12] text-balance text-ink/90 sm:max-w-3xl"
      >
        {site.tagline}
      </motion.span>
    </h1>
  );
}
