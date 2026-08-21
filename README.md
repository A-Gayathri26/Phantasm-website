# PHANTASM — Events Page

Stage 1 of the implementation plan: static 3D scene (real gate/railway/ruins/
minecart models, optimized) with a working accessible event list and detail
pages. Camera/minecart movement along the track is stubbed for Stage 3.

## Run it

```bash
npm install
npm run dev
```

Then open the printed localhost URL.

## What's implemented (Stage 1)

- Gate, railway (tiled), ruins (8 instances, varied), debris, and minecart
  all loaded from the optimized `.glb` files in `public/models/`.
- Fog, moon, stars, ambient/directional light, plus paired fire/magic point
  lights along the visible stretch of track.
- Intro text ("EVENTS / Hop aboard...") fades on scroll via
  `useJourneyProgress` — the same hook Stage 3 will use to drive the camera
  and minecart, so no rework needed there.
- Loading screen matching the reference art (title / "ENTERING THE RUINS" /
  percentage / bar), driven by drei's `useProgress`.
- Accessible HTML fallback: the event grid below the fold is real buttons,
  not raycasting-dependent. Clicking one opens a static detail page; "Back
  to Journey" restores scroll position instead of resetting to the top.

## What's NOT implemented yet (later stages)

- Camera/minecart don't actually travel along the track yet — `progress`
  is computed and passed in, but `JourneyCamera` only does a small idle
  drift. Stage 3.
- No in-world clickable event gates (arches with glowing highlight on
  approach). Stage 4/5. The event grid is the real navigation until then.
- No proximity-based scroll slowdown near events. Stage 6.
- Not yet tuned for mobile (DPR/particle/light reduction). Stage 6.

## Notes on the models

`public/models/*.glb` are already optimized (Meshopt + WebP, ~8.8MB total
vs ~125MB original — see chat for the per-file breakdown). If you replace
any of them, re-run through `gltf-transform optimize` before dropping them
in, or load times will regress hard.

`RAILWAY_SEGMENT_LENGTH` in `src/components/events/config.js` is an
eyeballed placeholder — once you can see the track in the browser, measure
the real segment length (`new THREE.Box3().setFromObject(scene)` on the
loaded railway scene) and correct it so segments don't gap or overlap.

## Structure

```
src/
├── components/events/   3D scene pieces (one file per concept, per the brief)
├── data/events.js       single source of truth for event content
├── hooks/                useJourneyProgress — scroll → 0-1 progress
├── pages/                Events (journey) and EventDetails (static)
├── utils/cloneGltf.js   SkeletonUtils clone helper — never re-fetch a GLB
└── styles/events.css
public/models/            optimized .glb assets
```
