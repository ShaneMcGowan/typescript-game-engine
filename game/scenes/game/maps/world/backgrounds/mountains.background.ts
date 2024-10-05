import { type BackgroundLayer } from '@core/model/background-layer';
import { type BackgroundTile } from '@core/model/background-tile';

const HILL_TILE: BackgroundTile = {
  tileset: 'tileset_hills',
  animationFrameDuration: 1,
  animationFrames: [],
  animationMap: [1],
};

// hill

const HILL_TOP_LEFT: BackgroundTile = {
  ...HILL_TILE,
  animationFrames: [
    { spriteX: 0, spriteY: 0, }
  ],
};

const HILL_TOP_MIDDLE: BackgroundTile = {
  ...HILL_TILE,
  animationFrames: [
    { spriteX: 1, spriteY: 0, }
  ],
};

const HILL_TOP_RIGHT: BackgroundTile = {
  ...HILL_TILE,
  animationFrames: [
    { spriteX: 2, spriteY: 0, }
  ],
};


const HILL_CENTER_LEFT: BackgroundTile = {
  ...HILL_TILE,
  animationFrames: [
    { spriteX: 0, spriteY: 1, }
  ],
};

const HILL_CENTER_MIDDLE: BackgroundTile = {
  ...HILL_TILE,
  animationFrames: [
    { spriteX: 1, spriteY: 1, }
  ],
};

const HILL_CENTER_RIGHT: BackgroundTile = {
  ...HILL_TILE,
  animationFrames: [
    { spriteX: 2, spriteY: 1, }
  ],
};

const HILL_BOTTOM_LEFT: BackgroundTile = {
  ...HILL_TILE,
  animationFrames: [
    { spriteX: 0, spriteY: 2, }
  ],
};

const HILL_BOTTOM_MIDDLE: BackgroundTile = {
  ...HILL_TILE,
  animationFrames: [
    { spriteX: 1, spriteY: 2, }
  ],
};

const HILL_BOTTOM_RIGHT: BackgroundTile = {
  ...HILL_TILE,
  animationFrames: [
    { spriteX: 2, spriteY: 2, }
  ],
};

const HILL_CORNER_TOP_LEFT: BackgroundTile = {
  ...HILL_TILE,
  animationFrames: [
    { spriteX: 5, spriteY: 1, }
  ],
};

export const SCENE_GAME_MAP_WORLD_BACKGROUND_MOUNTAINS: BackgroundLayer = {
  index: 1,
  tiles: [
    [
      HILL_TOP_LEFT,
      HILL_CENTER_LEFT,
      HILL_BOTTOM_LEFT,
    ],
    [
      HILL_TOP_MIDDLE,
      HILL_CENTER_MIDDLE,
      HILL_BOTTOM_MIDDLE,
    ],
    [
      HILL_TOP_RIGHT,
      HILL_CENTER_RIGHT,
      HILL_BOTTOM_RIGHT,
    ],
  ],
};
