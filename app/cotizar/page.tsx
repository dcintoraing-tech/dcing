import type { Metadata } from "next";
import { QuoteForm } from "@/components/sections/QuoteForm";
import { Nav } from "@/components/sections/Nav";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Solicitar cotización",
  description:
    "Cuéntanos qué necesitas y te enviamos una cotización estimada con alcance, conceptos y tiempo de desarrollo.",
  alternates: { canonical: "/cotizar" },
};

const GARANTIAS = [
  { titulo: "Respuesta en 24 h", detalle: "Revisamos cada solicitud a mano antes de enviarte nada." },
  { titulo: "Estimación, no factura", detalle: "Un rango realista para que sepas de qué tamaño es el proyecto." },
  { titulo: "Sin compromiso", detalle: "Si no encaja, te lo decimos y te orientamos igual." },
];

export default function CotizarPage() {
  return (
    <>
      <Nav />
      <main id="contenido" className="relative px-5 pt-32 pb-24 sm:pt-40 sm:pb-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_60%_40%_at_50%_0%,#000,transparent_70%)]"
        />

        <div className="relative mx-auto max-w-3xl">
          <Reveal>
            <span className="label-mono inline-flex items-center gap-2 text-ink/40">
              <span className="h-[5px] w-[5px] rounded-full bg-ink/25" />
              Cotización
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-5 text-[clamp(2rem,5vw,3.4rem)] leading-[1.05] font-medium tracking-[-0.035em] text-balance">
              Cuéntanos qué necesitas.
            </h1>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink/45 sm:text-base">
              Analizamos tu solicitud y te devolvemos una cotización con alcance, conceptos
              incluidos, precio estimado y tiempo de desarrollo.
            </p>
          </Reveal>

          <Reveal delay={0.2} className="mt-12">
            <QuoteForm />
          </Reveal>

          <Reveal delay={0.26}>
            <ul className="mt-12 grid gap-6 sm:grid-cols-3">
              {GARANTIAS.map((item) => (
                <li key={item.titulo}>
                  <p className="text-[14px] font-medium tracking-[-0.01em]">{item.titulo}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink/40">{item.detalle}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </main>
    </>
  );
}
