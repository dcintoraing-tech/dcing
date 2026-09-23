"use client";

import { useActionState } from "react";
import { entrar, type EstadoAcceso } from "@/app/admin/actions";
import { Window } from "@/components/ui/Window";

export function LoginForm() {
  const [estado, accion, pendiente] = useActionState<EstadoAcceso, FormData>(entrar, null);

  return (
    <div className="relative w-full max-w-sm">
      <Window label="dcing.panel">
        <form action={accion} className="flex flex-col gap-5 p-7">
          <div>
            <p className="text-[19px] font-medium tracking-[-0.02em]">Panel interno</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink/40">
              Solicitudes y cotizaciones de DCing.
            </p>
          </div>

          <div>
            <label htmlFor="password" className="label-mono mb-2.5 block text-ink/40">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              autoFocus
              className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-ink outline-none transition-colors duration-300 focus:border-ink/35"
              aria-invalid={Boolean(estado?.error)}
              aria-describedby={estado?.error ? "login-error" : undefined}
            />
          </div>

          {estado?.error ? (
            <p id="login-error" className="text-[12.5px] leading-snug text-ink/60">
              {estado.error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pendiente}
            className="inline-flex h-11 items-center justify-center rounded-full bg-ink px-6 text-[14px] font-medium text-paper shadow-pill transition-all duration-500 ease-premium hover:-translate-y-0.5 hover:shadow-pill-lift disabled:pointer-events-none disabled:opacity-55"
          >
            {pendiente ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </Window>
    </div>
  );
}
