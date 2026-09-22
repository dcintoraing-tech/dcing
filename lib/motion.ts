import type { Transition, Variants } from "framer-motion";

export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_SOFT: [number, number, number, number] = [0.32, 0.72, 0, 1];

export const transition: Transition = { duration: 0.8, ease: EASE };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition },
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

export const viewport = { once: true, margin: "-12% 0px -12% 0px" } as const;
