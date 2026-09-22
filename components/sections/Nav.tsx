"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Wordmark } from "@/components/ui/Logo";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { EASE } from "@/lib/motion";
import { mailto, navLinks } from "@/lib/site";

export function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => {
    const next = value > 28;
    setScrolled((current) => (current === next ? current : next));
  });

  return (
    <motion.header
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4"
    >
      <nav
        aria-label="Principal"
        className={[
          "mx-auto flex h-14 max-w-4xl items-center justify-between rounded-full border pr-2 pl-4 transition-all duration-700 ease-premium sm:pl-5",
          scrolled
            ? "border-line bg-surface/72 shadow-window backdrop-blur-2xl"
            : "border-transparent bg-transparent",
        ].join(" ")}
      >
        <a
          href="#top"
          className="flex items-center rounded-full text-[15px] text-ink transition-opacity duration-300 hover:opacity-70"
        >
          <Wordmark />
          <span className="sr-only">Inicio</span>
        </a>

        <div className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-[13.5px] text-ink/55 transition-colors duration-300 hover:bg-ink/[0.04] hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <ThemeSwitch />
          <ButtonLink href={mailto} size="sm">
            Hablemos
          </ButtonLink>
        </div>
      </nav>
    </motion.header>
  );
}
