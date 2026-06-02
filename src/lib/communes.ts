import { ALL_COMMUNES, type Commune } from "./communes.generated";

export { ALL_COMMUNES };
export type { Commune };

export type DeptCode = "86" | "79" | "49" | "85";

export type Dept = {
  code: DeptCode;
  nom: string;
  slug: string;
  prefecture: string;
  /** Formes grammaticales correctes (genre/article du département). */
  en: string; // "en Vienne", "dans les Deux-Sèvres"…
  de: string; // "de la Vienne", "des Deux-Sèvres"…
  le: string; // "la Vienne", "les Deux-Sèvres"…
};

export const DEPTS: Dept[] = [
  { code: "86", nom: "Vienne", slug: "vienne-86", prefecture: "Poitiers", en: "en Vienne", de: "de la Vienne", le: "la Vienne" },
  { code: "79", nom: "Deux-Sèvres", slug: "deux-sevres-79", prefecture: "Niort", en: "dans les Deux-Sèvres", de: "des Deux-Sèvres", le: "les Deux-Sèvres" },
  { code: "49", nom: "Maine-et-Loire", slug: "maine-et-loire-49", prefecture: "Angers", en: "dans le Maine-et-Loire", de: "du Maine-et-Loire", le: "le Maine-et-Loire" },
  { code: "85", nom: "Vendée", slug: "vendee-85", prefecture: "La Roche-sur-Yon", en: "en Vendée", de: "de la Vendée", le: "la Vendée" },
];

export const deptByCode = (code: string) => DEPTS.find((d) => d.code === code);
export const deptBySlug = (slug: string) => DEPTS.find((d) => d.slug === slug);
export const deptName = (code: string) => deptByCode(code)?.nom ?? code;

/** Nombre de communes par département prébâties (SSG). Les autres passent en ISR. */
export const TIER1_PER_DEPT = 12;

/** Communes d'un département, déjà triées par population décroissante. */
export function communesByDept(code: DeptCode): Commune[] {
  return ALL_COMMUNES.filter((c) => c.dept === code);
}

export function tier1ByDept(code: DeptCode): Commune[] {
  return communesByDept(code).slice(0, TIER1_PER_DEPT);
}

/** Tier 1 global (top communes des 4 départements). */
export function tier1(): Commune[] {
  return DEPTS.flatMap((d) => tier1ByDept(d.code));
}

export function communeBySlug(slug: string): Commune | undefined {
  return ALL_COMMUNES.find((c) => c.slug === slug);
}

/**
 * Communes PRIORITAIRES (focus Vendée) — toujours prébâties (SSG) + sitemap,
 * quelle que soit leur population, pour faire vieillir ces URLs en premier.
 */
export const PRIORITY_SLUGS = [
  "la-roche-sur-yon",
  "les-sables-d-olonne",
  "challans",
  "montaigu-vendee",
  "saint-gilles-croix-de-vie",
  "fontenay-le-comte",
  "lucon",
  "saint-hilaire-de-riez",
  "saint-jean-de-monts",
  "les-herbiers",
];

export function priorityCommunes(): Commune[] {
  return PRIORITY_SLUGS.map((s) => communeBySlug(s)).filter((c): c is Commune => Boolean(c));
}

const isPrioritySet = new Set(PRIORITY_SLUGS);
export const isPriorityCommune = (slug: string) => isPrioritySet.has(slug);

/** Communes prébâties en SSG = Tier 1 ∪ communes prioritaires (dédoublonné). */
export function ssgCommunes(): Commune[] {
  const map = new Map<string, Commune>();
  for (const c of [...tier1(), ...priorityCommunes()]) map.set(c.code, c);
  return [...map.values()];
}

/** Bande de population (sert à varier le contenu, jamais affichée telle quelle). */
export function popBand(pop: number): "metropole" | "ville" | "bourg" | "village" {
  if (pop >= 40000) return "metropole";
  if (pop >= 12000) return "ville";
  if (pop >= 3500) return "bourg";
  return "village";
}

function distanceKm(a: Commune, b: Commune): number {
  if (a.lat == null || a.lng == null || b.lat == null || b.lng == null) return Infinity;
  const R = 6371;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/** Communes voisines géographiques (haversine) — pour le maillage interne local. */
export function neighbors(commune: Commune, k = 8): Commune[] {
  return ALL_COMMUNES.filter((c) => c.code !== commune.code)
    .map((c) => ({ c, d: distanceKm(commune, c) }))
    .sort((x, y) => x.d - y.d)
    .slice(0, k)
    .map((o) => o.c);
}
