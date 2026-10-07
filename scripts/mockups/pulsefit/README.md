# Pulsefit CRM mockups (HTML to JPEG)

Source for the Pulsefit CRM case study images. The UI is rebuilt as HTML (`ui.css`, `ui.js`) and the website as `site.css`, `site.js`. The logo is the original vector from Figma node `406:58092` (`mark.js`), read with a read-only `use_figma` call (`exportAsync({format:'SVG_STRING'})`) because Figma's image host is blocked in the cloud session.

Build: put `ui.css`, `site.css` in a `<style>`, a sprite of the line icons, an empty `<div id="lib">` (positioned off screen), then the scripts `mark.js`, `ui.js`, `site.js`, then `modules.html`. `render.mjs <page.html> <outdir>` writes the ten 2400px JPEGs. Every name and number is sample data.
