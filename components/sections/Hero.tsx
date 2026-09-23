"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { HeroCanvas } from "@/components/three/HeroCanvas";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { EASE } from "@/lib/motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { rutaCotizar, site } from "@/lib/site";

const LETTERS = site.name.split("");

export function Hero() {
  const reduce = useReducedMotionSafe();
  const { scrollY } = useScroll();

  const contentY = useTransform(scrollY, [0, 700], reduce ? [0, 0] : [0, -70]);
  const contentOpacity = useTransform(scrollY, [0, 520], reduce ? [1, 1] : [1, 0]);
  const canvasY = useTransform(scrollY, [0, 700], reduce ? [0, 0] : [0, 110]);
  const canvasOpacity = useTransform(scrollY, [0, 620], reduce ? [1, 1] : [1, 0]);

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pt-28 pb-24 sm:pt-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid opacity-70 [mask-image:radial-gradient(ellipse_65%_55%_at_50%_42%,#000_15%,transparent_72%)]"
      />

      <motion.div
        aria-hidden="true"
        style={{ y: canvasY, opacity: canvasOpacity }}
        className="pointer-events-none absolute inset-0"
      >
        <HeroCanvas className="absolute inset-0" />
      </motion.div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-paper"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3.5 py-2 font-mono text-[9px] tracking-[0.13em] text-ink/45 uppercase backdrop-blur-md sm:text-[11px] sm:tracking-[0.18em]"
        >
          <span className="h-[5px] w-[5px] rounded-full bg-ink/40" />
          Firma de transformación digital
        </motion.span>

        <h1 className="mt-8 flex flex-col items-center">
          <span className="sr-only">
            {site.name} — {site.tagline}
          </span>

          <motion.span
            aria-hidden="true"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.075, delayChildren: 0.2 } } }}
            className="flex text-[clamp(4.2rem,15vw,11.5rem)] leading-[0.86] font-medium tracking-[-0.055em]"
          >
            {LETTERS.map((letter, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: "0.3em", filter: "blur(14px)" },
                  show: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 1.2, ease: EASE },
                  },
                }}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
          </motion.span>

          <motion.span
            aria-hidden="true"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.62, ease: EASE }}
            className="mt-7 max-w-[19ch] text-[clamp(1.35rem,3.1vw,2.5rem)] leading-[1.1] font-normal tracking-[-0.032em] text-balance text-ink/90 sm:max-w-3xl"
          >
            {site.tagline}
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.76, ease: EASE }}
          className="mt-7 font-mono text-[9px] tracking-[0.13em] text-ink/40 uppercase sm:text-[11px] sm:tracking-[0.18em]"
        >
          {site.subline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.88, ease: EASE }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <ButtonLink href={rutaCotizar} size="lg">
            Hablemos
          </ButtonLink>
          <ButtonLink href="#proyectos" variant="ghost" size="lg">
            Ver proyectos
          </ButtonLink>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        style={{ opacity: contentOpacity }}
        className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="label-mono text-ink/30">Desliza</span>
        <span className="relative h-9 w-px overflow-hidden bg-ink/12">
          <motion.span
            className="absolute inset-x-0 top-0 h-3 bg-ink/50"
            animate={{ y: ["-100%", "300%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.4 }}
          />
        </span>
      </motion.div>
    </section>
  );
}
