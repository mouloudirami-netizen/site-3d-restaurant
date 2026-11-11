"""Voix off féminine (Kokoro TTS, voix française ff_siwis), avec plusieurs variantes de test.
Usage : python3 generer_voix.py <dossier_modele_kokoro> <dossier_sortie> [variante]
Variantes : siwis (voix d'origine), siwis-posee (plus lente), siwis-emma, siwis-sara (mélanges plus matures)."""
import sys, re, numpy as np
from scipy.io import wavfile
from kokoro_onnx import Kokoro

MODEL, OUT = sys.argv[1], sys.argv[2]
VARIANTE = sys.argv[3] if len(sys.argv) > 3 else 'siwis'
k = Kokoro(f"{MODEL}/kokoro-v1.0.onnx", f"{MODEL}/voices-v1.0.bin")

# Nom de marque : « Skaï-nèt Éï-djeun-si » (anglais SkyNet Agency), écrit directement en phonèmes.
MARQUE = "skˈajnɛt ˈejdʒənsi"
LIGNES = [
    ("Vous avez une entreprise ?", 1.0, {}),
    ("Offrez-lui un site web moderne, élégant et à son image.", 1.0, {}),
    ("Présentez vos services et facilitez le contact avec vos clients.", 1.0, {"sɛʁvˈisz e": "sɛʁvˈis e"}),
    ("Contactez SKYNET AGENCY et créons votre site web ensemble.", 1.0, {}),
]
VARIANTES = {
    'siwis':        (0.95, [('ff_siwis', 1.0)]),
    'siwis-posee':  (0.90, [('ff_siwis', 1.0)]),
    'siwis-emma':   (0.94, [('ff_siwis', 0.75), ('bf_emma', 0.25)]),
    'siwis-sara':   (0.94, [('ff_siwis', 0.75), ('if_sara', 0.25)]),
}
vitesse, melange = VARIANTES[VARIANTE]
style = sum(k.get_voice_style(n) * w for n, w in melange)

for i, (texte, _, corr) in enumerate(LIGNES, 1):
    if 'SKYNET AGENCY' in texte:
        avant, apres = texte.split('SKYNET AGENCY')
        ph = (k.tokenizer.phonemize(avant.strip(), 'fr-fr') + ' ' + MARQUE + ' ' + k.tokenizer.phonemize(apres.strip(), 'fr-fr'))
    else:
        ph = k.tokenizer.phonemize(texte, 'fr-fr')
    for a, b in corr.items():
        ph = ph.replace(a, b)
    ph = re.sub(r"\((en|fr)\)", "", ph)
    s, sr = k.create(ph, voice=style, speed=vitesse, is_phonemes=True)
    wavfile.write(f"{OUT}/v{i}.wav", sr, (np.clip(s, -1, 1) * 32767).astype(np.int16))
    print(VARIANTE, i, f"{len(s) / sr:.2f} s |", ph)
