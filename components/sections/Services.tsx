"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import { Window } from "@/components/ui/Window";
import { ServiceVisual } from "@/components/visuals/ServiceVisuals";
import { services } from "@/lib/site";

const SPANS = [
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-2",
  "lg:col-span-2",
  "sm:col-span-2 lg:col-span-2",
];

export function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.1 });

  return (
    <section id="servicios" className="relative scroll-mt-24 px-5 py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          label="Servicios"
          title={
            <>
              Cinco piezas.
              <br />
              Un mismo sistema.
            </>
          }
          description="Cada capa se diseña para conectarse con la siguiente."
        />

        <div ref={ref} className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:gap-5">
          {services.map((service, i) => (
            <Reveal
              key={service.id}
              delay={i * 0.06}
              className={`group h-full ${SPANS[i]}`}
            >
              <Window label={service.file} hoverable className="h-full">
                <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-gradient-to-b from-surface to-mist">
                  <ServiceVisual id={service.id} inView={inView} />
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <span className="label-mono text-ink/30">{service.number}</span>
                  <h3 className="mt-3 text-[17px] font-medium tracking-[-0.02em] sm:text-lg">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink/45">
                    {service.description}
                  </p>
                </div>
              </Window>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
