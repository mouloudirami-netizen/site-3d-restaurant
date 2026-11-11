"""Musique originale (synthèse, aucun sample, aucun droit tiers) + bruitages pour la pub SKYNET AGENCY (20 s).
Tempo 120 BPM : un temps = 0,5 s. Sorties : musique.wav, bruitages.wav (48 kHz stéréo)."""
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR, DUR = 48000, 20.0
N = int(SR * DUR)
rng = np.random.default_rng(11)


def T(d): return np.arange(int(SR * d)) / SR
def hz(m): return 440.0 * 2 ** ((m - 69) / 12)


def place(buf, x, at, g=1.0, pan=0.0):
    i = int(at * SR)
    if i >= len(buf): return
    if x.ndim == 1:
        x = np.stack([x * np.sqrt(1 - pan), x * np.sqrt(1 + pan)], 1)
    n = min(len(x), len(buf) - i)
    buf[i:i + n] += x[:n] * g


def filt(x, kind, fc, order=2):
    sos = signal.butter(order, fc, kind, fs=SR, output='sos')
    return signal.sosfilt(sos, x, axis=0)


def sweep_lp(x, f0, f1, block=256):
    out = np.zeros_like(x); zi = None; nb = int(np.ceil(len(x) / block))
    for b in range(nb):
        fc = f0 * (f1 / f0) ** (b / max(1, nb - 1))
        sos = signal.butter(2, min(max(fc, 40), SR / 2 - 300), 'low', fs=SR, output='sos')
        if zi is None: zi = np.zeros((sos.shape[0], 2))
        seg = x[b * block:(b + 1) * block]
        y, zi = signal.sosfilt(sos, seg, zi=zi); out[b * block:b * block + len(seg)] = y
    return out


def ir(d, damp):
    t = T(d); e = np.exp(-damp * t / d * 2.2)
    r = np.stack([filt(rng.standard_normal(len(t)) * e, 'low', 6500) for _ in range(2)], 1)
    r[:int(.01 * SR)] *= np.linspace(0, 1, int(.01 * SR))[:, None]
    return r / np.sqrt((r ** 2).sum())


IR_L, IR_S = ir(2.8, 2.4), ir(0.8, 3.5)


def verb(st, r, wet):
    out = np.stack([signal.fftconvolve(st[:, c], r[:, c])[:len(st)] for c in range(2)], 1)
    return st * (1 - wet * .3) + out * wet


def env(n, a, d, s, r):
    t = np.arange(n) / SR; tot = n / SR; e = np.full(n, s)
    e[t < a] = t[t < a] / a
    m = (t >= a) & (t < a + d); e[m] = 1 - (1 - s) * (t[m] - a) / d
    rel = t > tot - r; e[rel] *= np.clip((tot - t[rel]) / r, 0, 1)
    return e


def saw(f, d, det=0.0):
    ph = f * (1 + det) * T(d); return 2 * (ph - np.floor(ph + .5))


def supersaw(f, d, v=5, spread=.01):
    return sum(saw(f, d, (k - (v - 1) / 2) / ((v - 1) / 2) * spread) for k in range(v)) / v


def pad(ms, d, cut):
    x = filt(sum(supersaw(hz(m), d) for m in ms) / len(ms), 'low', cut)
    return x * env(len(x), min(.7, d / 3), .3, .9, min(.9, d / 3)) * .32


def pluck(m, d=.45, bright=3200):
    f = hz(m); t = T(d)
    x = supersaw(f, d, 3, .005) * .55 + np.sin(2 * np.pi * f * t) * .45
    return sweep_lp(x * np.exp(-t * 7.5), bright, 450, 128) * .45


def sub(m, d):
    t = T(d); return np.sin(2 * np.pi * hz(m) * t) * env(len(t), .01, .1, .85, .08) * .5


def kick():
    t = T(.5); f = 46 + 100 * np.exp(-t * 30)
    return np.tanh(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7) * 1.4) * .75


def snap():
    t = T(.25); n = rng.standard_normal(len(t))
    return filt(n * (np.exp(-t * 140) + .5 * np.exp(-np.maximum(t - .012, 0) * 30) * (t > .012)), 'band', [1200, 6000]) * .4


def hat(op=False):
    t = T(.22 if op else .05)
    return filt(rng.standard_normal(len(t)), 'high', 8000, 4) * np.exp(-t * (16 if op else 80)) * .18


# Fmaj9 – Am7 – Dm9 – Bbmaj7 (lumineux, rassurant)
CH = [(41, [65, 69, 72, 76, 79]), (45, [64, 67, 69, 72, 76]), (38, [62, 65, 69, 72, 76]), (34, [62, 65, 69, 70, 74])]
syn = np.zeros((N, 2)); drm = np.zeros((N, 2))
# intro 0–4 s
place(syn, pad([53, 60, 64, 67], 4.2, 650), 0, .9)
for k in range(8): place(syn, sub(41, .45), k * .5, .45)
for k in range(16): place(drm, hat(), k * .25, .25 + .15 * (k % 2 == 0), pan=.25 if k % 2 else -.25)
for k, m in enumerate([77, 81, 84, 81]): place(syn, pluck(m, bright=2200), 1.0 + k * .5, .3, pan=.3)
# groove 4–15 s
for bar in range(2, 8):
    t0 = bar * 2.0
    root, notes = CH[(bar - 2) % 4]
    for b in range(4):
        tb = t0 + b * .5
        if tb >= 15: break
        place(drm, kick(), tb, .55 if b in (0, 2) else .0)
        if b in (1, 3): place(drm, snap(), tb, .4)
        place(drm, hat(), tb, .22, pan=-.2); place(drm, hat(b == 3), tb + .25, .3, pan=.2)
    for off, ln in [(0, .4), (.75, .2), (1.0, .4), (1.5, .4)]:
        if t0 + off < 15: place(syn, sub(root, ln), t0 + off, .7)
    place(syn, pad(notes[:4], min(2.0, 15 - t0), 900 + 150 * (bar - 2)), t0, .5)
    for k, idx in enumerate([0, 2, 4, 2, 3, 1, 4, 2]):
        if t0 + k * .25 < 14.9:
            place(syn, pluck(notes[idx] + (12 if k == 6 else 0), bright=1800 + 300 * (bar - 2)), t0 + k * .25, .34, pan=-.35 if k % 2 else .35)
# montée 13,5–15 s
rt = T(1.5)
place(syn, sweep_lp(rng.standard_normal(len(rt)), 300, 9000) * (rt / 1.5) ** 2 * .35, 13.5)
# signature 15–20 s
place(syn, pad([53, 60, 64, 67, 69, 72, 76], 4.9, 2600), 15.0, .8)
place(syn, sub(41, 4.6), 15.0, .6)
place(drm, kick(), 15.0, .8)
for k, m in enumerate([72, 76, 79, 84, 79, 76, 81, 84]):
    place(syn, pluck(m, .6, 2600), 15.5 + k * .5, .22, pan=-.3 if k % 2 else .3)
mus = verb(filt(syn, 'high', 35), IR_L, .32) * .9 + verb(drm, IR_S, .1) * .75
fade = np.ones(N); i0 = int(18.9 * SR); fade[i0:] = np.linspace(1, 0, N - i0) ** 1.6
mus = np.tanh(mus * fade[:, None] * 1.15) / 1.15

# ------------------------------------------------------------------ bruitages
sfx = np.zeros((N, 2))


def whoosh(d, f0, f1, peak, g):
    t = T(d); e = np.where(t < d * peak, (t / (d * peak)) ** 2, np.exp(-(t - d * peak) / (d * .18)))
    x = filt(sweep_lp(rng.standard_normal(len(t)), f0, f1) * e, 'high', 120)
    p = np.linspace(-.6, .6, len(t))
    return np.stack([x * np.sqrt(.5 * (1 - p)), x * np.sqrt(.5 * (1 + p))], 1) * 1.4 * g


def impact(g, tail=1.6):
    t = T(tail); f = 40 + 60 * np.exp(-t * 18)
    x = np.tanh((np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.4) + filt(rng.standard_normal(len(t)), 'band', [500, 6000]) * np.exp(-t * 50) * .35) * 1.4)
    return verb(np.stack([x, x], 1), IR_L, .35) * g


def tick(g=.35, f=2600):
    t = T(.05); x = np.sin(2 * np.pi * f * t) * np.exp(-t * 150)
    return np.stack([x, x], 1) * g


def click(g=.5):
    t = T(.09); x = np.sin(2 * np.pi * 1700 * t) * np.exp(-t * 90) * .7 + np.sin(2 * np.pi * 3400 * t) * np.exp(-t * 160) * .3
    return verb(np.stack([x, x], 1), IR_S, .15) * g


def shimmer(d, g):
    t = T(d); x = sum(np.sin(2 * np.pi * hz(m) * t) for m in (84, 88, 91, 96)) / 4 * (1 + .25 * np.sin(2 * np.pi * 6 * t))
    x *= env(len(t), .05, .2, .6, d * .6)
    return verb(np.stack([x, x * .96], 1), IR_L, .5) * g


place(sfx, impact(.55, 1.3), 0.0)
place(sfx, tick(), .35); place(sfx, tick(), 1.15)
place(sfx, whoosh(.85, 200, 9000, .8, .7), 3.3)
place(sfx, impact(.3, 1.0), 4.0)
place(sfx, tick(), 4.55)
place(sfx, click(.45), 7.2)
place(sfx, whoosh(.7, 300, 7000, .7, .55), 8.6)
for t0 in (10.0, 11.5, 13.0): place(sfx, tick(.4, 3000), t0)
place(sfx, click(.55), 12.35)
place(sfx, whoosh(1.2, 200, 10000, .9, .6), 13.85)
place(sfx, impact(.85, 2.2), 15.0); place(sfx, shimmer(2.2, .3), 15.0)
place(sfx, tick(), 16.6); place(sfx, tick(), 17.2); place(sfx, click(.4), 17.9)
sfx *= fade[:, None]


def save(n, x, peak=.89):
    wavfile.write(n, SR, (x / (np.abs(x).max() + 1e-9) * peak * 32767).astype(np.int16))


save('musique.wav', mus)
save('bruitages.wav', sfx)
print('ok')
