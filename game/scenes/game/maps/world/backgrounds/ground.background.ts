import { type BackgroundLayer } from '@core/model/background-layer';
import { type BackgroundTile } from '@core/model/background-tile';

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

const column = [
  GRASS_TILE_CENTER,
  GRASS_TILE_CENTER,
  GRASS_TILE_CENTER,
  GRASS_TILE_CENTER,
  GRASS_TILE_CENTER,
  GRASS_TILE_CENTER,
  GRASS_TILE_CENTER,
  GRASS_TILE_CENTER,
  GRASS_TILE_CENTER,
  GRASS_TILE_CENTER,
  GRASS_TILE_CENTER,
  GRASS_TILE_CENTER,
  GRASS_TILE_CENTER,
  GRASS_TILE_CENTER,
  GRASS_TILE_CENTER,
  GRASS_TILE_CENTER,
  GRASS_TILE_CENTER,
  GRASS_TILE_CENTER
];

export const SCENE_GAME_MAP_WORLD_BACKGROUND_GROUND: BackgroundLayer = {
  index: 1,
  tiles: [
    column,
    column,
    column,
    column,
    column,
    column,
    column,
    column,
    column,
    column,
    column,
    column,
    column,
    column,
    column,
    column,
    column,
    column,
    column,
    column,
    column,
    column,
    column,
    column,
    column,
    column,
    column,
    column,
    column,
    column,
    column,
    column,
  ],
};
