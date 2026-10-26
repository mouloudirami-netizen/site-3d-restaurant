# Thaisty Crousty — storyboard

| # | Section | Visuel | Mouvement | Interaction | Repli (niveau `static`) |
|---|---------|--------|-----------|-------------|--------------------------|
| 1 | Hero | Bol Crousty Spicy détouré (photo officielle), logo vectorisé, « CROUSTY » en trame orange, particules 3D (miettes de panure, persil, braises) | Séquence d'entrée GSAP (fond → typo → bol → particules → boutons), parallaxe au défilement, inclinaison du bol au pointeur | « Voir le menu », « Commander » | Bol et typographie fixes, pas de canvas |
| 2 | La devise | Citation « Si tu aimes aujourd'hui, tu aimeras demain ! » + photo des bols alignés | Mots qui s'allument au défilement, révélation de la photo par masque | — | Texte entier visible |
| 3 | La recette (3D) | Pot Thaisty modélisé (Three.js) : riz, sauce, poulet, nappage, oignons/persil | Section épinglée : les 5 couches descendent dans le pot, rotation et caméra pilotées par le défilement | Choix du bol (sauces 3D changent de couleur), lien vers le menu | Visuel officiel « bol éclaté » |
| 4 | Menu | 8 bols détourés, 2 familles | Transitions Motion entre bols | Onglets Crousty / Crousty Curry, survol des lignes, cartes à faire glisser sur mobile | Identique |
| 5 | Le geste | 9 images de la vidéo de préparation | Défilement horizontal épinglé (ordinateur), glissement des images | Défilement horizontal natif sur mobile | Défilement horizontal natif |
| 6 | Les sauces | 3 photos officielles + 4 sauces | Titres en mouvement inverse, parallaxe | — | Statique |
| 7 | Desserts | 13 pots/barquettes détourés | La couleur de la section suit le dessert (comme les affiches) | Onglets Crème dessert / Tiramisu, flèches, pastilles | Identique |
| 8 | L'univers | Campagnes, enseigne, façade | Révélations par masque | — | Statique |
| 9 | Restaurants | 8 cartes, nom du quartier en filigrane | Animations de mise en page | Statut ouvert/fermé en direct (heure d'Alger), filtre, appel, itinéraire | Identique |
| 10 | Final + pied de page | Bol Curry Mix | Montée du bol au défilement | Commander, trouver un restaurant, Instagram | Statique |

Niveaux : `full` (ordinateur), `lite` (mobile / appareil modeste : 3D allégée, rendu à la demande), `static` (réduction des animations, Save-Data ou pas de WebGL). Forçable avec `?tier=full|lite|static`.
