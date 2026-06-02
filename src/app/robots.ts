import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content";

/**
 * robots.txt — autorise l'indexation classique ET les crawlers IA
 * (visibilité AI Overviews / ChatGPT / Perplexity / Gemini), bloque l'API.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      {
        // Crawlers IA explicitement bienvenus (citations & grounding)
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "anthropic-ai",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
          "Applebot-Extended",
          "Bingbot",
          "Amazonbot",
        ],
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
