import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { makeRng } from '../../utils/rng';
import { PATHWAY, JOURNEY } from './config';

const dummy = new THREE.Object3D();
const color = new THREE.Color();

/**
 * Procedural flagstone tiles flanking the railway — built from a plain
 * BoxGeometry rather than the uploaded pathway asset. That asset turned
 * out to be some kind of rounded boulder/dome shape (bounding-box
 * dimensions alone couldn't reveal that — it only showed up once
 * rendered, tiled 100+ times, as rows of dome shapes rather than flat
 * pavers). A simple box gives full control over proportions and reads
 * correctly as a paving stone at a glance.
 *
 * One InstancedMesh, one draw call, regardless of tile count — same
 * performance approach as GroundClutter.
 */
export default function StonePathway() {
  const meshRef = useRef();

  const tiles = useMemo(() => {
    const rng = makeRng(2024);
    const items = [];
    const rowSpacing = PATHWAY.tileTargetSize * PATHWAY.rowSpacingFactor;
    const startZ = 8;
    const endZ = JOURNEY.cameraEndZ - 10;
    const rowCount = Math.ceil(Math.abs(endZ - startZ) / rowSpacing);

    for (let row = 0; row < rowCount; row++) {
      const z = startZ - row * rowSpacing - rng() * 0.5;
      PATHWAY.columnOffsets.forEach((colX) => {
        [-1, 1].forEach((sign) => {
          items.push({
            x: sign * colX + (rng() - 0.5) * 0.5,
            z: z + (rng() - 0.5) * 0.5,
            rotY: (rng() - 0.5) * 0.25,
            scaleX: 0.85 + rng() * 0.3,
            scaleZ: 0.85 + rng() * 0.3,
            heightJitter: rng() * 0.03,
            shade: 0.75 + rng() * 0.35,
          });
        });
      });
    }
    return items;
  }, []);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    tiles.forEach((t, i) => {
      dummy.position.set(t.x, -0.02 + t.heightJitter, t.z);
      dummy.rotation.set(0, t.rotY, 0);
      dummy.scale.set(t.scaleX, 1, t.scaleZ);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      // Per-instance gray-scale variation so the path doesn't read as a
      // single flat-colored slab repeated — subtle, not a texture, but
      // enough to break uniformity.
      color.setRGB(0.22 * t.shade, 0.24 * t.shade, 0.27 * t.shade);
      mesh.setColorAt(i, color);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [tiles]);

  return (
    <instancedMesh ref={meshRef} args={[null, null, tiles.length]} receiveShadow castShadow>
      <boxGeometry args={[PATHWAY.tileTargetSize * 0.42, 0.1, PATHWAY.tileTargetSize * 0.42]} />
      <meshStandardMaterial roughness={1} />
    </instancedMesh>
  );
}