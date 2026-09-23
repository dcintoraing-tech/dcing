import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cambiarEstadoSolicitud } from "@/app/admin/actions";
import { Estado } from "@/components/admin/Estado";
import { QuoteEditor } from "@/components/admin/QuoteEditor";
import { RegenerateButton } from "@/components/admin/RegenerateButton";
import { Window } from "@/components/ui/Window";
import { formatoMXN, servicioPorId } from "@/lib/quotes/rate-card";
import { obtenerSolicitud } from "@/lib/quotes/repo";
import { urlCotizacion } from "@/lib/site";
import { enlaceWhatsApp } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Solicitud",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const fechaLarga = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "long",
  timeStyle: "short",
});

function Dato({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="label-mono text-ink/35">{etiqueta}</p>
      <div className="mt-2 text-[14px] leading-relaxed break-words text-ink/75">{children}</div>
    </div>
  );
}

export default async function SolicitudPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const registro = await obtenerSolicitud(id).catch(() => null);
  if (!registro) notFound();

  const { solicitud, cotizaciones } = registro;
  const vigente = cotizaciones[0];
  const servicio = servicioPorId(solicitud.servicio);
  const etiquetaServicio = solicitud.servicio_otro
    ? `Otro — ${solicitud.servicio_otro}`
    : servicio.label;

  const mensajeWhats = vigente
    ? `Hola ${solicitud.nombre.split(" ")[0]}, soy de DCing. Ya está lista tu cotización estimada para "${vigente.titulo}": ${formatoMXN(Number(vigente.precio_min))} a ${formatoMXN(Number(vigente.precio_max))} MXN, ${vigente.tiempo_estimado}. Puedes verla completa aquí: ${urlCotizacion(vigente.token)}`
    : `Hola ${solicitud.nombre.split(" ")[0]}, soy de DCing. Recibimos tu solicitud y quiero platicar contigo sobre el proyecto.`;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          href="/admin"
          className="label-mono text-ink/35 transition-colors duration-300 hover:text-ink/70"
        >
          ← Solicitudes
        </Link>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <h1 className="text-[clamp(1.7rem,3.6vw,2.4rem)] leading-tight font-medium tracking-[-0.035em]">
            {solicitud.nombre}
          </h1>
          <Estado valor={solicitud.estado} />
        </div>

        <p className="mt-2 text-[14px] text-ink/40">
          {fechaLarga.format(new Date(solicitud.created_at))}
        </p>
      </div>

      <Window label="solicitud">
        <div className="grid gap-7 p-6 sm:grid-cols-2 sm:p-7">
          <Dato etiqueta="Correo">
            <a href={`mailto:${solicitud.correo}`} className="underline-offset-4 hover:underline">
              {solicitud.correo}
            </a>
          </Dato>

          <Dato etiqueta="Celular">
            <a
              href={enlaceWhatsApp(solicitud.celular, mensajeWhats)}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 hover:underline"
            >
              {solicitud.celular} · abrir WhatsApp
            </a>
          </Dato>

          <Dato etiqueta="Empresa">{solicitud.empresa || "—"}</Dato>
          <Dato etiqueta="Servicio">{etiquetaServicio}</Dato>

          <div className="sm:col-span-2">
            <Dato etiqueta="Lo que describió">
              <span className="whitespace-pre-wrap">{solicitud.descripcion}</span>
            </Dato>
          </div>

          {solicitud.error_ia ? (
            <div className="sm:col-span-2">
              <Dato etiqueta="Último error de la IA">
                <span className="text-ink/55">{solicitud.error_ia}</span>
              </Dato>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line px-6 py-5 sm:px-7">
          <RegenerateButton solicitudId={solicitud.id} primera={cotizaciones.length === 0} />

          <form action={cambiarEstadoSolicitud}>
            <input type="hidden" name="solicitudId" value={solicitud.id} />
            <input
              type="hidden"
              name="estado"
              value={solicitud.estado === "descartada" ? "nueva" : "descartada"}
            />
            <button
              type="submit"
              className="text-[13px] text-ink/35 underline-offset-4 transition-colors duration-300 hover:text-ink/70 hover:underline"
            >
              {solicitud.estado === "descartada" ? "Restaurar" : "Descartar"}
            </button>
          </form>
        </div>
      </Window>

      {vigente ? (
        <>
          {vigente.estado === "enviada" && vigente.enviada_at ? (
            <p className="text-[13px] text-ink/45">
              Enviada el {fechaLarga.format(new Date(vigente.enviada_at))} ·{" "}
              <a
                href={urlCotizacion(vigente.token)}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                ver enlace del cliente
              </a>
            </p>
          ) : null}

          <QuoteEditor
            key={vigente.id}
            cotizacion={vigente}
            servicioId={solicitud.servicio}
            bloqueada={vigente.estado === "enviada"}
          />

          {cotizaciones.length > 1 ? (
            <Window label="versiones anteriores">
              <ul className="divide-y divide-line">
                {cotizaciones.slice(1).map((anterior) => (
                  <li
                    key={anterior.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
                  >
                    <span className="text-[14px] text-ink/70">
                      v{anterior.version} · {anterior.titulo}
                    </span>
                    <span className="font-mono text-[12px] text-ink/40 tabular-nums">
                      {formatoMXN(Number(anterior.precio_min))} –{" "}
                      {formatoMXN(Number(anterior.precio_max))}
                    </span>
                  </li>
                ))}
              </ul>
            </Window>
          ) : null}
        </>
      ) : (
        <Window label="sin cotización">
          <div className="p-7">
            <p className="text-[15px] font-medium tracking-[-0.02em]">
              Todavía no hay cotización para esta solicitud.
            </p>
            <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink/45">
              Usa &quot;Generar cotización&quot; para que la IA prepare un borrador. Podrás
              revisarlo y editarlo antes de que salga al cliente.
            </p>
          </div>
        </Window>
      )}
    </div>
  );
}
