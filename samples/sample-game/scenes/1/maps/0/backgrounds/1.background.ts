import { type BackgroundLayer } from '@core/src/model/background-layer';
import { type BackgroundTile } from '@core/src/model/background-tile';

const GRASS_TILE: BackgroundTile = {
  tileset: 'tileset_grass',
  animationFrameDuration: 1,
  animationFrames: [],
  animationMap: [1],
};

const GRASS_TILE_TOP: BackgroundTile = {
  ...GRASS_TILE,
  animationFrames: [
    { spriteX: 0, spriteY: 1, }
  ],
};

const GRASS_TILE_TOP_LEFT: BackgroundTile = {
  ...GRASS_TILE,
  animationFrames: [
    { spriteX: 0, spriteY: 0, }
  ],
};

const GRASS_TILE_TOP_RIGHT: BackgroundTile = {
  ...GRASS_TILE,
  animationFrames: [
    { spriteX: 0, spriteY: 2, }
  ],
};

const GRASS_TILE_CENTER: BackgroundTile = {
  ...GRASS_TILE,
  animationFrames: [
    { spriteX: 1, spriteY: 1, }
  ],
};

const GRASS_TILE_LEFT: BackgroundTile = {
  ...GRASS_TILE,
  animationFrames: [
    { spriteX: 1, spriteY: 0, }
  ],
};

const GRASS_TILE_RIGHT: BackgroundTile = {
  ...GRASS_TILE,
  animationFrames: [
    { spriteX: 1, spriteY: 2, }
  ],
};

const GRASS_TILE_BOTTOM_LEFT: BackgroundTile = {
  ...GRASS_TILE,
  animationFrames: [
    { spriteX: 2, spriteY: 0, }
  ],
};

const GRASS_TILE_BOTTOM: BackgroundTile = {
  ...GRASS_TILE,
  animationFrames: [
    { spriteX: 2, spriteY: 1, }
  ],
};

const GRASS_TILE_BOTTOM_RIGHT: BackgroundTile = {
  ...GRASS_TILE,
  animationFrames: [
    { spriteX: 2, spriteY: 2, }
  ],
};

export const SAMPLE_SCENE_1_MAP_0_BACKGROUND_1: BackgroundLayer = {
  index: 1,
  tiles: [

    [],
    [],
    [
      undefined,
      undefined,
      GRASS_TILE_TOP_LEFT,
      GRASS_TILE_TOP,
      GRASS_TILE_TOP,
      GRASS_TILE_TOP,
      GRASS_TILE_TOP,
      GRASS_TILE_TOP,
      GRASS_TILE_TOP,
      GRASS_TILE_TOP,
      GRASS_TILE_TOP,
      GRASS_TILE_TOP,
      GRASS_TILE_TOP_RIGHT
    ],
    [
      undefined,
      undefined,
      GRASS_TILE_LEFT,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_RIGHT
    ],
    [
      undefined,
      undefined,
      GRASS_TILE_LEFT,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_RIGHT
    ],
    [
      undefined,
      undefined,
      GRASS_TILE_LEFT,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_RIGHT
    ],
    [
      undefined,
      undefined,
      GRASS_TILE_LEFT,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_RIGHT
    ],
    [
      undefined,
      undefined,
      GRASS_TILE_LEFT,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_RIGHT
    ],
    [
      undefined,
      undefined,
      GRASS_TILE_LEFT,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_RIGHT
    ],
    [
      undefined,
      undefined,
      GRASS_TILE_LEFT,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_RIGHT
    ],
    [
      undefined,
      undefined,
      GRASS_TILE_LEFT,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_RIGHT
    ],
    [
      undefined,
      undefined,
      GRASS_TILE_LEFT,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_RIGHT
    ],
    [
      undefined,
      undefined,
      GRASS_TILE_LEFT,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_RIGHT
    ],
    [
      undefined,
      undefined,
      GRASS_TILE_LEFT,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_RIGHT
    ],
    [
      undefined,
      undefined,
      GRASS_TILE_LEFT,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_RIGHT
    ],
    [
      undefined,
      undefined,
      GRASS_TILE_LEFT,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_RIGHT
    ],
    [
      undefined,
      undefined,
      GRASS_TILE_LEFT,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_RIGHT
    ],
    [
      undefined,
      undefined,
      GRASS_TILE_LEFT,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_CENTER,
      GRASS_TILE_RIGHT
    ],
    [
      undefined,
      undefined,
      GRASS_TILE_BOTTOM_LEFT,
      GRASS_TILE_BOTTOM,
      GRASS_TILE_BOTTOM,
      GRASS_TILE_BOTTOM,
      GRASS_TILE_BOTTOM,
      GRASS_TILE_BOTTOM,
      GRASS_TILE_BOTTOM,
      GRASS_TILE_BOTTOM,
      GRASS_TILE_BOTTOM,
      GRASS_TILE_BOTTOM,
      GRASS_TILE_BOTTOM_RIGHT
    ]
  ],
};
