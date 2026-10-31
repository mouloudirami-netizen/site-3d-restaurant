# braise — storyboard de la page d'accueil

Direction : **split stage** (taste-skill, graine 754970835). Une moitié de l'écran ne bouge jamais :
d'abord le feu (vidéo), puis l'assiette signature qui se dresse en 3D au fil de la lecture.

Idée : *Sur cette page, le dressage de la betterave sous la cendre devient la scène fixe : chaque étape
lue à droite pose un élément de l'assiette à gauche.*

Chose vivante : « Le feu est-il allumé ? », calculé à l'heure de Lyon (Europe/Paris) à partir des horaires.

| Section | Contenu | Visuel (moitié fixe) | Mouvement | Interaction | Repli statique |
|---|---|---|---|---|---|
| Hero | Nom « braise », phrase, état du feu, Réserver | Vidéo en boucle (braises sous la grille) | Lettres du nom qui montent, nom qui rétrécit de 6 % au scroll | Pause vidéo | Poster de la vidéo |
| Intro | Feu de sarment, 24 couverts, four allumé à 17 h | La vidéo cède la place à la 3D (fondu scrubbé) | Entrée par paragraphe | — | Image fixe de l'assiette |
| Le plat | Betterave sous la cendre, 6 étapes de dressage | Assiette 3D qui se dresse avec le scroll | Étapes qui s'allument, éléments qui tombent dans l'assiette | Vues « De côté / De haut / De près », glisser pour tourner | Image de l'assiette dressée |
| Le menu | 7 temps, prix, accords | Assiette dressée, tourne doucement | Lignes une par une | Survol des lignes | Liste lisible |
| La lettre | Mot de la cheffe | Assiette | Paragraphes en cascade | — | — |
| Venir | Adresse, horaires, téléphone, réserver | Pleine largeur : braises (image fixe) | Léger zoom de l'image | Bouton réserver | — |
| Pied de page | Menu en grand, contact, nom en pleine largeur | Gros plan de la betterave | Nom qui grandit de 0,94 à 1 | Survol des liens | — |

## Médias (tous produits dans ce dépôt, aucun asset externe)

| Fichier | Origine | À remplacer avant lancement ? |
|---|---|---|
| `public/media/hero-*.mp4`, `hero-poster.webp` | Rendu procédural (`tools/fire.html`, `tools/render-fire.mjs`) | Oui, par une vraie prise de vue du grill |
| `public/media/embers.webp` | Même shader, cadrage paysage | Oui, par une photo de la salle ou du feu |
| `public/media/plate-*.webp` | Rendu de la scène 3D (`tools/render-stills.mjs`) | Option : photo du vrai plat |

## Budgets retenus

LCP = poster vidéo ou texte du hero. Chunk 3D chargé à la demande (import dynamique) quand l'intro approche.
Vidéo ≤ 4 Mo desktop, ≤ 2 Mo mobile. Paliers `full` / `lite` / `static` forçables via `?tier=`.
