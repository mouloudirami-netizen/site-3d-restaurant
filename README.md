# Helena Restaurant & Café — site vitrine

Site une page (Vite + React + TypeScript) : hero vidéo, univers, brunch, carte interactive, galerie, informations pratiques.

## Commandes

```bash
npm install          # installer les dépendances
npm run dev          # serveur de développement
npm run typecheck    # vérification TypeScript
npm run build        # build de production (dist/)
npm run preview      # prévisualiser le build
bash scripts/optimize-media.sh   # régénérer les images AVIF/WebP depuis media-source/
```

## Où modifier le contenu

- Carte (produits, prix, descriptions) : `src/data/menu.ts` — voir `MENU_VERIFICATION.md`
- Informations pratiques (adresse, horaires, téléphone, réseaux) : `src/data/restaurant.ts`
- Couleurs, typographies, espacements : `src/styles/tokens.css`
- Éléments à confirmer : `CONTENT_CHECKLIST.md`

## Qualité (mesures du 27/10/2026, build de production local)

- Lighthouse mobile : performance 79 à 91 selon les passages, accessibilité 100, bonnes pratiques 100, SEO 100.
- Lighthouse ordinateur : performance 99, accessibilité 100, bonnes pratiques 100, SEO 100.
- axe-core (WCAG 2.2 AA) : 0 violation (ordinateur, mobile, menu ouvert).
- Contraste du texte du hero mesuré sur les images les plus claires : ≥ 5,2:1.
- Aucune barre de défilement horizontale de 320 px à 1920 px.

Choix de performance : écran d'attente statique (image + bouton d'appel) avant le JavaScript ;
pétales 3D chargés en différé, désactivés sans accélération graphique ou en « mouvement réduit » ;
repli photo si le film ne démarre pas (le téléchargement du film est alors interrompu).

Test sur téléphone : voir `TEST_MOBILE.md`.
