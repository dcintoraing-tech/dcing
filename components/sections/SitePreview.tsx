"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

/**
 * Medidas con las que se renderiza el sitio incrustado antes de escalarlo.
 * En marcos angostos se pide el ancho de un teléfono: encoger una maqueta de
 * escritorio al 26 % la vuelve ilegible, mientras que el propio layout móvil
 * del sitio se lee bien. El alto siempre excede al visible para poder
 * recorrer la página.
 */
const ESCRITORIO = { ancho: 1440, alto: 2100 };
const TELEFONO = { ancho: 430, alto: 1000 };
const CORTE = 640;

/**
 * Vista previa en vivo de un sitio.
 *
 * El iframe se renderiza a ancho de escritorio y se reduce con transform, de
 * modo que el sitio se ve con su maquetación real y no con la versión móvil
 * que le tocaría por el ancho de la tarjeta. Solo se monta cuando la tarjeta
 * se acerca a la pantalla: cuatro iframes cargando de golpe arruinarían la
 * carga inicial.
 *
 * Al pasar el cursor, la página se recorre despacio hacia abajo. No se puede
 * hacer scroll dentro de un iframe de otro origen, así que lo que se mueve es
 * el iframe completo dentro de su marco.
 */
export function SitePreview({ url, nombre }: { url: string; nombre: string }) {
  const marco = useRef<HTMLDivElement>(null);
  const cerca = useInView(marco, { once: true, margin: "400px 0px" });
  const reduce = useReducedMotionSafe();

  const [caja, setCaja] = useState({ ancho: 0, alto: 0 });
  const [cargado, setCargado] = useState(false);
  const [recorriendo, setRecorriendo] = useState(false);

  // La escala depende del ancho real de la tarjeta, que cambia con la ventana;
  // por eso se mide en vez de calcularse en CSS.
  useEffect(() => {
    const nodo = marco.current;
    if (!nodo) return;

    const medir = () => setCaja({ ancho: nodo.clientWidth, alto: nodo.clientHeight });
    medir();

    const observador = new ResizeObserver(medir);
    observador.observe(nodo);
    return () => observador.disconnect();
  }, []);

  const virtual = caja.ancho > 0 && caja.ancho < CORTE ? TELEFONO : ESCRITORIO;
  const escala = caja.ancho / virtual.ancho;
  const oculto = Math.max(0, virtual.alto * escala - caja.alto);
  // Se deja un margen para no llegar nunca al pie de la página incrustada.
  const recorrido = Math.min(oculto, caja.alto * 1.15);

  return (
    <div
      ref={marco}
      className="relative h-full w-full overflow-hidden bg-mist"
      onMouseEnter={() => setRecorriendo(true)}
      onMouseLeave={() => setRecorriendo(false)}
    >
      {cerca ? (
        <motion.div
          className="absolute top-0 left-0 origin-top-left"
          style={{ width: virtual.ancho, height: virtual.alto, scale: escala }}
          animate={{ y: recorriendo && !reduce ? -recorrido / (escala || 1) : 0 }}
          transition={{ duration: recorriendo ? 7 : 1.1, ease: recorriendo ? "linear" : "easeOut" }}
        >
          <iframe
            src={url}
            title={`Vista previa de ${nombre}`}
            loading="lazy"
            tabIndex={-1}
            referrerPolicy="no-referrer"
            onLoad={() => setCargado(true)}
            className="h-full w-full border-0"
            // El cursor nunca entra al iframe: la tarjeta completa es el enlace.
            style={{ pointerEvents: "none" }}
          />
        </motion.div>
      ) : null}

      {/* Mientras carga, el marco no debe verse vacío. */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 1 }}
        animate={{ opacity: cargado ? 0 : 1 }}
        transition={{ duration: 0.6 }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center bg-mist"
      >
        <span className="label-mono text-ink/25">{nombre}</span>
      </motion.div>
    </div>
  );
}
