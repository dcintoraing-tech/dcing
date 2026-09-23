const TONOS: Record<string, string> = {
  nueva: "border-line-strong text-ink/70",
  generando: "border-line-strong text-ink/45",
  borrador: "border-line-strong text-ink/70",
  aprobada: "border-ink/35 text-ink",
  enviada: "border-transparent bg-ink text-paper",
  descartada: "border-line text-ink/30",
};

const ETIQUETAS: Record<string, string> = {
  nueva: "Nueva",
  generando: "Generando",
  borrador: "Borrador",
  aprobada: "Aprobada",
  enviada: "Enviada",
  descartada: "Descartada",
};

export function Estado({ valor }: { valor: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] uppercase ${
        TONOS[valor] ?? "border-line text-ink/40"
      }`}
    >
      {ETIQUETAS[valor] ?? valor}
    </span>
  );
}
