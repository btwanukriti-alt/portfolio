# clihub showcase (React)

    npm install
    npm run dev      # opens the player at http://localhost:5173
    npm run build    # static build in dist/

- The component is in `src/ClihubShowcase.jsx`. Import the default export to get the player (play/pause, restart, scrubber).
- `ClihubStage` renders one frame at a given time `t` inside a 1920×1080 box, if you want to drive it from your own timeline.
- Keys: Space plays or pauses · R restarts · ←/→ seeks 1s · H hides the controls.
