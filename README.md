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
