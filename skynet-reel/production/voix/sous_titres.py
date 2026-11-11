"""Sous-titres synchronisés : détection des pauses dans chaque phrase + répartition au nombre de caractères.
Sorties : src/subtitles.ts (pour Remotion) et output/skynet-agency-promo.srt"""
import json, re, subprocess, os
H = os.path.dirname(os.path.abspath(__file__))
OFFS = [0.45, 4.35, 9.5, 15.4]
CHUNKS = ["Vous avez une entreprise ?",
          "Offrez-lui un site web moderne,|élégant et à son image.",
          "Présentez vos services|et facilitez le contact avec vos clients.",
          "Contactez SKYNET AGENCY|et créons votre site web ensemble."]


def info(f):
    D = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))
    e = subprocess.run(['ffmpeg', '-i', f, '-af', 'silencedetect=n=-32dB:d=0.06', '-f', 'null', '-'], capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', e)]; en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', e)]
    return D, st, en


subs = []
from scipy.io import wavfile
import numpy as np
for i, (off, txt) in enumerate(zip(OFFS, CHUNKS)):
    sr, x = wavfile.read(os.path.join(H, f'v{i + 1}.wav')); x = x.astype(np.float32) / 32768
    hop = int(sr * .02)
    db = 20 * np.log10(np.array([np.sqrt(np.mean(x[j:j + hop] ** 2)) + 1e-9 for j in range(0, len(x) - hop, hop)]))
    sm = np.convolve(db, np.ones(5) / 5, 'same')
    act = np.where(db > db.max() - 28)[0]
    s0, s1 = act[0] * .02, (act[-1] + 1) * .02           # début / fin de la parole
    parts = txt.split('|'); w = [len(p.replace(' ', '')) for p in parts]; tot = sum(w)
    bounds, acc = [s0], 0
    for k in range(len(parts) - 1):
        acc += w[k]; g = s0 + (s1 - s0) * acc / tot
        lo, hi = int(max(s0, g - .7) / .02), int(min(s1, g + .7) / .02)
        bounds.append((lo + int(np.argmin(sm[lo:hi]))) * .02)   # coupure sur le creux d'énergie le plus proche
    bounds.append(s1)
    for k, p in enumerate(parts):
        subs.append({'start': round(off + bounds[k] - .06, 3), 'end': round(off + bounds[k + 1] + (.3 if k == len(parts) - 1 else 0), 3), 'text': p})
root = os.path.join(H, '..', '..')
open(os.path.join(root, 'src', 'subtitles.ts'), 'w').write(
    '// Généré par production/voix/sous_titres.py — ne pas modifier à la main\n'
    'export const VOICE_STARTS = ' + json.dumps(OFFS) + ';\n'
    'export const SUBTITLES: { start: number; end: number; text: string }[] = ' + json.dumps(subs, ensure_ascii=False, indent=1) + ';\n')


def ts(x):
    return f'{int(x // 3600):02}:{int(x % 3600 // 60):02}:{int(x % 60):02},{int(round((x % 1) * 1000)):03}'


os.makedirs(os.path.join(root, 'output'), exist_ok=True)
with open(os.path.join(root, 'output', 'skynet-agency-promo.srt'), 'w') as fo:
    for n, s in enumerate(subs, 1): fo.write(f"{n}\n{ts(s['start'])} --> {ts(s['end'])}\n{s['text']}\n\n")
for s in subs: print(s)
