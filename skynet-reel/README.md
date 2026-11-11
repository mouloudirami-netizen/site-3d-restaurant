# SKYNET AGENCY : publicité Reel / TikTok (Remotion)

Vidéo verticale 1080 × 1920, 30 images/s, 20 s, H.264 + AAC.

## Fichiers finaux (`output/`)
| Fichier | Contenu |
|---|---|
| `skynet-agency-promo-v2.mp4` | **Version actuelle** : voix féminine posée, musique et bruitages |
| `skynet-agency-promo-v2-sans-musique.mp4` | Version actuelle, avec voix et bruitages seulement |
| `couverture-reel-v2.jpg` | Couverture de la version actuelle |
| `essais-voix/comparatif-4-voix.m4a` | Comparaison des 4 variantes de voix testées |
| `skynet-agency-promo.mp4` | Ancienne version (v1) |
| `skynet-agency-promo-sans-musique.mp4` | Même vidéo, avec voix et bruitages seulement |
| `couverture-reel.jpg` | Couverture verticale : logo et appel à l'action |
| `couverture-reel-accroche.jpg` | Couverture alternative : la phrase d'accroche sur la photo |
| `skynet-agency-promo.srt` | Sous-titres, si la plateforme les demande à part |
| `captures/` | Une capture par scène |

## Scénario
| Temps | Scène | Texte à l'écran | Voix |
|---|---|---|---|
| 0–4 s | Photo de l'entrepreneur, lent travelling avant, puis plongée dans l'écran de son ordinateur | Votre entreprise mérite plus. | « Vous avez une entreprise ? » |
| 4–9 s | Ordinateur portable avec le site de démonstration « Maison Lumen » : clic sur « Réserver une table », puis défilement | Donnez-lui une présence digitale. | « Offrez-lui un site web moderne, élégant et à son image. » |
| 9–15 s | Ordinateur, tablette et téléphone affichant le même site, chacun avec sa mise en page ; envoi d'un message sur le téléphone | Design sur mesure / Adapté aux mobiles / Expérience professionnelle | « Présentez vos services et facilitez le contact avec vos clients. » |
| 15–20 s | Logo officiel sur fond bleu nuit | Votre entreprise. Votre site web. / Un projet ? Parlons-en. / Contactez-nous en message privé | « Contactez SKYNET AGENCY et créons votre site web ensemble. » |

## Sources
- `src/` : composition Remotion (React, TypeScript).
  - `Promo.tsx` : les scènes.
  - `components/Devices.tsx` : ordinateur, tablette et téléphone.
  - `components/CafeSite.tsx` : le site de démonstration, en trois mises en page.
- `public/assets/` :
  - le logo officiel, inchangé ;
  - la photo et ses recadrages (le bas de la photo, avec la chaussure de marque, est exclu) ;
  - les polices sous licence libre OFL : Sora, Inter, Fraunces, Instrument Serif.
- `public/audio/` : le mix complet et la version sans musique.
- `production/voix/` :
  - `generer_voix.py` : voix off féminine (Kokoro TTS, voix française ff_siwis), 4 variantes testables. La version retenue est « siwis-posee » (débit plus calme). « SKYNET AGENCY » est prononcé à l'anglaise, à partir des phonèmes « skˈajnɛt ˈejdʒənsi » (« Skaï-nèt Éï-djeun-si »). Cette transcription ne sert qu'à la synthèse ; l'écran et les sous-titres affichent SKYNET AGENCY.
  - `v1.wav` à `v4.wav` : les phrases retenues.
  - `sous_titres.py` : calcul des sous-titres, avec chaque coupure placée sur une pause réelle de la voix.
- `production/voix-humaine/` : ancienne voix enregistrée, qui n'est plus utilisée.
- `production/audio/` :
  - `musique.py` : musique et bruitages originaux, synthétisés, donc sans droits ;
  - `mixer.sh` : mixage, avec la musique qui baisse automatiquement sous la voix.

## Refaire la vidéo
```bash
npm install
npx remotion studio                       # aperçu interactif
npx remotion render SkynetPromo output/skynet-agency-promo.mp4
```
Pour changer un texte, modifiez `src/Promo.tsx`. Pour une nouvelle voix, relancez `production/voix/generer_voix.py` (ou remplacez `production/voix/v*.wav`), puis relancez `production/voix/sous_titres.py` et `production/audio/mixer.sh` (les départs des phrases sont réglés dans ces deux fichiers).

Remotion est gratuit pour les indépendants et les entreprises de 3 personnes au plus. Au-delà, une licence entreprise est nécessaire.
