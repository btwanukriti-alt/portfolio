# clihub showcase: 20s agency cut (React)

    npm install
    npm run dev      # opens the player at http://localhost:5173
    npm run build    # static build in dist/

- The component is in `src/ClihubShowcase.jsx`. Its default export is the player (play/pause, restart, scrubber).
- `ClihubStage` renders one frame at time `t`, in seconds, inside a 1920×1080 box.
- Keys: Space plays or pauses · R restarts · ←/→ seeks 1s · H hides the controls.
