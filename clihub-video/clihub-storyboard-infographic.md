# clihub: 11.6s infographic cut (loop)

Source: Figma *Portfolio*, section 250:32492. Build: `clihub-video/figma-cut` (`npm run embed` writes `public/showcase/clihub.html`).

**Brief (Anu, round 2):** highlight the product's features with effects and an infographic flow. It should be engaging at first sight, simple to understand and not complex, and look different from the Pulsefit template (no Figma editor frame or vocabulary).

- **Canvas:** a soft radial gradient built on Anu's grey-blue swatch (`#B9C7DB`), with a slow drifting white light, a product-purple glow behind the focal element and faint grain. Full bleed, with no frame or pastel shapes.
- **Type:** a pill label with a purple dot, then a Poppins 600 headline whose words rise out of a blur one at a time. Portrait headlines break into two lines by hand.
- **Transitions:** zoom-through. Each scene leaves by pushing past the viewer with a blur, and the next arrives from slightly behind.
- **Effects:** beams drawn by length with glowing pulses travelling along them, light sweeps across cards, entrances that rise from depth with a small tilt, ring charts and counters.
- **Compositions:** landscape 1920×1080 and portrait 1080×1920. The stage extends to the canvas aspect, and the extra room is shared above, between and below.

| Time | Beat | Label / headline | Visuals |
|---|---|---|---|
| 0.0–3.4 | Hub | SSH CLIENT FOR DESKTOP / **All your servers, one app.** | The app tile (a prompt glyph, with a ring pulse) sits at the centre. Beams draw out to four host groups (Production Servers, AWS Infrastructure, Azure Resources, DigitalOcean Droplets), and pulses travel along them; each group's dot turns green as a pulse arrives. A badge counts to **64 hosts**. |
| 3.2–7.0 | Connect | HOSTS / **Connect in one click.** | The API Gateway Host Card rises in, and the cursor clicks **Connect** (ripple, status turns green, button becomes Disconnect, light sweep). A beam carries pulses to a panel, which checks off *Host key verified*, *Encrypted SSH channel* and *Session started*, then becomes live stats: CPU ring 34%, RAM ring 52%, uptime 15 days, 3 active sessions. |
| 6.8–11.6 | Features | BUILT IN / **Terminal, files, tunnels and keys.** | Four tiles rise in one after another, each with a live mini-infographic. **Terminal:** `ssh admin@192.168.1.100` types, connects, `df -h` shows /dev/sda1 at 81%, and an Ask AI chip pops. **Files:** release.zip arcs from This computer to API Gateway, with a progress bar to Uploaded. **Tunnels:** localhost:5432 ⇢ PostgreSQL with traffic flowing, and Local / Remote / Dynamic light in turn. **Keys:** id_rsa RSA 4096 generates, then its fingerprint types out. The tiles then fly into the centre, and the hub tile pops back to start the loop. |

## Data notes (from the file)
- Host groups and "16 hosts" each come from the Hosts screen; 64 is their sum.
- API Gateway, Ubuntu 22.04 LTS, 192.168.1.100, CPU 34%, RAM 52%, uptime 15 days and 3 active sessions come from the Host Card (250:36130) and the host Overview (250:34295).
- Disk "/dev/sda1 above 80%" comes from Security Insights; Ask AI from the Terminal screens; Local / Remote / Dynamic and PostgreSQL Database from Port Mapping; RSA 4096 from Active Sessions; key generate and import from Key Manager.

## Refinements and invented values
- "Digital Ocean Dorplets" → **DigitalOcean Droplets** (typo).
- Host Card IP "192.333.4.545" (not a valid IP) → **192.168.1.100**, the host's IP on its Overview.
- **Invented for the motion:**
  - the handshake step names;
  - the file name "release.zip" and folders "~/builds" → "/var/www";
  - "localhost:5432" and "db-server:5432";
  - the key name "id_rsa" and its fingerprint text;
  - the terminal output line "/dev/sda1 81% used" (based on the "above 80%" insight).
- No logo or wordmark. The hub tile uses a generic prompt glyph, and provider marks are simplified vector redraws.
