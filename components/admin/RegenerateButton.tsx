"use client";

import { useActionState } from "react";
import { regenerar, type EstadoPanel } from "@/app/admin/actions";

export function RegenerateButton({
  solicitudId,
  primera,
}: {
  solicitudId: string;
  primera: boolean;
}) {
  const [estado, accion, pendiente] = useActionState<EstadoPanel, FormData>(regenerar, null);

  return (
    <form action={accion} className="flex flex-wrap items-center gap-3">
      <input type="hidden" name="solicitudId" value={solicitudId} />
      <button
        type="submit"
        disabled={pendiente}
        className="inline-flex h-10 items-center justify-center rounded-full border border-line-strong px-5 text-[13.5px] text-ink transition-colors duration-300 hover:border-ink/35 disabled:pointer-events-none disabled:opacity-55"
      >
        {pendiente
          ? "Generando…"
          : primera
            ? "Generar cotización"
            : "Regenerar con la IA"}
      </button>

      {estado?.error || estado?.ok ? (
        <span role="status" className="text-[12.5px] leading-snug text-ink/50">
          {estado.error ?? estado.mensaje}
        </span>
      ) : null}
    </form>
  );
}
