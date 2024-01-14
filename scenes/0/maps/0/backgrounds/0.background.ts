import { BackgroundLayer } from "../../../../../model/background-layer"
import { BackgroundTile2 } from "../../../../../model/background-tile"

const MENU_TILE: BackgroundTile2 = {
  tileset: 'tileset_water',
  animationFrameDuration: 1,
  animationFrames: [
    {spriteX: 0, spriteY: 0}, 
    {spriteX: 1, spriteY: 0}, 
    {spriteX: 2, spriteY: 0}, 
    {spriteX: 3, spriteY: 0}
  ],
  animationMap: [
    0.25,
    0.5,
    0.75,
    1
  ]
}

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
];

export const SAMPLE_SCENE_0_MAP_0_BACKGROUND_0: BackgroundLayer = {
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
    MENU_TILE_COLUMN
  ]
}