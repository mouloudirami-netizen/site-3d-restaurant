# braise — site 3D du restaurant

Page d'accueil d'un restaurant au feu de sarment (contenu d'exemple) : vidéo hero, plat signature en 3D qui se dresse au scroll, animations GSAP + Lenis.

## Lancer

```bash
npm install
npm run dev        # http://localhost:5173
npm run build && npm run preview   # build de production, http://localhost:4173
```

Paliers de qualité forçables pour tester : `?tier=full`, `?tier=lite`, `?tier=static`.

## Structure

| Dossier | Rôle |
|---|---|
| `index.html` | Tout le contenu (SEO, accessibilité) est dans le DOM |
| `src/main.ts` | Lenis, ScrollTrigger, entrées de sections, chargement différé de la 3D |
| `src/three/plate.ts` | La betterave sous la cendre, modélisée en code (Three.js) |
| `src/media/video.ts` | Lecture de la vidéo, bouton pause, repli sur le poster |
| `src/live/fire-status.ts` | « Le feu est-il allumé ? » à l'heure de Lyon |
| `src/lib/capabilities.ts` | Choix du palier full / lite / static |
| `tools/` | Rendu de la vidéo (shader) et des images fixes de l'assiette |
| `docs/storyboard.md` | Storyboard section par section |

## À remplacer avant lancement

- Nom, adresse, téléphone, e-mail, horaires, menu, prix et lettre de la cheffe : **contenu d'exemple**.
- `public/media/hero-*.mp4` et `embers.webp` : rendus procéduraux, à remplacer par une vraie prise de vue du grill (mêmes noms de fichiers ; recettes ffmpeg dans `tools/`).
- `public/media/plate-*.webp` : rendus de la scène 3D, à remplacer éventuellement par des photos du vrai plat.
- Le bouton « Réserver » ouvre un e-mail prérempli : à brancher sur le vrai outil de réservation.
