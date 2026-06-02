import { SERVICES, type Service } from "./content";

export type ServiceMeta = {
  /** Terme métier pour le H1 / title (fort en SEO local). */
  h1Trade: string;
  /** Nom du professionnel pour la prose ("notre plombier…"). */
  metier: string;
  /** Prestations concrètes (6-8). */
  prestations: string[];
  /** Intentions de recherche associées. */
  keywords: string[];
  /** Raisons de choisir (bénéfices). */
  benefices: string[];
};

export const SERVICE_META: Record<string, ServiceMeta> = {
  plomberie: {
    h1Trade: "Plombier",
    metier: "plombier",
    prestations: [
      "Dépannage et recherche de fuite",
      "Installation et remplacement de chauffe-eau",
      "Rénovation complète de salle de bain",
      "Pose de sanitaires (WC, douche, baignoire, lavabo)",
      "Mise aux normes de l'installation de plomberie",
      "Débouchage et curage de canalisations",
      "Raccordement et réseaux d'évacuation",
      "Détection de fuite non destructive",
    ],
    keywords: ["plombier", "dépannage plomberie", "recherche de fuite", "installation sanitaire", "rénovation salle de bain"],
    benefices: [
      "Intervention rapide en cas de fuite ou de panne (aux heures d'ouverture)",
      "Devis clair et détaillé avant toute intervention",
      "Travail conforme aux normes en vigueur",
      "Un seul interlocuteur pour toute votre plomberie",
    ],
  },
  electricite: {
    h1Trade: "Électricien",
    metier: "électricien",
    prestations: [
      "Mise en sécurité et mise aux normes du tableau électrique",
      "Rénovation complète de l'installation électrique",
      "Pose de prises, interrupteurs et points lumineux",
      "Installation de borne de recharge pour véhicule électrique",
      "Recherche de panne et dépannage",
      "Tableau, disjoncteurs et différentiels",
      "Éclairage intérieur et extérieur",
      "Mise à la terre et protection des circuits",
    ],
    keywords: ["électricien", "dépannage électrique", "mise aux normes électrique", "installation électrique", "rénovation électrique"],
    benefices: [
      "Installation sûre et conforme à la norme NF C 15-100",
      "Diagnostic clair de votre tableau et de vos circuits",
      "Intervention soignée, sans dégât sur vos murs",
      "Conseils pour réduire votre consommation",
    ],
  },
  climatisation: {
    h1Trade: "Climatisation",
    metier: "climaticien",
    prestations: [
      "Pose de climatisation réversible Airton (marque française)",
      "Pompe à chaleur air-air monosplit et multisplit",
      "Climatiseur connecté WiFi, pilotage smartphone",
      "Technologie ReadyClim (liaison pré-chargée R32)",
      "Dimensionnement adapté à chaque pièce",
      "Mise en service et réglages",
      "Remplacement d'un ancien climatiseur",
      "Entretien et nettoyage de climatisation",
    ],
    keywords: ["climatisation Airton", "installateur Airton", "pompe à chaleur air air", "climatisation réversible", "clim air air", "climatiseur réversible Airton"],
    benefices: [
      "Climatisation réversible Airton, marque française",
      "Chauffe en hiver, rafraîchit en été (air-air)",
      "Du matériel dimensionné pièce par pièce",
      "Pose discrète et soignée, mise en service incluse",
    ],
  },
  peinture: {
    h1Trade: "Peintre",
    metier: "peintre en bâtiment",
    prestations: [
      "Peinture intérieure (murs, plafonds, boiseries)",
      "Ravalement et peinture de façade",
      "Préparation des supports et enduits",
      "Pose de revêtements muraux",
      "Traitement des fissures et reprises",
      "Peinture extérieure (volets, clôtures)",
      "Finitions décoratives",
      "Protection des sols et du mobilier",
    ],
    keywords: ["peintre", "peintre en bâtiment", "ravalement de façade", "peinture intérieure", "peinture extérieure"],
    benefices: [
      "Des surfaces nettes et durables",
      "Une préparation soignée pour un rendu impeccable",
      "Le respect de votre intérieur et de vos meubles",
      "Des conseils couleurs et matières",
    ],
  },
  "amenagement-exterieur": {
    h1Trade: "Aménagement extérieur",
    metier: "paysagiste",
    prestations: [
      "Création de terrasse (bois, composite, carrelage)",
      "Construction et aménagement de piscine",
      "Terrassement et préparation de terrain",
      "Allées, accès et maçonnerie paysagère",
      "Pose de clôtures, portails et brise-vue",
      "Aménagement de jardin et plantations",
      "Engazonnement et finitions",
      "Éclairage extérieur",
    ],
    keywords: ["aménagement extérieur", "paysagiste", "création terrasse", "construction piscine", "terrassement", "pisciniste"],
    benefices: [
      "Des extérieurs pensés pour en profiter toute l'année",
      "Du terrassement à la finition, un seul interlocuteur",
      "Des matériaux résistants aux intempéries",
      "Un projet adapté à votre terrain",
    ],
  },
  nettoyage: {
    h1Trade: "Nettoyage toiture & façade",
    metier: "spécialiste du nettoyage",
    prestations: [
      "Démoussage et nettoyage de toiture",
      "Traitement hydrofuge de toiture",
      "Nettoyage de façade et de bardage",
      "Nettoyage et dégrisage de terrasse",
      "Démoussage de gouttières",
      "Traitement anti-mousse préventif",
      "Nettoyage des murs extérieurs",
      "Remise en état des surfaces extérieures",
    ],
    keywords: ["nettoyage toiture", "démoussage toiture", "nettoyage façade", "nettoyage terrasse", "hydrofuge toiture"],
    benefices: [
      "Une toiture et une façade protégées dans la durée",
      "Des surfaces extérieures comme neuves",
      "Un traitement préventif contre les mousses",
      "Une intervention soignée, sans dégât",
    ],
  },
};

export function serviceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function serviceMeta(slug: string): ServiceMeta {
  return SERVICE_META[slug];
}
