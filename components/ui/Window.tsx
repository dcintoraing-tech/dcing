import type { ReactNode } from "react";

type WindowProps = {
  label?: ReactNode;
  actions?: ReactNode;
  hoverable?: boolean;
  className?: string;
  children: ReactNode;
};

export function Window({
  label,
  actions,
  hoverable = false,
  className = "",
  children,
}: WindowProps) {
  return (
    <div
      className={[
        "relative flex flex-col overflow-hidden rounded-[18px] border border-line bg-surface/85 shadow-window backdrop-blur-xl transition-[transform,box-shadow] duration-700 ease-premium sm:rounded-[22px]",
        hoverable ? "group-hover:-translate-y-1.5 group-hover:shadow-window-lift" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="relative z-10 flex h-9 shrink-0 items-center gap-[6px] border-b border-line bg-surface-bar/75 px-3.5 sm:h-10 sm:px-4">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-[9px] w-[9px] rounded-full bg-ink/10 transition-colors duration-500 group-hover:bg-ink/18"
          />
        ))}

        {label ? (
          <span className="label-mono pointer-events-none absolute inset-x-0 mx-auto hidden max-w-[60%] truncate text-center text-ink/35 sm:block">
            {label}
          </span>
        ) : null}

        {actions ? <div className="ml-auto flex items-center gap-2">{actions}</div> : null}
      </div>

      {children}
    </div>
  );
}

/** URL pill used in the title bar of project windows. */
export function AddressPill({ children }: { children: ReactNode }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-ink/[0.04] px-3 py-1 font-mono text-[10px] tracking-tight text-ink/45">
      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" aria-hidden="true">
        <rect x="2.5" y="5.25" width="7" height="5" rx="1.5" fill="currentColor" fillOpacity="0.55" />
        <path
          d="M4.25 5.25v-1.5a1.75 1.75 0 0 1 3.5 0v1.5"
          stroke="currentColor"
          strokeOpacity="0.55"
          strokeWidth="1"
        />
      </svg>
      {children}
    </span>
  );
}
