import { BackgroundLayer } from "../../../../../model/background-layer";
import { BackgroundTile2 } from "../../../../../model/background-tile";

const BASE_TILE : BackgroundTile2 = {
  tileset: 'tileset_dirt',
  animationFrameDuration: 1,
  animationFrames: [],
  animationMap: [1]
}

const TOP_LEFT: BackgroundTile2 = {
  ...BASE_TILE,
  animationFrames: [
    {spriteX: 0, spriteY: 0},
  ]
}

const TOP: BackgroundTile2 = {
  ...BASE_TILE,
  animationFrames: [
    {spriteX: 1, spriteY: 0},
  ]
}

const TOP_RIGHT: BackgroundTile2 = {
  ...BASE_TILE,
  animationFrames: [
    {spriteX: 2, spriteY: 0},
  ]
}

const LEFT: BackgroundTile2 = {
  ...BASE_TILE,
  animationFrames: [
    {spriteX: 0, spriteY: 1},
  ]
}

const CENTER: BackgroundTile2 = {
  ...BASE_TILE,
  animationFrames: [
    {spriteX: 1, spriteY: 1},
  ]
}

const RIGHT: BackgroundTile2 = {
  ...BASE_TILE,
  animationFrames: [
    {spriteX: 2, spriteY: 1},
  ]
}

const BOTTOM_LEFT: BackgroundTile2 = {
  ...BASE_TILE,
  animationFrames: [
    {spriteX: 0, spriteY: 2},
  ]
}

const BOTTOM: BackgroundTile2 = {
  ...BASE_TILE,
  animationFrames: [
    {spriteX: 1, spriteY: 2},
  ]
}

const BOTTOM_RIGHT: BackgroundTile2 = {
  ...BASE_TILE,
  animationFrames: [
    {spriteX: 2, spriteY: 2},
  ]
}

export const SAMPLE_SCENE_1_MAP_1_BACKGROUND_0: BackgroundLayer = {
  index: 0,
  tiles: [
    [
      TOP_LEFT,
      LEFT,
      LEFT,
      LEFT,
      LEFT,
      LEFT,
      BOTTOM_LEFT,
    ],
    [
      TOP,
      CENTER,
      CENTER,
      CENTER,
      CENTER,
      CENTER,
      BOTTOM,
    ],
    [
      TOP,
      CENTER,
      CENTER,
      CENTER,
      CENTER,
      CENTER,
      BOTTOM,
    ],
    [
      TOP,
      CENTER,
      CENTER,
      CENTER,
      CENTER,
      CENTER,
      BOTTOM,
    ],
    [
      TOP,
      CENTER,
      CENTER,
      CENTER,
      CENTER,
      CENTER,
      BOTTOM,
    ],
    [
      TOP,
      CENTER,
      CENTER,
      CENTER,
      CENTER,
      CENTER,
      BOTTOM,
    ],
    [
      TOP_RIGHT,
      RIGHT,
      RIGHT,
      RIGHT,
      RIGHT,
      RIGHT,
      BOTTOM_RIGHT,
    ],
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