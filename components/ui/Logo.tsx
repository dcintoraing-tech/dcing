type LogoProps = {
  className?: string;
};

/**
 * Monograma "d" de DCing, redibujado en vectores a partir del logo original.
 * Geometría tomada del archivo maestro: círculo de radio 291 centrado en
 * (291, 515) y asta de 179 × 806 desde x = 515. Ambas cierran exactamente en
 * el baseline, y el asta muerde el círculo igual que en el original.
 *
 * Usa currentColor a propósito: así el logo se invierte solo entre tema claro
 * y oscuro sin necesidad de dos archivos.
 */
export function LogoMark({ className = "" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 694 806"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <circle cx="291" cy="515" r="291" />
      <rect x="515" y="0" width="179" height="806" />
    </svg>
  );
}

export function Wordmark({ className = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-[0.5em] ${className}`}>
      <LogoMark className="h-[1.05em] w-auto" />
      <span className="font-medium tracking-[-0.035em]">DCing</span>
    </span>
  );
}
