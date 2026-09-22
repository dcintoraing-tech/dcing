"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import type { PointerEvent } from "react";
import { useRef } from "react";
import { MOCKUPS } from "@/components/mockups";
import { AddressPill, Window } from "@/components/ui/Window";
import { EASE } from "@/lib/motion";
import type { projects } from "@/lib/site";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

type Project = (typeof projects)[number];

export function ProjectWindow({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const Mockup = MOCKUPS[project.id];

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = index % 2 === 0 ? 54 : 34;
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [drift, -drift]);

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 140, damping: 20, mass: 0.6 });
  const rotateY = useSpring(tiltY, { stiffness: 140, damping: 20, mass: 0.6 });

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduce || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width - 0.5;
    const py = (event.clientY - bounds.top) / bounds.height - 0.5;
    tiltY.set(px * 4);
    tiltX.set(-py * 2.6);
  }

  function resetTilt() {
    tiltX.set(0);
    tiltY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-8% 0px -8% 0px" }}
      transition={{ duration: 1, ease: EASE }}
      className={[
        "group [perspective:1600px]",
        index % 2 === 0 ? "lg:mr-14" : "lg:ml-14",
      ].join(" ")}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
      >
        <Window
          hoverable
          label={<AddressPill>{project.domain}</AddressPill>}
          actions={<span className="label-mono text-ink/25">{project.year}</span>}
        >
          {/* Portrait crop on phones keeps the interface legible instead of shrinking it away. */}
          <div className="relative aspect-4/5 overflow-hidden bg-surface sm:aspect-3/2 md:aspect-[1200/750]">
            <Mockup />
          </div>

          <div className="flex flex-col gap-3 border-t border-line px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-4">
              <h3 className="text-[17px] font-medium tracking-[-0.02em] sm:text-lg">
                {project.name}
              </h3>
              <span className="label-mono text-ink/30">{project.category}</span>
            </div>
            <p className="text-[13.5px] leading-relaxed text-ink/45 sm:text-right">
              {project.description}
            </p>
          </div>
        </Window>
      </motion.div>
    </motion.div>
  );
}
