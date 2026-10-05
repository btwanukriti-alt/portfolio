# clihub: 18.7s product-flow cut (loop)

Build: `clihub-video/prototype-cut` (`npm run embed` writes `public/showcase/clihub.html`). Real screens from Figma *Portfolio* (section 250:32492) are shown as a working prototype.

**Brief (Anu, rounds 6–8):** show the flow of how the product is used; in Monitor, show all five dashboard tabs; make it more engaging with zoom in / zoom out and more infographics.

**Camera (rounds 9–10):** full view by default. The window frame stays fixed and the screen zooms inside it. The camera zooms only to highlight a key moment, with a short punch-in (about 0.3s in, a brief hold, back out). There are three:
- **Create Host:** the click.
- **Ask AI:** the answer.
- **Connect to Host:** the click that starts the upload.

The **Connect** and **Monitor (dashboard)** steps never zoom.

**Infographic callouts (round 8):** dark cards beside the frame, each tied to its spot in the UI by a dashed leader line and a pulsing target dot that follow the camera.
- **New host:** a checklist (Address / Port / Label).
- **SSH handshake:** a 3-segment progress bar, then Connected.
- **Uptime:** a counter plus a 15-day bar.
- **CPU:** a donut to 45%, plus a sparkline of the day traced from the CPU chart.
- **Disk:** a used/free stacked bar with a legend.
- **Eth0:** live download/upload bars.
- **Processes:** proportional bars.
- **Ask AI:** the question types out and an answer chip appears (`find . -name "*.txt"`).
- **Transfer:** a computer → server diagram with a moving file, a progress bar and "Uploaded". Kept from earlier rounds: the selection-drag intro, grey background only, no drop shadows.

The headline pill reads "Step N of 5". A step rail under the window fills the current step and checks off the finished ones.

| Time | Step | Headline | Screen and action |
|---|---|---|---|
| 0.0–1.4 | Open | (none) | The cursor drags out a Figma-blue selection box with a live size label (1280 × 832); the app window fills it. |
| 1.4–4.6 | 1 · Add a host | Add a host in seconds. | New Host panel (250:35175). Click Host Address and type 192.168.1.100; click Label and type API Gateway; click **Create Host**. Callout: ✓ Host created. |
| 4.6–7.4 | 2 · Connect | Connect in one click. | The connection ring fills from key to server. Starting connection, Authenticating and Exporting key check off; the shield turns green. Callout: Status · Connected. |
| 7.4–13.0 | 3 · Monitor | Watch it live. | The host stats dashboard (chrome from 250:33200). The cursor clicks through all five tabs; the underline slides and the content switches in place: **Overview** (Uptime 15 days, 6 hours · Connected), **Performance** (CPU ring to 45%), **Storage** (184 GB of 200 GB), **Network** (Eth0 1.1 / 1.6 MB/s with live bars), **Activity** (Processes 187 total, 3 running, 240 sleeping). |
| 13.0–15.7 | 4 · Run commands | Run commands, with AI to help. | Terminal; the cursor clicks Ask AI and the panel slides in. Callout types "How do I find all .txt files in a directory?". |
| 15.7–18.1 | 5 · Move files | Move files across, side by side. | SFTP: select Backups, then Connect to Host. Callout: Backups → API Gateway, uploading to 100%, Uploaded. |
| 18.1–18.7 | Loop | | Pushes past the lens with a blur; the loop restarts. |

## Fixes painted over the captures
- **SFTP recent connections:** "192.333.4.545" (not a valid IP) → **192.168.1.100**.

## Invented for the flow
- **Typed values:** 192.168.1.100 and API Gateway, typed into the New Host form.
- **Callouts:** "Host created", and the Backups upload progress.
