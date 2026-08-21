import { useMemo } from 'react';
import * as THREE from 'three';

let cachedTexture = null;

/**
 * Was using an external PNG via useTexture — that kept showing as a
 * checkerboard (WebGL's "texture failed to load" fallback) even after
 * confirming the file path, likely some remaining path/case/build-cache
 * issue on the local setup that's hard to debug remotely. Switched to a
 * canvas-generated soft cloud shape instead — same self-contained
 * technique as the working torch-glow texture (glowTexture.js), so there
 * is no external file that can go missing or fail to resolve. Fully
 * static per feedback — no drift, no growth animation, nothing in
 * useFrame.
 */
function getCloudTexture() {
  if (cachedTexture) return cachedTexture;

  const w = 256;
  const h = 160;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  // Several overlapping soft blobs read as a wispy cloud mass rather than
  // one perfect circle.
  const blobs = [
    [w * 0.3, h * 0.55, w * 0.28],
    [w * 0.55, h * 0.4, w * 0.32],
    [w * 0.72, h * 0.58, w * 0.24],
    [w * 0.45, h * 0.65, w * 0.3],
  ];

  blobs.forEach(([bx, by, r]) => {
    const gradient = ctx.createRadialGradient(bx, by, 0, bx, by, r);
    gradient.addColorStop(0, 'rgba(255,255,255,0.9)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.35)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(bx, by, r, 0, Math.PI * 2);
    ctx.fill();
  });

  cachedTexture = new THREE.CanvasTexture(canvas);
  return cachedTexture;
}

export default function SkyClouds() {
  const texture = useMemo(() => getCloudTexture(), []);

  const puffs = [
    { position: [-14, 15, -30], scale: [22, 13, 1], opacity: 0.4 },
    { position: [16, 17, -55], scale: [26, 15, 1], opacity: 0.32 },
    { position: [-8, 16, -80], scale: [20, 12, 1], opacity: 0.36 },
  ];

  return (
    <group>
      {puffs.map((p, i) => (
        <sprite key={i} position={p.position} scale={p.scale}>
          <spriteMaterial
            map={texture}
            color="#3a4668"
            transparent
            opacity={p.opacity}
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  );
}