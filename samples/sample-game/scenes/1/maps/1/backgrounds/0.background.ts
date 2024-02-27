import { type BackgroundLayer } from '../../../../../../../core/model/background-layer';
import { type BackgroundTile } from '../../../../../../../core/model/background-tile';

const BASE_TILE: BackgroundTile = {
  tileset: 'tileset_dirt',
  animationFrameDuration: 1,
  animationFrames: [],
  animationMap: [1],
};

const TOP_LEFT: BackgroundTile = {
  ...BASE_TILE,
  animationFrames: [
    { spriteX: 0, spriteY: 0, }
  ],
};

const TOP: BackgroundTile = {
  ...BASE_TILE,
  animationFrames: [
    { spriteX: 1, spriteY: 0, }
  ],
};

const TOP_RIGHT: BackgroundTile = {
  ...BASE_TILE,
  animationFrames: [
    { spriteX: 2, spriteY: 0, }
  ],
};

const LEFT: BackgroundTile = {
  ...BASE_TILE,
  animationFrames: [
    { spriteX: 0, spriteY: 1, }
  ],
};

const CENTER: BackgroundTile = {
  ...BASE_TILE,
  animationFrames: [
    { spriteX: 1, spriteY: 1, }
  ],
};

const RIGHT: BackgroundTile = {
  ...BASE_TILE,
  animationFrames: [
    { spriteX: 2, spriteY: 1, }
  ],
};

const BOTTOM_LEFT: BackgroundTile = {
  ...BASE_TILE,
  animationFrames: [
    { spriteX: 0, spriteY: 2, }
  ],
};

const BOTTOM: BackgroundTile = {
  ...BASE_TILE,
  animationFrames: [
    { spriteX: 1, spriteY: 2, }
  ],
};

const BOTTOM_RIGHT: BackgroundTile = {
  ...BASE_TILE,
  animationFrames: [
    { spriteX: 2, spriteY: 2, }
  ],
};

export const SAMPLE_SCENE_1_MAP_1_BACKGROUND_0: BackgroundLayer = {
  index: 0,
  tiles: [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      TOP_LEFT,
      LEFT,
      LEFT,
      LEFT,
      LEFT,
      LEFT,
      BOTTOM_LEFT
    ],
    [
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      TOP,
      CENTER,
      CENTER,
      CENTER,
      CENTER,
      CENTER,
      BOTTOM
    ],
    [
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      TOP,
      CENTER,
      CENTER,
      CENTER,
      CENTER,
      CENTER,
      BOTTOM
    ],
    [
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      TOP,
      CENTER,
      CENTER,
      CENTER,
      CENTER,
      CENTER,
      BOTTOM
    ],
    [
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      TOP,
      CENTER,
      CENTER,
      CENTER,
      CENTER,
      CENTER,
      BOTTOM
    ],
    [
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      TOP,
      CENTER,
      CENTER,
      CENTER,
      CENTER,
      CENTER,
      BOTTOM
    ],
    [
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      TOP_RIGHT,
      RIGHT,
      RIGHT,
      RIGHT,
      RIGHT,
      RIGHT,
      BOTTOM_RIGHT
    ]
    /*

    [
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
    ],
    [
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
    ],
    [
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
    ],
    [
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
    ],
    [
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
    ],
    [
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
    ],
    [
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
    ],
    [
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
      {spriteX: 0, spriteY: 0, tileset: 'tileset_water'},
    ],
    */
  ],
};
