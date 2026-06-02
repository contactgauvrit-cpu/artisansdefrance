/* ============================================================
   Données AIRTON (climatisation réversible air-air) — hub /climatisation
   Faits reformulés (pas de copie du texte Airton). AUCUN prix (vente posée,
   sur devis). « marque française » OK ; PAS « fabriqué en France ».
   Pas de mention d'attestation/obligation réglementaire (choix client).
   ============================================================ */

/** Gamme de splits (visuels produit + meta/alt SEO). */
export const AIRTON_RANGE: {
  key: string;
  name: string;
  img: string;
  alt: string;
  pieces: string;
  surface: string;
  desc: string;
}[] = [
  {
    key: "monosplit",
    name: "Monosplit",
    img: "/assets/airton/monosplit.jpg",
    alt: "Climatiseur réversible Airton monosplit : unité extérieure, unité murale intérieure et télécommande",
    pieces: "1 pièce",
    surface: "≈ 10 à 74 m²",
    desc: "Une unité intérieure reliée à un groupe extérieur. Idéal pour un séjour, une chambre ou un bureau — puissances 2100, 3400, 5100 ou 6200 W.",
  },
  {
    key: "bisplit",
    name: "Bi-split",
    img: "/assets/airton/bisplit.jpg",
    alt: "Climatiseur réversible Airton bi-split : deux unités intérieures et un groupe extérieur",
    pieces: "2 pièces",
    surface: "jusqu'à ~70 m²",
    desc: "Deux unités intérieures indépendantes sur un seul groupe extérieur, pour chauffer et rafraîchir deux pièces distinctes.",
  },
  {
    key: "trisplit",
    name: "Tri-split",
    img: "/assets/airton/trisplit.jpg",
    alt: "Climatiseur réversible Airton tri-split : trois unités intérieures et un groupe extérieur",
    pieces: "3 pièces",
    surface: "jusqu'à ~100 m²",
    desc: "Trois unités intérieures sur un seul groupe extérieur, pour un confort continu dans trois pièces de votre choix.",
  },
  {
    key: "quadrisplit",
    name: "Quadri-split",
    img: "/assets/airton/quadrisplit.jpg",
    alt: "Climatiseur réversible Airton quadri-split : quatre unités intérieures et un groupe extérieur",
    pieces: "4 pièces",
    surface: "toute la maison",
    desc: "Quatre unités intérieures sur un seul groupe extérieur, pour équiper une maison entière, pièce par pièce.",
  },
];

/** Atouts produit (reformulés, factuels). */
export const AIRTON_FEATURES: { t: string; d: string }[] = [
  { t: "Réversible 2-en-1", d: "Rafraîchit l'été, chauffe l'hiver. Température réglable de 16 à 31 °C." },
  { t: "Classe A++ / A+", d: "A++ en froid, A+ en chaud : des performances stables et une consommation maîtrisée toute l'année." },
  { t: "Pilotage WiFi", d: "Module WiFi SmartLife et 5 modes : pilotez votre climatiseur à distance depuis votre smartphone." },
  { t: "Marque française", d: "Airton, marque française. Fluide R32 et technologie ReadyClim (liaison pré-chargée et scellée)." },
  { t: "Posée par nos soins", d: "Nous dimensionnons, installons et mettons en service votre climatiseur — un seul interlocuteur." },
];

/** Visuels d'ambiance (lead + bandeau) avec meta/alt. */
export const AIRTON_VISUALS = {
  lead: {
    src: "/assets/airton/reversible.jpg",
    alt: "Climatisation réversible Airton : rafraîchit en été, chauffe en hiver (2 en 1)",
  },
  strip: [
    {
      src: "/assets/airton/studio-maison.jpg",
      alt: "Climatisation Airton adaptée du studio à la grande maison",
    },
    {
      src: "/assets/airton/surface.jpg",
      alt: "Climatiseur réversible Airton pour des surfaces de 10 à 120 m²",
    },
  ],
};
