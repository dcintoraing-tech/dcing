import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "ghost" | "inverse";
type Size = "sm" | "md" | "lg";

type ButtonLinkProps = ComponentPropsWithoutRef<"a"> & {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  children: ReactNode;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-paper shadow-pill hover:-translate-y-0.5 hover:shadow-pill-lift active:translate-y-0",
  ghost:
    "border border-line-strong bg-surface/60 text-ink backdrop-blur-md hover:-translate-y-0.5 hover:border-ink/25 hover:bg-surface",
  inverse:
    "bg-on-contrast text-contrast shadow-[0_10px_40px_-12px_rgba(255,255,255,0.35)] hover:-translate-y-0.5 hover:shadow-[0_18px_60px_-16px_rgba(255,255,255,0.5)] active:translate-y-0",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-[14px] sm:h-12 sm:px-6 sm:text-[15px]",
  lg: "h-12 px-6 text-[15px] sm:h-14 sm:px-8 sm:text-base",
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  arrow = false,
  className = "",
  href = "",
  children,
  ...props
}: ButtonLinkProps) {
  // Las rutas internas navegan con Link; los anclas y mailto siguen siendo <a>.
  const Etiqueta = href.startsWith("/") ? Link : "a";

  return (
    <Etiqueta
      {...props}
      href={href}
      className={[
        "group/btn inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] whitespace-nowrap transition-all duration-500 ease-premium",
        variants[variant],
        sizes[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
      {arrow ? (
        <span
          aria-hidden="true"
          className="translate-x-0 transition-transform duration-500 ease-premium group-hover/btn:translate-x-1"
        >
          →
        </span>
      ) : null}
    </Etiqueta>
  );
}
