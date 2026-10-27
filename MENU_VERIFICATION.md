# Helena — Vérification de la carte

Source : 14 pages du menu (`media-source/menu/page-01.jpg` → `page-14.jpg`).
Données : `src/data/menu.ts`. Chaque nom et chaque prix a été relu sur les images d'origine.

**Contrôle : 160 références transcrites, 156 avec prix, 4 sans prix (poissons).**

## 1. Prix non renseignés sur le menu (à confirmer)

Ces produits figurent avec un tiret à la place du prix. Le site affiche « Selon arrivage », sans aucun prix estimé.

| Rubrique | Produit | Page |
|---|---|---|
| Poissons | Loup de mer (grillé, farci, mille-feuille) | 08 |
| Poissons | Marmelade de poisson | 08 |
| Poissons | Tajine de poisson | 08 |
| Poissons | Assiette pêcheur | 08 |

Prix des **suppléments du brunch** (sucrés, salés, sauces, œufs) et des **suppléments boissons** (milk, honey, brown sugar, whipped cream, fruits ; Nutella, Kinder Bueno, Oreo, Snickers, Lotus) : non indiqués. Le site affiche « Prix des suppléments : nous consulter » pour le brunch et liste les autres sans prix.

## 2. Ambiguïtés de transcription (à confirmer)

| Page | Texte du menu | Choix retenu | Question |
|---|---|---|---|
| 03 | « …accompagnée d'un bouquet de salade Granola: Yaourt, granola & fruits de saison » (Sunrise brunch) | Deux éléments distincts : viennoiserie + granola | Le granola est-il bien un élément à part de la formule ? |
| 02–03 | « Eau pm » | « Eau PM » | Signifie « petit modèle » ? |
| 03 | « Charcuterie Œufs : (Poché/Dur/Brouillé/Au plate) » | Groupe « Charcuterie, œufs » : poché, dur, brouillé, au plat | La charcuterie est-elle un supplément distinct des œufs ? |
| 03 | Sauces « Chocolat / Pistache / Caramel / Beurre salé » | Quatre sauces distinctes | « Caramel / Beurre salé » = une seule sauce « caramel beurre salé » ? |
| 05 | « Pain single » (tartines) | Conservé tel quel | Terme voulu (pain de mie ? pain spécial ?) |
| 07 | « Assiette Bouché » | Conservé tel quel | Faut-il lire « Assiette du boucher » ? |
| 11 | Mojito « Classic » et « Mixte » : même description | Conservé à l'identique | Quelle différence pour le Mixte ? |
| 11 | Mojito « Flavored » : « …Sparkling Water, Flavour » | « …, flavour » | Quels parfums sont proposés ? |
| 12 | « L'entremets selon arrivage » | Note sous les coupes de glace | S'agit-il d'un dessert à part (sans prix) ? |
| 14 | Supplément « Glaces 300 Da » | « Glaces · 300 DA » | Prix par boule ? |

## 3. Corrections orthographiques appliquées (validées sur le principe)

Seules les fautes évidentes ont été corrigées ; aucun prix ni ingrédient n'a été modifié.

| Menu d'origine | Sur le site |
|---|---|
| Cookise ou croissant pure beurre | Cookie ou croissant pur beurre |
| Salade de pâtes a la grecque | Salade de pâtes à la grecque |
| Salade Caprese au anchoix | Salade Caprese aux anchois |
| sauce pisto | sauce pesto |
| oignons caramélisé, champignons sauté gratinée | oignons caramélisés, champignons sautés, gratinée |
| Burratta | burrata |
| Entrecôte grillé | Entrecôte grillée |
| Émincé de bœuf nappées | Émincé de bœuf nappé |
| Tranche de beauf gratine au 3 fromage | Tranche de bœuf gratinée aux 3 fromages |
| Osso boco medetranien | Osso buco méditerranéen |
| Méchooui d'Agneau | Méchoui d'agneau |
| Cuisse de poulet mariné | Cuisse de poulet marinée |
| Chicken Crespy | Chicken Crispy |
| 3 fromage / gratine aux Fromage / Suprême de poulet panée | 3 fromages / gratinée aux fromages / suprême de poulet pané |
| Crevettes … sauté à l'ail | sautées à l'ail |
| farcis (loup de mer) | farci |
| Paella (Weekend only) | Paella — « Le week-end uniquement » |
| Menu Kids « - 12 ans » | « Moins de 12 ans » |
| Le menu sera servi avec Mini Jus | Le menu est servi avec un mini jus |
| Ravioles ricota | Ravioles ricotta |
| Woke's | Woks |
| Vienesse Chocolate | Viennese Chocolate |
| Mocktailss | Mocktails |
| Juicies | Juices |
| Milkshake Straweberry | Milkshake Strawberry |
| Frappuccino Carame Beurre Salé | Frappuccino Caramel Beurre Salé |
| Brioche perdu au glace / avec fruits | Brioche perdue à la glace / aux fruits |
| pistach | pistache |
| Red velevette | Red velvet |
| Saint Sébastien | Saint-Sébastien |
| Cheese bomb dubai | Cheese Bomb Dubaï |
| Crêpe au glace / au fruits | Crêpe à la glace / aux fruits |
| Gaufre au Fruits de Saison | Gaufre aux fruits de saison |
| sur tout les tartine | sur toutes les tartines (reformulé en note) |

Les noms anglais du menu (Coffee, Brew Bar, Iced…, Mocktails, descriptions « shaken with ice ») sont conservés tels quels, comme sur la carte papier.

## 4. Mention ajoutée sur le site (à valider par le restaurant)

Sous la carte : « Prix en dinars algériens (DA). Carte susceptible d'évoluer selon les saisons et les arrivages. »

## 5. Mise à jour

Pour modifier un prix ou un produit : éditer `src/data/menu.ts` (voir README).
Si un menu PDF ou de nouvelles pages sont fournis, compléter ce fichier sans écraser les données déjà vérifiées.
