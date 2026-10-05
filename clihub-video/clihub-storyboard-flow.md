# clihub: 18.7s product-flow cut (loop)

Build: `clihub-video/prototype-cut` (`npm run embed` writes `public/showcase/clihub.html`). Real screens from Figma *Portfolio* (section 250:32492) are shown as a working prototype.

**Brief (Anu, rounds 6–13):** show the flow of how the product is used; in Monitor, show all five dashboard tabs; make it more engaging with more infographics. (Zooms were tried in rounds 8–10 and removed in round 11.)

**Camera (round 11):** no zoom anywhere. The screen stays at full view for the whole cut; the motion comes from the cursor, screen changes, callouts and the loop transition.

**Motion (round 13, Figma prototype standard):**
- **Screen changes:** Smart Animate style. The frame stays put; the old content dissolves out rising 10px, and the new content rises 18px into place with an expo ease-out.
- **Cursor:** moves on slight arcs with quint timing and presses on click with a soft white tap (no ripple ring).
- **Interaction states:**
  - a purple focus ring on the field being typed in;
  - a pressed state on Create Host;
  - a hover highlight on each dashboard tab just before it's clicked.
- **Callouts:** settle on a gentle spring; the leader line draws, then the target dot pops.
- **Frame label:** a grey "Desktop" label sits above the frame, like a Figma frame name.
- **Window fill:** after the selection drag, the window fills with an expo ease.
- **Loop exit:** a clean dissolve with a 16px lift (no zoom or blur).

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

**Text (round 12):** there are no step indicators (no "Step N of 5" pill and no step rail). Each step has its headline and one plain line beneath it:
1. Enter its address, give it a label and save.
2. The key is verified and a secure SSH session opens.
3. Uptime, CPU, storage, network and processes, one tab each.
4. Ask in plain words and get the command back.
5. Pick a folder on your computer and send it to the server.

| Time | Step | Headline | Screen and action |
|---|---|---|---|
| 0.0–1.4 | Open | (none) | The cursor drags out a Figma-blue selection box with a live size label (1280 × 832); the app window fills it. |
| 1.4–4.6 | 1 · Add a host | Add a host in seconds. | New Host panel (250:35175). Click Host Address and type 192.168.1.100; click Label and type API Gateway; click **Create Host**. Callout: ✓ Host created. |
| 4.6–7.4 | 2 · Connect | Connect in one click. | The connection ring fills from key to server. Starting connection, Authenticating and Exporting key check off; the shield turns green. Callout: Status · Connected. |
| 7.4–13.0 | 3 · Monitor | Watch it live. | The host stats dashboard (chrome from 250:33200). The cursor clicks through all five tabs; the underline slides and the content switches in place: **Overview** (Uptime 15 days, 6 hours · Connected), **Performance** (CPU ring to 45%), **Storage** (184 GB of 200 GB), **Network** (Eth0 1.1 / 1.6 MB/s with live bars), **Activity** (Processes 187 total, 3 running, 240 sleeping). |
| 13.0–15.7 | 4 · Run commands | Run commands, with AI to help. | Terminal; the cursor clicks Ask AI and the panel slides in. Callout types "How do I find all .txt files in a directory?". |
| 15.7–18.1 | 5 · Move files | Move files across, side by side. | SFTP: select Backups, then Connect to Host. Callout: Backups → API Gateway, uploading to 100%, Uploaded. |
| 18.1–18.7 | Loop | | Dissolves with a small lift; the loop restarts. |

## Fixes painted over the captures
- **SFTP recent connections:** "192.333.4.545" (not a valid IP) → **192.168.1.100**.

## Invented for the flow
- **Typed values:** 192.168.1.100 and API Gateway, typed into the New Host form.
- **Callouts:** "Host created", and the Backups upload progress.
