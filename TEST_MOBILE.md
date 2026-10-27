# Helena — Fiche de test sur téléphone

Ce qui n'a **pas** pu être testé automatiquement : la fluidité réelle (pétales 3D, animations)
sur un vrai téléphone avec carte graphique, le geste d'appel réel et la lecture vidéo sur iPhone.

## Ouvrir le site sur son téléphone (même réseau Wi-Fi que l'ordinateur)

```bash
npm install
npm run build
npm run preview -- --host
```

La commande affiche une adresse « Network » (ex. `http://192.168.1.20:4173`) : l'ouvrir sur le téléphone.

## À vérifier (cocher)

### Accueil
- [ ] Une image s'affiche immédiatement (pas d'écran blanc ou noir).
- [ ] Le film démarre seul, sans son ; les pétales roses tombent doucement par-dessus.
- [ ] Après ~8 s, fondu vers la vraie photo de la salle ; la légende passe à « La salle · Val d'Hydra ».
- [ ] « Pause » met le film en pause ; « Revoir le film » le relance.
- [ ] iPhone en mode économie d'énergie : la vraie photo s'affiche directement (normal).

### Navigation et appel
- [ ] Le bouton menu (☰) ouvre la navigation plein écran ; chaque lien mène à la bonne section.
- [ ] La barre du bas « Appeler · La carte » reste visible, sans masquer de contenu, au-dessus de la barre de l'iPhone.
- [ ] « Appeler » propose bien d'appeler le +213 5 54 06 22 54.
- [ ] « Itinéraire » ouvre Google Maps sur la fiche Helena (à confirmer).

### Défilement et animations
- [ ] Le défilement est fluide (pas de saccades), y compris dans la section Univers (pétales).
- [ ] La galerie et le brunch s'affichent correctement, photos nettes.
- [ ] Réglages → Accessibilité → « Réduire les animations » : le site reste complet, sans film ni pétales.

### Carte
- [ ] Les onglets Brunch / Cuisine / Boissons / Douceurs restent collés en haut pendant la lecture.
- [ ] Les rubriques défilent horizontalement ; un appui descend à la bonne rubrique.
- [ ] La recherche (« latte », « burger », « crêpe ») trouve les bons produits ; le clavier ne zoome pas la page.
- [ ] Les prix sont lisibles et alignés.

### Informations pratiques
- [ ] « Aujourd'hui » est sur la bonne ligne d'horaires.
- [ ] « Copier l'adresse » fonctionne.
- [ ] Instagram et TikTok s'ouvrent sur les bons comptes.

### Appareils conseillés
- [ ] iPhone récent (Safari) · [ ] Android milieu de gamme (Chrome) · [ ] tablette · [ ] ordinateur (Chrome, Safari, Firefox)

Noter tout problème avec : appareil, navigateur, section, capture d'écran.
