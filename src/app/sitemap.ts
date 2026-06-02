import type { MetadataRoute } from "next";
import { SERVICES, SITE } from "@/lib/content";
import { DEPTS, ssgCommunes, isPriorityCommune } from "@/lib/communes";

/**
 * Sitemap : accueil + zone + hubs départements + hubs services + pages
 * service×commune prébâties (ssgCommunes). La VENDÉE (85) est couverte à 100 %
 * (priorité 0.8, crawl hebdomadaire) ; les autres départements = Tier 1.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const urls: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/zone`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/mentions-legales`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE.url}/politique-de-confidentialite`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
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
      const isVendee = c.dept === "85";
      urls.push({
        url: `${SITE.url}/${s.slug}/${c.slug}`,
        lastModified: now,
        changeFrequency: isVendee ? "weekly" : "monthly",
        priority: isVendee ? 0.8 : isPriorityCommune(c.slug) ? 0.7 : 0.6,
      });
    }
  }

  return urls;
}
