import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { cloneGltfScene } from '../../utils/cloneGltf';
import { useFittedGLTF } from '../../utils/fitModel';
import { generateTrackScatter } from '../../utils/rng';
import { MODEL_PATHS, MODEL_FIT, JOURNEY } from './config';

/**
 * Procedurally scattered along the whole track (deterministic seed, so the
 * layout is stable across reloads). xRange keeps ruins further out than
 * the event gates (TRACK.eventSideOffset = 9) so they don't collide.
 */
export default function Ruins() {
  const { scene, fit } = useFittedGLTF(MODEL_PATHS.temple, MODEL_FIT.temple);

  const layout = useMemo(
    () =>
      generateTrackScatter({
        seed: 42,
        startZ: -6,
        endZ: JOURNEY.cameraEndZ - 10,
        clusterSpacing: 16,
        itemsPerCluster: 2,
        xRange: [10.5, 16],
        scaleRange: [0.8, 1.3],
      }),
    []
  );

  const instances = useMemo(
    () => layout.map((item, i) => ({ key: i, clone: cloneGltfScene(scene), ...item })),
    [scene, layout]
  );

  return (
    <group>
      {instances.map((item) => (
        <group key={item.key} position={item.pos} rotation={[0, item.rot, 0]} scale={item.scale}>
          <group scale={fit.scale}>
            <primitive object={item.clone} position={fit.offset} />
          </group>
        </group>
      ))}
    </group>
  );
}

useGLTF.preload(MODEL_PATHS.temple);