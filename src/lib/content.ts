/* ============================================================
   Artisans de France — données du site (FR, SEO local)
   Source de vérité du contenu de la page d'accueil.
   ⚠️ Les coordonnées (téléphone, e-mail, SIREN, domaine) sont des
   PLACEHOLDERS à remplacer par les vraies données client.
   ============================================================ */

export const SITE = {
  name: "Artisans de France",
  baseline: "Création • Rénovation",
  // ⚠️ PLACEHOLDERS — à remplacer
  phoneDisplay: "07 49 98 86 95",
  phoneHref: "+33749988695",
  email: "contact@artisansdefrancetravaux.fr",
  siren: "985 169 473",
  legalForm: "Entrepreneur individuel",
  address: "3 rue des Rosiers",
  legalCity: "Craon",
  postalCode: "86110",
  director: "Willy Gauvrit",
  url: "https://www.artisansdefrancetravaux.fr",
  // Localisation
  region: "Nouvelle-Aquitaine",
  baseCity: "Poitiers",
  baseDept: "Vienne",
  baseDeptCode: "86",
  hours: "Lun – Sam : 8 h – 19 h",
  hoursNote: "Dépannage rapide aux heures d'ouverture",
  areaServed: ["86", "79", "49", "85"],
} as const;

export type Service = {
  slug: string; // URL propre pour les futures pages programmatiques
  icon: string; // clé d'icône (voir lib/icons.tsx)
  title: string;
  desc: string;
};

export const SERVICES: Service[] = [
  { slug: "plomberie", icon: "plomberie", title: "Plomberie", desc: "Installation, dépannage et rénovation de plomberie : sanitaires, chauffe-eau, recherche de fuite et mise aux normes." },
  { slug: "electricite", icon: "electricite", title: "Électricité", desc: "Rénovation électrique, mise en sécurité du tableau, éclairage et bornes : une installation conforme et fiable." },
  { slug: "climatisation", icon: "clim", title: "Climatisation", desc: "Pose de climatisation réversible air/air Airton (marque française) : pompe à chaleur connectée, confort toute l'année et factures maîtrisées." },
  { slug: "peinture", icon: "peinture", title: "Peinture intérieure & extérieure", desc: "Peinture, enduits et ravalement de façade : des surfaces nettes et durables, en intérieur comme en extérieur." },
  { slug: "amenagement-exterieur", icon: "exterieur", title: "Création & aménagement extérieur", desc: "Terrasse, piscine, terrassement, allées, clôtures et jardin : nous créons et aménageons vos espaces extérieurs." },
  { slug: "nettoyage", icon: "nettoyage", title: "Nettoyage toiture, terrasse & façade", desc: "Démoussage et nettoyage de toiture, terrasse et façade : on protège votre habitat et on lui redonne de l'éclat." },
];

export const WHY: { n: string; title: string; desc: string }[] = [
  { n: "01", title: "Artisans français qualifiés", desc: "Des professionnels expérimentés, formés à chaque métier du bâtiment. Le travail bien fait, c'est notre fierté." },
  { n: "02", title: "Devis gratuit, sans engagement", desc: "Une visite, une estimation claire et détaillée, sans frais ni obligation. Vous décidez en toute sérénité." },
  { n: "03", title: "Un seul interlocuteur", desc: "Tous vos corps de métier coordonnés par une seule personne, du premier contact à la livraison du chantier." },
  { n: "04", title: "Chantier propre, délais tenus", desc: "Nous respectons votre logement et les délais annoncés. Un chantier rangé chaque soir, livré comme convenu." },
  { n: "05", title: "Conseils honnêtes, devis clair", desc: "Un diagnostic transparent et un devis détaillé sans surprise. On vous conseille selon votre budget, et vous décidez en toute sérénité." },
];

export const DEPARTEMENTS: { num: string; nom: string; villes: string[] }[] = [
  { num: "86", nom: "Vienne", villes: ["Poitiers", "Châtellerault", "Montmorillon", "Loudun", "Civray", "Chauvigny"] },
  { num: "79", nom: "Deux-Sèvres", villes: ["Niort", "Bressuire", "Parthenay", "Thouars", "Melle"] },
  { num: "49", nom: "Maine-et-Loire", villes: ["Angers", "Cholet", "Saumur", "Doué-en-Anjou"] },
  { num: "85", nom: "Vendée", villes: ["La Roche-sur-Yon", "Les Sables-d'Olonne", "Challans", "Fontenay-le-Comte"] },
];

export const GALLERY: { id: string; title: string; before: string; after: string }[] = [
  { id: "r1", title: "Rénovation de salle de bain", before: "Salle de bain — avant", after: "Salle de bain — après" },
  { id: "r2", title: "Ravalement de façade", before: "Façade — avant", after: "Façade — après" },
  { id: "r3", title: "Création de piscine", before: "Terrain — avant", after: "Piscine — après" },
  { id: "r4", title: "Aménagement extérieur", before: "Jardin — avant", after: "Terrasse — après" },
  { id: "r5", title: "Rénovation de cuisine", before: "Cuisine — avant", after: "Cuisine — après" },
  { id: "r6", title: "Peinture & finitions", before: "Pièce — avant", after: "Pièce — après" },
];

export const STEPS: { title: string; desc: string }[] = [
  { title: "Vous nous contactez", desc: "Par téléphone ou via le formulaire. Vous nous expliquez votre projet et vos besoins en quelques mots." },
  { title: "Visite & devis gratuit", desc: "Nous venons sur place, évaluons les travaux et vous remettons un devis clair, gratuit et sans engagement." },
  { title: "On réalise", desc: "Nos artisans interviennent dans les délais convenus, avec un suivi par votre interlocuteur unique." },
  { title: "Chantier propre livré", desc: "Nous livrons un chantier net et terminé dans les règles de l'art, et restons disponibles après les travaux." },
];

export const REVIEWS: { av: string; nm: string; lc: string; txt: string }[] = [
  { av: "M", nm: "Marie L.", lc: "Poitiers", txt: "« Salle de bain refaite à neuf en une semaine. Équipe ponctuelle, propre et de bon conseil. Le devis a été respecté à l'euro près. Je recommande sans hésiter. »" },
  { av: "T", nm: "Thierry D.", lc: "Châtellerault", txt: "« Un seul interlocuteur pour la plomberie et l'électricité, ça change tout. Travail soigné et délais tenus. Des artisans sérieux et locaux. »" },
  { av: "S", nm: "Sandrine R.", lc: "Montmorillon", txt: "« Création de notre terrasse et de la piscine : résultat magnifique. À l'écoute du début à la fin, chantier toujours rangé. Bravo à toute l'équipe. »" },
];

// Options du menu déroulant du formulaire (8 services + autre)
export const PROJECT_TYPES = [
  ...SERVICES.map((s) => s.title),
  "Plusieurs / autre",
];

// FAQ d'accueil — questions à forte intention locale (capte les "People Also Ask"
// et nourrit la citabilité IA). Repris en FAQPage JSON-LD.
export const HOME_FAQ: { q: string; a: string }[] = [
  {
    q: "Intervenez-vous rapidement en cas de fuite ou de panne ?",
    a: "Oui. Pour les dépannages de plomberie et d'électricité, nous intervenons rapidement — souvent dans la journée — pendant nos horaires d'ouverture (du lundi au samedi, 8 h – 19 h). Appelez-nous au 07 49 98 86 95.",
  },
  {
    q: "Le devis est-il vraiment gratuit et sans engagement ?",
    a: "Oui, le devis est gratuit et sans engagement. Nous nous déplaçons chez vous, évaluons les travaux et vous remettons une estimation claire et détaillée. Vous décidez ensuite librement.",
  },
  {
    q: "Quelle est votre zone d'intervention ?",
    a: "Basés en Vienne (86), nous intervenons aussi en Deux-Sèvres (79), Maine-et-Loire (49) et Vendée (85) — de Poitiers à Niort, Angers et La Roche-sur-Yon, ainsi que dans les communes alentour.",
  },
  {
    q: "Le devis et le déplacement sont-ils payants ?",
    a: "Non. La visite et le devis sont gratuits et sans engagement. Vous ne réglez que les travaux que vous décidez de nous confier, au tarif convenu à l'avance.",
  },
  {
    q: "Peut-on confier plusieurs corps de métier au même artisan ?",
    a: "Absolument, c'est notre spécialité. Plomberie, électricité, climatisation, peinture, aménagement extérieur (terrasse, piscine, terrassement) et nettoyage de toiture, terrasse et façade : tout est coordonné par un seul interlocuteur.",
  },
  {
    q: "Sous combien de temps répondez-vous à une demande de devis ?",
    a: "Nous vous recontactons sous 24 h après réception de votre demande pour organiser une visite et établir votre devis gratuit.",
  },
];
