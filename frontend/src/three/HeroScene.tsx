import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { BRAND, createDotTexture, createFluxoGeometry, useWindowPointer } from './shared';

type Pointer = MutableRefObject<{ x: number; y: number }>;

const FIELD_Y = -1.9;
const waveY = (x: number, z: number, t: number) =>
  FIELD_Y + Math.sin(x * 0.3 + t * 0.7) * 0.22 + Math.cos(z * 0.35 + t * 0.5) * 0.22;

/** Ambiente de reflexão gerado localmente (sem baixar HDRI). */
function StudioEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

/** Símbolo Fluxo em 3D: os dois módulos chegam de lados opostos e se encaixam. */
function FluxoModel({ pointer }: { pointer: Pointer }) {
  const group = useRef<THREE.Group>(null!);
  const blue = useRef<THREE.Mesh>(null!);
  const green = useRef<THREE.Mesh>(null!);
  const glow = useRef<THREE.Mesh>(null!);
  const geometry = useMemo(() => createFluxoGeometry(), []);
  const glowTexture = useMemo(() => createDotTexture(256), []);
  const { viewport } = useThree();

  const wide = viewport.width > 8;
  const scale = wide ? Math.min(0.025, viewport.width / 520) : Math.min(0.016, viewport.width / 235);
  const base = wide
    ? new THREE.Vector3(viewport.width * 0.25, 0.35, 0)
    : new THREE.Vector3(0, viewport.height * 0.31, 0);

  useEffect(() => () => {
    geometry.dispose();
    glowTexture.dispose();
  }, [geometry, glowTexture]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const g = group.current;

    // Intro: módulos convergem (Conexão) e depois "respiram" (Continuidade).
    // O movimento é SOMENTE vertical: os braços de cada módulo ficam encaixados entre os
    // braços do outro, então qualquer deslocamento horizontal faria as peças se atravessarem.
    // Separar no eixo Y (azul desce, verde sobe) apenas abre as folgas, nunca as fecha.
    const intro = Math.min(1, t / 2.4);
    const eased = 1 - Math.pow(1 - intro, 4);
    const breathe = (Math.sin(t * 0.9) * 0.5 + 0.5) * 3 * eased;
    const sep = (1 - eased) * 90 + breathe;
    blue.current.position.set(0, -sep, 0);
    green.current.position.set(0, sep, 0);

    const targetY = -0.45 + pointer.current.x * 0.35 + Math.sin(t * 0.35) * 0.12;
    const targetX = 0.12 - pointer.current.y * 0.18;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 2.5, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 2.5, delta);
    g.position.set(base.x, base.y + Math.sin(t * 0.8) * 0.08, base.z);

    const mat = glow.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.45 + Math.sin(t * 1.2) * 0.08;
  });

  return (
    <group>
      <mesh ref={glow} position={[base.x, base.y, -2.5]} scale={wide ? 9 : 6}>
        <planeGeometry />
        <meshBasicMaterial
          map={glowTexture}
          color="#1d55e0"
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      <group ref={group} scale={scale}>
        <mesh ref={blue} geometry={geometry}>
          <meshPhysicalMaterial
            color="#0b3696"
            metalness={0.55}
            roughness={0.22}
            clearcoat={1}
            clearcoatRoughness={0.12}
            envMapIntensity={1.1}
          />
        </mesh>
        <mesh ref={green} geometry={geometry} rotation-z={Math.PI}>
          <meshPhysicalMaterial
            color="#92D50B"
            emissive="#4d7f00"
            emissiveIntensity={0.35}
            metalness={0.25}
            roughness={0.28}
            clearcoat={1}
            clearcoatRoughness={0.15}
          />
        </mesh>
      </group>
    </group>
  );
}

/** Campo ondulado de pontos — os dados em movimento, com "vias" verdes. */
function DataField() {
  const points = useRef<THREE.Points>(null!);
  const COLS = 140;
  const ROWS = 70;
  const LANES = [12, 27, 41, 55];
  const texture = useMemo(() => createDotTexture(64), []);

  const { positions, colors, grid } = useMemo(() => {
    const positions = new Float32Array(COLS * ROWS * 3);
    const colors = new Float32Array(COLS * ROWS * 3);
    const grid = new Float32Array(COLS * ROWS * 2);
    const c = new THREE.Color();
    for (let r = 0; r < ROWS; r++) {
      for (let col = 0; col < COLS; col++) {
        const i = r * COLS + col;
        const x = (col / (COLS - 1) - 0.5) * 34;
        const z = -18 + (r / (ROWS - 1)) * 22;
        grid[i * 2] = x;
        grid[i * 2 + 1] = z;
        positions[i * 3] = x;
        positions[i * 3 + 1] = FIELD_Y;
        positions[i * 3 + 2] = z;
        const lane = LANES.includes(r);
        const depthFade = 0.35 + (r / ROWS) * 0.65;
        c.copy(lane ? BRAND.green : BRAND.blueBright).multiplyScalar(lane ? 1 : depthFade * 1.1);
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }
    }
    return { positions, colors, grid };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const attr = points.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < COLS * ROWS; i++) {
      arr[i * 3 + 1] = waveY(grid[i * 2], grid[i * 2 + 1], t);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.09}
        map={texture}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        toneMapped={false}
      />
    </points>
  );
}

/** Pulsos de luz percorrendo as vias do campo. */
function DataStreaks() {
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const COUNT = 36;
  const LANE_Z = [-18 + (12 / 69) * 22, -18 + (27 / 69) * 22, -18 + (41 / 69) * 22, -18 + (55 / 69) * 22];
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const streaks = useMemo(
    () =>
      Array.from({ length: COUNT }, () => ({
        x: Math.random() * 34 - 17,
        z: LANE_Z[Math.floor(Math.random() * LANE_Z.length)],
        speed: 2 + Math.random() * 4,
        length: 0.6 + Math.random() * 1.4,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    streaks.forEach((s, i) => {
      s.x += s.speed * Math.min(delta, 0.05);
      if (s.x > 17) s.x = -17;
      dummy.position.set(s.x, waveY(s.x, s.z, t) + 0.02, s.z);
      dummy.scale.set(s.length, 1, 1);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]} frustumCulled={false}>
      <boxGeometry args={[1, 0.03, 0.03]} />
      <meshBasicMaterial color="#c8ff5a" transparent opacity={0.9} blending={THREE.AdditiveBlending} toneMapped={false} />
    </instancedMesh>
  );
}

/** Poeira de fundo bem sutil. */
function Dust() {
  const ref = useRef<THREE.Points>(null!);
  const texture = useMemo(() => createDotTexture(32), []);
  const positions = useMemo(() => {
    const arr = new Float32Array(600 * 3);
    for (let i = 0; i < 600; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 1] = Math.random() * 14 - 3;
      arr[i * 3 + 2] = -Math.random() * 25;
    }
    return arr;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.01;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} map={texture} color="#7aa2ff" transparent opacity={0.5} depthWrite={false} />
    </points>
  );
}

function CameraRig({ pointer }: { pointer: Pointer }) {
  useFrame((state, delta) => {
    const cam = state.camera;
    cam.position.x = THREE.MathUtils.damp(cam.position.x, pointer.current.x * 0.4, 2, delta);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, 0.5 + pointer.current.y * 0.25, 2, delta);
    cam.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene({ active = true }: { active?: boolean }) {
  const pointer = useWindowPointer();
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.5, 9], fov: 40 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={[BRAND.ink]} />
      <fog attach="fog" args={[BRAND.ink, 9, 24]} />
      <StudioEnvironment />
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 6, 6]} intensity={2.2} />
      <pointLight position={[-4, -1, 3]} color="#92D50B" intensity={3} decay={0} distance={12} />
      <pointLight position={[5, 2, -2]} color="#3d7bff" intensity={4} decay={0} distance={14} />
      <FluxoModel pointer={pointer} />
      <DataField />
      <DataStreaks />
      <Dust />
      <CameraRig pointer={pointer} />
    </Canvas>
  );
}
