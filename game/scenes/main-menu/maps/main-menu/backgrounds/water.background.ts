import { type BackgroundLayer } from '@core/model/background-layer';
import { type BackgroundTile } from '@core/model/background-tile';

const MENU_TILE: BackgroundTile = {
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

const MENU_TILE_COLUMN = [
  MENU_TILE,
  MENU_TILE,
  MENU_TILE,
  MENU_TILE,
  MENU_TILE,
  MENU_TILE,
  MENU_TILE,
  MENU_TILE,
  MENU_TILE,
  MENU_TILE,
  MENU_TILE,
  MENU_TILE,
  MENU_TILE,
  MENU_TILE,
  MENU_TILE,
  MENU_TILE,
  MENU_TILE,
  MENU_TILE
];

export const SCENE_MAIN_MENU_MAP_MAIN_MENU_BACKGROUND_WATER: BackgroundLayer = {
  index: 0,
  tiles: [
    MENU_TILE_COLUMN,
    MENU_TILE_COLUMN,
    MENU_TILE_COLUMN,
    MENU_TILE_COLUMN,
    MENU_TILE_COLUMN,
    MENU_TILE_COLUMN,
    MENU_TILE_COLUMN,
    MENU_TILE_COLUMN,
    MENU_TILE_COLUMN,
    MENU_TILE_COLUMN,
    MENU_TILE_COLUMN,
    MENU_TILE_COLUMN,
    MENU_TILE_COLUMN,
    MENU_TILE_COLUMN,
    MENU_TILE_COLUMN,
    MENU_TILE_COLUMN,
    MENU_TILE_COLUMN,
    MENU_TILE_COLUMN,
    MENU_TILE_COLUMN,
    MENU_TILE_COLUMN,
    MENU_TILE_COLUMN,
    MENU_TILE_COLUMN,
    MENU_TILE_COLUMN,
    MENU_TILE_COLUMN,
    MENU_TILE_COLUMN,
    MENU_TILE_COLUMN,
    MENU_TILE_COLUMN,
    MENU_TILE_COLUMN,
    MENU_TILE_COLUMN,
    MENU_TILE_COLUMN,
    MENU_TILE_COLUMN,
    MENU_TILE_COLUMN,
  ],
};
