# clihub: UI-prototype cut (18.9s loop)

Build: `clihub-video/prototype-cut` (`npm run embed` writes `public/showcase/clihub.html`). Source screens come from Figma *Portfolio*, section 250:32492.

**Brief (Anu, round 3):** keep how the 20s cut shows the UI, as a working prototype of the real screens: the Host Card expanding, the connection ring, the Stats tabs with callouts, and the terminal with the Ask AI panel. Replace its dark-blue background and its hub intro.

- **Background:** a grey-blue gradient (Anu's swatch `#B9C7DB`), with a slow drifting white light, a soft purple key glow under the screens, a white light sweep at each cut and faint grain. The dark-blue grid, dust and vignette are gone.
- **Headlines:** dark ink, Outfit 600, words rising out of masks; a white glass pill eyebrow with a purple dot.
- **Transitions:** zoom-through between shots (as in the 20s cut). The last shot zooms out and the opening fades in, so the loop is seamless.
- **Format:** one 1920×1080 composition. On other aspects the backdrop fills the extra room; on tall screens up to 100px of empty side margin is cropped.

| Time | Shot | Eyebrow / headline | Visuals |
|---|---|---|---|
| 0.0–4.2 | Opening (new) | SSH CLIENT FOR DESKTOP / **All your servers in one app.** | The real Hosts screen rises in from a 3D tilt and settles. The camera pushes in on the host groups, the cursor glides in, **Production Servers** highlights, and it is clicked (ripple). |
| 3.6–9.7 | Connect | HOSTS / **Connect in one click.** | The API Gateway Host Card expands (Ubuntu · SSH · CPU 34% · RAM 52%), and the cursor clicks **Connect**. The connection ring fills from key to server; Starting connection, Authenticating and Exporting key check off; the shield turns green. |
| 9.1–14.9 | Live stats | HOST STATS / **Live stats for every host.** | The Stats screen on Performance, with a Total CPU Usage callout counting to 45%. The cursor clicks **Network**; the tab underline slides, the content crossfades, and Eth0 shows Download 1.1 / Upload 1.6 MB/s with live bars. |
| 14.3–18.9 | Terminal | TERMINAL / **A terminal with AI built in.** | The terminal window rises, the cursor opens the panel, Ask AI slides in, and a callout types "How do I find all .txt files in a directory?". |

## Changes from the 20s cut
- The hub intro is replaced by the real Hosts screen (250:32498).
- The black/electric-blue backdrop is replaced by the grey-blue canvas; shadows are softened for the light background; the accent glow is the app's purple.
- The closing hub reprise and fade to black are removed; the cut loops instead.

## Refinements to the screens
- **Hosts screen (painted over the capture):**
  - the duplicated third row (Azure Resources and Digital Ocean again) is cleared;
  - "Digital Ocean Dorplets" now reads **DigitalOcean Droplets**.
- **Host Card IP:** "192.333.4.545" (not a valid IP) → **192.168.1.100**, the host's IP on its Overview.
