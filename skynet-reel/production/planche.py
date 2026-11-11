import sys, glob
from PIL import Image
files = sorted(glob.glob(sys.argv[1]))
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 6
w, h = 360, 640
rows = (len(files) + cols - 1) // cols
s = Image.new('RGB', (cols * w, rows * h), 'black')
for i, f in enumerate(files):
    s.paste(Image.open(f).convert('RGB').resize((w, h)), ((i % cols) * w, (i // cols) * h))
s.save(sys.argv[2])
