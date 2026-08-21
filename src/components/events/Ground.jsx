import { useMemo } from 'react';
import * as THREE from 'three';
import { JOURNEY } from './config';

/**
 * The ground was a single flat, single-color plane — reads as "plain" no
 * matter how good the lighting is. This displaces vertices with a cheap
 * multi-frequency sine field (no noise-library dependency) for gentle
 * unevenness, and paints subtle per-vertex color variation between two
 * dark stone tones so it doesn't look like one flat material either.
 * Static geometry, built once — no runtime cost beyond the one draw call
 * the flat plane already had.
 */
export default function Ground() {
  const geometry = useMemo(() => {
    const width = 60;
    const length = Math.abs(JOURNEY.cameraStartZ - JOURNEY.cameraEndZ) + 80;
    const centerZ = (JOURNEY.cameraStartZ + JOURNEY.cameraEndZ) / 2;

    const segsX = 48;
    const segsZ = Math.round(length / 4);

    const geo = new THREE.PlaneGeometry(width, length, segsX, segsZ);
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, 0, centerZ);

    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const colorA = new THREE.Color('#14181f'); // base stone
    const colorB = new THREE.Color('#1c222c'); // slightly lighter patches

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Cheap layered undulation — not real noise, but reads fine as
      // "uneven ground" at this scale rather than "broken flat plane".
      const height =
        Math.sin(x * 0.18 + z * 0.09) * 0.09 +
        Math.sin(x * 0.4 - z * 0.22) * 0.035 +
        Math.sin(z * 0.05) * 0.05;
      pos.setY(i, height);

      // Same field, different frequency, drives color variation instead
      // of height so patches don't line up 1:1 with bumps.
      const mix = (Math.sin(x * 0.12 + z * 0.31) + 1) / 2;
      const c = colorA.clone().lerp(colorB, mix * 0.6);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial vertexColors roughness={1} metalness={0} />
    </mesh>
  );
}