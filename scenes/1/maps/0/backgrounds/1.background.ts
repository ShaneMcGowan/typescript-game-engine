import { BackgroundLayer } from "../../../../../model/background-layer";
import { BackgroundTile2 } from "../../../../../model/background-tile";

const GRASS_TILE : BackgroundTile2 = {
  tileset: 'tileset_grass',
  animationFrameDuration: 1,
  animationFrames: [],
  animationMap: [1]
}

const GRASS_TILE_TOP: BackgroundTile2 = {
  ...GRASS_TILE,
  animationFrames: [
    {spriteX: 0, spriteY: 1},
  ]
}

const GRASS_TILE_TOP_LEFT: BackgroundTile2 = {
  ...GRASS_TILE,
  animationFrames: [
    {spriteX: 0, spriteY: 0},
  ],
}

const GRASS_TILE_TOP_RIGHT: BackgroundTile2 = {
  ...GRASS_TILE,
  animationFrames: [
    {spriteX: 0, spriteY: 2},
  ],
}

const GRASS_TILE_CENTER: BackgroundTile2 = {
  ...GRASS_TILE,
  animationFrames: [
    {spriteX: 1, spriteY: 1},
  ],
}

const GRASS_TILE_LEFT: BackgroundTile2 = {
  ...GRASS_TILE,
  animationFrames: [
    {spriteX: 1, spriteY: 0},
  ],
}

const GRASS_TILE_RIGHT: BackgroundTile2 = {
  ...GRASS_TILE,
  animationFrames: [
    {spriteX: 1, spriteY: 2},
  ],
}

const GRASS_TILE_BOTTOM_LEFT: BackgroundTile2 = {
  ...GRASS_TILE,
  animationFrames: [
    {spriteX: 2, spriteY: 0},
  ],
}

const GRASS_TILE_BOTTOM: BackgroundTile2 = {
  ...GRASS_TILE,
  animationFrames: [
    {spriteX: 2, spriteY: 1},
  ],
}

const GRASS_TILE_BOTTOM_RIGHT: BackgroundTile2 = {
  ...GRASS_TILE,
  animationFrames: [
    {spriteX: 2, spriteY: 2},
  ],
}

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
      GRASS_TILE_RIGHT,
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
      GRASS_TILE_RIGHT,
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
      GRASS_TILE_RIGHT,
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
      GRASS_TILE_RIGHT,
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
      GRASS_TILE_RIGHT,
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
      GRASS_TILE_RIGHT,
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
      GRASS_TILE_RIGHT,
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
      GRASS_TILE_RIGHT,
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
      GRASS_TILE_RIGHT,
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
      GRASS_TILE_RIGHT,
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
      GRASS_TILE_RIGHT,
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
      GRASS_TILE_RIGHT,
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
      GRASS_TILE_RIGHT,
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
      GRASS_TILE_RIGHT,
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
      GRASS_TILE_RIGHT,
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
      GRASS_TILE_BOTTOM_RIGHT,
    ],
  ]
};