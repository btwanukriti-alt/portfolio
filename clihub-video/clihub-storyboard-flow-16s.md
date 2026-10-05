# clihub: 16s product-flow cut (loop)

Build: `clihub-video/prototype-cut` (`npm run embed` writes `public/showcase/clihub.html`). Real screens from Figma *Portfolio* (section 250:32492) are shown as a working prototype.

**Brief (Anu, round 6):** show the flow of how the product is used. Kept from earlier rounds: the selection-drag intro, grey background only, no drop shadows.

The headline pill reads "Step N of 5". A step rail under the window fills the current step and checks off the finished ones.

| Time | Step | Headline | Screen and action |
|---|---|---|---|
| 0.0–1.4 | Open | (none) | The cursor drags out a Figma-blue selection box with a live size label (1280 × 832); the app window fills it. |
| 1.4–4.6 | 1 · Add a host | Add a host in seconds. | New Host panel (250:35175). Click Host Address and type 192.168.1.100; click Label and type API Gateway; click **Create Host**. Callout: ✓ Host created. |
| 4.6–7.4 | 2 · Connect | Connect in one click. | The connection ring fills from key to server. Starting connection, Authenticating and Exporting key check off; the shield turns green. Callout: Status · Connected. |
| 7.4–10.3 | 3 · Monitor | Watch it live. | Performance stats (250:33200); the cursor hovers the CPU chart. Callouts: Total CPU Usage ring to 45%, and Uptime 15 days, 6 hours. |
| 10.3–13.0 | 4 · Run commands | Run commands, with AI to help. | Terminal; the cursor clicks Ask AI and the panel slides in. Callout types "How do I find all .txt files in a directory?". |
| 13.0–15.4 | 5 · Move files | Move files across, side by side. | SFTP: select Backups, then Connect to Host. Callout: Backups → API Gateway, uploading to 100%, Uploaded. |
| 15.4–16.0 | Loop | | Pushes past the lens with a blur; the loop restarts. |

## Fixes painted over the captures
- **SFTP recent connections:** "192.333.4.545" (not a valid IP) → **192.168.1.100**.

## Invented for the flow
- **Typed values:** 192.168.1.100 and API Gateway, typed into the New Host form.
- **Callouts:** "Host created", and the Backups upload progress.
