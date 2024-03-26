import { type BackgroundLayer } from '@core/src/model/background-layer';
import { type BackgroundTile } from '@core/src/model/background-tile';

const WATER_TILE: BackgroundTile = {
  tileset: 'tileset_water',
  animationFrameDuration: 1,
  animationFrames: [
    { spriteX: 0, spriteY: 0, },
    { spriteX: 1, spriteY: 0, },
    { spriteX: 2, spriteY: 0, },
    { spriteX: 3, spriteY: 0, }
  ],
  animationMap: [
    0.25,
    0.5,
    0.75,
    1
  ],
};

const WATER_TILE_COLUMN = [
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE,
  WATER_TILE
];

export const SAMPLE_SCENE_1_MAP_0_BACKGROUND_0: BackgroundLayer = {
  index: 0,
  tiles: [
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN],
    [...WATER_TILE_COLUMN]
  ],
};
