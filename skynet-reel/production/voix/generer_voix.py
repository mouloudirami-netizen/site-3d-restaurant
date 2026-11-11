"""Voix off féminine (Kokoro TTS, voix française ff_siwis) avec corrections de prononciation."""
import sys, re, numpy as np
from scipy.io import wavfile
from kokoro_onnx import Kokoro

MODEL = sys.argv[1]   # dossier contenant kokoro-v1.0.onnx et voices-v1.0.bin
OUT = sys.argv[2]
k = Kokoro(f"{MODEL}/kokoro-v1.0.onnx", f"{MODEL}/voices-v1.0.bin")
LIGNES = [
    ("Vous avez une entreprise ?", 0.92, {}),
    ("Offrez-lui un site web moderne, élégant et à son image.", 0.95, {}),
    ("Présentez vos services et facilitez le contact avec vos clients.", 0.97, {"sɛʁvˈisz e": "sɛʁvˈis e"}),
    ("Contactez Skynet Agency et créons votre site web ensemble.", 0.95,
     {"skˈaɪnɪt ˈeɪdʒənsi": "skˈajnɛt ˈɛjdʒɛnsi"}),
]
for i, (texte, vitesse, corr) in enumerate(LIGNES, 1):
    ph = k.tokenizer.phonemize(texte, "fr-fr")
    for a, b in corr.items():
        ph = ph.replace(a, b)
    ph = re.sub(r"\((en|fr)\)", "", ph)
    s, sr = k.create(ph, voice="ff_siwis", speed=vitesse, is_phonemes=True)
    wavfile.write(f"{OUT}/v{i}.wav", sr, (np.clip(s, -1, 1) * 32767).astype(np.int16))
    print(i, round(len(s) / sr, 2), "s |", ph)
