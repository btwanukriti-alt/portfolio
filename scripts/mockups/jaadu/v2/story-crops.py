# python3 story-crops.py: the Jaadu screens and close-ups for the case study, cut from the 1440 x 900 exports at
# their own size (no upscaling, no retouching). Boxes are (left, top, right, bottom) in screen pixels.
# The overnight shortlist cards are left out on purpose: the export repeats one card three times, so the page
# shows a separate, labelled HTML shortlist instead.
import os
from PIL import Image
here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(here, '..', '..', '..', '..', 'public', 'case-studies', 'jaadu', 'story')
os.makedirs(out, exist_ok=True)
CUTS = {
  'terminal': ('terminal', None),
  'terminal-mood': ('terminal', (1048, 330, 1408, 498)),
  'terminal-watchlist': ('terminal', (1048, 510, 1408, 680)),
  'alerts': ('alerts', None),
  'alerts-rule': ('alerts', (175, 360, 1357, 736)),
  'build': ('build', None),
  'build-card': ('build', (488, 212, 1386, 708)),
  'overnight-setup': ('overnight-setup', (470, 100, 1400, 800)),
  # The stage cards below 505px repeat 639 against 245 generated, so the crop stops above them.
  'overnight-running': ('overnight-running', (470, 100, 1400, 505)),
  'overnight-results': ('overnight-results', (470, 100, 1400, 532)),
  'compare': ('compare', None),
  'deja': ('deja', None),
}
for name, (src, box) in CUTS.items():
    im = Image.open(os.path.join(here, 'screens', src + '.png')).convert('RGB')
    if box: im = im.crop(box)
    p = os.path.join(out, name + '.webp')
    im.save(p, 'WEBP', quality=88, method=6)
    print(f'{name}: {im.width}x{im.height} {os.path.getsize(p)//1024}KB')
