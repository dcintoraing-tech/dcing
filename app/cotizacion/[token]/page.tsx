import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Wordmark } from "@/components/ui/Logo";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { Window } from "@/components/ui/Window";
import { AVISO_ESTIMACION, formatoMXN, servicioPorId } from "@/lib/quotes/rate-card";
import { obtenerPorToken } from "@/lib/quotes/repo";
import { mailto, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cotización estimada",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

const fecha = new Intl.DateTimeFormat("es-MX", { dateStyle: "long" });

function Bloque({
  etiqueta,
  children,
  className = "",
}: {
  etiqueta: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`border-t border-line px-6 py-8 sm:px-10 sm:py-10 ${className}`}>
      <p className="label-mono text-ink/35">{etiqueta}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default async function CotizacionPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const registro = await obtenerPorToken(token).catch(() => null);
  // Un borrador todavía no lo aprobó nadie: para el mundo no existe.
  if (!registro || registro.cotizacion.estado === "borrador") notFound();

  const { cotizacion, solicitud } = registro;
  const servicio = solicitud?.servicio_otro || servicioPorId(cotizacion.servicio).label;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-surface/75 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5">
          <Link href="/" className="transition-opacity duration-300 hover:opacity-70">
            <Wordmark />
            <span className="sr-only">Inicio</span>
          </Link>
          <ThemeSwitch />
        </div>
      </header>

      <main id="contenido" className="relative px-5 py-12 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid opacity-50 [mask-image:radial-gradient(ellipse_60%_35%_at_50%_0%,#000,transparent_72%)]"
        />

        <div className="relative mx-auto max-w-3xl">
          <Window label={`cotización · v${cotizacion.version}`}>
            <div className="px-6 py-9 sm:px-10 sm:py-11">
              <span className="label-mono text-ink/35">Cotización estimada</span>
              <h1 className="mt-5 text-[clamp(1.8rem,4.4vw,2.9rem)] leading-[1.08] font-medium tracking-[-0.035em] text-balance">
                {cotizacion.titulo}
              </h1>
              <p className="mt-5 text-[15px] leading-relaxed text-ink/55">{cotizacion.resumen}</p>

              <dl className="mt-8 grid gap-5 sm:grid-cols-3">
                <div>
                  <dt className="label-mono text-ink/30">Para</dt>
                  <dd className="mt-2 text-[14px] text-ink/70">
                    {solicitud?.empresa || solicitud?.nombre || "—"}
                  </dd>
                </div>
                <div>
                  <dt className="label-mono text-ink/30">Servicio</dt>
                  <dd className="mt-2 text-[14px] text-ink/70">{servicio}</dd>
                </div>
                <div>
                  <dt className="label-mono text-ink/30">Fecha</dt>
                  <dd className="mt-2 text-[14px] text-ink/70">
                    {fecha.format(new Date(cotizacion.enviada_at ?? cotizacion.created_at))}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="border-t border-line bg-contrast px-6 py-9 text-on-contrast sm:px-10">
              <p className="label-mono text-on-contrast/40">Inversión estimada</p>
              <p className="mt-4 text-[clamp(1.9rem,5.2vw,3rem)] leading-none font-medium tracking-[-0.04em] tabular-nums">
                {formatoMXN(Number(cotizacion.precio_min))} – {formatoMXN(Number(cotizacion.precio_max))}
              </p>
              <p className="mt-4 text-[13.5px] text-on-contrast/50">
                {cotizacion.moneda} · Tiempo estimado: {cotizacion.tiempo_estimado}
              </p>
            </div>

            {solicitud ? (
              <Bloque etiqueta="Descripción del proyecto">
                <p className="text-[14.5px] leading-relaxed whitespace-pre-wrap text-ink/60">
                  {solicitud.descripcion}
                </p>
              </Bloque>
            ) : null}

            <Bloque etiqueta="Alcance">
              <ul className="flex flex-col gap-3.5">
                {cotizacion.alcance.map((punto) => (
                  <li key={punto} className="flex gap-3.5 text-[14.5px] leading-relaxed text-ink/70">
                    <span aria-hidden="true" className="mt-[9px] h-px w-4 shrink-0 bg-ink/25" />
                    {punto}
                  </li>
                ))}
              </ul>
            </Bloque>

            <Bloque etiqueta="Conceptos incluidos">
              <ul className="divide-y divide-line">
                {cotizacion.conceptos.map((concepto) => (
                  <li key={concepto.concepto} className="py-4 first:pt-0 last:pb-0">
                    <p className="text-[14.5px] font-medium tracking-[-0.01em]">
                      {concepto.concepto}
                    </p>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/45">
                      {concepto.detalle}
                    </p>
                  </li>
                ))}
              </ul>
            </Bloque>

            <Bloque etiqueta="Condiciones y notas">
              <ul className="flex flex-col gap-3">
                {cotizacion.condiciones.map((condicion) => (
                  <li key={condicion} className="text-[13.5px] leading-relaxed text-ink/55">
                    {condicion}
                  </li>
                ))}
              </ul>
              {cotizacion.notas ? (
                <p className="mt-6 rounded-xl border border-line bg-mist px-4 py-3.5 text-[13px] leading-relaxed text-ink/55">
                  {cotizacion.notas}
                </p>
              ) : null}
            </Bloque>

            <div className="flex flex-col gap-5 border-t border-line px-6 py-9 sm:flex-row sm:items-center sm:justify-between sm:px-10">
              <p className="max-w-sm text-[13px] leading-relaxed text-ink/40">
                {AVISO_ESTIMACION}
              </p>
              <a
                href={mailto}
                className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-ink px-7 text-[15px] font-medium text-paper shadow-pill transition-all duration-500 ease-premium hover:-translate-y-0.5 hover:shadow-pill-lift"
              >
                Agendar llamada
              </a>
            </div>
          </Window>

          <p className="label-mono mt-8 text-center text-ink/25">
            {site.name} — Diseño + Ingeniería
          </p>
        </div>
      </main>
    </>
  );
}
