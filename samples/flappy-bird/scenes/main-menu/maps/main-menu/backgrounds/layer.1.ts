import { type BackgroundLayer } from '@core/src/model/background-layer';
import { type BackgroundTile } from '@core/src/model/background-tile';

const BASE_TILE: BackgroundTile = {
  tileset: 'sprites',
  animationFrameDuration: 1,
  animationFrames: [],
  animationMap: [1],
};

const SKY: BackgroundTile = {
  ...BASE_TILE,
  animationFrames: [
    { spriteX: 0, spriteY: 0, }
  ],
};

const CITY_TRANSITION: BackgroundTile = {
  ...BASE_TILE,
  animationFrames: [
    { spriteX: 0, spriteY: 9, }
  ],
};

const CITY: BackgroundTile = {
  ...BASE_TILE,
  animationFrames: [
    { spriteX: 0, spriteY: 10, }
  ],
};

const GRASS_TRANSITION: BackgroundTile = {
  ...BASE_TILE,
  animationFrames: [
    { spriteX: 0, spriteY: 11, }
  ],
};

const GRASS: BackgroundTile = {
  ...BASE_TILE,
  animationFrames: [
    { spriteX: 0, spriteY: 15, }
  ],
};

const COLUMN: BackgroundTile[] = [
  SKY,
  SKY,
  SKY,
  SKY,
  SKY,
  SKY,
  SKY,
  SKY,
  SKY,
  SKY,
  CITY_TRANSITION,
  CITY,
  GRASS_TRANSITION,
  GRASS,
  GRASS,
  GRASS
];

// TODO(smg): background is 9 tiles wide
export const MAIN_MENU_BACKGROUND_LAYER_1: BackgroundLayer = {
  index: 0,
  tiles: [
    COLUMN,
    COLUMN,
    COLUMN,
    COLUMN,
    COLUMN,
    COLUMN,
    COLUMN,
    COLUMN,
    COLUMN,
    COLUMN
  ],
};
