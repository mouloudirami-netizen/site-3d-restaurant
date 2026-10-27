# Helena — Guide de maintenance

Tout le **contenu** se trouve dans `src/data/`. Il se modifie sans toucher au design.
Après chaque modification : `npm run build` (doit afficher « ✓ built »), puis `npm run preview` pour vérifier.

---

## 1. Mettre à jour la carte (`src/data/menu.ts`)

La carte est organisée en **4 familles** (`brunch`, `cuisine`, `boissons`, `douceurs`),
chacune composée de **rubriques** (ex. `burgers`, `pasta`, `coffee`…), chacune contenant des **produits**.

### Changer un prix
Chercher le produit (Ctrl+F sur son nom) et modifier le nombre, **sans espace ni « DA »** :

```ts
{ name: 'Burger Classic', price: 1200, description: '150 g de viande, …' },
//                               ↑ 1300 pour passer à 1 300 DA
```

L'affichage « 1 300 DA » est automatique.

### Ajouter un produit
Copier une ligne existante de la même rubrique et l'adapter :

```ts
{ name: 'Nouveau burger', price: 1500, description: 'Ingrédients…' },
```

- `description` est facultative.
- `note` (facultative) affiche une petite étiquette, ex. `note: 'Le week-end uniquement'`.
- Prix inconnu : `price: null` → le site affiche « Prix : nous consulter » (ou « Selon arrivage » pour les poissons).
  **Ne jamais inventer un prix.**

### Retirer un produit
Supprimer sa ligne entière (de `{` à `},`).

### Ajouter une rubrique
1. Créer un objet sur le modèle des autres :
   ```ts
   const salades: MenuSection = {
     id: 'salades',            // identifiant unique, en minuscules, sans espace ni accent
     title: 'Salades',
     items: [ { name: '…', price: 1000 } ],
   };
   ```
2. L'ajouter dans la liste `sections` de la famille voulue, en bas du fichier (`menu = [...]`).
   La rubrique apparaît automatiquement dans les onglets, les rubriques et la recherche.

### Suppléments
Dans une rubrique, le champ `supplements` liste des groupes : `{ title: 'Suppléments', items: [{ name: 'Glaces', price: 300 }] }`.
Le prix d'un supplément est facultatif.

### Formules brunch
Elles sont dans `brunchFormulas` : `includes` liste les éléments de la formule.
Elles alimentent à la fois la section Brunch et l'onglet Brunch de la carte.

> Après une mise à jour importante de la carte, compléter `MENU_VERIFICATION.md`
> (date, source, éléments incertains).

---

## 2. Informations pratiques (`src/data/restaurant.ts`)

| Champ | Effet |
|---|---|
| `area` | Localité mise en avant : accueil, pied de page (« Val d'Hydra ») |
| `address` | Adresse postale complète (bloc Adresse, copie, pied de page) |
| `phone.display` / `phone.href` | Numéro affiché / numéro appelé (`tel:+213…`, sans espaces) |
| `social` | Liens et identifiants Instagram et TikTok |
| `mapsUrl` | Lien Google Maps du bouton « Itinéraire » (`null` pour masquer le bouton) |
| `hours` | Horaires : `days` (0 = dimanche … 6 = samedi), `slots` (heures d'ouverture), `note` facultative |

⚠️ **Le titre, la description Google et les données structurées sont aussi dans `index.html`**
(adresse, téléphone, horaires) : les mettre à jour en même temps.

---

## 3. Photos et vidéo

1. Déposer la photo d'origine dans `media-source/reel/` (vraie photo) ou `media-source/ambiance/` (visuel non photographique).
2. Ajouter une ligne dans la liste `IMAGES` de `scripts/optimize-media.sh` :
   `"nom-court|media-source/reel/fichier.jpg|"` (3e champ : recadrage ffmpeg facultatif).
3. Lancer `npm run media` (nécessite ffmpeg) : crée `public/media/nom-court-640/1280.avif/.webp`.
4. Utiliser l'image avec `<Picture name="nom-court" alt="Description précise" />`.

- Galerie : ajouter l'image dans `src/data/gallery.ts` (`realPhotos` pour les vraies photos, `moodImages` pour les visuels d'ambiance).
- **Règle** : un visuel généré ou d'illustration ne va jamais dans `realPhotos`, et ne doit jamais être présenté comme une photo du restaurant.
- Avant publication, vérifier qu'aucun client n'est reconnaissable (recadrer sinon).
- Vidéo d'accueil : remplacer `media-source/ambiance/video-accueil.mp4` puis `npm run media`.

## 4. Logo et icônes

Quand le logo original (SVG ou PNG HD) sera disponible :
1. Le placer dans `media-source/`, exporter `public/media/logo.webp` (320 px) et les icônes
   (`favicon-32.png`, `favicon.png` 64 px, `apple-touch-icon.png` 180 px).
2. Mettre à jour `src/components/Logo.tsx` et les balises `<link rel="icon">` de `index.html`.
3. Supprimer les fichiers `*-temp*`.

## 5. Charte graphique (`src/styles/tokens.css`)

Couleurs (`--rose-200`, `--bordeaux-600`…), typographies (`--font-display`, `--font-script`, `--font-body`)
et espacements sont centralisés ici : une modification s'applique à tout le site.
Garder un contraste suffisant entre texte et fond (au moins 4,5:1 pour le texte courant).

## 6. Vérifications après modification

```bash
npm run typecheck && npm run build && npm run preview
```

Puis contrôler sur ordinateur et téléphone : la section modifiée, la carte (onglets + recherche),
le bouton d'appel. En cas de doute, voir `TEST_MOBILE.md`.
