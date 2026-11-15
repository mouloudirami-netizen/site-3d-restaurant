# Thaisty Crousty — site vitrine

Maquette de présentation : React 19 + Vite, GSAP/ScrollTrigger + Lenis (défilement), Motion (interface), React Three Fiber (3D).

```bash
npm install
npm run dev       # développement
npm run build     # production (dist/)
npm run preview   # sert la version de production
```

- Données : `src/data/` (menu, desserts, restaurants). Les prix sont à `null` : la case reste vide sur le site.
- Commande : le bouton « Commander » ouvre la liste des restaurants avec un lien `tel:` (appel direct).
- Niveaux de rendu : `?tier=full|lite|static` pour tester.
- Voir `docs/storyboard.md` et `docs/assets.md`.
