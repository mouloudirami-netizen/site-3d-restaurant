"""Sous-titres synchronisés : détection des pauses dans chaque phrase + répartition au nombre de caractères.
Sorties : src/subtitles.ts (pour Remotion) et output/skynet-agency-promo.srt"""
import json, re, subprocess, os
H = os.path.dirname(os.path.abspath(__file__))
OFFS = [0.45, 4.35, 9.5, 15.6]
CHUNKS = ["Vous avez une entreprise ?",
          "Offrez-lui un site web moderne,|élégant et à son image.",
          "Présentez vos services|et facilitez le contact avec vos clients.",
          "Contactez SKYNET AGENCY|et créons votre site web ensemble."]


def info(f):
    D = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))
    e = subprocess.run(['ffmpeg', '-i', f, '-af', 'silencedetect=n=-38dB:d=0.06', '-f', 'null', '-'], capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', e)]; en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', e)]
    return D, st, en


subs = []
for i, (off, txt) in enumerate(zip(OFFS, CHUNKS)):
    D, st, en = info(os.path.join(H, f'v{i + 1}.wav'))
    s0 = en[0] if st and st[0] < .02 and en else 0.0
    s1 = st[-1] if st and st[-1] > D - .6 and st[-1] > s0 else D
    pauses = [(a, b) for a, b in zip(st, en) if a > s0 + .1 and b < s1 - .1]
    parts = txt.split('|'); w = [len(p.replace(' ', '')) for p in parts]; tot = sum(w)
    bounds, acc = [s0], 0
    for k in range(len(parts) - 1):
        acc += w[k]; g = s0 + (s1 - s0) * acc / tot
        near = min(pauses, key=lambda p: abs((p[0] + p[1]) / 2 - g), default=None)
        if near and abs((near[0] + near[1]) / 2 - g) < .4: g = (near[0] + near[1]) / 2
        bounds.append(g)
    bounds.append(s1)
    for k, p in enumerate(parts):
        subs.append({'start': round(off + bounds[k] - .05, 3), 'end': round(off + bounds[k + 1] + (.3 if k == len(parts) - 1 else 0), 3), 'text': p})
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
