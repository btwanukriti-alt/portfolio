# Lifts a dark UI's near-black surfaces into its brand's dark colour, so the screen reads on the
# hero (bright text and accents stay as they are).
#   python3 lift.py <in.png> <out.png> <#tint> [strength]
import sys
import numpy as np
from PIL import Image
src, dst, tint = sys.argv[1:4]
amt = float(sys.argv[4]) if len(sys.argv) > 4 else 1.0
a = np.asarray(Image.open(src).convert('RGB'), float) / 255
t = np.array([int(tint[i:i + 2], 16) for i in (1, 3, 5)], float) / 255
lum = a @ np.array([0.2126, 0.7152, 0.0722])
k = (np.clip((0.32 - lum) / 0.32, 0, 1) ** 0.8 * amt)[..., None]
out = a * (1 - k) + (t + a * 0.9) * k
Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8)).save(dst)
