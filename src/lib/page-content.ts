import { type Commune, deptByCode, neighbors, popBand } from "./communes";
import { type Service } from "./content";
import { serviceMeta, type ServiceMeta } from "./services-meta";
import { SITE } from "./content";

/* ---------- variation déterministe (stable par page, variée entre pages) ---------- */
function seed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
const pick = <T,>(arr: T[], n: number): T => arr[((n % arr.length) + arr.length) % arr.length];
/** Sélectionne `count` éléments distincts d'un pool, démarrage et pas variés par seed. */
function pickMany<T>(arr: T[], n: number, count: number): T[] {
  const out: T[] = [];
  const start = ((n % arr.length) + arr.length) % arr.length;
  for (let i = 0; out.length < Math.min(count, arr.length); i++) {
    out.push(arr[(start + i) % arr.length]);
  }
  return out;
}

type Ctx = {
  nom: string;
  dn: string;
  deDept: string;
  deptCode: string;
  cp: string;
  band: ReturnType<typeof popBand>;
  serviceLower: string;
  trade: string;
  metier: string;
  meta: ServiceMeta;
  nb: string[]; // noms des communes voisines
};

export type FAQ = { q: string; a: string };
export type ServiceCommuneContent = {
  title: string;
  description: string;
  h1: string;
  intro: string[];
  localContext: string[];
  reasons: string[];
  prestations: string[];
  faq: FAQ[];
};

/* ---------- pools de contenu (variés, factuels) ---------- */
const INTRO_1: ((c: Ctx) => string)[] = [
  (c) =>
    `Vous cherchez un ${c.metier} à ${c.nom} ? Artisans de France intervient à ${c.nom} et dans tout le département (${c.dn}, ${c.deptCode}) pour vos travaux de ${c.serviceLower}. De l'étude de votre projet au devis gratuit, puis à la réalisation, vous gardez un seul interlocuteur du début à la fin.`,
  (c) =>
    `Pour vos travaux de ${c.serviceLower} à ${c.nom} (${c.cp}), faites confiance à des artisans français qualifiés. Notre équipe connaît bien le secteur de ${c.nom} et de ses environs, et vous accompagne avec un travail soigné et des délais tenus.`,
  (c) =>
    `À ${c.nom}, faire appel à un ${c.metier} de confiance fait toute la différence. Artisans de France prend en charge vos projets de ${c.serviceLower}, du premier contact au chantier livré, avec un devis clair et sans engagement.`,
  (c) =>
    `Artisans de France accompagne les habitants de ${c.nom} et ${c.deDept} pour tous leurs travaux de ${c.serviceLower}. Particuliers et propriétaires : nous étudions chaque projet sur place et vous remettons une estimation gratuite et détaillée.`,
  (c) =>
    `Besoin d'un ${c.metier} sérieux à ${c.nom} ? Nous réalisons vos travaux de ${c.serviceLower} avec le souci du travail bien fait : chantier propre, finitions soignées et respect des délais annoncés.`,
];

const INTRO_2: ((c: Ctx) => string)[] = [
  () =>
    `Notre fierté, c'est le travail bien fait. Chaque chantier est préparé avec soin, réalisé proprement et livré dans les règles de l'art — exactement comme convenu lors du devis.`,
  () =>
    `Un seul interlocuteur coordonne votre projet : vous savez toujours où en est le chantier, et vous échangez avec une personne qui connaît votre dossier de bout en bout.`,
  (c) =>
    `Parce que nous sommes une entreprise locale, nous nous déplaçons rapidement à ${c.nom} et nous restons disponibles, y compris après les travaux, pour répondre à vos questions.`,
  () =>
    `Devis gratuit, conseils honnêtes et tarifs clairs : vous décidez en toute sérénité, sans mauvaise surprise et sans engagement de votre part.`,
];

const CONTEXT: ((c: Ctx) => string)[] = [
  (c) =>
    `Nous intervenons à ${c.nom} ainsi que dans les communes voisines comme ${c.nb.slice(0, 4).join(", ")}. Où que se situe votre logement dans le secteur, nous nous déplaçons pour étudier vos travaux de ${c.serviceLower}.`,
  (c) =>
    `Au-delà de ${c.nom}, notre zone d'intervention couvre ${c.nb.slice(0, 3).join(", ")} et l'ensemble ${c.deDept}. N'hésitez pas à nous contacter même si votre commune n'apparaît pas : nous étudions chaque demande.`,
  (c) =>
    `${cap(bandPhrase(c))}, ${c.nom} mérite des artisans qui prennent le temps de comprendre votre projet. Nous travaillons aussi à ${c.nb.slice(0, 4).join(", ")}, à proximité immédiate.`,
];

const REASON_LEAD: string[] = [
  "Pourquoi nous confier vos travaux",
  "Ce qui fait la différence",
  "De bonnes raisons de nous appeler",
];

/* ---------- FAQ : pool de générateurs (on en retient 4 par page) ---------- */
const FAQ_POOL: ((c: Ctx) => FAQ)[] = [
  (c) => ({
    q: `Intervenez-vous rapidement à ${c.nom} ?`,
    a: `Oui. Comme nous sommes basés en Vienne et que nous couvrons ${c.nom} et ses environs, nous organisons une visite rapidement — généralement sous 24 à 48 h après votre appel — pour évaluer vos travaux de ${c.serviceLower}.`,
  }),
  (c) => ({
    q: `Le devis pour mes travaux de ${c.serviceLower} à ${c.nom} est-il gratuit ?`,
    a: `Absolument. Nous nous déplaçons à ${c.nom}, étudions votre projet sur place et vous remettons un devis gratuit, clair et sans engagement. Vous décidez ensuite en toute liberté.`,
  }),
  (c) => ({
    q: `Travaillez-vous pour les particuliers à ${c.nom} ?`,
    a: `Oui, nous accompagnons avant tout les particuliers et propriétaires de ${c.nom} et ${c.deDept}. Notre approche est simple, à l'écoute et adaptée à votre budget.`,
  }),
  (c) => ({
    q: `Proposez-vous d'autres travaux que la ${c.serviceLower} à ${c.nom} ?`,
    a: `Oui. Artisans de France est une entreprise multiservice du bâtiment : plomberie, électricité, climatisation, rénovation, peinture, aménagement intérieur et extérieur, piscine. Un seul interlocuteur pour l'ensemble de vos travaux à ${c.nom}.`,
  }),
  (c) => ({
    q: `Vos travaux sont-ils garantis ?`,
    a: `Oui. Nous sommes une entreprise assurée et couverte par la garantie décennale. Vos travaux de ${c.serviceLower} à ${c.nom} sont protégés dans la durée.`,
  }),
  (c) => ({
    q: `Comment obtenir un rendez-vous à ${c.nom} ?`,
    a: `Appelez-nous au ${SITE.phoneDisplay} ou remplissez le formulaire de demande de devis. Nous vous recontactons rapidement pour convenir d'une visite à ${c.nom}.`,
  }),
];

function bandPhrase(c: Ctx): string {
  switch (c.band) {
    case "metropole":
      return `commune importante ${c.deDept}`;
    case "ville":
      return `ville dynamique ${c.deDept}`;
    default:
      return `commune ${c.deDept}`;
  }
}
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------- construction d'une page service × commune ---------- */
export function buildServiceCommune(service: Service, commune: Commune): ServiceCommuneContent {
  const meta = serviceMeta(service.slug);
  const dform = deptByCode(commune.dept)!;
  const dn = dform.nom;
  const s = seed(service.slug + ":" + commune.code);
  const ctx: Ctx = {
    nom: commune.nom,
    dn,
    deDept: dform.de,
    deptCode: commune.dept,
    cp: commune.cp,
    band: popBand(commune.pop),
    serviceLower: service.title.toLowerCase(),
    trade: meta.h1Trade,
    metier: meta.metier,
    meta,
    nb: neighbors(commune, 8).map((c) => c.nom),
  };

  const h1 = `${meta.h1Trade} à ${commune.nom} (${commune.dept})`;
  const title = `${meta.h1Trade} à ${commune.nom} (${commune.cp}) | Devis gratuit — Artisans de France`;

  const descPool = [
    `Besoin d'un ${meta.metier} qualifié à ${commune.nom} (${commune.cp}) ? Intervention rapide et travail soigné par nos artisans locaux ${dform.en}. Devis gratuit.`,
    `${meta.h1Trade} à ${commune.nom} : ${meta.keywords.slice(0, 3).join(", ")}. Artisans français, devis gratuit, délais tenus. ☎ ${SITE.phoneDisplay}.`,
    `Travaux de ${ctx.serviceLower} à ${commune.nom} (${commune.cp}) par des artisans locaux. Devis gratuit, un seul interlocuteur, garantie décennale.`,
  ];

  return {
    title,
    description: pick(descPool, s >> 2),
    h1,
    intro: [pick(INTRO_1, s)(ctx), pick(INTRO_2, s >> 3)(ctx)],
    localContext: [pick(CONTEXT, s >> 5)(ctx)],
    reasons: meta.benefices,
    prestations: meta.prestations,
    faq: pickMany(FAQ_POOL, s >> 7, 4).map((f) => f(ctx)),
  };
}

/* ---------- contenu d'un hub service (/[service]) ---------- */
export type ServiceHubContent = {
  title: string;
  description: string;
  h1: string;
  intro: string[];
  prestations: string[];
};

export function buildServiceHub(service: Service): ServiceHubContent {
  const meta = serviceMeta(service.slug);
  const sl = service.title.toLowerCase();
  return {
    title: `${service.title} en Vienne (86), Deux-Sèvres, Maine-et-Loire, Vendée — Artisans de France`,
    description: `${service.title} par des artisans français : ${meta.keywords.slice(0, 3).join(", ")}. Devis gratuit en Vienne (86), Deux-Sèvres (79), Maine-et-Loire (49) et Vendée (85).`,
    h1: `${meta.h1Trade} — vos travaux de ${sl}`,
    intro: [
      `Artisans de France réalise vos travaux de ${sl} sur quatre départements : la Vienne (86), les Deux-Sèvres (79), le Maine-et-Loire (49) et la Vendée (85). Particuliers et propriétaires, vous bénéficiez d'un interlocuteur unique, d'un devis gratuit et d'un travail soigné.`,
      `Sélectionnez votre commune ci-dessous pour découvrir notre intervention près de chez vous, ou contactez-nous directement : nous étudions chaque projet de ${sl} et nous nous déplaçons pour établir une estimation gratuite.`,
    ],
    prestations: meta.prestations,
  };
}
