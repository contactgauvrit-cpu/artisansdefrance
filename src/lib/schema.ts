import { SERVICES, SITE } from "@/lib/content";

const DEPT_LABELS: Record<string, string> = {
  "86": "Vienne (86)",
  "79": "Deux-Sèvres (79)",
  "49": "Maine-et-Loire (49)",
  "85": "Vendée (85)",
};

/**
 * JSON-LD LocalBusiness (entreprise du bâtiment) + offres de services.
 * ⚠️ telephone / SIREN / code postal sont des placeholders à confirmer.
 */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["GeneralContractor", "HomeAndConstructionBusiness"],
    "@id": `${SITE.url}/#business`,
    name: SITE.name,
    description:
      "Entreprise multiservice du bâtiment en Vienne (86) : plomberie, électricité, climatisation air/air, peinture, aménagement extérieur (terrasse, piscine, terrassement) et nettoyage de toiture, terrasse et façade. Devis gratuit, un seul interlocuteur.",
    url: SITE.url,
    telephone: SITE.phoneHref,
    email: SITE.email,
    image: `${SITE.url}/assets/coq-metal.png`,
    logo: `${SITE.url}/assets/coq-metal.png`,
    priceRange: "€€",
    slogan: SITE.baseline,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.baseCity,
      addressRegion: SITE.region,
      postalCode: "86000",
      addressCountry: "FR",
    },
    areaServed: SITE.areaServed.map((code) => ({
      "@type": "AdministrativeArea",
      name: DEPT_LABELS[code] ?? code,
    })),
    geo: { "@type": "GeoCoordinates", latitude: 46.5802, longitude: 0.3404 },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "19:00",
      },
    ],
    makesOffer: SERVICES.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, serviceType: s.title, areaServed: "FR-86" },
    })),
    knowsAbout: SERVICES.map((s) => s.title),
    sameAs: [] as string[],
    // À activer quand le SIREN réel est connu :
    // identifier: { "@type": "PropertyValue", propertyID: "SIREN", value: SITE.siren },
  };
}

/** Organization (couche d'entité, site-wide). */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/assets/coq-metal.png`,
    image: `${SITE.url}/assets/coq-metal.png`,
    description:
      "Entreprise multiservice du bâtiment en Vienne (86) : création et rénovation par des artisans français.",
    areaServed: ["Vienne (86)", "Deux-Sèvres (79)", "Maine-et-Loire (49)", "Vendée (85)"],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE.phoneHref,
      contactType: "customer service",
      areaServed: "FR",
      availableLanguage: "French",
    },
    sameAs: [] as string[],
  };
}

/** WebSite (site-wide). */
export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    inLanguage: "fr-FR",
    publisher: { "@id": `${SITE.url}/#organization` },
  };
}

/** Service schema (page service × commune) — provider local enrichi. */
export function serviceJsonLd(opts: {
  serviceName: string;
  communeNom: string;
  region: string;
  postalCode: string;
  url: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.serviceName,
    serviceType: opts.serviceName,
    description: opts.description,
    url: opts.url,
    areaServed: { "@type": "City", name: opts.communeNom },
    provider: {
      "@type": ["GeneralContractor", "HomeAndConstructionBusiness"],
      "@id": `${SITE.url}/#business`,
      name: SITE.name,
      image: `${SITE.url}/assets/coq-metal.png`,
      telephone: SITE.phoneHref,
      priceRange: "€€",
      address: {
        "@type": "PostalAddress",
        addressLocality: opts.communeNom,
        addressRegion: opts.region,
        postalCode: opts.postalCode,
        addressCountry: "FR",
      },
    },
    offers: { "@type": "Offer", priceCurrency: "EUR", availability: "https://schema.org/InStock" },
  };
}

/** FAQPage schema. */
export function faqPageJsonLd(faq: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** BreadcrumbList schema. items = [{name, path}] (path relatif). */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE.url}${it.path}`,
    })),
  };
}

/** Sérialise un ou plusieurs objets JSON-LD pour injection dans une balise <script>. */
export function jsonLdScript(...objs: object[]): string {
  return JSON.stringify(objs.length === 1 ? objs[0] : objs);
}
