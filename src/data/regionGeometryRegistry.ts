/**
 * Per-page region geometry used by the V2 brush engine for:
 *  - Stay-inside-lines clipping (each region rendered as a Skia clip-path)
 *  - Hit-testing the touch point at stroke start to find which region the
 *    finger is in, so the stroke can be clipped to that region only.
 *
 * Each entry mirrors the shapes the page's render component already draws.
 * Decorative outline-only marks (whiskers, mouths, antennae, etc.) are NOT
 * included here because they are not colorable regions.
 */

import type { RegionGeometry } from './types';

const FULL_BACKGROUND = { type: 'path' as const, d: 'M0 0 H400 V400 H0 Z' };

const animals: Record<string, RegionGeometry> = {
  cat: {
    background: FULL_BACKGROUND,
    leftEar: { type: 'polygon', points: [[120, 150], [100, 60], [180, 120]] },
    rightEar: { type: 'polygon', points: [[280, 150], [300, 60], [220, 120]] },
    face: { type: 'circle', cx: 200, cy: 220, r: 120 },
    leftCheek: { type: 'circle', cx: 140, cy: 250, r: 22 },
    rightCheek: { type: 'circle', cx: 260, cy: 250, r: 22 },
    leftEye: { type: 'circle', cx: 160, cy: 195, r: 14 },
    rightEye: { type: 'circle', cx: 240, cy: 195, r: 14 },
    nose: { type: 'path', d: 'M188 232 Q200 250 212 232 Q200 240 188 232 Z' },
  },
  dog: {
    background: FULL_BACKGROUND,
    leftEar: { type: 'path', d: 'M110 130 Q70 120 70 200 Q70 270 130 260 Q150 200 140 150 Z' },
    rightEar: { type: 'path', d: 'M290 130 Q330 120 330 200 Q330 270 270 260 Q250 200 260 150 Z' },
    face: { type: 'circle', cx: 200, cy: 210, r: 110 },
    snout: { type: 'path', d: 'M150 250 Q200 320 250 250 Q230 280 200 280 Q170 280 150 250 Z' },
    leftEye: { type: 'circle', cx: 165, cy: 200, r: 12 },
    rightEye: { type: 'circle', cx: 235, cy: 200, r: 12 },
    nose: { type: 'path', d: 'M188 240 Q200 256 212 240 Q200 250 188 240 Z' },
    tongue: { type: 'path', d: 'M192 280 Q200 305 208 280 Q204 295 192 280 Z' },
  },
  fish: {
    water: FULL_BACKGROUND,
    tail: { type: 'polygon', points: [[310, 200], [380, 130], [380, 270]] },
    body: {
      type: 'path',
      d: 'M50 200 Q120 90 250 110 Q330 130 320 200 Q330 270 250 290 Q120 310 50 200 Z',
    },
    topFin: { type: 'polygon', points: [[170, 130], [210, 70], [240, 130]] },
    bottomFin: { type: 'polygon', points: [[170, 270], [210, 330], [240, 270]] },
    eye: { type: 'circle', cx: 110, cy: 180, r: 14 },
    bubble1: { type: 'circle', cx: 70, cy: 120, r: 10 },
    bubble2: { type: 'circle', cx: 45, cy: 70, r: 14 },
    bubble3: { type: 'circle', cx: 90, cy: 50, r: 8 },
  },
  butterfly: {
    background: FULL_BACKGROUND,
    leftWingTop: {
      type: 'path',
      d: 'M200 200 Q120 80 60 130 Q40 180 110 220 Q150 230 200 200 Z',
    },
    leftWingBottom: {
      type: 'path',
      d: 'M200 200 Q140 270 90 320 Q70 280 130 230 Q170 215 200 200 Z',
    },
    rightWingTop: {
      type: 'path',
      d: 'M200 200 Q280 80 340 130 Q360 180 290 220 Q250 230 200 200 Z',
    },
    rightWingBottom: {
      type: 'path',
      d: 'M200 200 Q260 270 310 320 Q330 280 270 230 Q230 215 200 200 Z',
    },
    body: { type: 'path', d: 'M194 130 Q200 100 206 130 L206 280 Q200 300 194 280 Z' },
    leftSpot: { type: 'circle', cx: 120, cy: 160, r: 18 },
    rightSpot: { type: 'circle', cx: 280, cy: 160, r: 18 },
  },
  bunny: {
    background: FULL_BACKGROUND,
    leftEar: { type: 'ellipse', cx: 150, cy: 120, rx: 28, ry: 80 },
    rightEar: { type: 'ellipse', cx: 250, cy: 120, rx: 28, ry: 80 },
    leftEarInner: { type: 'ellipse', cx: 150, cy: 130, rx: 14, ry: 55 },
    rightEarInner: { type: 'ellipse', cx: 250, cy: 130, rx: 14, ry: 55 },
    face: { type: 'circle', cx: 200, cy: 250, r: 100 },
    leftCheek: { type: 'circle', cx: 155, cy: 275, r: 20 },
    rightCheek: { type: 'circle', cx: 245, cy: 275, r: 20 },
    nose: { type: 'path', d: 'M188 250 Q200 268 212 250 Q200 258 188 250 Z' },
  },
};

const fruits: Record<string, RegionGeometry> = {
  apple: {
    background: FULL_BACKGROUND,
    leftBody: { type: 'path', d: 'M200 130 Q90 130 80 230 Q70 330 200 350 Z' },
    rightBody: { type: 'path', d: 'M200 130 Q310 130 320 230 Q330 330 200 350 Z' },
    stem: { type: 'path', d: 'M196 110 Q200 70 210 70 Q204 90 204 130 Z' },
    leaf: { type: 'path', d: 'M210 100 Q260 70 280 110 Q230 130 210 100 Z' },
    highlight: { type: 'circle', cx: 150, cy: 200, r: 20 },
  },
  banana: {
    background: FULL_BACKGROUND,
    body: {
      type: 'path',
      d: 'M90 90 Q60 230 200 330 Q340 330 320 230 Q260 280 200 270 Q140 250 130 180 Q120 130 130 100 Z',
    },
    topTip: { type: 'polygon', points: [[90, 90], [130, 100], [130, 75]] },
    bottomTip: { type: 'polygon', points: [[320, 230], [340, 250], [325, 260]] },
  },
  strawberry: {
    background: FULL_BACKGROUND,
    body: {
      type: 'path',
      d: 'M200 130 Q90 140 100 230 Q120 340 200 350 Q280 340 300 230 Q310 140 200 130 Z',
    },
    leftLeaf: { type: 'path', d: 'M150 130 Q120 90 100 110 Q140 130 150 130 Z' },
    centerLeaf: { type: 'path', d: 'M180 120 Q200 70 220 120 Q200 140 180 120 Z' },
    rightLeaf: { type: 'path', d: 'M250 130 Q280 90 300 110 Q260 130 250 130 Z' },
    seed1: { type: 'circle', cx: 160, cy: 200, r: 6 },
    seed2: { type: 'circle', cx: 240, cy: 200, r: 6 },
    seed3: { type: 'circle', cx: 180, cy: 260, r: 6 },
    seed4: { type: 'circle', cx: 220, cy: 260, r: 6 },
  },
  watermelon: {
    background: FULL_BACKGROUND,
    rind: { type: 'path', d: 'M50 280 Q200 100 350 280 L350 300 Q200 360 50 300 Z' },
    whiteLayer: { type: 'path', d: 'M70 270 Q200 130 330 270 Q200 320 70 270 Z' },
    flesh: { type: 'path', d: 'M90 260 Q200 150 310 260 Q200 300 90 260 Z' },
    seed1: { type: 'circle', cx: 150, cy: 240, r: 8 },
    seed2: { type: 'circle', cx: 200, cy: 220, r: 8 },
    seed3: { type: 'circle', cx: 250, cy: 240, r: 8 },
  },
  pineapple: {
    background: FULL_BACKGROUND,
    leafLeft: { type: 'polygon', points: [[170, 140], [130, 50], [160, 130]] },
    leafCenter: { type: 'polygon', points: [[195, 130], [200, 30], [210, 130]] },
    leafRight: { type: 'polygon', points: [[230, 140], [270, 50], [240, 130]] },
    body: {
      type: 'path',
      d: 'M130 150 Q100 250 130 340 Q200 370 270 340 Q300 250 270 150 Z',
    },
  },
};

const vehicles: Record<string, RegionGeometry> = {
  car: {
    background: FULL_BACKGROUND,
    road: { type: 'rect', x: 0, y: 310, width: 400, height: 90 },
    body: {
      type: 'path',
      d: 'M40 270 L80 270 L100 230 L300 230 L320 270 L360 270 Q380 270 380 290 L380 320 L20 320 L20 290 Q20 270 40 270 Z',
    },
    roof: { type: 'polygon', points: [[110, 230], [150, 180], [260, 180], [290, 230]] },
    window: { type: 'polygon', points: [[125, 225], [155, 195], [255, 195], [280, 225]] },
    leftWheel: { type: 'circle', cx: 120, cy: 320, r: 36 },
    rightWheel: { type: 'circle', cx: 280, cy: 320, r: 36 },
    leftWheelHub: { type: 'circle', cx: 120, cy: 320, r: 14 },
    rightWheelHub: { type: 'circle', cx: 280, cy: 320, r: 14 },
    headlight: { type: 'circle', cx: 355, cy: 285, r: 10 },
  },
  truck: {
    background: FULL_BACKGROUND,
    road: { type: 'rect', x: 0, y: 320, width: 400, height: 80 },
    cargo: { type: 'rect', x: 40, y: 170, width: 210, height: 150, rx: 10 },
    cab: { type: 'polygon', points: [[250, 220], [320, 220], [360, 270], [360, 320], [250, 320]] },
    cabWindow: { type: 'polygon', points: [[260, 235], [310, 235], [335, 270], [260, 270]] },
    leftWheel: { type: 'circle', cx: 110, cy: 325, r: 28 },
    rightWheel: { type: 'circle', cx: 300, cy: 325, r: 28 },
  },
  boat: {
    sky: { type: 'path', d: 'M0 0 H400 V260 H0 Z' },
    sea: {
      type: 'path',
      d: 'M0 260 Q100 240 200 260 Q300 280 400 260 V400 H0 Z',
    },
    sun: { type: 'circle', cx: 330, cy: 80, r: 36 },
    sailLeft: { type: 'polygon', points: [[200, 80], [200, 240], [100, 240]] },
    sailRight: { type: 'polygon', points: [[210, 100], [210, 240], [300, 240]] },
    mast: { type: 'polygon', points: [[198, 80], [202, 80], [202, 250], [198, 250]] },
    hull: { type: 'polygon', points: [[70, 250], [330, 250], [290, 320], [110, 320]] },
  },
  airplane: {
    sky: FULL_BACKGROUND,
    cloudLeft: {
      type: 'path',
      d: 'M40 280 Q60 250 100 260 Q120 240 150 260 Q170 290 130 300 Q90 310 40 300 Z',
    },
    cloudRight: {
      type: 'path',
      d: 'M260 110 Q280 80 320 90 Q340 70 360 100 Q370 130 320 130 Q280 140 260 130 Z',
    },
    fuselage: {
      type: 'path',
      d: 'M40 230 L320 200 Q360 200 360 220 Q360 240 320 240 L40 230 Z',
    },
    wing: { type: 'polygon', points: [[150, 225], [260, 225], [210, 290], [130, 285]] },
    tail: { type: 'polygon', points: [[40, 230], [20, 170], [70, 220]] },
    window1: { type: 'circle', cx: 130, cy: 222, r: 8 },
    window2: { type: 'circle', cx: 170, cy: 219, r: 8 },
    window3: { type: 'circle', cx: 210, cy: 216, r: 8 },
  },
  train: {
    background: FULL_BACKGROUND,
    tracks: { type: 'rect', x: 0, y: 335, width: 400, height: 20 },
    engineBody: { type: 'rect', x: 50, y: 210, width: 300, height: 120, rx: 10 },
    engineCab: { type: 'polygon', points: [[230, 150], [320, 150], [320, 215], [230, 215]] },
    engineWindow: { type: 'rect', x: 245, y: 165, width: 60, height: 35, rx: 4 },
    smokestack: { type: 'rect', x: 90, y: 150, width: 40, height: 70 },
    smoke: {
      type: 'path',
      d: 'M70 130 Q80 90 110 90 Q140 80 150 110 Q160 130 130 140 Q90 150 70 130 Z',
    },
    wheel1: { type: 'circle', cx: 100, cy: 335, r: 28 },
    wheel2: { type: 'circle', cx: 200, cy: 335, r: 28 },
    wheel3: { type: 'circle', cx: 300, cy: 335, r: 28 },
  },
};

const shapes: Record<string, RegionGeometry> = {
  star: {
    background: FULL_BACKGROUND,
    star: {
      type: 'polygon',
      points: [
        [200, 60],
        [240, 160],
        [350, 160],
        [260, 220],
        [295, 330],
        [200, 260],
        [105, 330],
        [140, 220],
        [50, 160],
        [160, 160],
      ],
    },
    centerCircle: { type: 'circle', cx: 200, cy: 210, r: 28 },
    sparkle1: { type: 'circle', cx: 70, cy: 80, r: 12 },
    sparkle2: { type: 'circle', cx: 340, cy: 90, r: 10 },
    sparkle3: { type: 'circle', cx: 350, cy: 310, r: 14 },
  },
  heart: {
    background: FULL_BACKGROUND,
    heart: { type: 'path', d: 'M200 340 C40 230 60 80 200 150 C340 80 360 230 200 340 Z' },
    shine: { type: 'path', d: 'M120 160 Q140 130 170 140 Q160 170 130 180 Z' },
    tinyHeart: { type: 'circle', cx: 310, cy: 90, r: 20 },
  },
  flower: {
    background: FULL_BACKGROUND,
    topPetal: { type: 'ellipse', cx: 200, cy: 90, rx: 28, ry: 50 },
    rightPetal: { type: 'ellipse', cx: 280, cy: 170, rx: 50, ry: 28 },
    bottomPetal: { type: 'ellipse', cx: 200, cy: 250, rx: 28, ry: 50 },
    leftPetal: { type: 'ellipse', cx: 120, cy: 170, rx: 50, ry: 28 },
    topRightPetal: {
      type: 'path',
      d: 'M225 110 Q280 100 280 130 Q260 155 230 155 Z',
    },
    bottomRightPetal: {
      type: 'path',
      d: 'M225 230 Q280 240 280 210 Q260 185 230 185 Z',
    },
    bottomLeftPetal: {
      type: 'path',
      d: 'M175 230 Q120 240 120 210 Q140 185 170 185 Z',
    },
    topLeftPetal: {
      type: 'path',
      d: 'M175 110 Q120 100 120 130 Q140 155 170 155 Z',
    },
    center: { type: 'circle', cx: 200, cy: 170, r: 32 },
    stem: { type: 'path', d: 'M196 220 Q200 320 196 380 L204 380 Q200 320 204 220 Z' },
    leaf: { type: 'path', d: 'M204 320 Q280 290 290 340 Q230 350 204 320 Z' },
  },
  sun: {
    background: FULL_BACKGROUND,
    core: { type: 'circle', cx: 200, cy: 200, r: 90 },
    face: { type: 'circle', cx: 200, cy: 200, r: 50 },
    ray1: { type: 'polygon', points: [[200, 40], [220, 100], [180, 100]] },
    ray2: { type: 'polygon', points: [[200, 360], [180, 300], [220, 300]] },
    ray3: { type: 'polygon', points: [[40, 200], [100, 180], [100, 220]] },
    ray4: { type: 'polygon', points: [[360, 200], [300, 220], [300, 180]] },
    ray5: { type: 'polygon', points: [[80, 80], [130, 110], [110, 130]] },
    ray6: { type: 'polygon', points: [[320, 80], [290, 130], [270, 110]] },
    ray7: { type: 'polygon', points: [[80, 320], [110, 270], [130, 290]] },
    ray8: { type: 'polygon', points: [[320, 320], [270, 290], [290, 270]] },
  },
  rainbow: {
    sky: FULL_BACKGROUND,
    arc1: {
      type: 'path',
      d: 'M50 280 A150 150 0 0 1 350 280 L320 280 A120 120 0 0 0 80 280 Z',
    },
    arc2: {
      type: 'path',
      d: 'M80 280 A120 120 0 0 1 320 280 L290 280 A90 90 0 0 0 110 280 Z',
    },
    arc3: {
      type: 'path',
      d: 'M110 280 A90 90 0 0 1 290 280 L260 280 A60 60 0 0 0 140 280 Z',
    },
    arc4: {
      type: 'path',
      d: 'M140 280 A60 60 0 0 1 260 280 L230 280 A30 30 0 0 0 170 280 Z',
    },
    arc5: { type: 'path', d: 'M170 280 A30 30 0 0 1 230 280 Z' },
    cloudLeft: {
      type: 'path',
      d: 'M20 270 Q30 250 60 250 Q80 230 110 250 Q130 250 130 280 Q90 300 50 295 Q20 295 20 270 Z',
    },
    cloudRight: {
      type: 'path',
      d: 'M270 270 Q280 250 310 250 Q330 230 360 250 Q380 250 380 280 Q340 300 300 295 Q270 295 270 270 Z',
    },
  },
};

export const REGION_GEOMETRY: Record<string, RegionGeometry> = {
  ...animals,
  ...fruits,
  ...vehicles,
  ...shapes,
};
