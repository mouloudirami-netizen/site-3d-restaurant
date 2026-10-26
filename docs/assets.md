# Ressources

Toutes les images proviennent des photos, affiches et captures de vidéo fournies par le client (Thaisty Crousty) pendant la préparation de la maquette. Aucune banque d'images, aucune image générée.

| Dossier | Contenu | Traitement |
|---|---|---|
| `public/media/bowls/` | 8 bols (affiches menu) | Détourage `rembg` (isnet-general-use), WebP 1000 px et 560 px |
| `public/media/desserts/` | 9 crèmes dessert + 4 tiramisu (stories « Desserts ») | Détourage `rembg`, WebP 720 px et 400 px |
| `public/media/ritual/` | 9 images de la vidéo de préparation | Recadrage, WebP 760 px |
| `public/media/photos/` | Campagnes, enseigne, façade, bols | WebP 1170 px et 640 px |
| `public/media/textures/motif.webp` | Motif orange (mots darija/arabe) tiré des visuels horaires | Converti en masque alpha |
| `src/brand/logoPaths.ts` | Logo vectorisé depuis la photo de profil | `potrace` ; **à remplacer par le fichier vectoriel officiel** |

La 3D (pot, riz, poulet, sauces, garnitures, particules) est générée en code (`src/three/`), sans fichier GLB ni HDRI externe : l'éclairage d'environnement est construit avec des `Lightformer` locaux.

## À fournir / à valider

- [ ] Prix de tous les produits (cases vides, `price: null` dans `src/data/*.ts`)
- [ ] Adresses exactes et liens Google Maps officiels (`mapsUrl` / `address` dans `src/data/restaurants.ts`)
- [ ] Logo vectoriel officiel (SVG)
- [ ] Vidéo originale de préparation (pour un hero vidéo éventuel)
- [ ] Validation des comptes réseaux sociaux (lien actuel : instagram.com/thaisty.alger)
