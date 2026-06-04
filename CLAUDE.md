# CLAUDE.md — Artisans de France

Ce fichier est lu automatiquement par Claude Code à chaque session. Il contient tout le contexte pour travailler sur ce projet. À mettre à jour au fil des sprints.

Voir aussi **`brand.md`** (identité visuelle & ton) — à respecter pour tout ce qui touche au design/contenu.

---

## 0. Règles de travail Claude — PRIORITÉ ABSOLUE

Les 4 règles ci-dessous (Boris Cherny, créateur de Claude Code) s'appliquent à TOUTES les sessions, sans exception, et passent avant toute autre instruction.

### Règle 1 — Mode plan d'abord
Écrire le plan AVANT toute ligne de code (fichiers concernés, étapes ordonnées, vérification finale, risques). Si la session dérape : STOP, refaire le plan. Soumettre un plan (ExitPlanMode) pour tout changement d'architecture, ajout de table Supabase, modification de routing/URLs, ou nouveau sprint.

### Règle 2 — Sous-agents pour le complexe
Tâche complexe = un sous-agent dédié (outil Agent : Explore, Plan, general-purpose). Garder le contexte principal léger et focus sur la décision. Bons cas ici : exploration des routes/templates avant refactor, recherche de tous les usages d'un composant, audit SEO concurrentiel, vérification d'une migration Supabase.

### Règle 3 — Boucle d'auto-amélioration
Chaque erreur → une règle écrite immédiatement dans « 0 bis. Leçons apprises ». Relire cette section avant tout nouveau sprint. Objectif : −80 % d'erreurs sur le même sujet.

### Règle 4 — Prouve que ça marche
Jamais de « done » sans preuve concrète. Selon le type de tâche :
- **Code TS/React** : `npm run build` qui passe (405+ pages générées). Si erreurs `.next/types/` : `rm -rf .next && npm run build`.
- **Déploiement** : `git push origin main` → Vercel redéploie tout seul (projet git-connecté). **Vérifier la PROD au `curl` sur le STATUS HTTP** (`-w "%{http_code}"`), pas seulement le contenu — un 404/401/308 est invisible si on ne lit que le body. Poll `/api/health` pour confirmer la prise en compte des variables d'env.
- **SEO/UI** : vérification visuelle (preview/capture) + `curl` des balises clés (canonical, JSON-LD, H1).
- **E-mail (Brevo)** : envoi de test via `POST /api/lead` vers une donnée repérable, puis confirmer la réception sur `contact.gauvrit@gmail.com` (et les spams).
- **Supabase** : insertion de test (REST → 201) ou `/api/health` (`"supabase":true`). La lecture des leads se fait dans le dashboard (RLS = écriture seule pour `anon`).
- **Commits / Push** : `git log --oneline -3` + confirmation du push vers `origin/main`.

⚠️ **Vercel — NE JAMAIS déployer en CLI depuis cette machine.** Le CLI local est connecté au **mauvais compte** (`workwave`). Le déploiement se fait **uniquement par `git push origin main`** (le projet `artisansdefrance-ln42` du compte `contactgauvrit-cpu` est git-connecté). Toujours `vercel whoami` avant toute opération CLI Vercel, et préférer git.

---

## 0 bis. Leçons apprises (enrichir à chaque erreur — Règle 3)

Section vivante. Relire avant chaque sprint.

- **04/06/2026 — Numérotation `count(*)+1` casse après suppression → `duplicate key`** : dans l'admin (`/api/admin/documents` + conversion devis→facture), le n° `DEV/FAC-AAAA-NNNN` était dérivé du **nombre** de docs existants +1. Après suppression d'un doc au milieu, `count+1` retombe sur un numéro déjà pris → `duplicate key value violates unique constraint "documents_numero_key"` au « Créer le devis ». **Règle** : pour toute séquence à contrainte d'unicité, numéroter à partir du **MAX existant +1** (`order("numero", {ascending:false}).limit(1)` + `parseSeq`), jamais du `count`.
- **02/06/2026 — `>>` (décalage signé) donne un index négatif → `arr[neg] === undefined`** : dans `lib/page-content.ts`, `pick(POOL, seed >> 3)` renvoyait `undefined` pour les seeds ≥ 2³¹ (le décalage signé produit un négatif, et `arr[-1]` = undefined), d'où `TypeError: pick(...) is not a function` au build/SSG de TOUTES les pages service×commune. **Règle** : tout index dérivé d'un hash/seed doit être borné positif : `arr[((n % len) + len) % len]`. Jamais `arr[n % len]` quand `n` peut être négatif.
- **02/06/2026 — Projet Vercel sans framework = servi en STATIQUE → 404 sur les routes app** : un projet créé via `vercel project add` (ou import mal détecté) a `framework: null` → Vercel ne lance pas le runtime Next, sert seulement `public/` (donc `/llms.txt` = 200 mais `/`, `/plomberie/poitiers` = **404**). **Le `npm run build` local passe** ; seul le déploiement 404. **Fix** : committer **`vercel.json` `{"framework":"nextjs"}`** (présent à la racine) — ne pas le supprimer. Diagnostiquer au `curl` sur le STATUS, pas le contenu.
- **02/06/2026 — Vercel « Deployment Protection » (ssoProtection) bloque Google (401)** : un site protégé renvoie 401/SSO → invisible pour les crawlers = **mort SEO**. Un site vitrine/SEO doit être **public**. Vérifier que la protection est désactivée (ou que le domaine custom en est exempté). Symptôme : l'URL `*.vercel.app` répond 401, le domaine custom répond normalement.
- **02/06/2026 — Grammaire des départements** : ne JAMAIS écrire « du Vienne » / « dans le Vienne ». Utiliser les formes par département centralisées dans `lib/communes.ts` (`DEPTS[].en/de/le`) : **en Vienne / de la Vienne / la Vienne** · **dans les Deux-Sèvres / des Deux-Sèvres / les Deux-Sèvres** · **dans le Maine-et-Loire / du Maine-et-Loire / le Maine-et-Loire** · **en Vendée / de la Vendée / la Vendée**. Attention aussi à l'élision (« à Angers », pas « de Angers »).
- **02/06/2026 — `create-next-app` laisse `src/app/favicon.ico`** qui OVERRIDE `metadata.icons` ET `app/icon.png`. Pour un favicon custom : supprimer `favicon.ico` + ajouter `app/icon.png` (+ `app/apple-icon.png`). Le favicon est mis en cache fort par les navigateurs → hard refresh pour vérifier.
- **02/06/2026 — Les variables d'env Vercel ne s'appliquent qu'aux NOUVEAUX déploiements** : après ajout dans le dashboard, il faut **redéployer** (un `git push`, même commit vide, suffit). Vérifier ensuite via `/api/health` (booléens, aucun secret exposé).
- **02/06/2026 — Centraliser le NAP / la config** : tout (téléphone, e-mail, URL, SIREN) vit dans `SITE` (`lib/content.ts`). MAIS `public/llms.txt` contient des copies **en dur** → penser à le mettre à jour quand `SITE` change (idéalement le régénérer depuis `SITE`).
- **02/06/2026 — Pas de faux avis en JSON-LD** : les témoignages d'accueil sont des placeholders → NE PAS émettre de `Review`/`AggregateRating` (risque de pénalité Google). Les vrais avis se collectent via Google Business Profile.
- **02/06/2026 — Curseur custom = PNG, pas SVG** : les curseurs SVG ne sont pas fiables sous Chrome. Générer un PNG (ici via `sharp` à partir d'un glyphe/SVG) et `cursor: url(...) hotspot, auto`. Liseré blanc obligatoire pour rester visible sur fond clair ET foncé.

---

## 1. Vision du projet

Site vitrine **+ dispositif SEO local programmatique** pour **Artisans de France**, entreprise multiservice du bâtiment. Objectif : générer des **demandes de devis** et **dominer le SEO local** (« [métier] + [commune] ») sur 4 départements, avec un **contenu réel et unique par page** (zéro doorway page).

- **Zone** : Vienne (86), Deux-Sèvres (79), Maine-et-Loire (49), **Vendée (85)**. Base actuelle **Poitiers**, cap à terme **Vendée** (déménagement prévu) → garder une identité **neutre** (pas de n° de département figé dans la marque/le domaine).
- **6 services** : Plomberie, Électricité, Climatisation (air/air uniquement), Peinture intérieure & extérieure, Création & aménagement extérieur (terrasse, piscine, terrassement, clôtures…), Nettoyage (toiture, terrasse, façade). *(Artisan direct — pas de marketplace. Horaires Lun-Sam 8h-19h, pas de 24h/24.)*

## 2. Stack technique

- **Next.js 16** (App Router, Turbopack) · **TypeScript** · **Tailwind v4**
- **next/font** : Fraunces (titres), Inter (corps), JetBrains Mono (eyebrows/labels), Great Vibes (script du logo)
- **next/image** (AVIF/WebP) · rendu **SSG + ISR** (revalidate 1 j), 100 % crawlable sans JS
- **Supabase** (table `leads`) · **Brevo** (notification e-mail transactionnelle) · **Vercel** (hébergement)

## 3. Infra & déploiement (À CONNAÎTRE)

- **Domaine prod** : `https://www.artisansdefrancetravaux.fr` (apex `artisansdefrancetravaux.fr` → **308 → www** ; **canonical = www**). `SITE.url` doit rester sur `www`.
- **Repo** : `github.com/contactgauvrit-cpu/artisansdefrance` — branche **`main`**.
- **Vercel** : compte **`contactgauvrit-cpu`** (Hobby), projet **`artisansdefrance-ln42`**, **git-connecté** → `git push origin main` redéploie automatiquement. ⚠️ Voir Règle 4 : **jamais de deploy CLI** (le CLI local = compte `workwave`, à ne pas utiliser).
- **Build** : `vercel.json` force `framework: nextjs` (ne pas retirer).

## 4. Conventions de code

- `src/app/` (routes), `src/components/` (UI), `src/lib/` (données & logique). Alias `@/*` → `src/*`.
- Composants **serveur par défaut** ; `"use client"` seulement pour l'interactif (Header, formulaire, slider avant/après, ScrollFX).
- Le **design system** est porté en CSS dans `src/app/globals.css` (tokens cuivre, sections, effets de scroll, curseur). Réutiliser les classes existantes (`.btn`, `.eyebrow`, `.section`, `.scard`, `.chip`, `.prose-local`, etc.).
- ESLint : `react/no-unescaped-entities` désactivé (contenu FR avec apostrophes). Garder le build vert.

## 5. Architecture des pages (SEO programmatique)

| Route | Rôle |
|---|---|
| `/` | Accueil (fidèle à la maquette) |
| `/[service]` | Hub service (ex. `/plomberie`) — 8 pages |
| `/[service]/[commune]` | **Cœur SEO** (ex. `/plomberie/poitiers`) — Tier 1 (top 12/dépt = 48 communes) en **SSG**, le reste en **ISR** |
| `/zone` · `/zone/[departement]` | Zone globale + 4 hubs départements |
| `/api/lead` | POST devis → Supabase + e-mail Brevo |
| `/api/health` | Diagnostic env (booléens) |
| `sitemap.ts` · `robots.ts` · `opengraph-image.tsx` · `app/icon.png` | SEO technique |

`lib/` : `content.ts` (SITE + SERVICES/WHY/GALLERY/STEPS/REVIEWS/HOME_FAQ) · `communes.generated.ts` (946 communes INSEE, auto-généré) + `communes.ts` (tiers, voisins haversine, **formes grammaticales dépt**) · `services-meta.ts` (métier, prestations, mots-clés) · `page-content.ts` (**moteur de contenu unique** service×commune, anti-doorway, variation par seed) · `schema.ts` (JSON-LD) · `icons.tsx` · `anim.ts` · `supabase.ts` · `email.ts`.

Régénérer les communes : `node /tmp/gen-communes.mjs` (fetch `geo.api.gouv.fr`).

## 6. SEO / GEO — règles

- **Contenu UNIQUE par page** (intro/contexte/FAQ variés par seed + faits locaux : commune, dépt, voisins, population). **Jamais de texte filé** entre villes.
- **Maillage interne dense** : hub service ↔ communes, communes voisines, services frères, hub département, fil d'Ariane.
- **JSON-LD** : `LocalBusiness`/`Organization`/`WebSite` (site-wide, dans `layout`), `Service` + `FAQPage` + `BreadcrumbList` (pages). **Pas de faux `Review`.**
- **Technique** : `title`/meta uniques, canonical auto, `sitemap.xml`, `robots.txt` (+ crawlers IA autorisés), `llms.txt`, OpenGraph. SSG/ISR, CWV au vert.
- **Avant tout `noindex`/`Disallow`** : compter l'impact + validation explicite (cf. Workwave). En cas de doute : ne pas noindex.

## 7. Marque & design

Voir **`brand.md`**. En bref : base crème, sections anthracite, accent **cuivre brossé** (#B87333, jamais en fond), logo **coq**, **tricolore réservé au wordmark**, curseur **fleur de lis cuivre**, ton chaleureux/proximité, **jamais de codes « luxe »**.

## 8. Variables d'environnement

Définies dans **Vercel** (Production) ; `.env.local` en local (gitignoré). Toujours redéployer après modif.

| Variable | Rôle |
|---|---|
| `SUPABASE_URL` | Projet Supabase (`https://lvjwhlhzfdyunojdcpdq.supabase.co`) |
| `SUPABASE_ANON_KEY` | Clé publique anon (RLS insert-only sur `leads`) |
| `BREVO_API_KEY` | Clé API Brevo (secret) |
| `BREVO_SENDER_EMAIL` | Expéditeur sur domaine vérifié Brevo |
| `LEAD_NOTIFY_EMAIL` | Destinataire des devis (défaut `contact.gauvrit@gmail.com`) |

SQL de la table `leads` (+ RLS) : `supabase/schema.sql`.

## 9. Contacts / NAP (centralisés dans `SITE`)

- Téléphone : **07 49 98 86 95** · E-mail : `contact@artisansdefrancetravaux.fr`
- SIREN : **à renseigner** (placeholder `000 000 000`) — possibilité de récupérer les données officielles via les MCP données entreprise.

## 10. État d'avancement (02/06/2026)

**Fait** : accueil fidèle + design system, 8 hubs services, 384 pages service×commune (Tier 1) + ISR, hubs zone/départements, SEO/GEO complet, favicon coq, curseur fleur de lis cuivre, vrai numéro, formulaire → **Supabase + e-mail Brevo** (en prod), déploiement Vercel git-connecté.

**À faire** : (1) enrichir le contenu des pages prioritaires via l'API Claude ; (2) étendre aux communes Tier 2/3 (ISR prêt) ; (3) GBP + avis + SIREN réel + Search Console ; (4) blog SEO (aides : RGE, MaPrimeRénov') ; (5) rééquilibrage accueil multi-départements (Vendée en avant) ; (6) vraies photos (héros + réalisations).

## 11. Commandes utiles

```bash
npm run dev            # dev local (http://localhost:3000)
npm run build          # build prod (preuve Règle 4)
git push origin main   # déploie en prod (Vercel git-connecté)
curl -s -o /dev/null -w "%{http_code}\n" https://www.artisansdefrancetravaux.fr/   # statut
curl -s https://www.artisansdefrancetravaux.fr/api/health                          # diagnostic env
```
