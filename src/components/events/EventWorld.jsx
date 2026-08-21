import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Atmosphere from './Atmosphere';
import AncientGate from './AncientGate';
import Railway from './Railway';
import StonePathway from './StonePathway';
import Ruins from './Ruins';
import Debris from './Debris';
import GroundClutter from './GroundClutter';
import Minecart from './Minecart';
import EventGates from './EventGates';
import DivergingTracks from './DivergingTracks';
// AmbientTorches (glow sprites) removed per feedback — the floating orb
// look wasn't landing. Local illumination along the mid-track is now
// carried entirely by the global ambient/hemisphere/directional lights in
// Atmosphere.jsx plus the real lights at the entrance and event gates.
import FireLight from './FireLight';
import MagicLight from './MagicLight';
import JourneyCamera from './JourneyCamera';
import Loader from './Loader';
import { JOURNEY } from './config';

export default function EventWorld({ progress = 0, onSelectEvent }) {
  // Single authoritative camera position, written by JourneyCamera each
  // frame and read by Minecart — see JourneyCamera.jsx for why this
  // (rather than each component computing its own position from
  // `progress`) is what keeps camera and cart in perfect lockstep.
  // `locked` additionally pauses that per-frame update while a gate-click
  // zoom (EventGate.jsx) is animating the camera directly.
  const cameraState = useRef({
    z: JOURNEY.cameraStartZ,
    y: JOURNEY.cameraStartY,
    speed: 1,
    locked: false,
  });

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.35,
      }}
    >
      <Suspense fallback={<Loader />}>
        <JourneyCamera progress={progress} cameraState={cameraState} />
        <Atmosphere />

        <AncientGate position={[0, 0, 0]} />
        <Railway />
        <DivergingTracks />
        <StonePathway />
        <Ruins />
        <Debris />
        <GroundClutter />
        <EventGates onSelect={onSelectEvent} cameraState={cameraState} />
        {/* AmbientTorches removed — see note near the import. */}
        <Minecart cameraState={cameraState} />

        <FireLight position={[-4, 1.4, 3]} intensity={3.2} />
        <MagicLight position={[4, 1.4, 3]} intensity={3.2} />
      </Suspense>
    </Canvas>
  );
}