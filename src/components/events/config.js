export const COLORS = {
  ember: '#ff8a3d',
  magic: '#55c8ff',
  moon: '#eaf3ff',
  // Lightened from #0a0d13 — the old near-black fog color, combined with
  // exponential falloff, was crushing everything past ~20 units to flat
  // black regardless of how bright the lights were. This keeps the night
  // mood but gives fog a lighter navy floor instead of pure black.
  fog: '#131a28',
  ambient: '#3a4a70',
};

export const MODEL_PATHS = {
  gate: '/models/ancient-stone-gate.glb',
  minecart: '/models/minecart.glb',
  railway: '/models/railway.glb',
  temple: '/models/old_ruined_temple.glb',
  debris: '/models/debris_mid.glb',
  moon: '/models/moon.glb',
  pathway: '/models/stone-pathway.glb',
};

export const MODEL_FIT = {
  gate: { axis: 'y', target: 6.5 },
  // Event gates are the same asset, scaled down — secondary landmarks,
  // not the main entrance.
  eventGate: { axis: 'y', target: 4.2 },
  temple: { axis: 'y', target: 4 },
  railway: { axis: 'x', target: 4 },
  minecart: { axis: 'max', target: 3.0 }, // was 2.6, still looked undersized on the rail
  debris: { axis: 'max', target: 1.3 },
};

export const RAILWAY_SEGMENT_LENGTH = MODEL_FIT.railway.target;

// Was 0.02, still too dense over a track this long — the far majority of
// the now much-longer journey was fading to flat fog color. Cut further.
export const FOG_DENSITY = 0.011;

// ---------------------------------------------------------------------
// TRACK LAYOUT — single source of truth for where everything sits along Z.
// Extending the journey (more events, more distance) means editing this
// block only; every component that places something along the track reads
// from here rather than hardcoding positions.
// ---------------------------------------------------------------------
export const TRACK = {
  entranceZ: 0, // main gate
  eventStartZ: -24, // first event gate, past the entrance
  eventSpacing: 24, // regular interval between event gates
  eventCount: 8,
  eventSideOffset: 9, // distance from track centerline to each event gate
  finaleSpacing: 26, // extra gap after the last event before the finale
  // Diverging spur geometry — shared by DivergingTracks.jsx (draws the
  // rail segments) and trackLayout.js (computes each gate's facing
  // rotation from the same numbers). Keeping these in one place is what
  // guarantees the track and the gate it leads into can't disagree.
  spurLeadIn: 8, // spur forks off this many units before the gate's Z
  spurOvershoot: 15, // was 9, still reading as stopping beside the gate rather
  // than passing through it — pushed further. This is a visual-only
  // continuation past the gate; the facing rotation (trackLayout.js) uses
  // the same constant so gate orientation stays consistent automatically.
};

export const RAILWAY_SEGMENT_COUNT = Math.ceil(
  (TRACK.eventStartZ * -1 + TRACK.eventSpacing * (TRACK.eventCount - 1) + TRACK.finaleSpacing + 20) /
    RAILWAY_SEGMENT_LENGTH
);

// ---------------------------------------------------------------------
// JOURNEY — scroll-driven camera/minecart travel across the whole track.
// ---------------------------------------------------------------------
export const JOURNEY = {
  cameraStartZ: 14,
  cameraStartY: 3.2,
  cameraEndY: 2.8,
  minecartLead: 12, // was 5 — trig showed the cart was ~12° outside the
  // camera's vertical FOV at that distance (see chat). 12 keeps it
  // comfortably inside frame at the current camera height/FOV; the two
  // are coupled, see the derivation note in JourneyCamera.jsx.
  // Base damping (0-1, higher = snappier). Actual per-frame damping is
  // this value multiplied by a slowdown factor when near an event gate —
  // see getFrameSpeed() in utils/journey.js.
  cameraDamping: 0.06,
  // How close (in world Z) to an event gate before the camera starts
  // slowing, and the minimum speed multiplier once right on top of it.
  slowdownRadius: 9,
  minSpeedMultiplier: 0.25,
};

// cameraEndZ derived from the track layout so it always reaches just past
// the finale regardless of how many events are configured above.
JOURNEY.cameraEndZ =
  -(Math.abs(TRACK.eventStartZ) + TRACK.eventSpacing * (TRACK.eventCount - 1) + TRACK.finaleSpacing + 10);

export const TEXTURE_PATHS = {
  cloud: '/textures/cloud-01.png',
};

// Stone pathway tiling — flanks the railway on both sides. Columns are
// offsets from the centerline (not absolute X), rows run the length of
// the track. rowSpacingFactor < 1 means rows overlap slightly so there
// are no visible seams between tiles.
export const PATHWAY = {
  tileTargetSize: 1.3, // was 3.2 — smaller tiles read as flagstone, not scattered slabs
  // Was [3.6, 6.8] (only 2 columns, big gap next to the rail). Now starts
  // close to the rail edge and runs out past where ruins begin, so there's
  // no exposed bare-ground gap between the rail and the paved area.
  columnOffsets: [1.6, 2.9, 4.2, 5.5, 6.8, 8.1],
  rowSpacingFactor: 0.95, // near-seamless, was 0.9 with 2.5x bigger tiles
};