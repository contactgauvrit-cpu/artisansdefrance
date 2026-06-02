# brand.md — Artisans de France

Charte de marque. Toute création visuelle ou rédactionnelle doit s'y conformer.
Référence technique : les tokens vivent dans `src/app/globals.css` (`:root`).

---

## 1. Positionnement

**Artisans de France** — entreprise multiservice du bâtiment. Baseline : **« Création • Rénovation »**.

- Cible : **particuliers et propriétaires**, région populaire — **PAS une clientèle de luxe**.
- Promesse : confiance, **savoir-faire français**, **proximité**. Du solide, du chaleureux, du bien fait.
- ❌ Jamais : or, marbre, codes « premium » tape-à-l'œil, superlatifs clinquants.
- Arguments à pousser partout (vers le devis) : **devis gratuit**, **interlocuteur unique**, **artisans locaux**, **garantie décennale**, **chantier propre & délais tenus**, **intervention rapide**.

## 2. Couleurs

| Token | Hex | Usage |
|---|---|---|
| `--copper` | **#B87333** | Accent de marque (boutons, icônes, filets, survols, chiffres). À **doser** — jamais en fond de page. |
| `--copper-deep` | #9A5C26 | Hover / texte cuivre foncé |
| `--copper-soft` | #E7D2BC | Cuivre clair |
| `--copper-wash` | #F6ECE1 | Fonds cuivrés très légers (placeholders, tuiles) |
| `--anthracite` | **#2B2B2E** | Titres, textes, **sections sombres** |
| `--gray` | #6B7280 | Texte secondaire |
| `--gray-2` | #9AA0A8 | Labels discrets |
| `--cream` | **#FAF8F5** | Fond de page (base chaleureuse) |
| `--white` | #FFFFFF | Cartes, bandeaux |
| `--bleu` / `--rouge` | #11337A / #C8102E | **Tricolore — UNIQUEMENT le wordmark du logo**, nulle part ailleurs (sinon ça fait site administratif). |

## 3. Cuivre brossé satiné (matière signature)

Le cuivre est **brossé/métallique**, recréé en **CSS** (jamais en image), pour la perf.
- Recette : reflet diagonal clair→sombre (`--copper-sheen`) + fines stries verticales (`--copper-striae`) = `--copper-metal`. Variante survol `--copper-metal-hi`, texte métallique `--copper-text`, relief `--copper-relief`.
- **Appliquer à** : boutons « Devis gratuit », fonds d'icônes services, bande CTA, filets sous les eyebrows, badges numéros (01-05, dépts), logo coq, hovers.
- **Sur grandes surfaces** : baisser de moitié l'opacité du reflet et des stries. **Jamais en fond de page.**

## 4. Logo — le coq 🐓

Le **coq gaulois** est le logo principal **et** le favicon. Symbole de la marque, recoloré selon le fond.
- `public/assets/` : `coq-metal.png` (**principal**, dégradé cuivre cuit), `coq-cream.png` (filigrane sur sections sombres / footer), `coq-white.png`, `coq-anthracite.png`, `coq-copper.png` (cuivre plat), `favicon.png` (coq blanc sur tuile cuivre — favicon via `app/icon.png`).
- **Filigrane** : coq en très basse opacité (≈5-6 %) sur la section sombre « Pourquoi nous » et le footer.

### Wordmark (lockup)
« **Artisans** » en script (Great Vibes) au-dessus de « **DE&nbsp;FR&nbsp;ANCE** » — où **DE** = anthracite, **FR** = bleu, **ANCE** = rouge (**tricolore**, réservé au wordmark). Sur mobile, le coq seul peut suffire.

## 5. Fleur de lis ⚜ (curseur)

Curseur personnalisé : **fleur de lis en cuivre métallique** (dégradé comme le coq) + **liseré blanc** (visible sur crème, anthracite et bande cuivre). `public/assets/cursor-fleur.png` (32 px, hotspot 16/2). Désactivé sur tactile ; curseur **texte** conservé sur les champs de formulaire.

## 6. Typographie

| Rôle | Police | Notes |
|---|---|---|
| Titres (H1-H3) | **Fraunces** (serif) | poids 400-600, `letter-spacing:-.02em`. **Emphases en *italique cuivre*** (`em` → `font-style:italic; color:var(--copper)`). |
| Corps / UI | **Inter** (sans-serif) | 16-17 px, lisible. |
| Eyebrows / labels | **JetBrains Mono** | UPPERCASE, `letter-spacing` large, petit, couleur cuivre ; précédé d'un filet cuivre. |
| Script du logo | **Great Vibes** | **UNIQUEMENT** le mot « Artisans » du wordmark. Jamais ailleurs. |

Chargées via `next/font` (variables `--font-serif/-sans/-mono/-script`).

## 7. Style & composition

- Épuré, aéré, beaucoup de blanc/crème ; photos chaleureuses de **vrais chantiers en lumière naturelle** ; finitions cuivre discrètes. Moderne mais accessible.
- Sections sombres anthracite pour le contraste (« Pourquoi nous »), bande CTA cuivre.
- Effets de scroll **sobres** (fondu + léger translate, apparition en escalier ~80 ms), `transform/opacity` only (zéro CLS), respect de `prefers-reduced-motion`.
- Cartes qui se soulèvent au survol avec filet cuivre brossé.

## 8. Voix & ton

- **Vouvoiement**, chaleureux, concret, rassurant, **local**. Phrases simples, zéro jargon.
- Met en avant le bénéfice client + la proximité (« près de chez vous », mention de la commune/des environs).
- **Français impeccable** — attention aux articles de départements (cf. `CLAUDE.md` : *en Vienne, dans les Deux-Sèvres, dans le Maine-et-Loire, en Vendée*).
- Toujours un **appel à l'action** vers le devis gratuit + numéro cliquable.

## 9. Do / Don't

✅ **Do** : cuivre en accent dosé · coq comme signature · tricolore réservé au wordmark · photos vraies & chaleureuses · contenu local unique · CTA devis omniprésent.

❌ **Don't** : cuivre/dégradé en fond de page · or, marbre, codes luxe · tricolore hors wordmark · faux avis · superlatifs creux · texte dupliqué entre communes · jargon technique.
