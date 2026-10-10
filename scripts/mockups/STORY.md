# Case-study images (src/data/stories.ts)

The five case-study pages show clean screens and close-ups, without callouts, exported from each design's own
HTML source (the same source as the older `v2` boards). Annotations live in the page as HTML captions.

```
cd scripts/mockups
node story-render.mjs pulsefit/v2 gym-crm && python3 story-post.py gym-crm
node story-render.mjs college/v2 college-erp && python3 story-post.py college-erp
node story-render.mjs zync/v2 zync && python3 story-post.py zync
node story-render.mjs ssh-client/v2 ssh-client && python3 story-post.py ssh-client
node story-render.mjs jaadu/v2 jaadu && python3 story-post.py jaadu   # the footprint chart
python3 jaadu/v2/story-crops.py                                      # Jaadu screens (1440 x 900 exports only)
python3 story-sizes.py                                               # writes src/data/storySizes.ts
```

- `<project>/v2/story.js` lists the shots: whole screens and components, plus code-generated crops (`clips`).
- Shots render at 2x and are capped at 2240px wide (a 2x export of the 1064px content column).
- Earlier ERP screens (`college/v2/old-*.png`) and the Jaadu screens are 1x exports. They are converted or
  cropped at their own size and never upscaled.
- Source fixes made for these exports: Zync carbs bar 239 / 281 g = 85% (was 47%); Zync consumed ring fills
  1,385 / 2,250; SSH network card totals match RX 8.7 GB / TX 6.2 GB; SSH secondary text, labels and input borders
  raised for contrast (`--t2 #B4B4BE`, `--mut #9C9CA8`, input edge `#6E6E7A`).
