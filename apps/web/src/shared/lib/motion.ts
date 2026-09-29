export const DUR = { fast: 0.15, base: 0.25, slow: 0.4 } as const;
export const EASE = "aone";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
