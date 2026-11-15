# Thaisty Crousty — storyboard

| # | Section | Visuel | Mouvement | Interaction | Repli (niveau `static`) |
|---|---------|--------|-----------|-------------|--------------------------|
| 1 | Hero | Bol Crousty Spicy détouré, logo, « CROUSTY » en trame orange, particules 3D | Séquence d'entrée GSAP, parallaxe, inclinaison au pointeur | « Voir le menu », « Commander » | Bol et typographie fixes |
| 2 | La devise | Citation + photo des trois bols sur le comptoir | Mots qui s'allument au défilement | — | Texte visible |
| 3 | Menu | 8 bols détourés, 2 familles, prix et suppléments | Transitions Motion | Onglets, survol, cartes à glisser sur mobile | Identique |
| 4 | Desserts | 10 crèmes dessert + 4 tiramisu | Couleur de section liée au dessert | Onglets, flèches, pastilles | Identique |
| 5 | La recette | 6 photos (bol vide → bol terminé) | Scène collante (CSS sticky), fondus enchaînés pilotés par ScrollTrigger + scrub, zoom 1 → 1.03, liste 01-05 synchronisée | — | Dernière photo, toutes les étapes affichées |
| 6 | Le geste | 9 images de la vidéo de préparation | Défilement horizontal épinglé (ordinateur) | Défilement horizontal natif sur mobile | Défilement natif |
| 7 | Les sauces | 3 photos + 4 sauces | Parallaxe | — | Statique |
| 8 | Restaurants | 8 cartes | Statut ouvert/fermé en direct | Filtre, appel, itinéraire | Identique |
| 9 | L'univers Thaisty | Enseigne, jour d'ouverture, cuisine | Révélations par masque | — | Statique |
| 10 | Final + pied de page | Bol Curry Mix | Montée du bol | Commander, restaurants, Instagram | Statique |

Bouton « Commander » toujours accessible : bouton flottant en bas d'écran sur téléphone/tablette (< 1024 px), barre de navigation toujours visible sur ordinateur.

Niveaux : `full` (ordinateur), `lite` (mobile / appareil modeste : 3D allégée, rendu à la demande), `static` (réduction des animations, Save-Data ou pas de WebGL). Forçable avec `?tier=full|lite|static`.
