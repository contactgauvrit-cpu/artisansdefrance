/* ============================================================
   Playbooks métier — contenu d'EXPERTISE profond et unique par
   service, injecté dans les pages service×commune et les hubs.
   Objectif SEO : profondeur réelle + E-E-A-T, jamais de doorway.
   Tokenisé (ville, département, voisins) → variation par page.
   Contraintes marque : « nous » (artisan direct), Lun–Sam 8h–19h,
   AUCUNE mention de garantie/assurance, pas d'urgence 24h/24.
   ============================================================ */

export type FAQ = { q: string; a: string };

/** Contexte local passé aux générateurs (sous-ensemble du Ctx du moteur). */
export type LocalCtx = {
  nom: string; // nom de la commune
  dn: string; // nom du département
  enDept: string; // « en Vienne » / « dans les Deux-Sèvres »…
  deDept: string; // « de la Vienne » / « des Deux-Sèvres »…
  deptCode: string;
  cp: string;
  band: string; // metropole | ville | bourg…
  serviceLower: string;
  trade: string;
  metier: string;
  nb: string[]; // communes voisines
};

export type Playbook = {
  /** Titre (H2) du bloc d'expertise. */
  expertiseTitle: (c: LocalCtx) => string;
  /** Paragraphes de fond (le moteur en retient 2-3 selon le seed). */
  expertise: ((c: LocalCtx) => string)[];
  /** Points clés / savoir-faire (chips ou puces) — le moteur en retient 3-4. */
  highlights: ((c: LocalCtx) => string)[];
  /** FAQ spécifiques métier (le moteur en retient 2-3, mêlées aux génériques). */
  faq: ((c: LocalCtx) => FAQ)[];
  /** Paragraphes d'expertise niveau HUB (région, sans nom de commune). */
  hubExpertise?: string[];
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* ============================================================
   PLOMBERIE
   ============================================================ */
const plomberie: Playbook = {
  expertiseTitle: (c) => `Votre plombier à ${c.nom} : installation, dépannage et rénovation`,
  expertise: [
    (c) =>
      `À ${c.nom}, notre plombier intervient aussi bien pour un dépannage que pour une rénovation complète. Nous commençons toujours par un diagnostic précis : repérer l'origine d'une fuite, contrôler la pression, vérifier l'état des canalisations et des évacuations. Vous recevez ensuite un devis clair, détaillé poste par poste, avant la moindre intervention.`,
    (c) =>
      `${cap(c.enDept)}, l'eau est souvent calcaire : elle entartre les chauffe-eau, réduit le débit des robinets et fatigue les installations. Lors de nos interventions à ${c.nom}, nous vous conseillons sur l'entretien de votre réseau et, si c'est utile, sur la pose d'un adoucisseur pour prolonger la durée de vie de vos équipements.`,
    (c) =>
      `Cuivre, PER ou multicouche : nous choisissons le réseau le mieux adapté à votre logement et à votre projet. Raccordements soignés, évacuations correctement pentées, mise en service contrôlée — chaque installation réalisée à ${c.nom} est faite dans les règles de l'art pour durer.`,
    (c) =>
      `Une fuite ou une panne de chauffe-eau ne prévient jamais. Dès votre appel pendant nos horaires d'ouverture (du lundi au samedi, 8h–19h), nous organisons une intervention rapide à ${c.nom} et ses environs pour limiter les dégâts et rétablir votre confort au plus vite.`,
  ],
  highlights: [
    () => `Recherche de fuite non destructive (caméra, gaz traceur)`,
    () => `Remplacement de chauffe-eau souvent en une demi-journée`,
    () => `Rénovation complète de salle de bain, un seul interlocuteur`,
    () => `Réseaux cuivre, PER et multicouche posés dans les règles`,
    () => `Devis gratuit et détaillé avant toute intervention`,
  ],
  faq: [
    (c) => ({
      q: `Combien de temps faut-il pour remplacer un chauffe-eau à ${c.nom} ?`,
      a: `Le remplacement d'un chauffe-eau électrique prend en général une demi-journée, selon l'accès, le modèle et l'état du raccordement. Nous évacuons l'ancien appareil et vérifions le bon fonctionnement avant de partir.`,
    }),
    (c) => ({
      q: `Comment détectez-vous une fuite sans tout casser à ${c.nom} ?`,
      a: `Nous utilisons des méthodes non destructives : caméra d'inspection, détection par gaz traceur et écoute acoustique. L'objectif est de localiser précisément la fuite avant d'intervenir, pour éviter de casser inutilement murs et sols.`,
    }),
    (c) => ({
      q: `Pouvez-vous rénover entièrement ma salle de bain à ${c.nom} ?`,
      a: `Oui. De la dépose à la pose des sanitaires, en passant par la plomberie, le carrelage et l'électricité associée, nous coordonnons l'ensemble du chantier à ${c.nom}. Vous gardez un seul interlocuteur du devis à la livraison.`,
    }),
    (c) => ({
      q: `Mon eau est calcaire ${c.enDept}, que faire ?`,
      a: `Une eau calcaire entartre vos équipements. Selon votre installation à ${c.nom}, nous vous conseillons sur l'entretien préventif et, si nécessaire, sur la pose d'un adoucisseur correctement dimensionné.`,
    }),
  ],
};

/* ============================================================
   ÉLECTRICITÉ
   ============================================================ */
const electricite: Playbook = {
  expertiseTitle: (c) => `Votre électricien à ${c.nom} : sécurité, rénovation et mise aux normes`,
  expertise: [
    (c) =>
      `À ${c.nom}, la sécurité électrique commence par le tableau. Un tableau ancien (porte-fusibles en porcelaine, absence d'interrupteur différentiel 30 mA, mise à la terre incomplète) présente un vrai risque. Nous établissons un diagnostic clair de votre installation et vous expliquons, sans jargon, ce qui doit être mis en sécurité en priorité.`,
    (c) =>
      `Rénover l'électricité d'une maison ancienne ${c.enDept} demande de la méthode : passage des gaines, pose d'un tableau moderne, circuits dédiés, protections adaptées et mise à la terre. Nous travaillons proprement, en rebouchant soigneusement les saignées, pour que votre logement de ${c.nom} reste vivable pendant le chantier.`,
    (c) =>
      `Toutes nos installations à ${c.nom} respectent la norme NF C 15-100, la référence pour la sécurité des logements. Ajout de prises, points lumineux, éclairage LED intérieur et extérieur, remise en état d'un circuit défaillant : nous intervenons avec rigueur et nous vous remettons un devis clair au préalable.`,
    (c) =>
      `Vous roulez en électrique ? Nous installons votre borne de recharge (IRVE) à ${c.nom}, dimensionnée selon votre véhicule et votre tableau, pour une recharge sûre et plus rapide qu'une simple prise domestique.`,
  ],
  highlights: [
    () => `Mise en sécurité et conformité NF C 15-100`,
    () => `Tableau, différentiels 30 mA et mise à la terre`,
    () => `Borne de recharge pour véhicule électrique (IRVE)`,
    () => `Recherche de panne et remise en état de circuit`,
    () => `Chantier soigné, saignées rebouchées proprement`,
  ],
  faq: [
    (c) => ({
      q: `Mon tableau électrique est-il aux normes à ${c.nom} ?`,
      a: `Nous le vérifions lors d'un diagnostic à ${c.nom} : présence d'interrupteurs différentiels 30 mA, disjoncteurs adaptés, mise à la terre. S'il faut le mettre en sécurité, nous vous expliquons clairement les priorités et le coût avant d'intervenir.`,
    }),
    (c) => ({
      q: `Installez-vous des bornes de recharge à ${c.nom} ?`,
      a: `Oui. Nous posons des bornes de recharge pour véhicule électrique à ${c.nom}, dimensionnées selon votre voiture et votre installation, pour une recharge plus sûre et plus rapide qu'une prise classique.`,
    }),
    (c) => ({
      q: `Faut-il tout refaire dans une maison ancienne ${c.enDept} ?`,
      a: `Pas toujours. Nous commençons par un diagnostic à ${c.nom} : parfois une mise en sécurité du tableau et de quelques circuits suffit, parfois une rénovation plus large est conseillée. Vous décidez en connaissance de cause, devis à l'appui.`,
    }),
    (c) => ({
      q: `Intervenez-vous pour une simple panne électrique à ${c.nom} ?`,
      a: `Oui, nous recherchons l'origine de la panne (disjoncteur qui saute, prise ou circuit hors service) et nous remettons votre installation en état, pendant nos horaires d'ouverture, du lundi au samedi.`,
    }),
  ],
};

/* ============================================================
   PEINTURE
   ============================================================ */
const peinture: Playbook = {
  expertiseTitle: (c) => `Peinture intérieure et façade à ${c.nom} : un rendu net et durable`,
  expertise: [
    (c) =>
      `À ${c.nom}, un beau résultat tient d'abord à la préparation. Avant la première couche, nous rebouchons, ponçons, appliquons enduit et sous-couche adaptés au support. C'est ce travail invisible qui donne des murs nets, sans traces ni reprises, et une finition qui tient dans le temps.`,
    (c) =>
      `Les façades ${c.enDept} subissent la pluie, le gel et les écarts de température. Pour un ravalement à ${c.nom}, nous traitons d'abord le support (nettoyage, traitement des fissures) puis appliquons une peinture façade respirante et résistante, qui protège le mur tout en rafraîchissant votre maison.`,
    (c) =>
      `Murs, plafonds, boiseries, cages d'escalier : en intérieur, nous vous conseillons sur les teintes et les finitions (mate, satinée, lessivable) selon chaque pièce. À ${c.nom}, nous protégeons sols et mobilier, et nous rangeons le chantier chaque soir.`,
    (c) =>
      `Volets, portails, clôtures et boiseries extérieures : une peinture extérieure adaptée prolonge la vie de vos ouvrages. Nous préparons soigneusement chaque surface avant application, pour un rendu régulier qui résiste aux intempéries ${deShort(c)}.`,
  ],
  highlights: [
    () => `Préparation soignée des supports (enduit, ponçage, sous-couche)`,
    () => `Ravalement et peinture de façade respirante`,
    () => `Conseils teintes et finitions pièce par pièce`,
    () => `Protection complète des sols et du mobilier`,
    () => `Chantier propre, rangé chaque soir`,
  ],
  faq: [
    (c) => ({
      q: `Combien de temps pour repeindre une pièce à ${c.nom} ?`,
      a: `Pour une pièce courante, comptez en général de un à deux jours selon l'état des murs, le nombre de couches et les finitions. Nous vous donnons un planning précis dans le devis établi à ${c.nom}.`,
    }),
    (c) => ({
      q: `Faut-il une autorisation pour ravaler ma façade à ${c.nom} ?`,
      a: `Un ravalement de façade nécessite le plus souvent une déclaration préalable de travaux en mairie de ${c.nom}, surtout si la couleur change. Nous vous orientons sur la démarche avant de commencer le chantier.`,
    }),
    (c) => ({
      q: `Quelle peinture pour une pièce humide à ${c.nom} ?`,
      a: `Pour une salle de bain ou une cuisine, nous utilisons des peintures adaptées aux pièces humides (résistantes à la condensation et lessivables). Nous traitons aussi les éventuelles traces d'humidité avant application.`,
    }),
    (c) => ({
      q: `Travaillez-vous l'intérieur comme l'extérieur à ${c.nom} ?`,
      a: `Oui : peinture intérieure (murs, plafonds, boiseries) comme extérieure (façades, volets, clôtures). Un seul interlocuteur pour l'ensemble de vos travaux de peinture à ${c.nom}.`,
    }),
  ],
};

/* ============================================================
   AMÉNAGEMENT EXTÉRIEUR
   ============================================================ */
const amenagement: Playbook = {
  expertiseTitle: (c) => `Terrasse, piscine et aménagement extérieur à ${c.nom}`,
  expertise: [
    (c) =>
      `À ${c.nom}, une terrasse réussie commence sous la surface : préparation du sol, drainage, structure stable. Bois, composite ou carrelage sur plots — nous choisissons avec vous le revêtement adapté à votre usage et à votre terrain, pour un espace durable où il fait bon vivre dehors.`,
    (c) =>
      `De l'étude du terrain à la mise en eau, nous prenons en charge votre projet de piscine et le terrassement à ${c.nom} : implantation, décaissement, évacuation des terres, dalle et abords. Un chantier coordonné, du gros œuvre aux finitions, avec un seul interlocuteur.`,
    (c) =>
      `Clôtures, portails, brise-vue, allées et accès : nous structurons et sécurisons votre extérieur à ${c.nom} avec des matériaux résistants aux intempéries ${deShort(c)}. Engazonnement, plantations et éclairage extérieur viennent ensuite habiller l'ensemble.`,
    (c) =>
      `Aménager dehors, c'est souvent plusieurs métiers à la fois : terrassement, maçonnerie paysagère, menuiserie extérieure, finitions. Nous coordonnons tout pour vous, ce qui vous évite de jongler entre plusieurs entreprises autour de ${c.nom}.`,
  ],
  highlights: [
    () => `Terrasse bois, composite ou carrelage sur plots`,
    () => `Terrassement et préparation de terrain`,
    () => `Création et abords de piscine`,
    () => `Clôtures, portails, brise-vue et allées`,
    () => `Un seul interlocuteur, du terrassement aux finitions`,
  ],
  faq: [
    (c) => ({
      q: `Faut-il une autorisation pour une terrasse ou une piscine à ${c.nom} ?`,
      a: `Cela dépend de la surface et de la hauteur. Une déclaration préalable, voire un permis, peut être nécessaire en mairie de ${c.nom}. Nous vous indiquons la démarche adaptée à votre projet avant de lancer les travaux.`,
    }),
    (c) => ({
      q: `Quelle terrasse résiste le mieux au climat ${deShort(c)} ?`,
      a: `Le composite et le carrelage demandent peu d'entretien et supportent bien l'humidité ; le bois apporte un cachet naturel mais demande un entretien régulier. Nous vous conseillons selon l'exposition de votre extérieur à ${c.nom}.`,
    }),
    (c) => ({
      q: `Gérez-vous le terrassement complet à ${c.nom} ?`,
      a: `Oui, du décaissement à l'évacuation des terres et à la préparation des fondations. Nous coordonnons l'ensemble du chantier extérieur à ${c.nom}, terrassement compris.`,
    }),
    (c) => ({
      q: `Posez-vous des clôtures et portails à ${c.nom} ?`,
      a: `Oui : clôtures, portails, brise-vue et allées. Nous sécurisons et délimitons votre terrain à ${c.nom} avec des matériaux choisis pour durer face aux intempéries.`,
    }),
  ],
};

/* ============================================================
   NETTOYAGE (toiture, façade, terrasse)
   ============================================================ */
const nettoyage: Playbook = {
  expertiseTitle: (c) => `Nettoyage et démoussage de toiture, façade et terrasse à ${c.nom}`,
  expertise: [
    (c) =>
      `Sur les toitures ${deShort(c)}, mousses et lichens retiennent l'humidité, soulèvent les tuiles et accélèrent leur vieillissement. À ${c.nom}, nous procédons à un démoussage maîtrisé, puis au traitement adapté, pour protéger votre couverture et éviter des réparations coûteuses plus tard.`,
    (c) =>
      `Après le nettoyage, un traitement hydrofuge protège durablement votre toiture à ${c.nom} : il limite la reprise des mousses et améliore l'écoulement de l'eau. Nous adaptons le produit au type de tuiles et à leur exposition.`,
    (c) =>
      `Façades, bardages, terrasses et murets retrouvent leur éclat avec un nettoyage adapté. À ${c.nom}, nous privilégions la basse pression et des produits adaptés au support, pour décrasser sans abîmer ni les joints ni les matériaux.`,
    (c) =>
      `Travailler en hauteur ne s'improvise pas. À ${c.nom}, nous intervenons avec le matériel adapté et des méthodes maîtrisées, en protégeant vos abords (plantations, mobilier), pour un résultat net et un habitat protégé dans la durée.`,
  ],
  highlights: [
    () => `Démoussage de toiture + traitement hydrofuge`,
    () => `Nettoyage façade, bardage et murets`,
    () => `Dégrisage et nettoyage de terrasse`,
    () => `Basse pression : on décrasse sans abîmer les supports`,
    () => `Abords protégés, habitat préservé dans la durée`,
  ],
  faq: [
    (c) => ({
      q: `À quelle fréquence démousser ma toiture à ${c.nom} ?`,
      a: `Selon l'exposition (nord, arbres à proximité, humidité), un démoussage tous les 3 à 5 ans suffit généralement. Un traitement hydrofuge appliqué après nettoyage espace nettement les interventions.`,
    }),
    (c) => ({
      q: `Le nettoyage abîme-t-il les tuiles à ${c.nom} ?`,
      a: `Non, à condition d'adapter la méthode. Nous privilégions la basse pression et des produits adaptés, plutôt qu'un nettoyage agressif qui pourrait fragiliser les tuiles ou les joints de façade.`,
    }),
    (c) => ({
      q: `Traitez-vous aussi les façades et terrasses à ${c.nom} ?`,
      a: `Oui : façades, bardages, murets et terrasses. Nous redonnons de l'éclat à vos surfaces extérieures à ${c.nom} avec un nettoyage adapté à chaque matériau.`,
    }),
    (c) => ({
      q: `Pourquoi appliquer un traitement hydrofuge après le nettoyage ?`,
      a: `L'hydrofuge protège la toiture en limitant la pénétration de l'eau et la reprise des mousses. C'est ce qui prolonge l'effet du nettoyage et protège durablement votre couverture à ${c.nom}.`,
    }),
  ],
};

/* ============================================================
   CLIMATISATION — pompe à chaleur air-air, marque AIRTON
   Faits vérifiés (recherche sourcée) :
   ✅ Airton = marque française (siège Nice, groupe MIH), conçue en France,
      techno ReadyClim brevetée, fluide R32, mono/multisplit, WiFi, jusqu'à A+++.
   ⛔ NE PAS écrire « fabriqué en France » (fabrication historiquement chinoise ;
      usine de Roanne = projet 2023 non confirmé ; aucun label officiel).
   ⚠️ La mise en service d'un fluide R32 relève d'un professionnel attesté
      (attestation de capacité, Cat. I) — fait réglementaire, présenté sobrement.
   Air/air UNIQUEMENT. Pas de chiffres SEER/SCOP/dB inventés.
   ============================================================ */
const climatisation: Playbook = {
  expertiseTitle: (c) => `Climatisation réversible Airton à ${c.nom} : confort été comme hiver`,
  expertise: [
    (c) =>
      `À ${c.nom}, nous installons la climatisation réversible Airton, marque française spécialiste de la pompe à chaleur air-air. Une clim réversible rafraîchit l'été et chauffe en demi-saison comme en hiver : un seul équipement pour un confort maîtrisé toute l'année, avec une consommation bien inférieure à celle d'un convecteur électrique.`,
    (c) =>
      `Les climatiseurs Airton utilisent le fluide R32 et la technologie ReadyClim : une liaison frigorifique pré-chargée et hermétiquement scellée, qui fiabilise l'installation. Selon votre logement à ${c.nom}, nous posons un modèle monosplit (une pièce) ou multisplit — jusqu'à quatre unités intérieures reliées à un seul groupe extérieur.`,
    (c) =>
      `Une climatisation efficace est d'abord une climatisation bien dimensionnée. Nous étudions vos pièces à ${c.nom} — surface, exposition, isolation — pour choisir la puissance juste, puis nous posons les unités avec soin : emplacement réfléchi, liaisons propres, évacuation des condensats maîtrisée.`,
    (c) =>
      `Après la pose, nous réalisons la mise en service et les réglages. De nombreux modèles Airton sont connectés (pilotage WiFi depuis votre smartphone) et atteignent une excellente classe énergétique — jusqu'à A+++ selon la référence — pour un confort piloté au degré près à ${c.nom}.`,
    (c) =>
      `Conçue en France, la gamme Airton couvre aussi bien le monosplit pour une chambre que le multisplit pour toute la maison, et même des modèles monobloc sans unité extérieure. À ${c.nom}, nous vous orientons vers la solution la plus adaptée à votre habitat et à votre budget.`,
  ],
  highlights: [
    () => `Climatisation réversible Airton, marque française`,
    () => `Pompe à chaleur air-air : rafraîchit et chauffe`,
    () => `Fluide R32 + technologie ReadyClim (liaison pré-chargée)`,
    () => `Monosplit ou multisplit (jusqu'à 4 pièces)`,
    () => `Modèles connectés WiFi, jusqu'à A+++ selon le modèle`,
    () => `Dimensionnement sur mesure, pose soignée et mise en service`,
  ],
  faq: [
    (c) => ({
      q: `Pourquoi choisir la climatisation Airton à ${c.nom} ?`,
      a: `Airton est une marque française spécialiste de la pompe à chaleur air-air. Ses climatiseurs réversibles (fluide R32, technologie ReadyClim, modèles connectés WiFi jusqu'à A+++ selon la référence) offrent un très bon rapport qualité-prix. Nous vous conseillons le modèle adapté à votre logement à ${c.nom}, puis nous l'installons.`,
    }),
    (c) => ({
      q: `Une climatisation réversible chauffe-t-elle vraiment en hiver à ${c.nom} ?`,
      a: `Oui. Une pompe à chaleur air-air restitue plusieurs fois l'énergie qu'elle consomme : elle chauffe efficacement en demi-saison et en hiver, et rafraîchit l'été. C'est souvent un excellent complément, voire une alternative, au chauffage électrique classique à ${c.nom}.`,
    }),
    (c) => ({
      q: `Quelle puissance de climatisation pour ma pièce à ${c.nom} ?`,
      a: `Cela dépend de la surface, de l'exposition et de l'isolation. C'est pourquoi nous nous déplaçons à ${c.nom} pour dimensionner précisément votre installation : une clim sous-dimensionnée peine, une clim surdimensionnée consomme inutilement.`,
    }),
    (c) => ({
      q: `Faut-il un professionnel pour installer une clim au fluide R32 à ${c.nom} ?`,
      a: `Oui. La mise en service d'un climatiseur contenant un fluide frigorigène comme le R32 doit être confiée à un professionnel : c'est une obligation réglementaire. Nous prenons en charge la pose et la mise en service de votre climatiseur Airton à ${c.nom}.`,
    }),
    (c) => ({
      q: `Peut-on climatiser plusieurs pièces à ${c.nom} avec un seul appareil ?`,
      a: `Oui, avec un système multisplit Airton : un seul groupe extérieur alimente plusieurs unités intérieures (jusqu'à quatre). Idéal pour climatiser séjour et chambres à ${c.nom} sans multiplier les groupes extérieurs sur la façade.`,
    }),
    (c) => ({
      q: `La climatisation Airton est-elle économique à l'usage à ${c.nom} ?`,
      a: `Les modèles réversibles Airton atteignent jusqu'à la classe A+++ selon les références et se pilotent à distance via WiFi, ce qui aide à maîtriser la consommation. Le rendement réel dépend du modèle, du dimensionnement et de l'usage : nous vous orientons vers la solution la plus pertinente pour votre logement à ${c.nom}.`,
    }),
  ],
  hubExpertise: [
    `Artisans de France installe la climatisation réversible Airton, marque française spécialiste de la pompe à chaleur air-air, sur la Vienne (86), les Deux-Sèvres (79), le Maine-et-Loire (49) et la Vendée (85). Une clim réversible rafraîchit l'été et chauffe en demi-saison comme en hiver : un seul équipement, un confort toute l'année et des consommations maîtrisées.`,
    `Conçus en France, les climatiseurs Airton reposent sur le fluide R32 et la technologie ReadyClim — une liaison pré-chargée et hermétiquement scellée. Monosplit pour une pièce, multisplit jusqu'à quatre unités, modèles connectés WiFi atteignant jusqu'à la classe A+++ selon la référence : nous dimensionnons puis posons la solution adaptée à votre logement.`,
    `La mise en service d'un climatiseur au fluide R32 doit être confiée à un professionnel. Nous prenons en charge l'installation comme la mise en service de votre climatisation Airton — du conseil sur le bon modèle au réglage final, avec un seul interlocuteur.`,
  ],
};

/** Forme courte « de la Vienne » → « de la Vienne » (déjà fournie par deDept). */
function deShort(c: LocalCtx): string {
  return c.deDept; // ex. « de la Vienne », « des Deux-Sèvres »
}

export const PLAYBOOKS: Record<string, Playbook> = {
  plomberie,
  electricite,
  climatisation,
  peinture,
  "amenagement-exterieur": amenagement,
  nettoyage,
};
