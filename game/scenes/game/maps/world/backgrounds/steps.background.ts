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

//

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

// 

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

//

const HILL_CORNER_TOP_LEFT: BackgroundTile = {
  ...HILL_TILE,
  animationFrames: [
    { spriteX: 5, spriteY: 1, }
  ],
};

const HILL_CORNER_TOP_RIGHT: BackgroundTile = {
  ...HILL_TILE,
  animationFrames: [
    { spriteX: 6, spriteY: 1, }
  ],
};

const HILL_CORNER_BOTTOM_LEFT: BackgroundTile = {
  ...HILL_TILE,
  animationFrames: [
    { spriteX: 5, spriteY: 2, }
  ],
};

const HILL_CORNER_BOTTOM_RIGHT: BackgroundTile = {
  ...HILL_TILE,
  animationFrames: [
    { spriteX: 6, spriteY: 2, }
  ],
};

// steps

const HILL_STEPS_TOP_LEFT: BackgroundTile = undefined;

const HILL_STEPS_TOP_MIDDLE: BackgroundTile = {
  ...HILL_TILE,
  animationFrames: [
    { spriteX: 9.5, spriteY: 4, }
  ],
};

const HILL_STEPS_TOP_RIGHT: BackgroundTile = {
  ...HILL_TILE,
  animationFrames: [
    { spriteX: 10.5, spriteY: 4, }
  ],
};

const HILL_STEPS_CENTER_LEFT: BackgroundTile = {
  ...HILL_TILE,
  animationFrames: [
    { spriteX: 8.5, spriteY: 5, }
  ],
};

const HILL_STEPS_CENTER_MIDDLE: BackgroundTile = {
  ...HILL_TILE,
  animationFrames: [
    { spriteX: 9.5, spriteY: 5, }
  ],
};

const HILL_STEPS_CENTER_RIGHT: BackgroundTile = {
  ...HILL_TILE,
  animationFrames: [
    { spriteX: 10.5, spriteY: 5, }
  ],
};

const HILL_STEPS_BOTTOM_LEFT: BackgroundTile = {
  ...HILL_TILE,
  animationFrames: [
    { spriteX: 8.5, spriteY: 6, }
  ],
};

const HILL_STEPS_BOTTOM_MIDDLE: BackgroundTile = {
  ...HILL_TILE,
  animationFrames: [
    { spriteX: 9.5, spriteY: 6, }
  ],
};

const HILL_STEPS_BOTTOM_RIGHT: BackgroundTile = {
  ...HILL_TILE,
  animationFrames: [
    { spriteX: 10.5, spriteY: 6, }
  ],
};


export const SCENE_GAME_MAP_WORLD_BACKGROUND_STEPS: BackgroundLayer = {
  index: 1,
  tiles: [
    [
    ],
    [
    ],
    [
    ],
    [
    ],
    [
    ],
    [
    ],
    [
    ],
    [
    ],
    [
    ],
    [
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      HILL_STEPS_TOP_LEFT,
      HILL_STEPS_CENTER_LEFT,
      HILL_STEPS_BOTTOM_LEFT,

    ],
    [
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      HILL_STEPS_TOP_MIDDLE,
      HILL_STEPS_CENTER_MIDDLE,
      HILL_STEPS_BOTTOM_MIDDLE,
    ],
    [
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      HILL_STEPS_TOP_RIGHT,
      HILL_STEPS_CENTER_RIGHT,
      HILL_STEPS_BOTTOM_RIGHT,
    ],
    [
    ],
    [
    ],
    [
    ],
    [
    ],
    [
    ],
    [
    ],
    [
    ],
    [
    ],
    [
    ],
    [
    ],
    [
    ],
    [
    ],
    [
    ],
    [
    ],
  ],
};
