import { useMemo, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { useFittedGLTF } from '../../utils/fitModel';
import { cloneGltfScene } from '../../utils/cloneGltf';
import { MODEL_PATHS, MODEL_FIT, TRACK } from './config';
import FireLight from './FireLight';
import MagicLight from './MagicLight';

const ZOOM_DURATION = 0.7; // seconds — matches the ~500-800ms spec range

/**
 * Clicking the gate pushes the camera in through the arch, then hands off
 * to the static event page once the push completes. `cameraState.locked`
 * is set so JourneyCamera's own per-frame scroll-driven update backs off
 * and doesn't fight this tween — see JourneyCamera.jsx.
 */
export default function EventGate({ z, side, code, id, facingY = 0, onSelect, cameraState }) {
  const { scene, fit } = useFittedGLTF(MODEL_PATHS.gate, MODEL_FIT.eventGate);
  const { camera } = useThree();
  const [hovered, setHovered] = useState(false);
  // Same fix as AncientGate — this loads the same gate URL as the
  // entrance and 7 other event gates; each instance needs its own clone.
  const instance = useMemo(() => cloneGltfScene(scene), [scene]);

  const x = side === 'right' ? TRACK.eventSideOffset : -TRACK.eventSideOffset;
  const isEven = Number(code) % 2 === 0;

  // Unit vector the gate's opening faces, derived from the same facingY
  // computed in trackLayout.js (facingY rotates local +Z, so this is just
  // that rotation applied to (0,0,1)). Used to place the zoom camera
  // "standing in front of the opening" and look through it, rather than
  // assuming the gate faces +Z like the unrotated entrance does.
  const fx = Math.sin(facingY);
  const fz = Math.cos(facingY);

  function handleClick(e) {
    e.stopPropagation();
    if (cameraState) cameraState.current.locked = true;

    gsap.to(camera.position, {
      x: x + fx * 3,
      y: 1.9,
      z: z + fz * 3,
      duration: ZOOM_DURATION,
      ease: 'power2.inOut',
      onUpdate: () => camera.lookAt(x - fx * 3, 2, z - fz * 3),
      onComplete: () => onSelect?.(id),
    });
  }

  return (
    <group
      position={[x, 0, z]}
      rotation={[0, facingY, 0]}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <group scale={fit.scale}>
        <primitive object={instance} position={fit.offset} />
      </group>
      {isEven ? (
        <MagicLight position={[0, 1.3, 1.5]} intensity={hovered ? 5 : 3.6} />
      ) : (
        <FireLight position={[0, 1.3, 1.5]} intensity={hovered ? 5 : 3.6} />
      )}
    </group>
  );
}

useGLTF.preload(MODEL_PATHS.gate);