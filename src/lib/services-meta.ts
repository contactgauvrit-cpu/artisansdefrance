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
    keywords: ["plombier", "dépannage plomberie", "urgence plombier", "recherche de fuite", "installation sanitaire"],
    benefices: [
      "Intervention rapide en cas de fuite ou de panne",
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
      "Pose de climatisation réversible (mono et multi-split)",
      "Installation de pompe à chaleur air/air et air/eau",
      "Entretien et recharge de climatisation",
      "Remplacement d'un ancien système de chauffage",
      "Dimensionnement adapté à votre logement",
      "Mise en service et réglages",
      "Dépannage de climatisation et PAC",
      "Conseils sur les aides (MaPrimeRénov', CEE)",
    ],
    keywords: ["climatisation", "installateur climatisation", "pompe à chaleur", "PAC air eau", "clim réversible"],
    benefices: [
      "Un confort maîtrisé été comme hiver",
      "Des factures d'énergie allégées",
      "Matériel dimensionné précisément pour votre maison",
      "Accompagnement sur les aides à la rénovation énergétique",
    ],
  },
  "renovation-generale": {
    h1Trade: "Rénovation",
    metier: "artisan",
    prestations: [
      "Rénovation complète de maison ou d'appartement",
      "Travaux tous corps d'état coordonnés",
      "Rénovation énergétique (isolation, chauffage)",
      "Démolition, cloisons et reprise de gros œuvre",
      "Sols, murs, plafonds et finitions",
      "Mise aux normes et réagencement",
      "Suivi de chantier par un interlocuteur unique",
      "Coordination des différents métiers",
    ],
    keywords: ["rénovation maison", "entreprise de rénovation", "rénovation appartement", "travaux tous corps d'état", "rénovation complète"],
    benefices: [
      "Un seul interlocuteur du devis à la livraison",
      "Tous les corps de métier coordonnés",
      "Un planning et un budget respectés",
      "Un chantier propre et rangé chaque soir",
    ],
  },
  "amenagement-interieur": {
    h1Trade: "Aménagement intérieur",
    metier: "artisan",
    prestations: [
      "Création et rénovation de cuisine",
      "Aménagement de salle de bain",
      "Pose de cloisons et création de pièces",
      "Placards et rangements sur mesure",
      "Optimisation des espaces de vie",
      "Sols, faïence et revêtements",
      "Menuiseries intérieures",
      "Finitions soignées",
    ],
    keywords: ["aménagement intérieur", "rénovation intérieure", "agencement", "cuisine", "salle de bain"],
    benefices: [
      "Des espaces repensés pour votre quotidien",
      "Du sur-mesure adapté à votre logement",
      "Des matériaux durables et bien posés",
      "Un accompagnement de la conception à la pose",
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
      "Aménagement de jardin et massifs",
      "Pose d'allées et de clôtures",
      "Création d'espaces extérieurs et abords",
      "Maçonnerie paysagère",
      "Pose de portail et de brise-vue",
      "Engazonnement et plantations",
      "Éclairage extérieur",
    ],
    keywords: ["aménagement extérieur", "paysagiste", "création terrasse", "aménagement jardin", "clôture"],
    benefices: [
      "Des extérieurs pensés pour en profiter toute l'année",
      "Des matériaux résistants aux intempéries",
      "Une réalisation soignée du sol aux finitions",
      "Un projet adapté à votre terrain",
    ],
  },
  piscine: {
    h1Trade: "Pisciniste",
    metier: "pisciniste",
    prestations: [
      "Construction de piscine maçonnée",
      "Rénovation et remise à neuf de piscine",
      "Création de plage et margelles",
      "Aménagement des abords et terrasse",
      "Local technique et filtration",
      "Étanchéité et revêtement",
      "Mise en eau et mise en service",
      "Conseils d'entretien",
    ],
    keywords: ["pisciniste", "construction piscine", "rénovation piscine", "installateur piscine", "création piscine"],
    benefices: [
      "Un espace de détente sur mesure dans votre jardin",
      "Une construction durable et étanche",
      "Un projet complet, du bassin aux abords",
      "Un accompagnement de la conception à la mise en eau",
    ],
  },
};

export function serviceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function serviceMeta(slug: string): ServiceMeta {
  return SERVICE_META[slug];
}
