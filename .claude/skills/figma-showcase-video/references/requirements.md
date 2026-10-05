# Showcase video: design and motion requirements

These are the requirements Anu settled on for the portfolio's product showcase videos, over many rounds of feedback on the Pulsefit cut. The reference build is `pulsefit-video/figma-cut` (10s, lilac). Each rule includes the reason behind it, so it can be applied to a new product rather than copied blindly.

## Contents
1. Purpose
2. Format and structure
3. Canvas and background
4. Figma editor vocabulary
5. Text
6. UI content
7. Layout
8. Motion
9. Do not use (rejected in feedback)
10. Done checklist

---

## 1. Purpose
The video plays in the portfolio's Selected Work card boxes and at the top of the case study. Someone seeing it for the first time should understand within a couple of seconds what kind of product this is and what it does. It should feel like a designer's work on a Figma canvas: polished, calm, and specific.

## 2. Format and structure
- **Length:** about **10 seconds**, looping seamlessly.
- **Pace:** calm, never rushed. Keep 10 seconds by showing fewer things, not by speeding motion up.
- **Three scenes:**

| Scene | Time | Job |
|---|---|---|
| Intro | about 0–3.6s | Say what the product is and show it. The title names the category, e.g. "Gym management software", with one plain line beneath. The cursor draws a frame, which fills with the product's main dashboard. Three real component cards land around it. |
| Feature | about 3.6–7.6s | One key flow, built from the product's real components. For example: a card, then the cursor clicks the primary action, then a prototype noodle ("On click") draws to the result card, whose value counts up. |
| Close | about 7.6–10s | The product's modules, from the sidebar, drop in and snap into an auto-layout grid. |

- **Two compositions:** landscape (1920×1080 stage) and portrait (1080×1920 stage), chosen by the viewport's aspect. Each is scaled to fit.

## 3. Canvas and background
- **One bright, Figma-like pastel for the whole video.** The default is lilac `#DCCFFF`. Don't change colour between scenes; keep it lilac unless asked.
- **A few soft pastel shapes** drift very slowly: a pink circle `#FFC2DD`, a yellow pill `#FFE07A`, a violet star `#A48CFF` and a white ring. Add a gentle white key light in the centre and faint grain at about 12% overlay.
- **No dot grid.** It looked bad.
- **Black selection frame around the canvas.** It shows the whole video as a selected Figma frame:
  - a 1.5px `#111` border, inset from the viewport edges by about 2.2% of the short side, clamped to 10–28px;
  - white square handles with a 1.5px `#111` edge at the four corners.
- **The canvas is clipped inside that frame.** Nothing crosses it: no shapes, no cards, no background. Outside the frame is a plain light margin, `#F4F2FA`. Scale the composition to the inner rect, not the full viewport.

## 4. Figma editor vocabulary (inside the canvas)
Use these, because they are what make it read as "designed in Figma":
- **Selection boxes:** blue `#0D99FF`, 2px, with white square corner handles. Add a size label below in a blue pill, e.g. `400 × 294` or `Hug × Hug`. Show one on an element while it is created, dragged or lands, then fade it.
- **Component labels:** purple `#9747FF` text with the four-diamond component icon, above the selection (`Lead Card`, `Assign Plan`).
- **Frame name label:** small grey text above a drawn frame's top-left (e.g. "Members dashboard").
- **Prototype noodle:** a blue curve drawn by path length, with a white start dot, an arrowhead and an "On click" pill.
- **Auto-layout spacing:** pink `#F24822` hatched gap markers with a value pill ("24").
- **Cursor:** **one** dark cursor (`#111` with a white edge) with **no name tag**. It's one designer's portfolio, so multiplayer cursors and names don't belong. It presses (scales slightly) and shows a soft grey ripple on click.
- **No Figma toolbar** (the bottom edit bar).

## 5. Text
- **Text sits at the top only.** It is centred:
  - an uppercase **eyebrow**: Poppins 500, about 19px, `0.16em` tracking, `#3D3A5C`;
  - a one-line **title**: Poppins 500, about 62px, `-0.035em`, ink `#0F1222`;
  - on portrait, the title wraps to two lines at about 76px.
- **Plain, true copy. No exaggeration.** "Convert a lead into a member." is right; "Turn *every* lead into a member." overclaims. "Members, leads, plans and more." beats "Everything your gym runs on."
- **No product name or logo, unless the user asks for it.**
  - Describe the category instead ("Gym management software").
  - Remove the logo and wordmark from the rebuilt UI too; in a sidebar, show the workspace switcher instead.
  - Page and artifact titles are generic ("Gym Management Showcase").
- No paragraphs, no metrics or claims that aren't in the designs.

## 6. UI content
- **Rebuild screens and components as vector React from the user's Figma file.** Use the Figma MCP: `get_metadata`, plus `get_screenshot` with base64 when figma.com assets are blocked. Never embed screenshots.
- **Use real values from the file.** Polish placeholders to production quality and list every change:
  - initials avatars instead of photos;
  - real names in place of "Plan Name";
  - fix typos;
  - remove lorem ipsum.
- **Show frames whole when they are at rest.** Don't crop a screen in a way that hides that it is a full screen.
- **Use only well-designed screens.** Skip screens with placeholder names, plain forms or repetition.

## 7. Layout
- **Fill the space under the title.** Content is centred vertically in the area below it. There should be no large empty band at the bottom; it looks incomplete.
- **Intro:** the dashboard frame is large, about 1040×480 on landscape. Cards sit at about 1.2× scale, two on one side and one on the other, overlapping the frame edge slightly.
- **Feature:** cards at about 1.6× scale, centred around y ≈ 700 on landscape.
- **Close:** tiles of about 340×124 on landscape; portrait uses a 2-column grid with taller tiles (about 160px).
- **Check** 1920×1080, 1366×768, 1280×800, 390×844 and 820×1180. Nothing should clip, overlap the title or leave a big empty area.

## 8. Motion
- **Easing:**
  - entrances: snappy ease-out (expo);
  - landings: a small back pop;
  - moves: smooth ease-in-out;
  - no bounce beyond a slight pop.
- **Timing:** hold each state long enough to read. Counters count up to the design's values, and paths draw by length.
- **Intro:**
  1. The cursor drags out the frame, with a live size label.
  2. The frame fills with the dashboard, whose KPIs count up.
  3. The cards fly in one after another, each selected as it lands.
- **Scene changes: everything in a scene fades and lifts out *together*, including frames.** Then the next scene fades in on the same background.
  - A frame left behind on its own reads as a glitch.
  - There are no colour wipes, since the background never changes.
- **Loop:** the close fades out and the intro starts on the same lilac, with no jump.
- **Rendering:** every frame is a pure function of the clock `t`. This makes the video seekable, lets it pause in the embed, and makes frame captures exact.

## 9. Do not use (rejected in feedback)
- Saturated or bright colour stages, or a different background per scene.
- Muted grey canvases, and camera "tours" across many screens on one canvas.
- Screens simply placed on a background with no motion story.
- Captions in a side column; big bold Inter Tight headlines with highlight pills.
- The dot grid, the Figma toolbar, multiplayer cursors and name tags, and comment pins from teammates.
- Isometric layer intros.
- The product's logo or name (unless asked).
- Fast pacing, compressed timelines and exaggerated copy.

## 10. Done checklist
- [ ] Is it about 10s, does it loop seamlessly, and is it calm?
- [ ] Is it one lilac (or the chosen pastel) background, with no dot grid?
- [ ] Is the black selection frame with corner handles around the canvas, with nothing crossing it?
- [ ] Is there one cursor with no name, and no toolbar?
- [ ] Is the text on top only, plain and not exaggerated, with no product name or logo?
- [ ] Does the intro say what the product is and show its main dashboard?
- [ ] Are the screens and components real (from Figma), with refinements listed?
- [ ] Does the content fill the space under the title at every checked size?
- [ ] Do scenes leave together, with no leftover elements?
- [ ] Is the card embed built, does it pause off screen, and is the preview artifact updated?
