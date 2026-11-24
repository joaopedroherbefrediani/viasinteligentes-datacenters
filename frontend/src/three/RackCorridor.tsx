import { Canvas, useFrame } from '@react-three/fiber';
import type { MotionValue } from 'motion/react';
import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { BRAND, useWindowPointer } from './shared';

const ROW_X = 2.1;
const PER_ROW = 18;
const SPACING = 1.3;
const START_Z = 7;
const RACK = { w: 1.1, h: 2.6, d: 1.15 };
const LEDS_PER_RACK = 24;
const END_Z = START_Z - (PER_ROW - 1) * SPACING;

const rackPositions = () => {
  const list: { x: number; z: number; side: 1 | -1 }[] = [];
  for (const side of [-1, 1] as const) {
    for (let i = 0; i < PER_ROW; i++) list.push({ x: side * ROW_X, z: START_Z - i * SPACING, side });
  }
  return list;
};

function Racks() {
  const racks = useMemo(rackPositions, []);
  const body = useRef<THREE.InstancedMesh>(null!);
  const strips = useRef<THREE.InstancedMesh>(null!);
  const leds = useRef<THREE.InstancedMesh>(null!);
  const ledCount = racks.length * LEDS_PER_RACK;

  const palette = useMemo(
    () => [
      new THREE.Color('#92D50B').multiplyScalar(1.6),
      new THREE.Color('#3d7bff').multiplyScalar(1.8),
      new THREE.Color('#9fd8ff').multiplyScalar(1.4),
      new THREE.Color('#0b1a3d'),
    ],
    [],
  );

  useLayoutEffect(() => {
    const d = new THREE.Object3D();
    racks.forEach((r, i) => {
      d.position.set(r.x, RACK.h / 2, r.z);
      d.rotation.set(0, 0, 0);
      d.updateMatrix();
      body.current.setMatrixAt(i, d.matrix);

      // Fita de luz vertical na face voltada ao corredor
      d.position.set(r.x - r.side * (RACK.w / 2 + 0.005), RACK.h / 2, r.z + RACK.d / 2 - 0.04);
      d.updateMatrix();
      strips.current.setMatrixAt(i, d.matrix);

      for (let k = 0; k < LEDS_PER_RACK; k++) {
        const row = Math.floor(k / 3);
        const col = k % 3;
        d.position.set(
          r.x - r.side * (RACK.w / 2 + 0.006),
          0.45 + row * 0.26,
          r.z - 0.3 + col * 0.22 + (Math.random() - 0.5) * 0.05,
        );
        d.rotation.set(0, r.side === -1 ? Math.PI / 2 : -Math.PI / 2, 0);
        d.updateMatrix();
        const idx = i * LEDS_PER_RACK + k;
        leds.current.setMatrixAt(idx, d.matrix);
        leds.current.setColorAt(idx, palette[Math.floor(Math.random() * palette.length)]);
      }
    });
    body.current.instanceMatrix.needsUpdate = true;
    strips.current.instanceMatrix.needsUpdate = true;
    leds.current.instanceMatrix.needsUpdate = true;
    if (leds.current.instanceColor) leds.current.instanceColor.needsUpdate = true;
  }, [racks, palette]);

  // LEDs piscando: algumas trocas por frame
  useFrame(() => {
    for (let n = 0; n < 14; n++) {
      const idx = Math.floor(Math.random() * ledCount);
      leds.current.setColorAt(idx, palette[Math.floor(Math.random() * palette.length)]);
    }
    if (leds.current.instanceColor) leds.current.instanceColor.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={body} args={[undefined, undefined, racks.length]}>
        <boxGeometry args={[RACK.w, RACK.h, RACK.d]} />
        <meshStandardMaterial color="#0a1634" metalness={0.7} roughness={0.38} />
      </instancedMesh>
      <instancedMesh ref={strips} args={[undefined, undefined, racks.length]}>
        <boxGeometry args={[0.02, RACK.h * 0.92, 0.03]} />
        <meshBasicMaterial color={new THREE.Color('#3d7bff').multiplyScalar(1.5)} toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={leds} args={[undefined, undefined, ledCount]}>
        <planeGeometry args={[0.09, 0.03]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

/** Piso com grade e faixas verdes, com pulsos correndo ao longo do corredor. */
function Floor() {
  const pulses = useRef<THREE.InstancedMesh>(null!);
  const COUNT = 10;
  const state = useMemo(
    () => Array.from({ length: COUNT }, (_, i) => ({ z: START_Z - Math.random() * 26, side: i % 2 ? 1 : -1, speed: 3 + Math.random() * 3 })),
    [],
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    state.forEach((p, i) => {
      p.z -= p.speed * Math.min(delta, 0.05);
      if (p.z < END_Z - 4) p.z = START_Z + 2;
      dummy.position.set(p.side * 1.2, 0.012, p.z);
      dummy.rotation.set(-Math.PI / 2, 0, 0);
      dummy.updateMatrix();
      pulses.current.setMatrixAt(i, dummy.matrix);
    });
    pulses.current.instanceMatrix.needsUpdate = true;
  });

  const length = START_Z - END_Z + 12;
  const midZ = (START_Z + END_Z) / 2;

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, midZ]}>
        <planeGeometry args={[14, length]} />
        <meshStandardMaterial color="#030c24" metalness={0.85} roughness={0.32} />
      </mesh>
      <gridHelper args={[length, Math.round(length / 0.6), '#12307a', '#0b2257']} position={[0, 0.002, midZ]} />
      {[-1.2, 1.2].map((x) => (
        <mesh key={x} rotation-x={-Math.PI / 2} position={[x, 0.006, midZ]}>
          <planeGeometry args={[0.035, length]} />
          <meshBasicMaterial color={BRAND.green} toneMapped={false} transparent opacity={0.75} />
        </mesh>
      ))}
      <instancedMesh ref={pulses} args={[undefined, undefined, COUNT]} frustumCulled={false}>
        <planeGeometry args={[0.09, 1.2]} />
        <meshBasicMaterial color={new THREE.Color('#d4ff7a').multiplyScalar(1.5)} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

function Ceiling() {
  const bars = useMemo(() => Array.from({ length: 12 }, (_, i) => START_Z - i * 2.4), []);
  return (
    <group>
      {bars.map((z) => (
        <mesh key={z} position={[0, 3.4, z]}>
          <boxGeometry args={[0.18, 0.04, 1.4]} />
          <meshBasicMaterial color={new THREE.Color('#d6e4ff').multiplyScalar(1.3)} toneMapped={false} />
        </mesh>
      ))}
      {/* Bandejas de cabos sobre os racks */}
      {[-ROW_X, ROW_X].map((x) => (
        <mesh key={x} position={[x, 3.05, (START_Z + END_Z) / 2]}>
          <boxGeometry args={[0.7, 0.08, START_Z - END_Z + 4]} />
          <meshStandardMaterial color="#0c1a3e" metalness={0.8} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function CameraRig({ progress }: { progress: MotionValue<number> }) {
  const pointer = useWindowPointer();
  useFrame((state, delta) => {
    const p = progress.get();
    const cam = state.camera;
    const targetZ = 10.5 - p * 15;
    cam.position.z = THREE.MathUtils.damp(cam.position.z, targetZ, 4, delta);
    cam.position.x = THREE.MathUtils.damp(cam.position.x, Math.sin(p * Math.PI) * 0.45 + pointer.current.x * 0.25, 3, delta);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, 1.45 + pointer.current.y * 0.12, 3, delta);
    cam.lookAt(Math.sin(p * Math.PI) * -0.3, 1.25, cam.position.z - 6);
  });
  return null;
}

export default function RackCorridor({ progress, active = true }: { progress: MotionValue<number>; active?: boolean }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.45, 10.5], fov: 58, near: 0.1, far: 60 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={[BRAND.ink]} />
      <fog attach="fog" args={[BRAND.ink, 4, 22]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 3, 4]} intensity={6} decay={0} distance={9} color="#bcd2ff" />
      <pointLight position={[0, 3, -4]} intensity={6} decay={0} distance={9} color="#bcd2ff" />
      <pointLight position={[0, 0.5, 0]} intensity={2} decay={0} distance={8} color="#92D50B" />
      <hemisphereLight args={['#4a6fd1', '#020b1f', 0.6]} />
      <Racks />
      <Floor />
      <Ceiling />
      <CameraRig progress={progress} />
    </Canvas>
  );
}
