"use client";

import { useInView } from "framer-motion";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { useTheme } from "@/lib/theme";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export function HeroCanvas({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.05 });
  const reduce = useReducedMotionSafe();
  const theme = useTheme();

  return (
    <div ref={ref} aria-hidden="true" className={className}>
      <HeroScene active={inView} still={reduce} theme={theme} />
    </div>
  );
}
