#!/bin/bash
# Mixage : voix humaine (nettoyée dans ../voix-humaine, -16 LUFS) + musique (-25 LUFS, baisse automatique sous la voix) + bruitages.
# Sorties dans ../../public/audio : mix.wav (complet) et voix-bruitages.wav (version sans musique).
set -e
cd "$(dirname "$0")"
OUT=../../public/audio; mkdir -p $OUT
D=(300 4200 9350 15250)   # départs des phrases (ms) — identiques à src/timeline.ts
in=""; f=""
for i in 0 1 2 3; do in="$in -i ../voix-humaine/phrase$((i+1)).wav"; f="$f[$i:a]aresample=48000,adelay=${D[$i]}|${D[$i]}[v$i];"; done
ffmpeg -y -v error $in -filter_complex "$f[v0][v1][v2][v3]amix=inputs=4:normalize=0,apad=whole_dur=21,atrim=0:21,pan=stereo|c0=c0|c1=c0" -ar 48000 voix_brute.wav
norm(){ m=$(ffmpeg -hide_banner -i $1 -af ebur128 -f null - 2>&1 | grep -A3 Summary | grep "I:" | awk '{print $2}')
  g=$(python3 -c "print(round($3-($m),2))"); ffmpeg -y -v error -i $1 -af volume=${g}dB $2; }
norm voix_brute.wav voix.wav -16
norm musique.wav musique_n.wav -25
norm bruitages.wav bruitages_n.wav -27
ffmpeg -y -v error -i voix.wav -i musique_n.wav -i bruitages_n.wav -filter_complex "
[0:a]asplit=2[vx][key];[1:a][key]sidechaincompress=threshold=0.02:ratio=5:attack=40:release=400[duck];
[vx][duck][2:a]amix=inputs=3:normalize=0,volume=1.5dB,alimiter=limit=0.84:attack=3:release=60:level=disabled[o]" -map "[o]" -ar 48000 $OUT/mix.wav
ffmpeg -y -v error -i voix.wav -i bruitages_n.wav -filter_complex "[0:a][1:a]amix=inputs=2:normalize=0,volume=2dB,alimiter=limit=0.84:level=disabled[o]" -map "[o]" -ar 48000 $OUT/voix-bruitages.wav
for x in mix voix-bruitages; do echo "$x: $(ffmpeg -hide_banner -i $OUT/$x.wav -af ebur128=peak=true -f null - 2>&1 | grep -A12 Summary | grep -E 'I:' | xargs)"; done
