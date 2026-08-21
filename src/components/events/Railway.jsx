import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { cloneGltfScene } from '../../utils/cloneGltf';
import { useFittedGLTF } from '../../utils/fitModel';
import { MODEL_PATHS, MODEL_FIT, RAILWAY_SEGMENT_LENGTH, RAILWAY_SEGMENT_COUNT } from './config';

/**
 * Tiles railway.glb end-to-end along -Z starting at z=0.
 *
 * The raw asset's rail direction is along its local X axis (measured
 * bounding box: x≈4.0, z≈2.82 — X is the long axis). We fit against X
 * (see MODEL_FIT.railway) so the scale is correct, then rotate each
 * instance 90° around Y so that local-X (rail direction) lines up with
 * world -Z (the direction the track/camera travels). Without this
 * rotation the segments tile correctly in world space but each individual
 * rail mesh still points sideways, which is why the track was invisible/
 * looked broken before.
 */
export default function Railway() {
  const { scene, fit } = useFittedGLTF(MODEL_PATHS.railway, MODEL_FIT.railway);

  const segments = useMemo(
    () =>
      Array.from({ length: RAILWAY_SEGMENT_COUNT }, (_, i) => ({
        key: i,
        z: -i * RAILWAY_SEGMENT_LENGTH,
        clone: cloneGltfScene(scene),
      })),
    [scene]
  );

  return (
    <group>
      {segments.map((seg) => (
        <group key={seg.key} position={[0, 0, seg.z]}>
          <group rotation={[0, Math.PI / 2, 0]}>
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