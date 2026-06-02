import type { CSSProperties } from "react";

/** Style avec variable CSS personnalisée (--d) pour l'apparition en escalier. */
type CSSVars = CSSProperties & Record<`--${string}`, string | number>;

/** Délai d'apparition échelonné (~80 ms par carte, plafonné à 5). */
export function stagger(i: number): CSSVars {
  return { "--d": `${Math.min(i, 5) * 80}ms` };
}
