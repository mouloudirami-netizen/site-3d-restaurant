# Helena — Éléments à confirmer avant publication

Légende : 🔴 bloquant pour la publication · 🟠 important · 🟢 confirmé

## Informations pratiques

| Statut | Élément | Détail |
|---|---|---|
| 🟢 | Localité | Sur demande du commanditaire, « Val d'Hydra » remplace « El Biar » partout (accueil, adresse, pied de page, titre, données structurées, image de partage). |
| 🟠 | Adresse postale | Affichée : 43 Bd du 11 Décembre 1960, Val d'Hydra 16100, Algérie. Le code postal 16100 et la rue proviennent de l'adresse initiale (« El Biar 16100 ») : à confirmer avec le restaurant que rue + code postal + « Val d'Hydra » forment bien l'adresse officielle (notamment pour Google). |
| 🟠 | Lien Google Maps | Fourni par le commanditaire : https://maps.app.goo.gl/jvGTbnBpugh7GLYT6?g_st=iw — intégré (bouton « Itinéraire » + pied de page). Destination non vérifiable depuis l'environnement de développement (accès réseau à Google Maps bloqué) : cliquer une fois pour confirmer qu'il ouvre bien la fiche Helena. |
| 🟢 | Téléphone | +213 5 54 06 22 54 (`tel:+213554062254`). |
| 🟢 | Horaires | Sam.–jeu. 08 h–23 h 30 ; vendredi 08 h–12 h et 14 h–23 h 30. |
| 🟠 | Brunch le vendredi | Le menu indique un brunch de 10 h à 16 h, mais le restaurant ferme de 12 h à 14 h le vendredi. Créneau du vendredi à confirmer. |
| 🟢 | Instagram / TikTok | Liens officiels fournis. |

## Identité

| Statut | Élément | Détail |
|---|---|---|
| 🔴 | Logo original | Seul un JPG 554×554 est disponible (`media-source/logo-helna-couronne-temp.jpg`). Fichier SVG ou PNG HD transparent requis. Utilisé temporairement : `public/media/logo-temp.webp`, `public/favicon-temp.png`. |
| 🟠 | Version officielle du logo | « HEL&NA » (couronne, sur place) vs « ꞒLENA » (menu). Le site utilise HEL&NA comme logo et « Helena » dans les textes. |

## Médias

| Statut | Élément | Détail |
|---|---|---|
| 🟠 | Vidéo d'accueil | Rendu stylisé (non filmé dans le restaurant). Utilisée comme ouverture d'ambiance, suivie d'un fondu vers une vraie photo (option C validée). Le restaurant doit valider cet usage. |
| 🟠 | Visuels d'ambiance | `ambiance-salle`, `ambiance-latte`, `ambiance-cocktails` sont générés : ils ne sont jamais présentés comme de vraies photos de Helena. |
| 🟢 | Photo « salle-roses » | Recadrée pour exclure un client reconnaissable. |
| 🟠 | Photo « escalier » | Trop basse résolution (415×739) : usage en vignette uniquement. Une version HD serait bienvenue. |

## Menu

Voir `MENU_VERIFICATION.md` : prix manquants, ambiguïtés de transcription et corrections orthographiques à faire valider.

## Hero (étape 4)

| Statut | Élément | Détail |
|---|---|---|
| 🟠 | Photo de fin du hero | « salle-roses » (1170 px de large) est légèrement agrandie sur grand écran et laisse voir l'écran TV en bas. Une photo HD du plafond fleuri, en format paysage, améliorerait nettement le rendu. |
| 🟢 | Accroche | « Sous une voûte de fleurs, chaque instant se savoure. » — texte original, sans promesse factuelle. |

## Contact & pied de page (étape 7)

| Statut | Élément | Détail |
|---|---|---|
| 🟢 | Bouton « Itinéraire » | Affiché (ouvre Google Maps dans un nouvel onglet). Mettre `mapsUrl` à `null` le masque. |
| 🟢 | « Copier l'adresse » | Disponible à côté du bouton « Itinéraire ». |
| 🟠 | Mentions ajoutées | Pied de page : « Prix en dinars algériens (DA), à titre indicatif. » et « Val d’Hydra, Alger ». À valider par le restaurant. |
| 🟢 | Réservations | Aucune mention de réservation (service non confirmé) : le bloc s'intitule simplement « Téléphone ». |

## Référencement et mise en ligne (étape 8)

| Statut | Élément | Détail |
|---|---|---|
| 🟠 | Nom de domaine | Inconnu. À la mise en ligne : passer `og:image` en URL absolue, ajouter `<link rel="canonical">`, `url` et `image` dans les données structurées, et un `sitemap.xml`. |
| 🟢 | Données structurées | Restaurant : adresse, téléphone, horaires, réseaux, lien Maps. Aucune note, aucun avis, aucune coordonnée GPS, aucune gamme de prix inventés. |
| 🟠 | Icônes du site | `favicon-temp*.png` et `apple-touch-icon-temp.png` générés depuis le logo basse définition : à refaire depuis le logo original. |
| 🟢 | Image de partage | `public/og-image.jpg` (1200×630) : vraie photo de la salle (recadrée, sans client visible) + nom. |
| 🟠 | Indexation | Le site n'est pas en ligne : aucune indexation ni positionnement Google à ce stade. |
