# python3 story-post.py <slug>: converts .story-out/<slug>/*.png to WebP in public/case-studies/<slug>/story/ and
# prints each file's size for src/data/stories.ts. A shot's `max` caps its width (a 2x export of the display size).
import json, os, sys
from PIL import Image
slug = sys.argv[1]
src = os.path.join('.story-out', slug)
dst = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'case-studies', slug, 'story')
os.makedirs(dst, exist_ok=True)
for m in json.load(open(os.path.join(src, 'manifest.json'))):
    im = Image.open(os.path.join(src, m['name'] + '.png'))
    if m['max'] and im.width > m['max']:
        im = im.resize((m['max'], round(im.height * m['max'] / im.width)), Image.LANCZOS)
    path = os.path.join(dst, m['name'] + '.webp')
    im.save(path, 'WEBP', quality=84, method=6)
    print(f"{m['name']}: {im.width}x{im.height} {os.path.getsize(path)//1024}KB")
