# Swaps the placeholder "Fit Flow" logo on the website frame for Pulsefit (step 1 of 2).
# Clears the old logo in the nav and the footer by filling each column from the pixels just
# above and below it, so the gradient behind carries on. website-logo.mjs then draws the logo.
import sys
import numpy as np
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
im = np.asarray(Image.open(src).convert('RGB')).astype(float)
for x0, y0, x1, y1 in [(180, 46, 362, 92), (180, 5932, 362, 5982)]:
    top, bot = im[y0 - 1, x0:x1], im[y1, x0:x1]
    for y in range(y0, y1):
        t = (y - y0 + 1) / (y1 - y0 + 1)
        im[y, x0:x1] = top * (1 - t) + bot * t
Image.fromarray(im.clip(0, 255).astype('uint8')).save(out)
