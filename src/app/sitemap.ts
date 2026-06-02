import type { MetadataRoute } from "next";
import { SERVICES, SITE } from "@/lib/content";
import { DEPTS, ssgCommunes, isPriorityCommune } from "@/lib/communes";

/**
 * Sitemap : accueil + zone + hubs départements + hubs services + pages
 * service×commune du Tier 1. Les communes hors Tier 1 (ISR) seront ajoutées
 * lors de l'extension de contenu (étape 7 de la mission).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const urls: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/zone`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  for (const d of DEPTS) {
    urls.push({
      url: `${SITE.url}/zone/${d.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const s of SERVICES) {
    urls.push({
      url: `${SITE.url}/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  const communes = ssgCommunes();
  for (const s of SERVICES) {
    for (const c of communes) {
      urls.push({
        url: `${SITE.url}/${s.slug}/${c.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: isPriorityCommune(c.slug) ? 0.7 : 0.6,
      });
    }
  }

  return urls;
}
