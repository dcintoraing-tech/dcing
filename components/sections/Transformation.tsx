"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { EASE } from "@/lib/motion";
import { useTheme } from "@/lib/theme";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const TransformScene = dynamic(() => import("@/components/three/TransformScene"), { ssr: false });

export function Transformation() {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const theme = useTheme();

  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const inView = useInView(stage, { amount: 0.05 });

  const firstOpacity = useTransform(scrollYProgress, [0.08, 0.58], [1, 0.16]);
  const firstBlur = useTransform(scrollYProgress, [0.08, 0.58], ["blur(0px)", "blur(6px)"]);
  const secondOpacity = useTransform(scrollYProgress, [0.32, 0.82], [0.16, 1]);
  const secondBlur = useTransform(scrollYProgress, [0.32, 0.82], ["blur(6px)", "blur(0px)"]);
  const meterWidth = useTransform(scrollYProgress, [0.05, 0.9], ["4%", "100%"]);

  return (
    <section className="relative">
      <div ref={track} className="relative h-[320vh]">
        <div ref={stage} className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
          <div aria-hidden="true" className="absolute inset-0">
            <TransformScene progress={scrollYProgress} active={inView} still={reduce} theme={theme} />
          </div>

          <div
            aria-hidden="true"
            className="veil pointer-events-none absolute inset-0"
          />

          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
              className="label-mono mb-8 text-ink/35"
            >
              Transformación
            </motion.span>

            <h2 className="text-[clamp(2.1rem,6.2vw,5rem)] leading-[1.02] font-medium tracking-[-0.042em] text-balance">
              <motion.span style={{ opacity: firstOpacity, filter: firstBlur }} className="block">
                De procesos complejos
              </motion.span>
              <motion.span style={{ opacity: secondOpacity, filter: secondBlur }} className="block">
                a experiencias simples.
              </motion.span>
            </h2>

            <div className="mt-12 flex w-full max-w-xs items-center gap-3">
              <span className="label-mono shrink-0 text-ink/25">Caos</span>
              <span className="relative h-px flex-1 bg-ink/12">
                <motion.span style={{ width: meterWidth }} className="absolute inset-y-0 left-0 bg-ink/55" />
              </span>
              <span className="label-mono shrink-0 text-ink/25">Sistema</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
