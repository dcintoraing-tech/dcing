import type { Metadata } from "next";
import Link from "next/link";
import { Estado } from "@/components/admin/Estado";
import { Window } from "@/components/ui/Window";
import { formatoMXN, servicioPorId } from "@/lib/quotes/rate-card";
import { listarSolicitudes } from "@/lib/quotes/repo";
import { supabaseConfigurado } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Solicitudes",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const fecha = new Intl.DateTimeFormat("es-MX", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

function Aviso({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <Window label="configuración">
      <div className="p-7">
        <p className="text-[16px] font-medium tracking-[-0.02em]">{titulo}</p>
        <div className="mt-3 text-[13.5px] leading-relaxed text-ink/50">{children}</div>
      </div>
    </Window>
  );
}

export default async function AdminPage() {
  if (!supabaseConfigurado()) {
    return (
      <Aviso titulo="Falta conectar la base de datos">
        Define <code className="font-mono text-ink/70">SUPABASE_URL</code> y{" "}
        <code className="font-mono text-ink/70">SUPABASE_SECRET_KEY</code> en{" "}
        <code className="font-mono text-ink/70">.env.local</code> y en Vercel.
      </Aviso>
    );
  }

  let solicitudes;
  try {
    solicitudes = await listarSolicitudes();
  } catch (error) {
    return (
      <Aviso titulo="No se pudo leer la base de datos">
        {error instanceof Error ? error.message : String(error)}
      </Aviso>
    );
  }

  const pendientes = solicitudes.filter(
    (s) => s.estado !== "enviada" && s.estado !== "descartada",
  ).length;

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="label-mono text-ink/35">Solicitudes</span>
          <h1 className="mt-3 text-[clamp(1.8rem,4vw,2.6rem)] leading-tight font-medium tracking-[-0.035em]">
            {solicitudes.length === 0
              ? "Todavía no hay solicitudes."
              : `${solicitudes.length} solicitud${solicitudes.length === 1 ? "" : "es"}.`}
          </h1>
        </div>
        {pendientes > 0 ? (
          <p className="text-[13.5px] text-ink/45">
            {pendientes} por revisar
          </p>
        ) : null}
      </div>

      {solicitudes.length === 0 ? (
        <Aviso titulo="Bandeja vacía">
          Cuando alguien envíe el formulario de <code className="font-mono text-ink/70">/cotizar</code>{" "}
          aparecerá aquí con su cotización generada.
        </Aviso>
      ) : (
        <Window label="bandeja">
          <ul className="divide-y divide-line">
            {solicitudes.map((solicitud) => {
              const ultima = solicitud.cotizaciones?.[0];
              const servicio =
                solicitud.servicio_otro || servicioPorId(solicitud.servicio).label;

              return (
                <li key={solicitud.id}>
                  <Link
                    href={`/admin/${solicitud.id}`}
                    className="flex flex-col gap-3 px-5 py-5 transition-colors duration-300 hover:bg-mist sm:flex-row sm:items-center sm:gap-6 sm:px-6"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <p className="text-[15px] font-medium tracking-[-0.015em]">
                          {solicitud.nombre}
                        </p>
                        {solicitud.empresa ? (
                          <span className="text-[13px] text-ink/35">{solicitud.empresa}</span>
                        ) : null}
                      </div>
                      <p className="mt-1 truncate text-[13px] text-ink/45">{servicio}</p>
                    </div>

                    <div className="flex items-center gap-4 sm:w-64 sm:justify-end">
                      {ultima ? (
                        <span className="font-mono text-[12px] text-ink/50 tabular-nums">
                          {formatoMXN(Number(ultima.precio_min))} – {formatoMXN(Number(ultima.precio_max))}
                        </span>
                      ) : (
                        <span className="font-mono text-[12px] text-ink/25">sin cotización</span>
                      )}
                      <Estado valor={solicitud.estado} />
                    </div>

                    <span className="label-mono shrink-0 text-ink/25 sm:w-28 sm:text-right">
                      {fecha.format(new Date(solicitud.created_at))}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Window>
      )}
    </>
  );
}
