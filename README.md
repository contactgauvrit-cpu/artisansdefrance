# Artisans de France — site Next.js

Site vitrine + dispositif SEO local d'**Artisans de France**, entreprise multiservice du
bâtiment (Vienne 86, Deux-Sèvres 79, Maine-et-Loire 49, Vendée 85).

Cette base implémente **fidèlement la page d'accueil** issue de la maquette Claude Design,
dans la stack cible, et pose les fondations pour les pages programmatiques service × commune.

## Stack

- **Next.js 16** (App Router) · **TypeScript** · **Tailwind v4**
- Rendu **SSG** (page d'accueil prérendue, 100 % crawlable sans JS)
- Polices auto-hébergées via `next/font` (Fraunces, Inter, JetBrains Mono, Great Vibes)
- Images via `next/image` (AVIF/WebP)

## Démarrer

```bash
npm run dev      # http://localhost:3000
npm run build    # build de production
npm start        # sert le build
```

## Structure

```
src/
  app/
    layout.tsx                      # polices, métadonnées SEO, OpenGraph, JSON-LD LocalBusiness
    page.tsx                        # page d'accueil
    globals.css                     # design system porté (cuivre brossé, scroll FX, pages prog.)
    opengraph-image.tsx             # image de partage générée en code
    [service]/page.tsx              # hub service (ex. /plomberie)
    [service]/[commune]/page.tsx    # page SEO service × commune (ex. /plomberie/poitiers)
    zone/page.tsx                   # zone d'intervention globale
    zone/[departement]/page.tsx     # hub département (ex. /zone/vienne-86)
    api/lead/route.ts               # réception des devis (prêt pour Supabase — voir TODO)
    sitemap.ts                      # accueil + hubs + Tier 1 service×commune
    robots.ts
  components/                       # Header, Hero, Services, …, Breadcrumb, LocalCTA, ServiceTiles
  lib/
    content.ts                      # SITE (NAP), SERVICES, WHY, GALLERY, STEPS, REVIEWS
    communes.generated.ts           # 946 communes (INSEE) — auto-généré
    communes.ts                     # tiers, voisins (haversine), formes grammaticales dépt.
    services-meta.ts                # métier, prestations, mots-clés, bénéfices par service
    page-content.ts                 # moteur de contenu unique service×commune (anti-doorway)
    icons.tsx · schema.ts · anim.ts
public/assets/         # logos coq (cuivre/cream/blanc/anthracite), favicon, photos/ (placeholders)
design-reference/      # bundle de design original (ignoré par git)
```

Pour régénérer les communes : `node /tmp/gen-communes.mjs` (script de génération INSEE).

## ⚠️ À remplacer avant mise en ligne

Tout est centralisé dans **`src/lib/content.ts`** (objet `SITE`) :

| Donnée | Valeur actuelle (placeholder) |
|---|---|
| Téléphone | `05 49 00 00 00` / `+33549000000` |
| E-mail | `contact@artisansdefrance86.fr` |
| SIREN | `000 000 000` |
| Domaine | `https://www.artisansdefrance86.fr` |
| Photos | placeholders (`ImageSlot`) — hero + galerie avant/après |
| Réseaux sociaux | liens `#` dans le footer |

## SEO déjà en place

- `<title>` / meta description uniques, OpenGraph + Twitter cards, canonical, theme-color
- JSON-LD **LocalBusiness** (areaServed 86/79/49/85, offres = 8 services)
- `sitemap.xml` + `robots.txt`
- H1 unique, hiérarchie H2/H3, contenu 100 % SSR (vérifié sans JS)

## État d'avancement

**✅ Livré**
- Page d'accueil fidèle à la maquette (cuivre brossé, effets de scroll, responsive).
- Image OpenGraph de partage (générée en code, sans dépendance externe).
- **Pages programmatiques** : `/[service]`, `/[service]/[commune]`, `/zone`, `/zone/[departement]`.
  384 pages service×commune (Tier 1 = top 12/dépt) + 8 hubs services + 4 hubs départements,
  contenu unique fact-driven (anti-doorway), maillage interne dense, breadcrumb,
  JSON-LD (Service, FAQPage, BreadcrumbList), SSG + ISR (revalidate 1 j).
- **Données communes** : 946 communes des 4 départements via INSEE `geo.api.gouv.fr`.

**⏳ Reste à faire (mission complète)**
1. **Enrichir le contenu** des pages prioritaires via l'API Claude — le moteur actuel produit du
   contenu unique mais générique ; l'API permettra des pages plus riches et singulières
   (garde-fou anti-duplication).
2. **Étendre** aux communes Tier 2/3 (ISR déjà prêt ; les ajouter au sitemap au fil de l'eau).
3. **Supabase** : table `leads` + modèle communes×services×contenus (TODO dans `api/lead/route.ts`).
4. **Indexation** : Search Console + Google Indexing API ; **cron Vercel** (sitemap, blog).
5. **Déploiement Vercel** (ISR) + connexion du domaine.
6. **Blog SEO** (requêtes informationnelles & aides : RGE, MaPrimeRénov'…).
7. **Visuels photo** : hero + réalisations (API d'image à débloquer, ou photos client).

### Outils disponibles dans l'environnement (ÉTAPE 0)

- Génération d'images : MCP **nanobanana** (visuels réalisations / hero / OG).
- Données entreprise / SIREN : MCP données légales FR (substitut **Pappers**).
- Déploiement : MCP **Vercel** + skills `vercel:*`.
- SEO : skills `keyword-research`, `serp-analysis`, `seo-*` (données SERP live = extension DataForSEO).
- **Manquant** : MCP Supabase (à brancher via SDK/CLI avec les clés du projet).
