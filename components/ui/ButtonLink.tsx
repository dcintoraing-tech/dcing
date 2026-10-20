"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import type { ComponentPropsWithoutRef, PointerEvent, ReactNode } from "react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

type Variant = "primary" | "ghost" | "inverse";
type Size = "sm" | "md" | "lg";

type ButtonLinkProps = ComponentPropsWithoutRef<"a"> & {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  /** El botón se inclina hacia el cursor mientras lo tiene encima. */
  magnetic?: boolean;
  children: ReactNode;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-paper shadow-pill hover:-translate-y-0.5 hover:shadow-pill-lift active:translate-y-0",
  ghost:
    "border border-line-strong bg-surface/60 text-ink backdrop-blur-md hover:-translate-y-0.5 hover:border-ink/25 hover:bg-surface",
  inverse:
    "bg-on-contrast text-contrast shadow-[0_10px_40px_-12px_rgba(255,255,255,0.35)] hover:-translate-y-0.5 hover:shadow-[0_18px_60px_-16px_rgba(255,255,255,0.5)] active:translate-y-0",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-[14px] sm:h-12 sm:px-6 sm:text-[15px]",
  lg: "h-12 px-6 text-[15px] sm:h-14 sm:px-8 sm:text-base",
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  arrow = false,
  magnetic = false,
  className = "",
  href = "",
  children,
  ...props
}: ButtonLinkProps) {
  // Las rutas internas navegan con Link; los anclas y mailto siguen siendo <a>.
  const Etiqueta = href.startsWith("/") ? Link : "a";
  const reduce = useReducedMotionSafe();

  const tiraX = useMotionValue(0);
  const tiraY = useMotionValue(0);
  const resorte = { stiffness: 260, damping: 18, mass: 0.5 };
  const x = useSpring(tiraX, resorte);
  const y = useSpring(tiraY, resorte);

  const activo = magnetic && !reduce;

  /*
   * El desplazamiento lo lleva la envoltura, no el enlace: el propio botón ya
   * usa transform en sus estados de hover, y pelearse con él por la misma
   * propiedad daba saltos.
   *
   * Solo con ratón: en una pantalla táctil no hay cursor al que acercarse.
   */
  function seguir(evento: PointerEvent<HTMLSpanElement>) {
    if (!activo || evento.pointerType !== "mouse") return;
    const caja = evento.currentTarget.getBoundingClientRect();
    tiraX.set((evento.clientX - (caja.left + caja.width / 2)) * 0.24);
    tiraY.set((evento.clientY - (caja.top + caja.height / 2)) * 0.34);
  }

  function soltar() {
    tiraX.set(0);
    tiraY.set(0);
  }

  return (
    <motion.span
      className="inline-flex"
      style={activo ? { x, y } : undefined}
      onPointerMove={activo ? seguir : undefined}
      onPointerLeave={activo ? soltar : undefined}
    >
      <Etiqueta
        {...props}
        href={href}
        className={[
          "group/btn inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] whitespace-nowrap transition-all duration-500 ease-premium",
          variants[variant],
          sizes[size],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
        {arrow ? (
          <span
            aria-hidden="true"
            className="translate-x-0 transition-transform duration-500 ease-premium group-hover/btn:translate-x-1"
          >
            →
          </span>
        ) : null}
      </Etiqueta>
    </motion.span>
  );
}
