# Collects the full screens and framed devices into ./a/ for tiles.html. Run from the repo root:
#   python3 scripts/mockups/hero/prep.py   (after rendering the Pulsefit screens, see README)
from PIL import Image
import os
A = 'scripts/mockups/hero/a/'
os.makedirs(A, exist_ok=True)
trim = lambda im: im.crop(im.getchannel('A').getbbox())
cs = 'public/case-studies/'
cf = Image.open(cs + 'college-management/ui/laptops-drawer-finance.webp').convert('RGBA')
trim(cf.crop((0, 0, 2712, 1700))).save(A + 'col-drawer.png')
trim(cf.crop((0, 1740, 2712, 3448))).save(A + 'col-finance.png')
trim(Image.open(cs + 'college-management/ui/laptop-staff.webp').convert('RGBA')).save(A + 'col-staff.png')
for n in ['food', 'gym', 'home', 'water', 'workout']:
    trim(Image.open(cs + f'zync/ui/phone-{n}.webp').convert('RGBA')).save(A + f'zy-{n}.png')
for n in ['hosts', 'terminal']:
    Image.open(cs + f'ssh-client/ui/{n}.webp').save(A + f'ssh-{n}.png')
for n in ['alerts', 'footprint', 'library', 'overnight', 'tablet', 'mobile']:
    Image.open(f'scripts/mockups/jaadu/real/s-{n}.png').save(A + f'ja-{n}.png')
