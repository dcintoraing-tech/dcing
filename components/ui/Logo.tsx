type LogoProps = {
  className?: string;
};

/** Abstract mark: a square (design) and a circle (engineering) sharing an overlap. */
export function LogoMark({ className = "" }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="2" y="4.5" width="12.5" height="15" rx="4.2" fill="currentColor" fillOpacity="0.92" />
      <circle cx="16" cy="12" r="6" fill="currentColor" fillOpacity="0.38" />
    </svg>
  );
}

export function Wordmark({ className = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark className="h-[1.15em] w-[1.15em]" />
      <span className="font-medium tracking-[-0.035em]">DCing</span>
    </span>
  );
}
