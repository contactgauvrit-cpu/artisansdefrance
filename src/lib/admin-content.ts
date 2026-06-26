import { SITE } from "./content";

/** Coordonnées bancaires affichées en bas des devis/factures (compte Revolut). */
export const RIB = {
  iban: "FR76 2823 3000 0189 2745 2107 134",
  bic: "REVOFRP2",
  titulaire: "Willy Gauvrit",
};

/** Mention TVA obligatoire (franchise en base). */
export const TVA_MENTION = "TVA non applicable, art. 293 B du CGI";

export const DEFAULT_CONDITIONS_DEVIS =
  "Devis valable 30 jours à compter de sa date d'émission. Acompte de 50 % à la commande, " +
  "solde à la fin des travaux. " + TVA_MENTION + ".";

export const DEFAULT_CONDITIONS_FACTURE =
  "Paiement à réception de la facture. En cas de retard : pénalités au taux de 3 fois " +
  "l'intérêt légal et indemnité forfaitaire de recouvrement de 40 €. " + TVA_MENTION + ".";

/** Émetteur figé sur les documents (entreprise individuelle, franchise en base). */
export const EMETTEUR = {
  nom: SITE.name,
  forme: SITE.legalForm,
  dirigeant: SITE.director,
  adresse: SITE.address,
  cp: SITE.postalCode,
  ville: SITE.legalCity,
  siren: SITE.siren,
  tel: SITE.phoneDisplay,
  email: SITE.email,
  site: "artisansdefrancetravaux.fr",
};

/* ---------- types & calculs ---------- */
export type Ligne = { designation: string; quantite: number; prix_unitaire: number };

export type DocType = "devis" | "facture";
export type DocStatut = "brouillon" | "envoye" | "signe" | "refuse" | "paye" | "annule";

export type ClientSnapshot = {
  nom?: string;
  prenom?: string;
  email?: string;
  tel?: string;
  adresse?: string;
  cp?: string;
  ville?: string;
  est_entreprise?: boolean;
  raison_sociale?: string;
  siret?: string;
};

export const ligneTotal = (l: Ligne) =>
  Math.round((Number(l.quantite) || 0) * (Number(l.prix_unitaire) || 0) * 100) / 100;
export const docTotal = (lignes: Ligne[]) =>
  Math.round(lignes.reduce((s, l) => s + ligneTotal(l), 0) * 100) / 100;

export const eur = (n: number) =>
  (Number(n) || 0).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
export const dateFr = (d: string | Date) =>
  new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

/** Numéro humain DEV-AAAA-NNNN / FAC-AAAA-NNNN à partir du compteur de l'année. */
export function makeNumero(type: DocType, year: number, count: number): string {
  const prefix = type === "devis" ? "DEV" : "FAC";
  return `${prefix}-${year}-${String(count + 1).padStart(4, "0")}`;
}

/** Extrait la séquence finale d'un numéro (DEV-2026-0007 -> 7). 0 si absent. */
export function parseSeq(numero?: string | null): number {
  if (!numero) return 0;
  const m = /(\d+)$/.exec(numero);
  return m ? parseInt(m[1], 10) : 0;
}

export const STATUT_LABEL: Record<DocStatut, string> = {
  brouillon: "Brouillon",
  envoye: "Envoyé",
  signe: "Signé",
  refuse: "Refusé",
  paye: "Payé",
  annule: "Annulé",
};
