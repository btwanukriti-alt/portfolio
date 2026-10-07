Design Language: Portfolio showcase videos (v3)

VIDEO SYSTEM (same for every project, so the portfolio feels consistent)

Motion
- Smooth ease-in-out with no bounce and no gimmicks.
- Calm pace: about 1.5–2s per UI state. Transitions are authored at 450–750ms, then the whole timeline plays at 1.6× length, so a video runs about 45–50s.
- Enter: fade in and rise while a slight tilt settles. Exit: fade out and lift.
- Point attention with a cursor that clicks through real tabs and states, floating callouts and gentle camera moves.
- Never use highlight rectangles, outline rings or spotlight dimming.

Type
- One clean sans-serif, the product's own UI font.
- One eyebrow (the feature area) and one short, one-line headline per scene.
- No paragraphs, no product name cards, no "Coming soon".

Scene types
- Real-screen walk-through: the cursor clicks through the product's own tabs or states. The underline slides and the content crossfades.
- Floating callouts: small cards beside the UI, each showing one real value from the current state, animated (a ring, bar, counter, live bars, toggle or typing).
- Component infographics: the product's Figma components rebuilt as live vector UI, animating their real behaviour.

Structure
- Opening: an infographic rebuilt from the product's own illustration, plus one tagline sentence.
- 3–5 feature scenes that mix real-screen walk-throughs and component infographics.
- Close: the opening infographic reprises, with no text.

Content rules
- The product is pre-launch, so no metrics, testimonials or claims.
- Every value, label and flow on screen comes from the user's own design. The UI is the hero.

Output
- A React project (the component and a player) plus an MP4 at 1920×1080, 30fps.

PROJECT THEME (change per project)

Background, derived from the product's theme
- Base: the product's own background tone. A dark UI gets its darkest surface or black; a light UI gets its lightest surface or an off-white.
- Light: the product's primary or accent colour at low opacity, used the same way every time:
  - a soft key light from above (about 0.12–0.18);
  - a gentle floor glow that drifts slowly (about 0.10–0.14);
  - a fine grid (about 0.06–0.10) that fades toward the edges;
  - edges that fall off into the base tone.
- The background stays the same across all scenes of one video and never competes with the UI.
- Example, SSH client: black with low-opacity electric blue (#1E6EFF).

Layout, chosen from the product's form factor and the screens
- Desktop or web app: centered composition, with the headline at the top center and the window or panel below. Side panels float beside a dimmed context window.
- Mobile app: phones centered or arranged in a row or cascade. Tall screens may scroll inside the device, and several phones may appear together when comparing states.
- Wide or dense screens: a larger window with the camera moving through it. Tall or narrow content: a split between the device and floating callouts.
- Whatever the arrangement: generous whitespace, one idea per scene, and headlines that never collide with the UI.

Per-project inputs
- Product: [name]. Used in file and component names only, never on screen.
- Figma: [link to the screens and the component section]
- Features: [3–5, or "use the product's onboarding copy"]
- Typeface: [the UI font]
- Theme colours: [base / primary / accent, sampled from the UI]
- Form factor: [mobile / desktop / web]
- Mood: [e.g. precise and calm]
