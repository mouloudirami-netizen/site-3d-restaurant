"""Découpe les meilleures prises de l'enregistrement d'origine et applique un nettoyage léger (voix naturelle,
sans changement de hauteur ni de timbre). Usage : python3 preparer_voix.py enregistrement.m4a dossier_sortie"""
import subprocess, sys, os, numpy as np
from scipy.io import wavfile

SRC, OUT = sys.argv[1], sys.argv[2]
# fenêtres (s) des prises retenues dans l'enregistrement d'origine
CHOIX = {1: (20.40, 22.20), 2: (2.20, 6.10), 3: (6.95, 10.85), 4: (32.40, 37.40)}
NETTOYAGE = ("highpass=f=70,afftdn=nr=6:nf=-44,"
             "equalizer=f=120:t=q:w=1:g=1,equalizer=f=260:t=q:w=1.2:g=-1.5,equalizer=f=3500:t=q:w=1.2:g=1.5,"
             "deesser=i=0.3,acompressor=threshold=-22dB:ratio=2.2:attack=10:release=160:makeup=2dB")
tmp = os.path.join(OUT, '_source.wav')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', SRC, '-ac', '1', '-ar', '48000', tmp], check=True)
sr, x = wavfile.read(tmp); x = x.astype(np.float32) / 32768


def lufs(path):
    e = subprocess.run(['ffmpeg', '-hide_banner', '-i', path, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(e.split('Summary:')[1].split('I:')[1].split('LUFS')[0])


for n, (a, b) in CHOIX.items():
    s = x[int(a * sr):int(b * sr)]
    hop = int(sr * .01)
    db = 20 * np.log10(np.array([np.sqrt(np.mean(s[i:i + hop] ** 2)) + 1e-9 for i in range(0, len(s) - hop, hop)]))
    act = np.where(db > db.max() - 26)[0]
    t0 = max(0, act[0] * .01 - .18) + a          # 180 ms avant la première syllabe
    t1 = min(b - a, (act[-1] + 1) * .01 + .22) + a  # 220 ms après la dernière
    d = t1 - t0
    raw = os.path.join(OUT, f'_p{n}.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t0:.3f}', '-to', f'{t1:.3f}', '-i', tmp,
                    '-af', f'{NETTOYAGE},afade=t=in:d=0.02,afade=t=out:st={d - 0.08:.3f}:d=0.08', '-ar', '48000', raw], check=True)
    g = -16 - lufs(raw)  # même niveau pour chaque phrase (gain linéaire, sans compression supplémentaire)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', f'volume={g:.2f}dB', os.path.join(OUT, f'phrase{n}.wav')], check=True)
    os.remove(raw)
    print(f'phrase {n}: {t0:.2f} → {t1:.2f} s de l\'original, durée {d:.2f} s, gain {g:+.1f} dB')
os.remove(tmp)
