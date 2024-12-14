import { type BackgroundLayer } from '@core/model/background-layer';
import { BASE_BACKGROUND_TILE, type BackgroundTile } from '@core/model/background-tile';

const FLOOR_TILE: BackgroundTile = {
  ...BASE_BACKGROUND_TILE,
  tileset: 'tileset_house',
  animationFrames: [{ spriteX: 1, spriteY: 2, }]
};

const FLOOR_COLUMN = [
  undefined,
  undefined,
  undefined,
  undefined,
  FLOOR_TILE,
  FLOOR_TILE,
  FLOOR_TILE,
  FLOOR_TILE,
  FLOOR_TILE,
  FLOOR_TILE,
  FLOOR_TILE,
  FLOOR_TILE,
  FLOOR_TILE,
];

export const SCENE_GAME_MAP_SHOP_BACKGROUND_FLOOR: BackgroundLayer = {
  index: 2,
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
    [],
    FLOOR_COLUMN,
    FLOOR_COLUMN,
    FLOOR_COLUMN,
    FLOOR_COLUMN,
    FLOOR_COLUMN,
    FLOOR_COLUMN,
    FLOOR_COLUMN,
    FLOOR_COLUMN,
    FLOOR_COLUMN,
  ],
};
