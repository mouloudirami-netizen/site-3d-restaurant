# Helena Restaurant & Café — site vitrine

Site une page, premium et cinématographique, pour **Helena Restaurant & Café** (Val d'Hydra, Alger) :
film d'ambiance, univers, formules brunch, carte interactive complète (160 références), galerie,
informations pratiques, réseaux sociaux, et bouton d'appel toujours accessible.

**Stack** : Vite + React 19 + TypeScript · GSAP/ScrollTrigger (animations) · Lenis (défilement fluide) ·
Three.js (pétales 3D, chargés à la demande) · CSS Modules · polices auto-hébergées (@fontsource).

---

## Lancer le site

Prérequis : Node.js 20.19 ou plus récent.

```bash
npm install          # installer les dépendances (une seule fois)
npm run dev          # développement : http://localhost:5173 (rechargement automatique)
npm run build        # version de production dans dist/
npm run preview      # tester la version de production : http://localhost:4173
npm run preview -- --host   # idem, accessible depuis un téléphone du même Wi-Fi
```

## Vérifier

```bash
npm run typecheck    # vérification TypeScript
npm run build        # doit se terminer par « ✓ built », sans erreur ni alerte
```

Tests manuels sur téléphone : `TEST_MOBILE.md`.

## Version en ligne (GitHub Pages)

**https://mouloudirami-netizen.github.io/site-3d-restaurant/helena/**

La branche `gh-pages` de ce dépôt héberge deux sites : **Thaisty Crousty à la racine** (ne pas toucher)
et **Helena dans le dossier `helena/`**. Pour publier une mise à jour de Helena :

```bash
npx vite build --base=./ --outDir /tmp/helena-build --emptyOutDir
git worktree add /tmp/ghp gh-pages
rm -rf /tmp/ghp/helena && mkdir /tmp/ghp/helena && cp -r /tmp/helena-build/. /tmp/ghp/helena/
cd /tmp/ghp && git add helena && git commit -m "Mise à jour du site Helena" && git push origin gh-pages
cd - && git worktree remove /tmp/ghp
```

GitHub redéploie automatiquement en 1 à 2 minutes (onglet « Actions » du dépôt).
Ne jamais supprimer ou écraser les fichiers à la racine de `gh-pages` (site Thaisty Crousty).

## Mettre en ligne sur un autre hébergeur

`npm run build` produit un site **100 % statique** dans `dist/` (environ 9 Mo, dont 6,6 Mo de médias) :
il peut être hébergé tel quel sur n'importe quel hébergeur statique (Netlify, Vercel, Cloudflare Pages,
OVH, serveur Apache/Nginx…). Avant la mise en ligne, voir la section « Référencement » de
`CONTENT_CHECKLIST.md` (URL absolues, canonical, sitemap).

---

## Structure du projet

```
index.html                 Page HTML : titre, meta, Open Graph, données structurées, écran d'attente
src/
  data/                    ← CONTENU (à modifier sans toucher au design)
    menu.ts                  la carte complète (produits, prix, descriptions, suppléments)
    restaurant.ts            adresse, localité, téléphone, horaires, réseaux, lien Google Maps
    gallery.ts               photos de la galerie et visuels d'ambiance
    navigation.ts            liens du menu de navigation
  components/              ← SECTIONS ET COMPOSANTS (chacun avec son .module.css)
    Hero                     film d'ambiance → fondu vers la vraie salle, titre animé
    Univers                  présentation éditoriale et « moments »
    Brunch                   les 4 formules et suppléments
    Carte                    familles, onglets, recherche, rubriques
    Gallery                  vraies photos + inspirations d'ambiance (signalées)
    Infos / Social / Footer  adresse, horaires, téléphone, réseaux, pied de page
    Nav, CallButton, Cursor  navigation, bouton d'appel permanent, curseur (ordinateur)
    PetalField               calque de pétales 3D (charge three/PetalScene.ts)
    Button, Icon, Logo, Picture, Ornament, SectionHeading, MenuItemRow, MenuSectionBlock
  three/PetalScene.ts      scène Three.js (pétales instanciés)
  hooks/                   défilement fluide, révélations au défilement, mouvement réduit…
  lib/                     configuration GSAP, format des prix
  styles/tokens.css        ← COULEURS, TYPOGRAPHIES, ESPACEMENTS (charte graphique)
  styles/base.css          styles de base
public/
  media/                   images optimisées (AVIF + WebP, 640 et 1280 px) et vidéos
  og-image.jpg             image de partage (WhatsApp, Facebook…)
  favicon-temp*, apple-touch-icon-temp.png   icônes TEMPORAIRES (logo basse définition)
media-source/              médias d'origine (photos réelles, visuels d'ambiance, menu, logo)
scripts/optimize-media.sh  régénère public/media depuis media-source (npm run media)
```

## Documentation

| Fichier | Contenu |
|---|---|
| `MAINTENANCE.md` | Guide de mise à jour : carte, prix, horaires, photos, couleurs |
| `CONTENT_CHECKLIST.md` | Éléments confirmés et éléments encore à confirmer |
| `MENU_VERIFICATION.md` | Contrôle de la carte : prix manquants, ambiguïtés, corrections |
| `PRESENTATION_CHECKLIST.md` | Checklist avant la présentation au client |
| `TEST_MOBILE.md` | Fiche de test sur téléphone |

---

## Qualité (mesures du 27/10/2026, build de production local)

- Lighthouse mobile : performance 79 à 91 selon les passages, accessibilité 100, bonnes pratiques 100, SEO 100.
- Lighthouse ordinateur : performance 99, accessibilité 100, bonnes pratiques 100, SEO 100.
- axe-core (WCAG 2.2 AA) : 0 violation (ordinateur, mobile, menu ouvert).
- Contraste du texte du hero mesuré sur les images les plus claires : ≥ 5,2:1.
- Aucune barre de défilement horizontale de 320 px à 1920 px.
- Connexion très lente (Slow 3G) : image et bouton « Appeler » visibles dès ~1,5 s, jamais d'écran noir.

Choix de performance : écran d'attente statique (image + bouton d'appel) avant le JavaScript ;
pétales 3D chargés en différé, mis en pause hors écran, désactivés sans accélération graphique ou en
« mouvement réduit » ; repli photo si le film ne démarre pas (son téléchargement est alors interrompu).

## Limites connues

- **Fluidité sur vrai téléphone non mesurée** : l'environnement de test n'a pas de carte graphique (voir `TEST_MOBILE.md`).
- **Logo et icônes temporaires** : seul un JPG 554×554 du logo est disponible.
- **Photo de fin du hero** légèrement agrandie sur grand écran (photo source de 1170 px de large).
- **Lien Google Maps** intégré tel que fourni, sans vérification possible depuis l'environnement de développement.
- **Site rendu côté navigateur** (React) : le contenu essentiel (nom, adresse, horaires, téléphone) est aussi présent
  dans le HTML (données structurées et `<noscript>`) pour les moteurs de recherche.
- Le fichier Three.js (~140 Ko compressé) est volumineux mais chargé uniquement après l'affichage de la page.
