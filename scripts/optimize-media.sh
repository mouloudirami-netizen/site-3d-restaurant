#!/usr/bin/env bash
# Génère les images web (AVIF + WebP, 2 largeurs) depuis media-source/.
# Usage : bash scripts/optimize-media.sh   (nécessite ffmpeg avec libaom et libwebp)
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=public/media
mkdir -p "$OUT"

# nom_sortie | fichier source | filtre de recadrage optionnel
IMAGES=(
  "salle-roses|media-source/reel/salle-roses.jpg|crop=980:ih:0:0"   # recadrée : client reconnaissable à droite
  "salle-glycine|media-source/reel/salle-glycine.jpg|"
  "brunch-table|media-source/reel/brunch-table.jpg|"
  "brioche-dattes|media-source/reel/brioche-dattes.jpg|"
  "pancakes-banane|media-source/reel/pancakes-banane.jpg|"
  "smoothie-fraise|media-source/reel/smoothie-fraise.jpg|"
  "escalier|media-source/reel/escalier.jpg|"
  "ambiance-salle|media-source/ambiance/salle-vue-mer.jpg|"
  "ambiance-latte|media-source/ambiance/latte-rose.jpg|"
  "ambiance-cocktails|media-source/ambiance/cocktails.jpg|"
)
WIDTHS=(640 1280)

for entry in "${IMAGES[@]}"; do
  IFS='|' read -r name src crop <<<"$entry"
  for w in "${WIDTHS[@]}"; do
    filter="scale='min($w,iw)':-2"
    [[ -n "$crop" ]] && filter="$crop,$filter"
    ffmpeg -v error -y -i "$src" -vf "$filter" -c:v libwebp -quality 78 "$OUT/$name-$w.webp"
    ffmpeg -v error -y -i "$src" -vf "$filter,format=yuv420p" -c:v libaom-av1 -still-picture 1 -crf 34 -cpu-used 6 "$OUT/$name-$w.avif"
  done
  echo "✓ $name"
done

# Vidéo d'accueil : version ordinateur (16:9) et mobile (recadrage vertical centré), sans piste audio.
VIDEO=media-source/ambiance/video-accueil.mp4
ffmpeg -v error -y -i "$VIDEO" -an -vf "scale=1600:-2" -c:v libx264 -preset slow -crf 26 \
  -profile:v high -pix_fmt yuv420p -movflags +faststart "$OUT/hero-desktop.mp4"
ffmpeg -v error -y -i "$VIDEO" -an -vf "crop=608:1080:(iw-608)/2:0,scale=540:-2" -c:v libx264 -preset slow -crf 27 \
  -profile:v high -pix_fmt yuv420p -movflags +faststart "$OUT/hero-mobile.mp4"
ffmpeg -v error -y -i "$VIDEO" -vf "scale=1600:-2" -frames:v 1 -c:v libwebp -quality 80 "$OUT/hero-poster-desktop.webp"
ffmpeg -v error -y -i "$VIDEO" -vf "crop=608:1080:(iw-608)/2:0,scale=540:-2" -frames:v 1 -c:v libwebp -quality 80 "$OUT/hero-poster-mobile.webp"
echo "✓ vidéo d'accueil"
