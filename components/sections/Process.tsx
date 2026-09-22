"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/Reveal";
import { Window } from "@/components/ui/Window";
import { ProcessVisual } from "@/components/visuals/ProcessVisuals";
import { EASE } from "@/lib/motion";
import { steps } from "@/lib/site";

export function Process() {
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const [index, setIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.max(0, Math.min(steps.length - 1, Math.floor(value * steps.length)));
    setIndex((current) => (current === next ? current : next));
  });

  const progressWidth = useTransform(scrollYProgress, [0, 1], ["2%", "100%"]);
  const active = steps[index];

  return (
    <section id="proceso" className="relative scroll-mt-24 bg-mist">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid opacity-50 [mask-image:linear-gradient(to_bottom,#000,transparent_45%)]"
      />

      <div className="relative mx-auto max-w-6xl px-5 pt-24 sm:pt-32 lg:pt-40">
        <SectionHeading
          label="Cómo trabajamos"
          title={
            <>
              Un proceso.
              <br />
              Cinco estados.
            </>
          }
          description="Del mapa del negocio al sistema que lo sostiene."
        />
      </div>

      <div ref={track} className="relative h-[440vh]">
        <div className="sticky top-0 flex h-[100svh] items-center px-4 sm:px-5">
          <div className="mx-auto w-full max-w-5xl">
            <Window
              label="proceso.sys"
              actions={
                <span className="label-mono text-ink/30">
                  {active.number} <span className="text-ink/20">/ 05</span>
                </span>
              }
            >
              <div className="grid md:grid-cols-[232px_1fr]">
                <ol className="flex gap-1 overflow-x-auto border-b border-line p-2 md:flex-col md:overflow-visible md:border-r md:border-b-0 md:p-3 [scrollbar-width:none]">
                  {steps.map((step, i) => {
                    const isActive = i === index;
                    return (
                      <li key={step.id} className="shrink-0 md:shrink">
                        <div
                          aria-current={isActive ? "step" : undefined}
                          className={[
                            "relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-500 ease-premium",
                            isActive ? "bg-ink/[0.045]" : "",
                          ].join(" ")}
                        >
                          {isActive ? (
                            <motion.span
                              layoutId="process-marker"
                              className="absolute top-1/2 left-0.5 h-5 w-[2px] -translate-y-1/2 rounded-full bg-ink"
                              transition={{ duration: 0.5, ease: EASE }}
                            />
                          ) : null}
                          <span
                            className={[
                              "label-mono transition-colors duration-500",
                              isActive ? "text-ink" : "text-ink/30",
                            ].join(" ")}
                          >
                            {step.number}
                          </span>
                          <span
                            className={[
                              "text-[13.5px] whitespace-nowrap transition-colors duration-500",
                              isActive ? "text-ink" : "hidden text-ink/40 md:block",
                            ].join(" ")}
                          >
                            {step.title}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ol>

                <div className="flex flex-col">
                  <div className="relative aspect-[420/230] overflow-hidden bg-gradient-to-b from-surface to-mist">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={active.id}
                        initial={{ opacity: 0, scale: 0.985 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.01 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="absolute inset-0"
                      >
                        <ProcessVisual id={active.id} />
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="border-t border-line p-5 sm:p-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={active.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, ease: EASE }}
                      >
                        <h3 className="text-[17px] font-medium tracking-[-0.02em] sm:text-lg">
                          {active.title}
                        </h3>
                        <p className="mt-2 text-[14px] leading-relaxed text-ink/50">
                          {active.description}
                        </p>
                        <p className="mt-1 text-[13px] leading-relaxed text-ink/30">
                          {active.detail}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="h-[3px] w-full bg-ink/[0.06]">
                <motion.div style={{ width: progressWidth }} className="h-full bg-ink/45" />
              </div>
            </Window>
          </div>
        </div>
      </div>
    </section>
  );
}
