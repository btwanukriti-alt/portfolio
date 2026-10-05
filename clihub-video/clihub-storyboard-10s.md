# clihub: 10s Figma-style cut (loop)

Source: Figma *Portfolio*, section 250:32492 (Hosts, Terminal, Serial). Build: `clihub-video/figma-cut` (`npm run embed` writes `public/showcase/clihub.html`).

- **Canvas:** one grey-blue pastel `#B9C7DB` (chosen by Anu for this cut, instead of the default lilac) inside the black Figma selection frame. Soft pink circle, yellow pill, violet star and white ring drift slowly. No dot grid, no toolbar, one unnamed cursor.
- **Compositions:** landscape 1920×1080 and portrait 1080×1920. The stage extends to the canvas aspect, and the extra room is shared above the title, between title and content, and below the content.

| Time | Scene | Copy (eyebrow / title) | Visuals |
|---|---|---|---|
| 0.0–3.6 | Intro | SERVER ACCESS / **SSH client for desktop** | The cursor drags out a frame ("Hosts") with a live size label, up to 1040 × 480. It fills with the Hosts dashboard, whose host counts count up. Three components land at 1.2×, each selected as it lands: *Host Card* (API Gateway), *Port Mapping Card* (PostgreSQL Database) and *Security Insights*. |
| 3.6–7.6 | Feature | HOSTS / **Connect to a host in one click.** | The *Host Card* (1.6× landscape, 1.9× portrait) lands, and the cursor clicks **Connect** with a ripple. The status dot turns green and the button becomes **Disconnect**. An "On click" noodle draws to *Host Info*, where Active Sessions counts to 3 and Uptime to 15 days, 6 hours. |
| 7.6–10.0 | Close | MODULES / **Hosts, terminal, port mapping and SFTP.** | Six module tiles drop in scattered, then snap into an auto-layout grid (3×2 landscape, 2×3 portrait). The cursor selects the frame (Hug × Hug), and pink 28px gap markers show. |

Scenes fade and lift out together, and the loop returns to the intro on the same background.

## Data notes
- Host Info values come from the host Overview (250:34295): Ubuntu 22.04 LTS, 192.168.1.100, port 22, 3 active sessions, uptime 15 days 6 hours, Connected.
- Host Card (250:36130), Port Mapping card (250:38685) and Security Insights rows (250:34295) are as in the file.
- Module names come from the sidebar (Hosts, Terminal, Port Mapping, SFTP) and the screens under More (Key Manager, Known Host).

## UI refinements (changes from the file)
- "Digital Ocean Dorplets" → **DigitalOcean Droplets** (typo).
- Host Card IP "192.333.4.545" (not a valid IP) → **192.168.1.100**, the host's IP on its Overview.
- The Hosts list repeats Azure Resources and Digital Ocean in its third row. These were replaced with **Staging Servers** (Parent Group) and **Database Cluster** (Database tag); both are invented.
- Host counts were "16 Hosts" on every group; now **16, 12, 9, 8, 6, 4** (invented, so the count-up reads).
- "Active Sesssions" → **Active Sessions** (typo).
- "Known Host" → **Known Hosts** for the module tile.
- Module tile sublines are short descriptions written from the screens: "Groups, vaults and favourites", "Packages, history and Ask AI", "Local, remote and dynamic", "File explorer for every host", "Generate and import keys", "Trusted host fingerprints" (the last is inferred from the Known Host screen).
- No logo or wordmark. The sidebar keeps its home button, and the top bar keeps the Personal Vault switcher.
- Provider marks (AWS, Azure, DigitalOcean, Ubuntu) are simplified vector redraws.
