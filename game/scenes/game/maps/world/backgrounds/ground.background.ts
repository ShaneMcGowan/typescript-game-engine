import { type BackgroundLayer } from '@core/model/background-layer';
import { type BackgroundTile } from '@core/model/background-tile';

const GRASS_TILE: BackgroundTile = {
  tileset: 'tileset_grass',
  animationFrameDuration: 1,
  animationFrames: [],
  animationMap: [1],
};


const MIDDLE_CENTER: BackgroundTile = {
  ...GRASS_TILE,
  animationFrames: [
    { spriteX: 1, spriteY: 1, }
  ],
};

const MIDDLE_RIGHT: BackgroundTile = {
  ...GRASS_TILE,
  animationFrames: [
    { spriteX: 2, spriteY: 1, }
  ],
};


const BOTTOM_CENTER: BackgroundTile = {
  ...GRASS_TILE,
  animationFrames: [
    { spriteX: 1, spriteY: 2, }
  ],
};

const BOTTOM_RIGHT: BackgroundTile = {
  ...GRASS_TILE,
  animationFrames: [
    { spriteX: 2, spriteY: 2, }
  ],
};

const COLUMN_CENTER = [
  MIDDLE_CENTER,
  MIDDLE_CENTER,
  MIDDLE_CENTER,
  MIDDLE_CENTER,
  MIDDLE_CENTER,
  MIDDLE_CENTER,
  MIDDLE_CENTER,
  MIDDLE_CENTER,
  MIDDLE_CENTER,
  MIDDLE_CENTER,
  MIDDLE_CENTER,
  MIDDLE_CENTER,
  MIDDLE_CENTER,
  MIDDLE_CENTER,
  MIDDLE_CENTER,
  MIDDLE_CENTER,
  MIDDLE_CENTER,
  MIDDLE_CENTER,
  BOTTOM_CENTER
];

const COLUMN_RIGHT = [
  MIDDLE_RIGHT,
  MIDDLE_RIGHT,
  MIDDLE_RIGHT,
  MIDDLE_RIGHT,
  MIDDLE_RIGHT,
  MIDDLE_RIGHT,
  MIDDLE_RIGHT,
  MIDDLE_RIGHT,
  MIDDLE_RIGHT,
  MIDDLE_RIGHT,
  MIDDLE_RIGHT,
  MIDDLE_RIGHT,
  MIDDLE_RIGHT,
  MIDDLE_RIGHT,
  MIDDLE_RIGHT,
  MIDDLE_RIGHT,
  MIDDLE_RIGHT,
  MIDDLE_RIGHT,
  BOTTOM_RIGHT
];


export const SCENE_GAME_MAP_WORLD_BACKGROUND_GROUND: BackgroundLayer = {
  index: 1,
  tiles: [
    COLUMN_CENTER,
    COLUMN_CENTER,
    COLUMN_CENTER,
    COLUMN_CENTER,
    COLUMN_CENTER,
    COLUMN_CENTER,
    COLUMN_CENTER,
    COLUMN_CENTER,
    COLUMN_CENTER,
    COLUMN_CENTER,
    COLUMN_CENTER,
    COLUMN_CENTER,
    COLUMN_CENTER,
    COLUMN_CENTER,
    COLUMN_CENTER,
    COLUMN_CENTER,
    COLUMN_CENTER,
    COLUMN_CENTER,
    COLUMN_CENTER,
    COLUMN_CENTER,
    COLUMN_CENTER,
    COLUMN_CENTER,
    COLUMN_CENTER,
    COLUMN_CENTER,
    COLUMN_CENTER,
    COLUMN_CENTER,
    COLUMN_CENTER,
    COLUMN_RIGHT,
  ],
};
