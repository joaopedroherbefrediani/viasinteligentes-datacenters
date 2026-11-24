import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Módulo do símbolo Fluxo como THREE.Shape (mesmo desenho de lib/fluxo.ts, eixo Y para cima),
 * já centralizado no ponto de rotação (68, -22) para que o módulo verde seja
 * simplesmente o mesmo geometry rotacionado em 180° no eixo Z.
 */
export function createFluxoGeometry(depth = 16) {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.lineTo(28, 0);
  s.lineTo(28, -38);
  s.lineTo(62, -38);
  s.quadraticCurveTo(70, -38, 70, -30);
  s.lineTo(70, -18);
  s.absarc(78, -18, 8, Math.PI, Math.PI / 2, true);
  s.lineTo(100, -10);
  s.lineTo(100, -34);
  s.absarc(74, -34, 26, 0, -Math.PI / 2, true);
  s.lineTo(0, -60);
  s.closePath();

  const geometry = new THREE.ExtrudeGeometry(s, {
    depth,
    bevelEnabled: true,
    // bevelSize expande a silhueta: mantê-lo pequeno preserva a folga de 4 unidades entre os módulos.
    bevelThickness: 2,
    bevelSize: 0.7,
    bevelSegments: 4,
    curveSegments: 28,
  });
  geometry.translate(-68, 22, -depth / 2);
  geometry.computeVertexNormals();
  return geometry;
}

/** Textura circular suave para pontos/partículas. */
export function createDotTexture(size = 64) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.85)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Posição normalizada do ponteiro na janela (-1..1), sem depender de eventos do canvas. */
export function useWindowPointer() {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
  return pointer;
}

export const BRAND = {
  blue: new THREE.Color('#072B75'),
  blueBright: new THREE.Color('#2f6bff'),
  green: new THREE.Color('#92D50B'),
  ink: '#020b1f',
};
