# clihub: 12s cut (loop)

Build: `clihub-video/prototype-cut` (`npm run embed` writes `public/showcase/clihub.html`). Real screens from Figma *Portfolio* (section 250:32492) are shown as a working prototype.

**Brief (Anu, round 5):** open with a dragged selection box, then the UI; add more feature UI. Kept from round 4: the dashboard leads, grey background only, no drop shadows.

| Time | Beat | Visuals |
|---|---|---|
| 0.0–1.5 | Selection drag | The cursor presses and drags out a Figma-blue selection box (white corner handles, live size label up to 1008 × 702). The API Gateway stats dashboard fills it, and the selection fades. The headline rises: SSH CLIENT · HOST STATS / **Everything about a server, one tab away.** |
| 1.5–6.5 | Dashboard | Overview (callout: Uptime 15 days, 6 hours · Connected). Then clicks to Performance (CPU ring to 45%), Storage (184 GB of 200 GB) and Network (Download 1.1 / Upload 1.6 MB/s). |
| 6.5–11.2 | More features | The headline changes: BUILT IN / **Terminal, files, tunnels and keys.** The window steps through four real screens, each with a label chip and one cursor click: **Terminal + Ask AI** (the Ask AI panel slides in), **SFTP** (Connect to Host), **Port mapping** (Connect on a tunnel) and **Key manager**. |
| 11.2–12.0 | Loop | Everything pushes past the lens with a blur and the loop restarts. |

- **Background:** grey only (a gradient on `#B9C7DB` with a drifting light and grain).
- **Shadows:** none anywhere; the screens have a thin light outline.
- **Tab switches:** staggered, so screens never ghost.

## Fixes painted over the captures
- **SFTP recent connections:** "192.333.4.545" (not a valid IP) → **192.168.1.100**.

## Left as in the file
- **Port mapping:** "Dev App Tunnel" appears twice.
- **Key manager:** repeats "Windows Hello", "YubiKey 5 NFC" and "Production Server Key" cards.
