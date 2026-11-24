/**
 * Geometria do símbolo "Fluxo": dois módulos idênticos, um girado 180°,
 * que se encaixam formando um caminho contínuo.
 *
 * Coordenadas em unidades arbitrárias (SVG, eixo Y para baixo).
 * O módulo verde é o azul rotacionado 180° em torno de (68, 22).
 */
export const FLUXO_MODULE_PATH =
  'M0,0 H28 V38 H62 Q70,38 70,30 V18 A8,8 0 0 1 78,10 H100 V34 A26,26 0 0 1 74,60 H0 Z';

export const FLUXO_ROTATION_CENTER = { x: 68, y: 22 } as const;
export const FLUXO_VIEWBOX = '0 -16 136 76';
