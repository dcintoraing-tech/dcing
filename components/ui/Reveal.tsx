"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE, viewport } from "@/lib/motion";

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

type SectionHeadingProps = {
  label: string;
  title: ReactNode;
  description?: string;
  className?: string;
};

export function SectionHeading({
  label,
  title,
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

      <Reveal delay={0.08}>
        <h2 className="mt-5 max-w-3xl text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.05] font-medium tracking-[-0.035em] text-balance text-ink">
          {title}
        </h2>
      </Reveal>

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
