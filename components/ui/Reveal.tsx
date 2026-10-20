"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE, viewport } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 22,
  duration = 0.8,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Titular que entra línea por línea desde detrás de una máscara.
 *
 * Cada línea lleva su propio recorte, y el relleno inferior existe para que
 * la máscara caiga por debajo de las colas de las letras: sin él, una "g" o
 * una "j" quedarían rebanadas al terminar. El margen negativo devuelve ese
 * relleno para que la maquetación no cambie.
 */
export function RevealLines({
  lines,
  className = "",
  delay = 0,
}: {
  lines: string[];
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotionSafe();

  return (
    <span className={`block ${className}`}>
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden pb-[0.16em] -mb-[0.16em]">
          <motion.span
            className="block"
            initial={{ y: reduce ? "0%" : "115%" }}
            whileInView={{ y: "0%" }}
            viewport={viewport}
            transition={
              reduce ? { duration: 0 } : { duration: 1, delay: delay + i * 0.09, ease: EASE }
            }
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

type SectionHeadingProps = {
  label: string;
  /** Una entrada por línea: cada una se revela por separado. */
  lines: string[];
  description?: string;
  className?: string;
};

export function SectionHeading({
  label,
  lines,
  description,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={className}>
      <Reveal>
        <span className="label-mono inline-flex items-center gap-2 text-ink/40">
          <span className="h-[5px] w-[5px] rounded-full bg-ink/25" />
          {label}
        </span>
      </Reveal>

      <h2 className="display mt-5 max-w-3xl text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.04] text-ink">
        <RevealLines lines={lines} delay={0.06} />
      </h2>

      {description ? (
        <Reveal delay={0.14}>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink/45 sm:text-base">
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
