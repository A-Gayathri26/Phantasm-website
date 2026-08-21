import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { cloneGltfScene } from '../../utils/cloneGltf';
import { useFittedGLTF } from '../../utils/fitModel';
import { events } from '../../data/events';
import { MODEL_PATHS, MODEL_FIT, RAILWAY_SEGMENT_LENGTH, TRACK } from './config';

// Spur geometry constants moved to TRACK.spurLeadIn/spurOvershoot in
// config.js — trackLayout.js needs the exact same numbers to compute each
// gate's facing rotation, so they live in one shared place now rather
// than as local consts here that could silently drift out of sync with
// the gate rotation logic.

/**
 * For each event, a straight chain of rail segments forking off the main
 * line (x=0) and angling out to that event's gate. Not a curve (no curved
 * rail asset to work with) — a single constant-angle diagonal reads fine
 * at this scale and distance.
 *
 * Reuses Railway.jsx's orientation convention: base rotation of Math.PI/2
 * aligns a segment's local-X (its measured long axis) with world -Z. A
 * spur at some angle off dead-ahead just adds that angle on top of the
 * same base rotation.
 */
export default function DivergingTracks() {
  const { scene, fit } = useFittedGLTF(MODEL_PATHS.railway, MODEL_FIT.railway);

  const allSegments = useMemo(() => {
    const segs = [];

    events.forEach((ev) => {
      const startX = 0;

      // Snap the fork's start Z to an actual joint between two main-line
      // segments (main segments are centered at z=-i*RAILWAY_SEGMENT_LENGTH
      // and span RAILWAY_SEGMENT_LENGTH, so their joints fall at
      // z=-(2+4k)). Without this, the spur could start mid-way through a
      // main segment's mesh, which reads as branching off nothing rather
      // than a clean fork at a rail joint.
      const rawStartZ = ev.z + TRACK.spurLeadIn;
      const half = RAILWAY_SEGMENT_LENGTH / 2;
      const k = Math.round((-rawStartZ - half) / RAILWAY_SEGMENT_LENGTH);
      const startZ = -(half + k * RAILWAY_SEGMENT_LENGTH);

      const endX = (ev.side === 'right' ? 1 : -1) * TRACK.eventSideOffset;
      const endZ = ev.z - TRACK.spurOvershoot;

      const dx = endX - startX;
      const dz = endZ - startZ;
      const length = Math.hypot(dx, dz);
      const dirX = dx / length;
      const dirZ = dz / length;

      // Rotation that maps the rail's local +X axis (its measured long
      // axis, per Railway.jsx) onto the direction (dx, dz) in world space.
      // three.js rotation.y=t maps local (1,0,0) -> world (cos t, 0, -sin t),
      // so solving cos t = dx, -sin t = dz gives t = atan2(-dz, dx).
      // Sanity check: straight ahead (dx=0, dz=-1) gives exactly Math.PI/2,
      // matching Railway.jsx's own convention for the main line.
      const rotationY = Math.atan2(-dz, dx);

      // Fixed spacing of RAILWAY_SEGMENT_LENGTH per segment, same as
      // Railway.jsx — NOT length/count. Dividing the target distance into
      // `count` equal slices (the previous version) only avoids gaps when
      // `length` happens to be an exact multiple of the segment length;
      // otherwise every segment center is spaced by length/count while the
      // rendered segment itself is still exactly RAILWAY_SEGMENT_LENGTH
      // long, leaving a gap (or overlap) every time. +1 segment so the
      // spur overshoots the target rather than stopping short of it.
      const count = Math.ceil(length / RAILWAY_SEGMENT_LENGTH) + 1;

      for (let i = 0; i < count; i++) {
        const dist = RAILWAY_SEGMENT_LENGTH * (i + 0.5);
        segs.push({
          key: `${ev.id}-${i}`,
          pos: [startX + dirX * dist, 0, startZ + dirZ * dist],
          rotationY,
          clone: cloneGltfScene(scene),
        });
      }
    });

    return segs;
  }, [scene]);

  return (
    <group>
      {allSegments.map((seg) => (
        <group key={seg.key} position={seg.pos}>
          <group rotation={[0, seg.rotationY, 0]}>
            <group scale={fit.scale}>
              <primitive object={seg.clone} position={fit.offset} />
            </group>
          </group>
        </group>
      ))}
    </group>
  );
}

useGLTF.preload(MODEL_PATHS.railway);