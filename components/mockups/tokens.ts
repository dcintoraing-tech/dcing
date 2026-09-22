/**
 * Shared art direction for every product mockup. Values are CSS variables so a
 * theme change repaints the artwork without re-rendering React.
 */
export const M = {
  ink: "var(--viz-ink)",
  onInk: "var(--viz-on-ink)",
  surface: "var(--viz-surface)",
  line: "var(--viz-line)",
  soft: "var(--viz-soft)",
  softer: "var(--viz-softer)",
  mid: "var(--viz-mid)",
  text: "var(--viz-text)",
  objectFrom: "var(--viz-object-from)",
  objectTo: "var(--viz-object-to)",
} as const;

export const VIEWBOX = "0 0 1200 750";

export const MONO = "var(--font-geist-mono), ui-monospace, monospace";
export const SANS = "var(--font-geist-sans), system-ui, sans-serif";

export const pop = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 as const },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});
